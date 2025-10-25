<template>
  <div class="min-h-screen bg-[#050b1e] px-6 py-8 text-white">
    <div class="mx-auto max-w-6xl space-y-8">
      <header class="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 class="text-3xl font-bold tracking-[0.3em] text-accent">数据管理后台</h1>
          <p class="mt-2 text-sm text-slate-300">维护镇级产改观察点展示数据，数据实时更新至大屏驾驶舱。</p>
        </div>
        <div class="flex items-center space-x-3">
          <div class="rounded-lg border border-slate-600/60 bg-slate-900/50 px-4 py-3 text-xs text-slate-300">
            <p>上次更新时间：<span class="text-accent">{{ formattedUpdatedAt }}</span></p>
            <p>当前账号：{{ username }}</p>
          </div>
          <button
            class="rounded-lg border border-red-400/40 px-4 py-2 text-xs uppercase tracking-widest text-red-300 hover:bg-red-500/10"
            @click="handleLogout"
          >
            退出登录
          </button>
        </div>
      </header>

      <form v-if="form" class="space-y-8" @submit.prevent="handleSubmit">
        <section class="card-surface p-6">
          <h2 class="text-xl font-semibold text-accent">核心指标</h2>
          <div class="mt-4 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            <div v-for="key in Object.keys(form.kpis)" :key="key">
              <label class="block text-xs uppercase tracking-widest text-slate-400">{{ kpiLabels[key] }}</label>
              <input
                v-model.number="form.kpis[key]"
                type="number"
                step="0.1"
                class="mt-2 w-full rounded-lg border border-slate-600 bg-slate-900/60 px-4 py-3 text-sm focus:border-accent focus:outline-none"
              />
            </div>
          </div>
        </section>

        <section class="card-surface p-6">
          <h2 class="text-xl font-semibold text-accent">年度趋势</h2>
          <div class="mt-4 grid gap-6 lg:grid-cols-3">
            <div>
              <label class="block text-xs uppercase tracking-widest text-slate-400">年份（逗号分隔）</label>
              <input
                v-model="trendYears"
                class="mt-2 w-full rounded-lg border border-slate-600 bg-slate-900/60 px-4 py-3 text-sm focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label class="block text-xs uppercase tracking-widest text-slate-400">企业总数</label>
              <input
                v-model="trendSeries.enterpriseCounts"
                class="mt-2 w-full rounded-lg border border-slate-600 bg-slate-900/60 px-4 py-3 text-sm focus:border-accent focus:outline-none"
                placeholder="示例：198,205,214"
              />
            </div>
            <div>
              <label class="block text-xs uppercase tracking-widest text-slate-400">创新项目</label>
              <input
                v-model="trendSeries.innovationProjects"
                class="mt-2 w-full rounded-lg border border-slate-600 bg-slate-900/60 px-4 py-3 text-sm focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label class="block text-xs uppercase tracking-widest text-slate-400">培训人次</label>
              <input
                v-model="trendSeries.trainingCounts"
                class="mt-2 w-full rounded-lg border border-slate-600 bg-slate-900/60 px-4 py-3 text-sm focus:border-accent focus:outline-none"
              />
            </div>
          </div>
        </section>

        <section class="card-surface p-6">
          <h2 class="text-xl font-semibold text-accent">维度指数</h2>
          <div class="mt-4 grid gap-6 md:grid-cols-2">
            <div v-for="(dimension, key) in form.dimensions" :key="key" class="rounded-lg border border-slate-700/60 bg-slate-900/40 p-5">
              <h3 class="text-lg font-semibold text-accent">{{ dimension.name }}</h3>
              <label class="mt-3 block text-xs uppercase tracking-widest text-slate-400">指数序列（逗号分隔）</label>
              <input
                v-model="dimensionSeries[key]"
                class="mt-2 w-full rounded-lg border border-slate-600 bg-slate-900/60 px-4 py-3 text-sm focus:border-accent focus:outline-none"
              />
            </div>
          </div>
        </section>

        <section class="card-surface p-6">
          <h2 class="text-xl font-semibold text-accent">企业亮点</h2>
          <div class="mt-4 space-y-6">
            <div v-for="(item, index) in form.enterprises.highlights" :key="item.id" class="rounded-lg border border-slate-700/60 bg-slate-900/40 p-5">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-accent">亮点 {{ index + 1 }}</h3>
                <button type="button" class="text-xs text-red-400 hover:text-red-300" @click="removeHighlight(index)">删除</button>
              </div>
              <div class="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <label class="block text-xs uppercase tracking-widest text-slate-400">标题</label>
                  <input
                    v-model="item.title"
                    class="mt-2 w-full rounded-lg border border-slate-600 bg-slate-900/60 px-4 py-3 text-sm focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label class="block text-xs uppercase tracking-widest text-slate-400">标签（逗号分隔）</label>
                  <input
                    v-model="highlightTags[index]"
                    class="mt-2 w-full rounded-lg border border-slate-600 bg-slate-900/60 px-4 py-3 text-sm focus:border-accent focus:outline-none"
                  />
                </div>
              </div>
              <label class="mt-4 block text-xs uppercase tracking-widest text-slate-400">描述</label>
              <textarea
                v-model="item.description"
                rows="3"
                class="mt-2 w-full rounded-lg border border-slate-600 bg-slate-900/60 px-4 py-3 text-sm focus:border-accent focus:outline-none"
              ></textarea>
            </div>
            <button
              type="button"
              class="rounded-lg border border-accent/40 px-4 py-2 text-xs uppercase tracking-widest text-accent hover:bg-accent/10"
              @click="addHighlight"
            >
              新增企业亮点
            </button>
          </div>
        </section>

        <section class="card-surface p-6">
          <h2 class="text-xl font-semibold text-accent">企业覆盖 & 职工结构</h2>
          <div class="mt-4 grid gap-6 md:grid-cols-2">
            <div>
              <h3 class="text-lg font-semibold text-accent">覆盖统计</h3>
              <div class="mt-3 space-y-3">
                <div v-for="(item, index) in form.enterprises.coverage" :key="index" class="rounded-lg border border-slate-700/60 bg-slate-900/40 p-4">
                  <label class="block text-xs uppercase tracking-widest text-slate-400">类别</label>
                  <input
                    v-model="item.name"
                    class="mt-2 w-full rounded-lg border border-slate-600 bg-slate-900/60 px-4 py-3 text-sm focus:border-accent focus:outline-none"
                  />
                  <label class="mt-3 block text-xs uppercase tracking-widest text-slate-400">数量</label>
                  <input
                    v-model.number="item.value"
                    type="number"
                    class="mt-2 w-full rounded-lg border border-slate-600 bg-slate-900/60 px-4 py-3 text-sm focus:border-accent focus:outline-none"
                  />
                </div>
              </div>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-accent">职工学历</h3>
              <div class="mt-3 space-y-3">
                <div v-for="(item, index) in form.enterprises.education" :key="index" class="rounded-lg border border-slate-700/60 bg-slate-900/40 p-4">
                  <label class="block text-xs uppercase tracking-widest text-slate-400">层次</label>
                  <input
                    v-model="item.name"
                    class="mt-2 w-full rounded-lg border border-slate-600 bg-slate-900/60 px-4 py-3 text-sm focus:border-accent focus:outline-none"
                  />
                  <label class="mt-3 block text-xs uppercase tracking-widest text-slate-400">人数</label>
                  <input
                    v-model.number="item.value"
                    type="number"
                    class="mt-2 w-full rounded-lg border border-slate-600 bg-slate-900/60 px-4 py-3 text-sm focus:border-accent focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="card-surface p-6">
          <h2 class="text-xl font-semibold text-accent">荣誉榜单</h2>
          <div class="mt-4 space-y-5">
            <div v-for="(group, index) in form.enterprises.honors" :key="group.title" class="rounded-lg border border-slate-700/60 bg-slate-900/40 p-5">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-accent">{{ group.title }}</h3>
                <button type="button" class="text-xs text-red-400 hover:text-red-300" @click="removeHonor(index)">删除</button>
              </div>
              <label class="mt-3 block text-xs uppercase tracking-widest text-slate-400">标题</label>
              <input
                v-model="group.title"
                class="mt-2 w-full rounded-lg border border-slate-600 bg-slate-900/60 px-4 py-3 text-sm focus:border-accent focus:outline-none"
              />
              <label class="mt-3 block text-xs uppercase tracking-widest text-slate-400">获奖名单（逗号分隔）</label>
              <input
                v-model="honorWinners[index]"
                class="mt-2 w-full rounded-lg border border-slate-600 bg-slate-900/60 px-4 py-3 text-sm focus:border-accent focus:outline-none"
              />
            </div>
            <button type="button" class="rounded-lg border border-accent/40 px-4 py-2 text-xs uppercase tracking-widest text-accent hover:bg-accent/10" @click="addHonor">
              新增荣誉
            </button>
          </div>
        </section>

        <div class="flex items-center justify-end space-x-3">
          <button type="button" class="rounded-lg border border-slate-600 px-4 py-2 text-xs uppercase tracking-widest text-slate-300 hover:bg-slate-700/40" @click="resetForm">
            重置
          </button>
          <button type="submit" class="rounded-lg bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-widest text-slate-900 hover:opacity-90" :disabled="saving">
            {{ saving ? '保存中…' : '保存更新' }}
          </button>
        </div>
      </form>

      <div v-else class="card-surface p-10 text-center text-sm text-slate-300">数据加载中，请稍候…</div>

      <p v-if="statusMessage" class="text-sm text-accent">{{ statusMessage }}</p>
      <router-link class="block text-center text-xs text-slate-400 hover:text-accent" to="/">返回大屏驾驶舱</router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

