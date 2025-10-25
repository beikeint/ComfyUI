<template>
  <div class="relative h-full w-full">
    <div class="absolute inset-0 grid-overlay rounded-3xl"></div>
    <div class="relative z-10 h-full w-full p-8 flex flex-col">
      <header class="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 class="text-3xl font-bold tracking-widest text-white">维度趋势</h2>
          <p class="mt-2 max-w-xl text-sm text-slate-300">
            从经济发展、产改推进、创新人才、工会工作四大维度，洞察改革成效与稳步提升态势。
          </p>
        </div>
        <div class="mt-4 flex items-center space-x-3 md:mt-0">
          <button
            v-for="(dimension, key) in dimensionList"
            :key="key"
            class="rounded-full border px-4 py-2 text-xs uppercase tracking-wider transition-all"
            :class="currentKey === key ? 'border-accent bg-accent/10 text-accent shadow-lg' : 'border-slate-600 text-slate-300'"
            @click="switchDimension(key)"
          >
            {{ dimension.name }}
          </button>
        </div>
      </header>
      <transition name="fade-slide" mode="out-in">
        <section :key="currentKey" class="mt-8 flex-1 card-surface p-6">
          <div class="section-title">
            <span>{{ dimensionList[currentKey].name }}年度指数</span>
          </div>
          <div ref="chart" class="h-full w-full"></div>
        </section>
      </transition>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'DimensionTrendsPanel',
  props: {
    years: {
      type: Array,
      required: true
    },
    dimensions: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chartInstance: null,
      currentKey: 'economic',
      timer: null
    };
  },
  computed: {
    dimensionList() {
      return this.dimensions || {};
    }
  },
  watch: {
    currentKey() {
      this.renderChart();
    },
    dimensions: {
      handler() {
        this.renderChart();
      },
      deep: true
    }
  },
  mounted() {
    this.chartInstance = echarts.init(this.$refs.chart);
    this.renderChart();
    window.addEventListener('resize', this.handleResize);
    this.startAutoSwitch();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
    clearInterval(this.timer);
    if (this.chartInstance) {
      this.chartInstance.dispose();
    }
  },
  methods: {
    handleResize() {
      if (this.chartInstance) this.chartInstance.resize();
    },
    switchDimension(key) {
      this.currentKey = key;
      this.startAutoSwitch();
    },
    startAutoSwitch() {
      if (this.timer) clearInterval(this.timer);
      const keys = Object.keys(this.dimensionList);
      if (!keys.length) return;
      this.timer = setInterval(() => {
        const currentIndex = keys.indexOf(this.currentKey);
        const nextIndex = (currentIndex + 1) % keys.length;
        this.currentKey = keys[nextIndex];
      }, 6000);
    },
    renderChart() {
      if (!this.chartInstance || !this.dimensionList[this.currentKey]) return;
      const data = this.dimensionList[this.currentKey].series;
      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis'
        },
        grid: { left: '3%', right: '4%', top: '12%', bottom: '8%', containLabel: true },
        xAxis: {
          type: 'category',
          data: this.years,
          boundaryGap: false,
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
            name: this.dimensionList[this.currentKey].name,
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 10,
            lineStyle: { color: '#4fc3f7', width: 3 },
            itemStyle: { color: '#4fc3f7', borderColor: '#0a1126', borderWidth: 3 },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(79, 195, 247, 0.45)' },
                { offset: 1, color: 'rgba(79, 195, 247, 0)' }
              ])
            },
            data
          }
        ]
      };
      this.chartInstance.setOption(option, true);
    }
  }
};
</script>
