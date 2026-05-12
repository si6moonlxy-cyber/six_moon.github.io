---
title: 博客PRD v1.0.1
description: 页面修改,obsidian+Astro的MD文档格式对齐,文章标签分类导航,图片资源图床
pubDate: 2026-05-10
draft: false
tags:
  - 博客
---
# 背景
我正在使用 Astro 构建个人博客，部署到 GitHub Pages，通过 VS Code 和 Obsidian 双端写作。目前已实现基础页面展示，现在需要针对以下四个需求提供代码实现或具体配置步骤。

# 需求

## 1. 关于页面修改
- 位置：博客首页右上角的“关于”链接，点击后进入 `/about` 页面。
- 要求：
  - 展示我的自我介绍：200字左右，可包含当前状态、兴趣领域、内容范围等。
  - 列出社交平台链接：GitHub、Twitter、Mastodon、个人邮箱等（图标+链接形式）。
  - 页面风格与整体博客保持一致（使用现有 Astro 布局组件）。
  - 提供 Astro 页面文件（如 `about.astro`）及对应的样式代码，可引用 Heroicons 图标或 SVG 图标。

![https://res.cloudinary.com/dn3exco8l/image/upload/v1778403249/six-moon-blog/blog/about_v1.0.1.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1778403249/six-moon-blog/blog/about_v1.0.1.png)
## 2. Obsidian 写作流与 Astro 解析
- 我的写作流程：在 Obsidian 编辑 Markdown 笔记（含 `[[双链]]`、`![[图片引用]]`、标签和 Front Matter），放在本地 Obsidian vault 中的 `blog-posts` 文件夹，定期同步到 Astro 项目 `src/content/posts/` 目录。
- 要求：
  - 配置 `astro-loader-obsidian` 或 `astro-content-sync` 等方案，让 Astro 能够识别 Obsidian 语法（双链、图片、标签）。
  - 给出具体的安装步骤、`astro.config.mjs` 和 `content.config.mjs` 的配置代码。
  - 实现构建时将图片复制到 `public/` 或合适的静态目录，确保文章中 `![[image.png]]` 能正确显示。
  - 如果双链需要转换为 Astro 的标准链接，请提供处理方法或转换层代码。

## 3. 文章标签过滤与分类导航
- 我预设了四种标签：`生活`、`博客`、`项目`、`想法`。
- 要求：
  - 在博客首页或顶栏添加一个基于标签的筛选器（如按钮组或下拉菜单），点击某个标签后，只显示带有该标签的文章。
  - 标签筛选器支持与“全部”显示切换。
  - 文章卡片需要展示标签。
  - 提供 Astro 组件或页面的示例代码，使用 `Astro.props` 或 `getCollection` 过滤实现。
  - 考虑 SEO：是否为每个标签生成独立页面（如 `/tags/生活`）更友好？如果这样更好，请给出现有路由和生成逻辑。

![https://res.cloudinary.com/dn3exco8l/image/upload/v1778403252/six-moon-blog/blog/index.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1778403252/six-moon-blog/blog/index.png)

## 4. 图片资源管理与存储
- 当前图片直接存放在 GitHub 仓库中，导致仓库体积过大，部署变慢。
- 要求：推荐并实现一套免费或低成本的图片存储方案，可选方向包括：
  - 图床服务：如 Cloudinary（免费额度 25GB）、ImageKit、Aliyun OSS + PicGo 等。
  - 图片压缩：在构建时通过 Astro 图片组件 `@astrojs/image` 或 `astro-imagetools` 自动压缩。
  - 工作流集成：在 Obsidian 中使用 PicGo 插件，上传图片后自动得到图床链接，替换本地的 `![[image.png]]` 引用；或在 Astro 构建阶段用图片优化插件处理本地图片并上传至 CDN。
- 请给出推荐方案，提供具体的配置步骤和代码。如果选择 Cloudinary，请说明如何通过环境变量安全储存 API Key。

![https://res.cloudinary.com/dn3exco8l/image/upload/v1778403253/six-moon-blog/blog/upload-img-obs-cloud.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1778403253/six-moon-blog/blog/upload-img-obs-cloud.png)

# 输出要求
- 每个需求的解决方案需包含：
  - 必要的环境工具或插件安装命令（如适用）。
  - 完整的文件路径和代码块。
  - 简要的“为什么这样实现”的解释。
- 优先保证方案的可维护性和最简实现，避免过度工程化。

# [[Blog PRD|版本一览]]