const parseSeries = (value) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item !== '')
    .map((item) => Number(item));

export default {
  name: 'AdminPanel',
  data() {
    return {
      form: null,
      original: null,
      saving: false,
      statusMessage: '',
      username: localStorage.getItem('observation-username') || 'admin',
      trendYears: '',
      trendSeries: {
        enterpriseCounts: '',
        innovationProjects: '',
        trainingCounts: ''
      },
      dimensionSeries: {},
      highlightTags: [],
      honorWinners: []
    };
  },
  computed: {
    kpiLabels() {
      return {
        coverageRate: '产改覆盖率(%)',
        enterpriseCount: '企业总数',
        innovationProjects: '创新项目数',
        unionCount: '工会数',
        trainingCount: '培训人次'
      };
    },
    formattedUpdatedAt() {
      const updatedAt = (this.form && this.form.meta && this.form.meta.updatedAt) ||
        (this.original && this.original.meta && this.original.meta.updatedAt);
      if (!updatedAt) return '—';
      const date = new Date(updatedAt);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    }
  },
  created() {
    const token = localStorage.getItem('observation-token');
    if (!token) {
      this.$router.replace({ name: 'AdminLogin' });
      return;
    }
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const { data } = await axios.get('/api/data');
        this.form = JSON.parse(JSON.stringify(data));
        this.original = data;
        const trends = data.trends || {};
        this.trendYears = Array.isArray(trends.years) ? trends.years.join(',') : '';
        this.trendSeries = {
          enterpriseCounts: Array.isArray(trends.enterpriseCounts) ? trends.enterpriseCounts.join(',') : '',
          innovationProjects: Array.isArray(trends.innovationProjects) ? trends.innovationProjects.join(',') : '',
          trainingCounts: Array.isArray(trends.trainingCounts) ? trends.trainingCounts.join(',') : ''
        };
        const dims = data.dimensions || {};
        this.dimensionSeries = Object.keys(dims).reduce((acc, key) => {
          acc[key] = Array.isArray(dims[key].series) ? dims[key].series.join(',') : '';
          return acc;
        }, {});
        const enterprises = data.enterprises || {};
        this.highlightTags = (enterprises.highlights || []).map((item) =>
          Array.isArray(item.tags) ? item.tags.join(',') : ''
        );
        this.honorWinners = (enterprises.honors || []).map((item) =>
          Array.isArray(item.winners) ? item.winners.join(',') : ''
        );
      } catch (error) {
        console.error(error);
        this.statusMessage = '数据加载失败，请稍后重试。';
      }
    },
    sanitizeForm() {
      const payload = JSON.parse(JSON.stringify(this.form));
      payload.trends = {
        years: parseSeries(this.trendYears),
        enterpriseCounts: parseSeries(this.trendSeries.enterpriseCounts),
        innovationProjects: parseSeries(this.trendSeries.innovationProjects),
        trainingCounts: parseSeries(this.trendSeries.trainingCounts)
      };
      payload.dimensions = Object.keys(this.dimensionSeries).reduce((acc, key) => {
        const dimension = payload.dimensions && payload.dimensions[key] ? payload.dimensions[key] : { name: '' };
        acc[key] = {
          ...dimension,
          series: parseSeries(this.dimensionSeries[key] || '')
        };
        return acc;
      }, {});
      if (!payload.enterprises) {
        payload.enterprises = { highlights: [], honors: [], coverage: [], education: [] };
      }
      payload.enterprises.highlights = (payload.enterprises.highlights || []).map((item, index) => ({
        ...item,
        tags: (this.highlightTags[index] || '')
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag)
      }));
      payload.enterprises.honors = (payload.enterprises.honors || []).map((item, index) => ({
        ...item,
        winners: (this.honorWinners[index] || '')
          .split(',')
          .map((winner) => winner.trim())
          .filter((winner) => winner)
      }));
      return payload;
    },
    async handleSubmit() {
      this.saving = true;
      this.statusMessage = '';
      try {
        const payload = this.sanitizeForm();
        const token = localStorage.getItem('observation-token');
        const { data } = await axios.post('/api/data', payload, {
          headers: {
            'x-admin-token': token
          }
        });
        this.statusMessage = `数据已更新，更新时间：${data.meta.updatedAt}`;
        await this.fetchData();
      } catch (error) {
        const message =
          error && error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : '保存失败，请稍后重试。';
        this.statusMessage = message;
      } finally {
        this.saving = false;
      }
    },
    addHighlight() {
      if (!this.form.enterprises) {
        this.form.enterprises = { highlights: [], honors: [], coverage: [], education: [] };
      }
      this.form.enterprises.highlights.push({
        id: `highlight-${Date.now()}`,
        title: '新增企业亮点',
        tags: [],
        description: ''
      });
      this.highlightTags.push('');
    },
    removeHighlight(index) {
      this.form.enterprises.highlights.splice(index, 1);
      this.highlightTags.splice(index, 1);
    },
    addHonor() {
      if (!this.form.enterprises) {
        this.form.enterprises = { highlights: [], honors: [], coverage: [], education: [] };
      }
      this.form.enterprises.honors.push({ title: '新增荣誉', winners: [] });
      this.honorWinners.push('');
    },
    removeHonor(index) {
      this.form.enterprises.honors.splice(index, 1);
      this.honorWinners.splice(index, 1);
    },
    resetForm() {
      this.fetchData();
      this.statusMessage = '已恢复为最新保存的数据。';
    },
    async handleLogout() {
      try {
        const token = localStorage.getItem('observation-token');
        await axios.post(
          '/api/logout',
          {},
          {
            headers: {
              'x-admin-token': token
            }
          }
        );
      } catch (error) {
        console.warn('Logout failed', error);
      }
      localStorage.removeItem('observation-token');
      this.$router.replace({ name: 'AdminLogin' });
    }
  }
};
</script>
