# 镇级产改观察点数字平台

镇级产改观察点数字平台是面向镇级产改（产业工人队伍建设改革）成果展示与数据管理的大屏可视化项目。项目包含大屏驾驶舱和后台管理端两部分，分别用于成果展示与数据维护。

## 技术栈

- 前端：Vue 2 + Vue CLI、Vue Router、Axios、ECharts、Tailwind CSS、Animate.css、Lucide Vue 图标库
- 后端：Node.js + Express + CORS + body-parser
- 数据存储：本地 `server/data.json`
- 动画：CSS 动画与 ECharts 渐进动画
- 自适配：针对 1920×1080 的大屏布局，并兼顾平板与手机端

## 目录结构

```
observation-platform/
├── web/                  # 前端 Vue 应用
│   ├── public/
│   └── src/
└── server/               # Node.js API 服务
    ├── data.json
    ├── index.js
    └── package.json
```

## 快速开始

### 1. 启动后端服务

```bash
cd server
npm install
npm run start
```

服务器默认运行在 `http://localhost:5050`，支持以下接口：

- `GET /api/data`：获取大屏展示数据
- `POST /api/data`：更新并写入数据（需要管理端登录返回的 `x-admin-token`）
- `POST /api/login`：管理员登录，返回临时 token
- `POST /api/logout`：注销登录

可通过环境变量 `ADMIN_PASSWORD` 设置管理端密码，默认值为 `changeMe@2025`。

### 2. 启动前端

```bash
cd web
npm install
npm run serve
```

Vue 应用将运行在 `http://localhost:8080`。

## 自定义数据

所有展示数据保存在 `server/data.json` 中，可直接编辑或通过后台管理端更新。`meta.updatedAt` 字段会在每次更新时自动覆盖。

## 构建与发布

```bash
cd web
npm run build
```

构建产物默认输出至 `web/dist`，可与后端整合部署或托管在静态服务器上。

## 设计说明

- **大屏驾驶舱**：实现三大版面轮播，每 8 秒自动切换，支持手动切换。
- **后台管理端**：通过 `/admin` 路由访问，支持登录、数据编辑、实时预览、更新时间提示。
- 使用 Tailwind CSS 自定义深蓝色系主题变量，结合渐变背景与动画凸显科技氛围。

## 兼容性

- 主要面向现代浏览器（Chrome、Edge、Firefox）及 Chromium 内核的触控大屏
- 通过响应式布局适配 1920×1080 大屏及常见 Pad、手机尺寸

## License

遵循项目根目录 License（见仓库根目录 `LICENSE`）。
