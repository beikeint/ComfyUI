<template>
  <div class="flex min-h-screen items-center justify-center bg-[#050b1e] px-6">
    <div class="card-surface w-full max-w-md p-8">
      <h2 class="text-2xl font-semibold text-center text-accent tracking-[0.3em]">管理登录</h2>
      <p class="mt-2 text-center text-sm text-slate-400">请输入管理密码以进入数据维护后台</p>
      <form class="mt-6 space-y-5" @submit.prevent="handleSubmit">
        <div>
          <label class="block text-xs uppercase tracking-widest text-slate-400">用户名</label>
          <input
            v-model="form.username"
            type="text"
            class="mt-2 w-full rounded-lg border border-slate-600 bg-slate-900/60 px-4 py-3 text-sm focus:border-accent focus:outline-none"
            placeholder="默认 admin，可自定义"
          />
        </div>
        <div>
          <label class="block text-xs uppercase tracking-widest text-slate-400">密码</label>
          <input
            v-model="form.password"
            type="password"
            class="mt-2 w-full rounded-lg border border-slate-600 bg-slate-900/60 px-4 py-3 text-sm focus:border-accent focus:outline-none"
            placeholder="请输入管理密码"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full rounded-lg bg-accent py-3 text-sm font-semibold uppercase tracking-widest text-slate-900 transition hover:opacity-90"
          :disabled="loading"
        >
          {{ loading ? '登录中…' : '进入管理后台' }}
        </button>
      </form>
      <p v-if="error" class="mt-4 text-center text-sm text-red-400">{{ error }}</p>
      <router-link class="mt-6 block text-center text-xs text-slate-400 hover:text-accent" to="/">
        返回大屏驾驶舱
      </router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AdminLogin',
  data() {
    return {
      form: {
        username: 'admin',
        password: ''
      },
      loading: false,
      error: ''
    };
  },
  methods: {
    async handleSubmit() {
      this.loading = true;
      this.error = '';
      try {
        const { data } = await axios.post('/api/login', this.form);
        localStorage.setItem('observation-token', data.token);
        localStorage.setItem('observation-username', data.username);
        this.$router.push({ name: 'AdminPanel' });
      } catch (err) {
        const message =
          err && err.response && err.response.data && err.response.data.message
            ? err.response.data.message
            : '登录失败，请检查密码';
        this.error = message;
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
