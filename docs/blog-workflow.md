# 博客写作与图片工作流

## 安装命令

当前实现不依赖第三方 Obsidian loader，使用 Astro 原生 content collection 加自定义 remark 插件处理 `[[双链]]` 和 `![[图片引用]]`。

```bash
npm install
```

可选 Cloudinary 批量上传脚本需要：

```bash
npm install cloudinary dotenv
```

## 内容目录

- 手写文章：`src/content/blog/`
- 从 Obsidian 同步来的文章：`src/content/posts/`
- 本地图片目录：`public/images/类名/`，例如 `public/images/blog/`

Front Matter 示例：

```yaml
---
title: 文章标题
description: 首页卡片描述
pubDate: 2026-05-10
tags:
  - 博客
  - 想法
draft: false
---
```

标签只允许：`生活`、`博客`、`项目`、`想法`。这样做能避免同义标签越写越散，也方便生成 `/tags/标签名/` 独立页面。

## Obsidian 语法处理

`astro.config.mjs` 已启用：

```js
import { remarkObsidian } from './src/lib/remark-obsidian.mjs';

export default defineConfig({
  markdown: {
    remarkPlugins: [remarkObsidian],
  },
});
```

转换规则：

- `[[hello-world]]` -> `/blog/hello-world/`
- `[[hello-world|第一篇文章]]` -> 文本为“第一篇文章”的链接
- `src/content/blog/` 内的 `![[cover.png]]` -> `/images/blog/cover.png`
- `src/content/template/` 内的 `![[cover.png]]` -> `/images/template/cover.png`
- `src/content/craft/` 内的 `![[cover.png]]` -> `/images/craft/cover.png`

图片放在 `public/images/类名/` 后，Astro 会在构建时自动复制到最终站点，不再需要额外同步命令。

## 标签页面

博客列表页 `/blog/` 显示“全部”和四个标签入口。每个标签也有独立 SEO 页面，默认链接使用英文 slug：

- `/tags/life/`
- `/tags/blog/`
- `/tags/project/`
- `/tags/idea/`

同时保留中文路径兼容，例如 `/tags/生活/`。

独立页面比纯前端筛选更适合 GitHub Pages，因为页面能被搜索引擎直接抓取，也能被单独分享。

## 图片存储建议

推荐流程：

1. 日常写作先用本地附件，确保 Obsidian 体验顺滑。
2. 发布前对大图用 PicGo 上传到 Cloudinary。
3. 把 Markdown 里的 `![[image.png]]` 替换为 Cloudinary URL。
4. 小图、favicon、必要配图仍可放仓库。

Cloudinary 环境变量放在 `.env`，不要提交：

```bash
CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
```

仓库已提供 `.env.example`。`.gitignore` 已忽略 `.env`。

可选批量上传：

```bash
npm run upload:cloudinary
```

这个命令只扫描 `src/content/blog/` 的 Markdown，提取其中 `/images/blog/...` 本地图片引用，上传对应的 `public/images/blog/...` 文件，并输出可替换到 Markdown 的 HTTPS 地址。它不会处理 `template` 或 `craft`。
