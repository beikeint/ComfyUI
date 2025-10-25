<template>
  <div class="card-surface p-5 h-full flex flex-col">
    <div class="section-title">
      <span>企业亮点速览</span>
    </div>
    <div class="relative flex-1 overflow-hidden">
      <transition-group name="fade-slide" tag="div">
        <article
          v-for="item in displayHighlights"
          :key="item.id"
          class="animate__animated animate__fadeIn h-full flex flex-col justify-between"
        >
          <div>
            <h3 class="text-xl font-semibold text-accent">{{ item.title }}</h3>
            <div class="mt-3 flex flex-wrap">
              <span v-for="tag in item.tags" :key="tag" class="highlight-tag">
                {{ tag }}
              </span>
            </div>
            <p class="mt-4 text-sm text-slate-300 leading-relaxed">
              {{ item.description }}
            </p>
          </div>
        </article>
      </transition-group>
    </div>
    <div class="mt-4 flex justify-center space-x-2">
      <span
        v-for="(item, index) in highlights"
        :key="item.id"
        class="carousel-dot"
        :class="{ 'carousel-dot-active': index === currentIndex }"
        @click="jumpTo(index)"
      ></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HighlightTicker',
  props: {
    highlights: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentIndex: 0,
      timer: null
    };
  },
  computed: {
    activeHighlight() {
      return this.highlights[this.currentIndex] || null;
    },
    displayHighlights() {
      if (!this.activeHighlight) {
        return [
          {
            id: 'placeholder',
            title: '暂无亮点信息',
            tags: [],
            description: '请在后台管理端补充企业亮点内容。'
          }
        ];
      }
      return [
        {
          id: this.activeHighlight.id,
          title: this.activeHighlight.title,
          tags: Array.isArray(this.activeHighlight.tags) ? this.activeHighlight.tags : [],
          description: this.activeHighlight.description || '—'
        }
      ];
    }
  },
  watch: {
    highlights: {
      handler() {
        if (!this.highlights.length) {
          this.currentIndex = 0;
        } else if (this.currentIndex >= this.highlights.length) {
          this.currentIndex = 0;
        }
        this.restart();
      },
      deep: true
    }
  },
  mounted() {
    this.start();
  },
  beforeDestroy() {
    this.stop();
  },
  methods: {
    start() {
      this.stop();
      if (!this.highlights.length) return;
      this.timer = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.highlights.length;
      }, 5000);
    },
    stop() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    restart() {
      this.start();
    },
    jumpTo(index) {
      this.currentIndex = index;
      this.restart();
    }
  }
};
</script>
