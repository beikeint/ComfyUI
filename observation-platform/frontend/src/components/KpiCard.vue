<template>
  <div class="card-surface p-5 flex flex-col justify-between h-full">
    <div class="text-sm text-slate-300 uppercase tracking-widest flex items-center space-x-2">
      <slot name="icon"></slot>
      <span>{{ title }}</span>
    </div>
    <div class="mt-4 text-4xl font-semibold text-accent animate__animated animate__fadeInUp">
      {{ formattedValue }}
    </div>
    <div v-if="subtext" class="mt-2 text-xs text-slate-400">{{ subtext }}</div>
  </div>
</template>

<script>
export default {
  name: 'KpiCard',
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: [Number, String],
      default: 0
    },
    suffix: {
      type: String,
      default: ''
    },
    subtext: {
      type: String,
      default: ''
    }
  },
  computed: {
    formattedValue() {
      if (typeof this.value === 'number') {
        return `${this.value.toLocaleString()}${this.suffix}`;
      }
      return `${this.value}${this.suffix}`;
    }
  }
};
</script>
