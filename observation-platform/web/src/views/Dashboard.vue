<template>
  <div class="relative flex min-h-screen flex-col overflow-hidden bg-[#050b1e] text-white">
    <div class="absolute inset-0 opacity-60" style="background-image: linear-gradient(120deg, rgba(14, 54, 127, 0.65), rgba(6, 11, 24, 0.95));"></div>
    <div class="relative z-10 flex flex-1 flex-col">
      <header class="flex flex-col items-center justify-between gap-4 px-8 pt-6 text-center lg:flex-row lg:text-left">
        <div>
          <h1 class="text-4xl font-bold tracking-[0.4em] text-accent">镇级产改观察点数字平台</h1>
          <p class="mt-3 text-sm text-slate-300">
            聚焦镇级产业工人队伍建设改革成果，通过多维数据洞察改革动能，服务企业发展与职工成长。
          </p>
        </div>
        <div class="flex items-center space-x-4 text-slate-300">
          <div class="text-left">
            <p class="text-xs uppercase tracking-widest text-slate-400">自动轮播</p>
            <p class="text-lg font-semibold">{{ remainingSeconds }} 秒后切换</p>
          </div>
          <div class="flex space-x-2">
            <button
              v-for="(panel, index) in panels"
              :key="panel.key"
              class="h-2 w-16 rounded-full transition-all"
              :class="currentPanel === index ? 'bg-accent shadow-lg' : 'bg-slate-600/40'"
              @click="goToPanel(index)"
            ></button>
          </div>
        </div>
      </header>
      <main class="relative flex-1 px-8 pb-10">
        <div v-if="loading" class="card-surface flex h-full items-center justify-center text-sm text-slate-300">
          数据加载中…
        </div>
        <div v-else-if="error" class="card-surface flex h-full items-center justify-center text-sm text-red-400">
          {{ error }}
        </div>
        <transition v-else-if="panels.length" name="fade-slide" mode="out-in">
          <component
            :is="panels[currentPanel].component"
            :key="panels[currentPanel].key"
            v-bind="panels[currentPanel].props"
          />
        </transition>
      </main>
      <footer class="relative z-20 flex justify-between px-8 pb-6 text-xs text-slate-400">
        <div>© 2025 镇级产改观察点 · 数据支撑单位：镇产改办</div>
        <div>后台管理：<router-link class="text-accent hover:underline" to="/admin">进入管理端</router-link></div>
      </footer>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import TownOverviewPanel from '@/components/TownOverviewPanel.vue';
import DimensionTrendsPanel from '@/components/DimensionTrendsPanel.vue';
import EnterpriseWorkersPanel from '@/components/EnterpriseWorkersPanel.vue';

const ROTATION_INTERVAL = 8000;

export default {
  name: 'Dashboard',
  components: {
    TownOverviewPanel,
    DimensionTrendsPanel,
    EnterpriseWorkersPanel
  },
  data() {
    return {
      loading: false,
      error: '',
      payload: null,
      currentPanel: 0,
      timer: null,
      countdownTimer: null,
      remainingSeconds: ROTATION_INTERVAL / 1000
    };
  },
  computed: {
    panels() {
      if (!this.payload) return [];
      return [
        {
          key: 'overview',
          component: 'TownOverviewPanel',
          props: {
            kpis: this.payload.kpis,
            trends: this.payload.trends,
            updatedAt: this.payload.meta ? this.payload.meta.updatedAt : ''
          }
        },
        {
          key: 'dimensions',
          component: 'DimensionTrendsPanel',
          props: {
            years: this.payload.trends && this.payload.trends.years ? this.payload.trends.years : [],
            dimensions: this.payload.dimensions
          }
        },
        {
          key: 'enterprise',
          component: 'EnterpriseWorkersPanel',
          props: {
            coverage: this.payload.enterprises && this.payload.enterprises.coverage ? this.payload.enterprises.coverage : [],
            highlights:
              this.payload.enterprises && this.payload.enterprises.highlights
                ? this.payload.enterprises.highlights
                : [],
            education:
              this.payload.enterprises && this.payload.enterprises.education
                ? this.payload.enterprises.education
                : [],
            honors:
              this.payload.enterprises && this.payload.enterprises.honors
                ? this.payload.enterprises.honors
                : []
          }
        }
      ];
    }
  },
  created() {
    this.fetchData();
  },
  beforeDestroy() {
    this.clearTimers();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      this.error = '';
      try {
        const { data } = await axios.get('/api/data');
        this.payload = data;
        this.$nextTick(() => {
          this.startRotation();
        });
      } catch (err) {
        this.error = '数据加载失败，请稍后重试。';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    startRotation() {
      this.clearTimers();
      if (!this.panels.length) return;
      this.timer = setInterval(() => {
        this.currentPanel = (this.currentPanel + 1) % this.panels.length;
        this.remainingSeconds = ROTATION_INTERVAL / 1000;
      }, ROTATION_INTERVAL);
      this.countdownTimer = setInterval(() => {
        if (this.remainingSeconds <= 1) {
          this.remainingSeconds = ROTATION_INTERVAL / 1000;
        } else {
          this.remainingSeconds -= 1;
        }
      }, 1000);
    },
    clearTimers() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      if (this.countdownTimer) {
        clearInterval(this.countdownTimer);
        this.countdownTimer = null;
      }
    },
    goToPanel(index) {
      this.currentPanel = index;
      this.remainingSeconds = ROTATION_INTERVAL / 1000;
      this.startRotation();
    }
  }
};
</script>
