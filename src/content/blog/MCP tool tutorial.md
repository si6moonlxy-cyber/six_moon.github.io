---
title: CC-Switch投入生成跨平台MCP工具
pubDate: 2026-05-13
draft: false
description: 利用集成MCP工具CC-Switch使得Claude code 接入 DeepSeek API实现 图文版
tags:
  - 项目
  - 想法
---
## 配置cc - switch
### 1. 打开 cc-switch的github官方仓库 : [github/cc-switch](https://github.com/farion1231/cc-switch)
![4908d503cc7ab1a2288a8eb09d74bb1d.png|437](https://res.cloudinary.com/dn3exco8l/image/upload/v1778710994/six-moon-blog/blog/e8a3b11181161e7ea1f2255dff503daa.png)
### 2. 下滑找到 Releases ,只需选择最新版 
![091a7973ed4bfbc686cbd237dd45c9dd.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1778711034/six-moon-blog/blog/f03455934cf4a2026143912392951ed6.png)
### 3. 下滑找到安装文档以及版本库
![c253d6da2e2e55b8092a191923e601ce.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1778711099/six-moon-blog/blog/68d01d6d074b86c39fc5961809454b50.png)
### 4. 下载对应安装包 , 开箱即用 , 单机即可迅速切换
![image.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1778711517/six-moon-blog/blog/fb754adcc230bec4433663c6f00a2097.png)
### 5. 打开运行 , 并且配置相关属性
#### 1. 选择claude - deepseek
![7f28d0850cf3d4bd9f902a26c2b0ad6b.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1778712241/six-moon-blog/blog/f680e99f8ef401fcbe7e74f1050ab08b.png)
#### 2. 输入DS密钥以及配置
![a85e09b04b5330bea86ba2ca36697894.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1778712268/six-moon-blog/blog/8cd815c9a4dec0efcea4422b05734817.png)
#### 3. 调整默认模型为 "DeepSeek-V4-Pro[1m]"
![image.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1778716790/six-moon-blog/blog/9df8e7f8543365aa401e9d9f6251e6a5.png)

#### 4. 回到首页
![2c2fd5182fa9bde0bca9bc10761cd613.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1778712321/six-moon-blog/blog/00059a446877d11eed1cff5a17b47c5c.png)

## 下载Claude
### 1. 打开claude code 的官方文档 [claude code Docs](https://code.claude.com/docs/zh-CN/quickstart)
![image.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1778712607/six-moon-blog/blog/8dda0e057945c084f499b140870b5643.png)
### 2. 打开cmd运行下列脚本
- **macOS, Linux, WSL:**
	```
	curl -fsSL https://claude.ai/install.sh | bash
	```
- **Windows PowerShell:**
	```
	irm https://claude.ai/install.ps1 | iex
	```
- **Windows CMD:**
	```
	curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
	```
### 3. 打开cmd输入脚本
![image.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1778713151/six-moon-blog/blog/2d9976835db7d6824ef0f3e486e402e7.png)
### 4. 输入 claude --version 测试是否安装完成
![image.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1778716181/six-moon-blog/blog/679b0ef916348048b0c3e6a8ae1799d7.png)
- 显示 2.1.140 即安装成功
### 5.测试deepseek v4的context
![image.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1778716986/six-moon-blog/blog/9b44ad4188f9a8416bfc12a14b69291f.png)
- DeepSeek - V4 - Pro[1m] 显示当前API运营商,cc可以一键切换
- 上下文拥有1M
- Skills为当前挂载的技能