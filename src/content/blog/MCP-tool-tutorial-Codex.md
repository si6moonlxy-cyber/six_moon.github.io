---
title: Codex 与 CC-Switch & Codex++的使用
pubDate: 2026-06-07
draft: false
description: 利用集成工具CC-Switch和Codex++使得Codex 接入 DS v4 Pro 并且启动登录版UI实现 图文版
tags:
  - 想法
---
# Codex 与 CC-Switch & Codex++ 的完美二重奏
>适用人群:没有GPT官方账号但是需要使用Codex的人群
>推荐使用场景:初次使用Codex,Codex接入DeepSeek,对MCP工具有强需求的场景

---
## 配置cc - switch
### 1. 打开 cc-switch的github官方仓库 : [github/cc-switch](https://github.com/farion1231/cc-switch)
![4908d503cc7ab1a2288a8eb09d74bb1d.png|437](https://res.cloudinary.com/dn3exco8l/image/upload/v1778710994/six-moon-blog/blog/e8a3b11181161e7ea1f2255dff503daa.png)
### 2. 下滑找到 Releases ,只需选择最新版 
![091a7973ed4bfbc686cbd237dd45c9dd.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1778711034/six-moon-blog/blog/f03455934cf4a2026143912392951ed6.png)
### 3. 下滑找到安装文档以及版本库
![c253d6da2e2e55b8092a191923e601ce.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1778711099/six-moon-blog/blog/68d01d6d074b86c39fc5961809454b50.png)
### 4. 下载对应安装包 , 开箱即用
![image.png|557](https://res.cloudinary.com/dn3exco8l/image/upload/v1780751795/six-moon-blog/blog/2c51d06eb89638e394168da027b2cd1b.png)
### 5. 配置相关属性
#### 1. 选择codex -> 加号 -> deep seek
![image.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1780755369/six-moon-blog/blog/8029174227dee3d0160865360c264463.png)
#### 2. 输入DS密钥以及配置
![a85e09b04b5330bea86ba2ca36697894.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1778712268/six-moon-blog/blog/8cd815c9a4dec0efcea4422b05734817.png)
#### 3. Codex使用非GPT节点需要打开路由
![image.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1780755411/six-moon-blog/blog/80494e079a4a2ea1f1799077446a895d.png)
#### 4. 打开思考和配置deepseek的两个模型
![image.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1780755704/six-moon-blog/blog/3a910937b3fae246aaa0ba914eb568bc.png)
#### 5. 配置cc-switch的路由
![image.png|697](https://res.cloudinary.com/dn3exco8l/image/upload/v1780755816/six-moon-blog/blog/e9a91967e35161139f1448b873a8f0af.png)
![image.png|697](https://res.cloudinary.com/dn3exco8l/image/upload/v1780755944/six-moon-blog/blog/9d1ece323ec742adc090c9b2d8b4668b.png)
#### 6. 开启故障转移(若没有多个Codex API可以跳过)
![image.png|697](https://res.cloudinary.com/dn3exco8l/image/upload/v1780756135/six-moon-blog/blog/d556d6788ec84cd70be39bd3c7c22374.png)
**选择你的供应商List (队列顺序与首页供应商列表顺序一致，可在首页拖拽调整顺序)**
![image.png|697](https://res.cloudinary.com/dn3exco8l/image/upload/v1780756154/six-moon-blog/blog/69f6b845c43f8d67ef0acc042d439239.png)
#### 7. 回到首页
![image.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1780756257/six-moon-blog/blog/32845be904e9391aa5e8ce7c01d26253.png)

## 配置Codex++ (PS:仅仅优化Codex页面,若无需求,可以跳过)
### 1. 打开 Codex++的github官方仓库 : [github/CodexPlusPlus](https://github.com/BigPizzaV3/CodexPlusPlus)
![image.png|697](https://res.cloudinary.com/dn3exco8l/image/upload/v1780843683/six-moon-blog/blog/5d552522d19cbdf828223b6dfc2d5776.png)
### 2. 选择最新版本下载
![image.png|697](https://res.cloudinary.com/dn3exco8l/image/upload/v1780843710/six-moon-blog/blog/22498f585b18812ae8dd05d42be496e4.png)
### 3. 一个Codex++和后台管理
![image.png|697](https://res.cloudinary.com/dn3exco8l/image/upload/v1780843836/six-moon-blog/blog/2a4198342a791e6f69671ab5879b0048.png)
### 4. 打开后台管理开启页面增强
![image.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1780844013/six-moon-blog/blog/296db19286dcfe096342bc98bcb5e172.png)

## 下载Codex
### 1. 打开 [Codex下载](https://openai.com/codex/)
![image.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1780844198/six-moon-blog/blog/43d2a846c83bc90fbe754584dc9ee98c.png)
### 2.  下载后从Codex++打开Codex
![image.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1780844354/six-moon-blog/blog/0f7377308585a7e5bac3ecd74cf735a7.png)
![image.png|697](https://res.cloudinary.com/dn3exco8l/image/upload/v1780844485/six-moon-blog/blog/689de4b28d238aa779066b460cb28534.png)
**插件等功能能用即配置成功**

---
*Written By Six_moon*