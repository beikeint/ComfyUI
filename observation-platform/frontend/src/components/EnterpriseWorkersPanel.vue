<template>
  <div class="relative h-full w-full">
    <div class="absolute inset-0 grid-overlay rounded-3xl"></div>
    <div class="relative z-10 grid h-full w-full grid-cols-1 gap-6 p-8 xl:grid-cols-12">
      <section class="xl:col-span-5 card-surface p-6 flex flex-col">
        <div class="section-title">
          <span>企业产改覆盖情况</span>
        </div>
        <div ref="coverageChart" class="flex-1"></div>
      </section>
      <section class="xl:col-span-4">
        <HighlightTicker :highlights="highlights" />
      </section>
      <section class="xl:col-span-3 card-surface p-6 flex flex-col">
        <div class="section-title">
          <span>职工学历结构</span>
        </div>
        <div ref="educationChart" class="h-64 flex-1"></div>
        <div class="mt-4 text-xs text-slate-400">
          从学历结构看，技能型人才占比持续提升，创新支撑更为坚实。
        </div>
      </section>
      <section class="xl:col-span-5 card-surface p-6">
        <div class="section-title">
          <span>荣誉榜单</span>
        </div>
        <div class="space-y-4 max-h-72 overflow-y-auto pr-2 custom-scroll">
          <div v-for="group in honors" :key="group.title" class="rounded-lg border border-slate-700/60 bg-slate-900/40 p-4">
            <h3 class="text-lg font-semibold text-accent">{{ group.title }}</h3>
            <ul class="mt-3 space-y-2 text-sm text-slate-200">
              <li v-for="winner in group.winners" :key="winner" class="flex items-center space-x-2">
                <span class="h-1.5 w-1.5 rounded-full bg-accent"></span>
                <span>{{ winner }}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import HighlightTicker from './HighlightTicker.vue';

export default {
  name: 'EnterpriseWorkersPanel',
  components: { HighlightTicker },
  props: {
    coverage: {
      type: Array,
      default: () => []
    },
    highlights: {
      type: Array,
      default: () => []
    },
    education: {
      type: Array,
      default: () => []
    },
    honors: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      coverageChart: null,
      educationChart: null
    };
  },
  watch: {
    coverage: {
      handler() {
        this.renderCoverage();
      },
      deep: true
    },
    education: {
      handler() {
        this.renderEducation();
      },
      deep: true
    }
  },
  mounted() {
    this.coverageChart = echarts.init(this.$refs.coverageChart);
    this.educationChart = echarts.init(this.$refs.educationChart);
    this.renderCoverage();
    this.renderEducation();
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
    if (this.coverageChart) this.coverageChart.dispose();
    if (this.educationChart) this.educationChart.dispose();
  },
  methods: {
    handleResize() {
      if (this.coverageChart) {
        this.coverageChart.resize();
      }
      if (this.educationChart) {
        this.educationChart.resize();
      }
    },
    renderCoverage() {
      if (!this.coverageChart) return;
      const option = {
        backgroundColor: 'transparent',
        tooltip: { trigger: 'item' },
        grid: { top: '8%', left: '3%', right: '4%', bottom: '5%', containLabel: true },
        xAxis: {
          type: 'category',
          data: this.coverage.map((item) => item.name),
          axisLabel: { color: '#9fb5d9' },
          axisLine: { lineStyle: { color: '#284b8f' } }
        },
        yAxis: {
          type: 'value',
          axisLabel: { color: '#9fb5d9' },
          splitLine: { lineStyle: { color: '#1b2a4a' } }
        },
        series: [
          {
            name: '覆盖企业数量',
            type: 'bar',
            data: this.coverage.map((item) => item.value),
            barWidth: '45%',
            itemStyle: {
              borderRadius: [10, 10, 0, 0],
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#66bb6a' },
                { offset: 1, color: '#1b5e20' }
              ])
            }
          }
        ]
      };
      this.coverageChart.setOption(option, true);
    },
    renderEducation() {
      if (!this.educationChart) return;
      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}人 ({d}%)'
        },
        legend: {
          bottom: 0,
          textStyle: { color: '#9fb5d9' }
        },
        series: [
          {
            name: '学历结构',
            type: 'pie',
            radius: ['35%', '65%'],
            avoidLabelOverlap: false,
            label: {
              color: '#d0e6ff',
              formatter: '{b}\n{d}%'
            },
            labelLine: {
              length: 18,
              length2: 12
            },
            data: this.education.map((item) => ({ ...item, value: item.value }))
          }
        ]
      };
      this.educationChart.setOption(option, true);
    }
  }
};
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar {
  width: 6px;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: rgba(79, 195, 247, 0.4);
  border-radius: 999px;
}
</style>
