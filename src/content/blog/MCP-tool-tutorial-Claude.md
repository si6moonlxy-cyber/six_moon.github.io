---
title: Claude code CLI 利用 CC-Switch & VS Code使用
pubDate: 2026-05-13
draft: false
description: 利用集成工具CC-Switch和VS Code使得Claude code 接入  DS v4 Pro 实现 图文版
tags:
  - 想法
---
# Claude code 与 CC-Switch & VS Code 的完美二重奏
>适用人群:没有Claude官方账号但是需要使用Claude Code的人群
>推荐使用场景:初次使用Claude,Claude接入DeepSeek,对MCP工具有强需求的场景

---
## 配置cc - switch
### 1. 打开 cc-switch的github官方仓库 : [github/cc-switch](https://github.com/farion1231/cc-switch)
![4908d503cc7ab1a2288a8eb09d74bb1d.png|437](https://res.cloudinary.com/dn3exco8l/image/upload/v1778710994/six-moon-blog/blog/e8a3b11181161e7ea1f2255dff503daa.png)
### 2. 下滑找到 Releases ,只需选择最新版 
![091a7973ed4bfbc686cbd237dd45c9dd.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1778711034/six-moon-blog/blog/f03455934cf4a2026143912392951ed6.png)
### 3. 下滑找到安装文档以及版本库
![c253d6da2e2e55b8092a191923e601ce.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1778711099/six-moon-blog/blog/68d01d6d074b86c39fc5961809454b50.png)
### 4. 下载对应安装包 , 开箱即用
![image.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1778711517/six-moon-blog/blog/fb754adcc230bec4433663c6f00a2097.png)
### 5. 配置相关属性
#### 1. 选择claude -> 加号 -> deep seek
![7f28d0850cf3d4bd9f902a26c2b0ad6b.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1778712241/six-moon-blog/blog/f680e99f8ef401fcbe7e74f1050ab08b.png)
#### 2. 输入DS密钥以及配置
![a85e09b04b5330bea86ba2ca36697894.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1778712268/six-moon-blog/blog/8cd815c9a4dec0efcea4422b05734817.png)
#### 3. 调整默认模型为 "DeepSeek-V4-Pro[1m]"
![image.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1778716790/six-moon-blog/blog/9df8e7f8543365aa401e9d9f6251e6a5.png)

#### 4. 回到首页
![2c2fd5182fa9bde0bca9bc10761cd613.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1778712321/six-moon-blog/blog/00059a446877d11eed1cff5a17b47c5c.png)

## 下载Claude CLI 
### 1. 打开claude code 的官方文档 [claude code Docs]([https://code.claude.com/docs/zh-CN/quickstart](https://code.claude.com/docs/en/overview#terminal))
![image.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1780756780/six-moon-blog/blog/3ba3d2a3c2ac5f03e2745fc447428306.png)

### 2. 根据你的设备运行下列脚本

``` Linux
curl -fsSL https://claude.ai/install.sh | bash
```

```PowerShell
irm https://claude.ai/install.ps1 | iex
```

```CMD
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```
![image.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1780757413/six-moon-blog/blog/857c7326859cd87e28c9f483d861e93e.png)
### 3. 这里使用PowerShell脚本
![image.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1778713151/six-moon-blog/blog/2d9976835db7d6824ef0f3e486e402e7.png)
**等待片刻~**
### 4. 完成后 输入 claude --version 测试是否安装完成
![image.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1778716181/six-moon-blog/blog/679b0ef916348048b0c3e6a8ae1799d7.png)
**显示 2.1.140 即安装成功**
### 5.测试deepseek v4的context
![image.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1778716986/six-moon-blog/blog/9b44ad4188f9a8416bfc12a14b69291f.png)
- DeepSeek - V4 - Pro[1m] 显示当前API运营商,cc可以一键切换
- 上下文拥有1M
- Skills为当前挂载的技能

## 使用VS Codex的Claude插件
### 1. 打开 [在 VS Code 中使用 Claude Code](https://code.claude.com/docs/en/vs-code#get-started)
![image.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1780842458/six-moon-blog/blog/d538dce5c274dbadd77285adae995a58.png)
### 2. 下载Claude Code for VS Code(默认已有VS Code)
![image.png|582](https://res.cloudinary.com/dn3exco8l/image/upload/v1780842561/six-moon-blog/blog/95e96ecda61f134cf76e5af6c306e526.png)
### 3. 测试Claude插件
![image.png|369](https://res.cloudinary.com/dn3exco8l/image/upload/v1780842729/six-moon-blog/blog/43cef8f17dff8ac698bb3269e5741b9c.png)
**输入/context 测试当前上下文**
![image.png|582](https://res.cloudinary.com/dn3exco8l/image/upload/v1780842842/six-moon-blog/blog/7e19c722fe90c634ee0290ec3d2257ac.png)
**显示Model: DeepSeek-V4-Pro[1m]即配置成功**

---
*Written By Six_moon*
