---
title: 博客PRD v1.0.2
description: 关于页增加头像,深色浅色UI切换,首页标签筛选,以及图片创造图床逻辑优化
pubDate: 2026-05-10
draft: false
tags:
  - 博客
---
# 背景
当前博客基于 Astro + GitHub Pages + Obsidian 双端写作。已实现：自定义 remark 插件处理 Obsidian `[[双链]]` 和 `![[图片引用]]`，标签独立页面 `/tags/生活/` 等，图片同步脚本 `npm run sync:obsidian-images`，以及 Cloudinary 上传脚本。详细实现见 `blog-workflow.md`。

现在需要根据以下新需求调整代码和配置。

# 需求

## 1. 关于页面修改
- 在 `/about` 页面新增一个头像占位符（`<img src="/images/blog/avatar-placeholder.png" alt="avatar" />`），方便后续替换。
- 保持 GitHub、Twitter 链接不变，将后两个改为“抖音”和“Email”。
  - 抖音链接：`https://www.douyin.com/user/你的抖音号`（需要替换占位符）
  - Email：不跳转，点击时复制邮箱地址 `你的邮箱@example.com` 到剪贴板（需提供 JavaScript 实现）。
- 确保首页的四个标签入口（博客、项目、生活、想法）能正确跳转到对应的 `/tags/blog/`、`/tags/project/`、`/tags/life/`、`/tags/idea/` 页面（如果尚未实现，请添加链接）。

![https://res.cloudinary.com/dn3exco8l/image/upload/v1778403256/six-moon-blog/blog/about_v1.0.2.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1778403256/six-moon-blog/blog/about_v1.0.2.png)
## 2. 深色/浅色模式切换 UI
- 在页面左上角、博客标题左侧，增加一个深色/浅色模式切换按钮。
- 点击时切换全局主题，所有页面保持所选模式（localStorage 持久化），兼容 Astro 的 scoped 样式或 Tailwind dark mode 均可。
- 提供必要的 Astro 组件和主题切换逻辑（CSS 变量或 Tailwind 配置）。

![https://res.cloudinary.com/dn3exco8l/image/upload/v1778403257/six-moon-blog/blog/UI_Light_mode.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1778403257/six-moon-blog/blog/UI_Light_mode.png)
![https://res.cloudinary.com/dn3exco8l/image/upload/v1778403259/six-moon-blog/blog/UI_dark_mode.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1778403259/six-moon-blog/blog/UI_dark_mode.png)
## 3. 图片路径和写作流调整
- 当前图片实际存储规则已改变：
  - 所有本地图片现在统一放在 `six_moon.github.io/public/images/类名/` 下，“类名”对应 `src/content/` 下的分类名（如 `blog`、`template`、`craft`）。
  - **不再**使用 `public/images/obsidian/` 路径。
- 调整 `remark-obsidian.mjs` 中的图片转换逻辑：
  - Obsidian 中写 `![[图片名.png]]` 应转换为 `/images/blog/图片名.png`（假设文章在 `src/content/blog/`，你可以根据文件所在集合自动推断对应路径）。
  - 如果无法自动推断，则提供可配置的映射，确保 `blog` 集合的文章引用 `/images/blog/`，`template` 和 `craft` 集合的文章引用各自对应的目录，但 `template` 和 `craft` 内容本身不渲染到网站上。
- 更新图片同步脚本或构建流程：
  - 不再需要 `npm run sync:obsidian-images` 或修改其逻辑，改为只确保 `public/images/类名/` 下的图片在构建时被正确复制到最终站点（`public/` 下的内容 Astro 默认会打包，无需额外操作，但需确认）。
  - 移除或调整 `remark-obsidian.mjs` 中引用 `/images/obsidian/` 的部分，全部改为 `/images/对应类名/`。

 ![https://res.cloudinary.com/dn3exco8l/image/upload/v1778403261/six-moon-blog/blog/public_img.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1778403261/six-moon-blog/blog/public_img.png)

## 4. Cloudinary 上传范围调整
- 现在仅需将 `src/content/blog/` 中的文章所引用的本地图片（即 `public/images/blog/` 下的文件）上传到 Cloudinary。
- **不应**处理 `src/content/template/` 和 `src/content/craft/` 中的任何图片。
- 更新 `npm run upload:cloudinary` 脚本，只扫描 `src/content/blog/` 目录下的 Markdown 文件，提取其中的本地图片路径（形如 `/images/blog/xxx.png`），然后将其对应的实际文件上传到 Cloudinary，并输出可替换的 Cloudinary HTTPS 链接。
- 保留 `.env` 的环境变量设置。

![https://res.cloudinary.com/dn3exco8l/image/upload/v1778403263/six-moon-blog/blog/Cloudinary.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1778403263/six-moon-blog/blog/Cloudinary.png)


## 5. 首页标签筛选确认
- 确认首页博客列表必须通过链接跳转到标签独立页面（如 `/tags/生活/`），而非纯前端 JS 筛选（因为 GitHub Pages 不利于 SPA 路由，独立页面更 SEO 友好）。
- 如果首页的“四个标签入口”尚未实现为指向 `/tags/...` 的链接，请实现。

![https://res.cloudinary.com/dn3exco8l/image/upload/v1778403264/six-moon-blog/blog/tags_select.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1778403264/six-moon-blog/blog/tags_select.png)

# 输出要求
- 给出需要修改或新增的文件完整路径和代码。
- 如果涉及配置修改（如 `astro.config.mjs`），请给出修改后的完整内容。
- 提供简短的操作说明，确保改动后现有功能不受影响。
- 所有占位符（如用户名、邮箱、抖音号）使用 `你的用户名` 等形式，方便我后续全局替换。

# [版本一览](Blog%20PRD.md)
