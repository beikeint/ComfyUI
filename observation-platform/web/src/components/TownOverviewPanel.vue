<template>
  <div class="relative h-full w-full">
    <div class="absolute inset-0 grid-overlay rounded-3xl"></div>
    <div class="relative z-10 h-full w-full p-8">
      <header class="flex items-center justify-between">
        <div>
          <h2 class="text-3xl font-bold tracking-widest text-white">镇级产改总览</h2>
          <p class="mt-2 text-sm text-slate-300">聚焦整体产改推进态势，呈现核心指标与年度趋势。</p>
        </div>
        <div class="text-right">
          <p class="text-sm text-slate-400">最近更新</p>
          <p class="text-lg font-semibold text-accent">{{ formattedUpdatedAt }}</p>
        </div>
      </header>
      <section class="mt-6 grid grid-cols-5 gap-4">
        <KpiCard title="产改覆盖率" :value="kpis.coverageRate" suffix="%" subtext="覆盖镇域重点企业">
          <template #icon>
            <TrendingUp class="h-5 w-5 text-accent" />
          </template>
        </KpiCard>
        <KpiCard title="企业总数" :value="kpis.enterpriseCount" suffix="家" subtext="纳统企业总量">
          <template #icon>
            <Building class="h-5 w-5 text-accent" />
          </template>
        </KpiCard>
        <KpiCard title="创新项目数" :value="kpis.innovationProjects" suffix="项" subtext="年度累计">
          <template #icon>
            <Lightbulb class="h-5 w-5 text-accent" />
          </template>
        </KpiCard>
        <KpiCard title="工会数" :value="kpis.unionCount" suffix="个" subtext="基层工会组织">
          <template #icon>
            <Users class="h-5 w-5 text-accent" />
          </template>
        </KpiCard>
        <KpiCard title="培训人次" :value="kpis.trainingCount" suffix="人次" subtext="技能提升累计">
          <template #icon>
            <GraduationCap class="h-5 w-5 text-accent" />
          </template>
        </KpiCard>
      </section>
      <section class="mt-8 h-[55%] card-surface p-6">
        <div class="section-title">
          <span>年度趋势洞察</span>
        </div>
        <div ref="chart" class="h-full w-full"></div>
      </section>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import KpiCard from './KpiCard.vue';
import { TrendingUp, Building, Lightbulb, Users, GraduationCap } from 'lucide-vue';

export default {
  name: 'TownOverviewPanel',
  components: { KpiCard, TrendingUp, Building, Lightbulb, Users, GraduationCap },
  props: {
    kpis: {
      type: Object,
      required: true
    },
    trends: {
      type: Object,
      required: true
    },
    updatedAt: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      chartInstance: null
    };
  },
  computed: {
    formattedUpdatedAt() {
      if (!this.updatedAt) return '—';
      const date = new Date(this.updatedAt);
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${`${date.getMinutes()}`.padStart(2, '0')}`;
    }
  },
  watch: {
    trends: {
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
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
    if (this.chartInstance) {
      this.chartInstance.dispose();
    }
  },
  methods: {
    handleResize() {
      if (this.chartInstance) {
        this.chartInstance.resize();
      }
    },
    renderChart() {
      if (!this.chartInstance || !this.trends || !this.trends.years) return;
      const option = {
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis' },
        legend: {
          data: ['企业总数', '创新项目', '培训人次'],
          textStyle: { color: '#9fb5d9' }
        },
        grid: { left: '3%', right: '3%', bottom: '6%', containLabel: true },
        xAxis: {
          type: 'category',
          data: this.trends.years,
          axisLabel: { color: '#9fb5d9' },
          axisLine: { lineStyle: { color: '#284b8f' } }
        },
        yAxis: [
          {
            type: 'value',
            axisLabel: { color: '#9fb5d9' },
            splitLine: { lineStyle: { color: '#1b2a4a' } }
          },
          {
            type: 'value',
            axisLabel: { color: '#9fb5d9' },
            splitLine: { show: false }
          }
        ],
        series: [
          {
            name: '企业总数',
            type: 'bar',
            data: this.trends.enterpriseCounts,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#4fc3f7' },
                { offset: 1, color: '#1d2f6f' }
              ])
            },
            barMaxWidth: 28
          },
          {
            name: '创新项目',
            type: 'line',
            yAxisIndex: 1,
            smooth: true,
            symbol: 'circle',
            symbolSize: 10,
            lineStyle: { color: '#29b6f6', width: 3 },
            itemStyle: { color: '#29b6f6' },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(41, 182, 246, 0.35)' },
                { offset: 1, color: 'rgba(41, 182, 246, 0)' }
              ])
            },
            data: this.trends.innovationProjects
          },
          {
            name: '培训人次',
            type: 'line',
            smooth: true,
            symbol: 'triangle',
            symbolSize: 10,
            lineStyle: { color: '#ffb74d', width: 3 },
            itemStyle: { color: '#ffb74d' },
            data: this.trends.trainingCounts
          }
        ]
      };
      this.chartInstance.setOption(option);
    }
  }
};
</script>
