---
title: Git 操作教学
description: Git、GitHub 与 VS Code 可视化 Git 的入门说明和常见问题排查手册
pubDate: 2026-05-12
draft: false
tags:
  - 项目
  - 想法
---
# Git 使用说明与常见问题排查手册

> 适用对象：刚开始使用 Git、GitHub、VS Code 可视化 Git 的个人项目维护者。  
> 推荐使用场景：个人博客、前端项目、文档项目、vibe coding 需要强版本管理的项目。

---


## 1. Git 是什么

Git 是一个版本管理工具，用来记录项目文件的变化。

你可以把 Git 理解成：

```text
项目文件的时间机器
```

它可以帮助你做到：

- 保存每一次修改记录
- 查看哪里改了
- 回到之前的版本
- 把本地代码上传到 GitHub
- 多台电脑之间同步项目
- 多人协作开发

GitHub 是一个远程代码托管平台。Git 是工具，GitHub 是远程仓库网站。

```text
Git：本地版本管理工具
GitHub：远程仓库存放平台
VS Code：编辑器，可以可视化操作 Git
```


---


## 2. Git 的核心概念

### 2.1 工作区 Working Directory

你正在编辑的项目文件所在位置，就是工作区。

例如：

```text
my-blog/
├─ src/
├─ public/
├─ package.json
├─ README.md
└─ .gitignore
```

你修改文件后，这些变化会先出现在工作区。

---

### 2.2 暂存区 Staging Area

暂存区表示：

```text
我要把这些修改放进下一次提交里
```

命令是：

```bash
git add .
```

或者在 VS Code 中点击文件旁边的 `+`。

---

### 2.3 本地仓库 Local Repository

提交之后，Git 会在本地保存一个版本记录。

命令是：

```bash
git commit -m "update blog"
```

注意：

```text
commit 只是保存到本地，还没有上传 GitHub。
```

---

### 2.4 远程仓库 Remote Repository

远程仓库通常在 GitHub 上。

上传到 GitHub 的命令是：

```bash
git push
```

从 GitHub 拉取更新的命令是：

```bash
git pull
```

---

### 2.5 四个区域的关系

```text
工作区
  ↓ git add
暂存区
  ↓ git commit
本地仓库
  ↓ git push
远程仓库 GitHub
```

对应日常流程：

```bash
git status
git add .
git commit -m "update blog"
git push
```


---


## 3. 第一次使用 Git 的基础配置

### 3.1 查看 Git 是否安装

```bash
git --version
```

如果输出类似：

```text
git version 2.45.0
```

说明 Git 已安装。

---

### 3.2 设置用户名和邮箱

这两个信息会写入你的提交记录。

```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

例子：

```bash
git config --global user.name "Serecely"
git config --global user.email "example@gmail.com"
```

查看配置：

```bash
git config --global user.name
git config --global user.email
```

查看所有全局配置：

```bash
git config --global --list
```

---

### 3.3 设置默认分支名为 main

```bash
git config --global init.defaultBranch main
```

以后新建仓库时，默认分支就是 `main`。


---


## 4. 创建或下载仓库

Git 项目有两种常见开始方式。

---

### 4.1 方式一：从 GitHub 下载已有仓库

使用 `git clone`。

```bash
git clone git@github.com:username/repository-name.git
```

例子：

```bash
git clone git@github.com:username/my-blog.git
```

然后进入项目：

```bash
cd my-blog
```

查看状态：

```bash
git status
```

---

### 4.2 方式二：本地项目初始化为 Git 仓库

如果你已经有一个本地项目：

```bash
cd my-blog
git init
```

添加所有文件：

```bash
git add .
```

提交第一个版本：

```bash
git commit -m "init project"
```

绑定 GitHub 远程仓库：

```bash
git remote add origin git@github.com:username/my-blog.git
```

设置分支为 `main`：

```bash
git branch -M main
```

推送到 GitHub：

```bash
git push -u origin main
```


---


## 5. 日常 Git 工作流

### 5.1 每次开始工作前

建议先拉取远程最新内容：

```bash
git pull
```

如果你是一个人维护项目，而且只在本地改，一般不会经常冲突。但如果你在 GitHub 网页上改过文件，本地就需要先 `pull`。

---

### 5.2 修改文件后查看状态

```bash
git status
```

常见输出：

```text
modified:   src/pages/index.astro
untracked:  src/content/new-post.md
```

含义：

```text
modified   已修改的文件
untracked  新文件，Git 还没有跟踪
deleted    删除的文件
```

---

### 5.3 查看具体修改内容

```bash
git diff
```

查看某个文件：

```bash
git diff README.md
```

查看已经暂存的内容：

```bash
git diff --staged
```

---

### 5.4 暂存修改

暂存全部修改：

```bash
git add .
```

暂存单个文件：

```bash
git add README.md
```

暂存某个目录：

```bash
git add src/
```

---

### 5.5 提交修改

```bash
git commit -m "update blog content"
```

提交信息建议清楚说明本次做了什么。

推荐：

```bash
git commit -m "add git usage guide"
git commit -m "fix homepage layout"
git commit -m "update astro config"
```

不推荐：

```bash
git commit -m "111"
git commit -m "修改"
git commit -m "test"
```

---

### 5.6 推送到 GitHub

```bash
git push
```

如果是第一次推送当前分支：

```bash
git push -u origin main
```

设置过 `-u` 后，以后只需要：

```bash
git push
```

---

### 5.7 一个完整例子

```bash
cd my-blog

git pull

# 修改文章或代码后
git status
git add .
git commit -m "add new blog post"
git push
```


---


## 6. VS Code 可视化 Git 操作

VS Code 可以不用手写大部分 Git 命令。

---

### 6.1 打开正确的项目文件夹

一定要打开包含 `.git`、`package.json`、`src` 等文件的项目根目录。

正确：

```text
my-blog/
├─ .git/
├─ src/
├─ package.json
└─ README.md
```

错误：

```text
my-work/
└─ my-blog/
   ├─ .git/
   ├─ src/
   └─ package.json
```

如果你打开的是外层 `my-work`，VS Code 可能找不到正确项目。

---

### 6.2 打开源代码管理面板

快捷键：

```text
Ctrl + Shift + G
```

或点击左侧分支形状图标。

---

### 6.3 查看文件变化

VS Code Source Control 面板中常见标记：

```text
M = Modified，已修改
U = Untracked，新文件
A = Added，已添加
D = Deleted，已删除
```

点击文件可以查看修改对比。

---

### 6.4 暂存文件

在文件右侧点击：

```text
+
```

等价于：

```bash
git add 文件名
```

点击 `Changes` 右侧的 `+`，等价于：

```bash
git add .
```

---

### 6.5 提交

在输入框写提交信息：

```text
update blog
```

点击 `Commit`。

等价于：

```bash
git commit -m "update blog"
```

---

### 6.6 推送

点击：

```text
Sync Changes
```

或：

```text
Source Control → ... → Push
```

等价于：

```bash
git push
```

第一次推送时可能显示：

```text
Publish Branch
```

点击它即可，等价于：

```bash
git push -u origin main
```

---

### 6.7 查看 Git 输出日志

如果 VS Code 推送失败：

```text
Ctrl + Shift + P
→ Git: Show Git Output
```

这里可以看到 VS Code 实际执行的 Git 命令和报错。


---


## 7. 使用 SSH 连接 GitHub

推荐使用 SSH，而不是 HTTPS。

SSH 的好处：

- 不需要每次输入 GitHub 账号密码
- 不依赖 GitHub Token
- 更适合长期使用
- VS Code 推送也会自动走 SSH

---

### 7.1 生成 SSH Key

在 Git Bash 中执行：

```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
```

一路按回车。

生成后会有两个文件：

```text
~/.ssh/id_ed25519      私钥，不能给别人
~/.ssh/id_ed25519.pub  公钥，可以添加到 GitHub
```

---

### 7.2 查看公钥

```bash
cat ~/.ssh/id_ed25519.pub
```

复制整段内容，通常以 `ssh-ed25519` 开头。

---

### 7.3 添加到 GitHub

路径：

```text
GitHub → Settings → SSH and GPG keys → New SSH key
```

填写：

```text
Title: My Laptop
Key type: Authentication Key
Key: 粘贴 id_ed25519.pub 内容
```

---

### 7.4 测试 SSH

```bash
ssh -T git@github.com
```

第一次会提示：

```text
Are you sure you want to continue connecting?
```

输入：

```text
yes
```

成功时会看到类似：

```text
Hi username! You've successfully authenticated, but GitHub does not provide shell access.
```

这说明 SSH 已经连通。

---

### 7.5 把仓库远程地址改成 SSH

查看当前远程地址：

```bash
git remote -v
```

如果是 HTTPS：

```text
https://github.com/username/my-blog.git
```

改成 SSH：

```bash
git remote set-url origin git@github.com:username/my-blog.git
```

检查：

```bash
git remote -v
```

应该变成：

```text
origin  git@github.com:username/my-blog.git (fetch)
origin  git@github.com:username/my-blog.git (push)
```

---

### 7.6 如果 22 端口无法连接

某些网络会拦截 SSH 默认端口 22，可以让 GitHub SSH 走 443 端口。

编辑：

```bash
notepad ~/.ssh/config
```

写入：

```sshconfig
Host github.com
  HostName ssh.github.com
  User git
  Port 443
```

再测试：

```bash
ssh -T git@github.com
```


---


## 8. 分支的基本使用

### 8.1 查看当前分支

```bash
git branch
```

带 `*` 的是当前分支：

```text
* main
```

---

### 8.2 创建新分支

```bash
git branch dev
```

切换到新分支：

```bash
git switch dev
```

也可以一步完成：

```bash
git switch -c dev
```

---

### 8.3 合并分支

例如你在 `dev` 分支完成修改，要合并到 `main`：

```bash
git switch main
git merge dev
```

然后推送：

```bash
git push
```

---

### 8.4 删除分支

删除本地分支：

```bash
git branch -d dev
```

强制删除：

```bash
git branch -D dev
```

删除远程分支：

```bash
git push origin --delete dev
```

---

### 8.5 个人项目建议

个人博客或个人项目，初期可以只用一个分支：

```text
main
```

等你熟悉后，再使用：

```text
main：稳定版本
dev：开发版本
```


---


## 9. 远程仓库 remote 的使用

### 9.1 查看远程仓库

```bash
git remote -v
```

输出示例：

```text
origin  git@github.com:username/my-blog.git (fetch)
origin  git@github.com:username/my-blog.git (push)
```

---

### 9.2 添加远程仓库

```bash
git remote add origin git@github.com:username/my-blog.git
```

---

### 9.3 修改远程仓库地址

```bash
git remote set-url origin git@github.com:username/new-repo.git
```

---

### 9.4 删除远程仓库

```bash
git remote remove origin
```

---

### 9.5 第一次推送并建立追踪关系

```bash
git push -u origin main
```

之后可以直接：

```bash
git push
git pull
```


---


## 10. `.gitignore` 的使用

`.gitignore` 用来告诉 Git：

```text
哪些文件不要提交到仓库
```

---

### 10.1 Node / 前端项目常用 `.gitignore`

```gitignore
# dependencies
node_modules/

# build output
dist/
build/
.output/

# environment variables
.env
.env.local
.env.*.local

# logs
npm-debug.log*
yarn-debug.log*
pnpm-debug.log*

# system files
.DS_Store
Thumbs.db

# editor
.vscode/*
!.vscode/extensions.json
.idea/
```

---

### 10.2 Astro 项目常用 `.gitignore`

```gitignore
node_modules/
dist/
.astro/
.env
.env.local
.DS_Store
```

注意：

```text
public/ 通常要提交
src/ 通常要提交
package.json 要提交
package-lock.json 通常要提交
node_modules/ 不要提交
dist/ 通常不要提交，除非你的部署方案明确要求
```

---

### 10.3 已经提交过的文件，后来加入 `.gitignore` 不生效怎么办

例如你已经把 `node_modules` 提交过了，后来才写入 `.gitignore`。

需要先从 Git 跟踪中移除，但保留本地文件：

```bash
git rm -r --cached node_modules
git add .gitignore
git commit -m "remove node_modules from git"
git push
```


---


## 11. 常见错误与解决办法

---

### 11.1 `fatal: not a git repository`(你当前目录不是 Git 仓库)

报错：

```text
fatal: not a git repository (or any of the parent directories): .git
```

原因：

你当前目录不是 Git 仓库。

解决：

进入正确项目目录：

```bash
cd my-blog
```

检查是否有 `.git`：

```bash
ls -a
```

如果是新项目，需要初始化：

```bash
git init
```

---

### 11.2 `remote origin already exists`(已经存在名为 `origin` 的远程仓库)

报错：

```text
error: remote origin already exists.
```

原因：

已经存在名为 `origin` 的远程仓库。

解决：

查看远程地址：

```bash
git remote -v
```

如果地址错了，修改：

```bash
git remote set-url origin git@github.com:username/my-blog.git
```

如果确实要重新添加：

```bash
git remote remove origin
git remote add origin git@github.com:username/my-blog.git
```

---

### 11.3 `src refspec main does not match any`(还没有任何 commit/当前分支不叫 `main`)

报错：

```text
error: src refspec main does not match any
```

常见原因：

还没有任何 commit，或者当前分支不叫 `main`。

解决：

```bash
git status
git add .
git commit -m "init project"
git branch -M main
git push -u origin main
```

---

### 11.4 `Updates were rejected because the tip of your current branch is behind`(远程仓库有你本地没有的提交)

报错：

```text
Updates were rejected because the tip of your current branch is behind its remote counterpart.
```

原因：

远程仓库有你本地没有的提交。

解决：

```bash
git pull origin main
git push
```

如果两个仓库历史无关，例如本地新项目推到已有 README 的 GitHub 仓库：

```bash
git pull origin main --allow-unrelated-histories
```

如果出现冲突，先处理冲突，再：

```bash
git add .
git commit -m "resolve merge conflicts"
git push
```

如果你确定远程内容不要了，才可以强制推送：

```bash
git push -u origin main --force-with-lease
```

谨慎使用强制推送。

---

### 11.5 `Pulling is not possible because you have unmerged files`(上一次合并冲突还没有处理完)

报错：

```text
Pulling is not possible because you have unmerged files.
```

原因：

上一次合并冲突还没有处理完。

解决：

查看状态：

```bash
git status
```

打开冲突文件，找到类似内容：

```text
<<<<<<< HEAD
本地内容
=======
远程内容
>>>>>>> origin/main
```

手动改成你想保留的最终内容。

然后：

```bash
git add .
git commit -m "resolve merge conflicts"
git push
```

如果想放弃这次合并：

```bash
git merge --abort
```

---

### 11.6 `There is no merge to abort`(当前并没有处在合并状态。)
报错：

```text
fatal: There is no merge to abort (MERGE_HEAD missing).
```

原因：

当前并没有处在合并状态，所以没有可取消的 merge。

解决：

这不是严重错误。继续查看状态：

```bash
git status
```

根据实际状态继续操作。

---

### 11.7 `Permission denied (publickey)`(SSH key 没配置好)

报错：

```text
git@github.com: Permission denied (publickey).
```

原因：

SSH key 没配置好，或者 GitHub 没有你的公钥。

解决：

检查 SSH 是否可用：

```bash
ssh -T git@github.com
```

如果失败，检查是否有 key：

```bash
ls ~/.ssh
```

生成 key：

```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
```

查看公钥并添加到 GitHub：

```bash
cat ~/.ssh/id_ed25519.pub
```

---

### 11.8 `Host key verification failed`(SSH 主机验证异常)

报错：

```text
Host key verification failed.
```

原因：

SSH 主机验证异常，可能是首次连接没确认，或 `known_hosts` 记录异常。

解决：

先测试：

```bash
ssh -T git@github.com
```

如果仍失败，可以删除 GitHub 的旧记录：

```bash
ssh-keygen -R github.com
```

然后重新连接：

```bash
ssh -T git@github.com
```

输入：

```text
yes
```

---

### 11.9 `Failed to connect to github.com port 443`(无法连接 GitHub 的 HTTPS 端口)

报错：

```text
Failed to connect to github.com port 443
```

原因：

当前网络无法连接 GitHub 的 HTTPS 端口。

解决：

测试网络：

```powershell
Test-NetConnection github.com -Port 443
```

如果你使用代理，检查代理端口：

```powershell
netstat -ano | findstr :7890
netstat -ano | findstr :7897
```

如果改用 SSH，可测试：

```bash
ssh -T git@github.com
```

如果 22 端口失败，可配置 SSH 走 443：

```sshconfig
Host github.com
  HostName ssh.github.com
  User git
  Port 443
```

---

### 11.10 `Failed to connect to 127.0.0.1 port 7890`(Git 被设置成走本地代理)

报错：

```text
Failed to connect to 127.0.0.1 port 7890
```

原因：

Git 被设置成走本地代理 `127.0.0.1:7890`，但这个端口没有代理服务运行。

查看 Git 代理：

```bash
git config --global --get http.proxy
git config --global --get https.proxy
```

清除 Git 代理：

```bash
git config --global --unset-all http.proxy
git config --global --unset-all https.proxy
```

查看 7890 是否监听：

```powershell
netstat -ano | findstr :7890
```

如果你确实需要代理，就打开代理软件，并确认端口是否正确。

设置 Git 代理示例：

```bash
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy http://127.0.0.1:7890
```

---

### 11.11 `Please specify which branch you want to merge with`(本地分支还没有和远程分支建立追踪关系)

报错：

```text
Please specify which branch you want to merge with.
```

原因：

本地分支还没有和远程分支建立追踪关系。

解决：

```bash
git branch --set-upstream-to=origin/main main
```

或者第一次推送时使用：

```bash
git push -u origin main
```

之后再执行：

```bash
git pull
git push
```

---

### 11.12 `nothing to commit, working tree clean`(当前没有可提交的修改)

输出：

```text
nothing to commit, working tree clean
```

含义：

当前没有可提交的修改。

这不是错误。

如果你想推送之前已经提交的内容：

```bash
git push
```

如果你以为自己改了文件，但 Git 没看到，检查：

- 文件是否保存
- 是否在正确项目目录
- 文件是否被 `.gitignore` 忽略
- 是否打开了错误文件夹

---

### 11.13 `detached HEAD`(你当前不在正常分支上)

输出：

```text
HEAD detached at ...
```

原因：

你当前不在正常分支上，而是切到了某个历史提交。

解决：

回到 main 分支：

```bash
git switch main
```

如果你在 detached HEAD 状态下做了修改，并且想保留：

```bash
git switch -c temp-save
git switch main
git merge temp-save
```

---

### 11.14 不小心提交了 `node_modules`

解决：

确认 `.gitignore` 包含：

```gitignore
node_modules/
```

从 Git 跟踪中移除：

```bash
git rm -r --cached node_modules
git add .gitignore
git commit -m "remove node_modules"
git push
```

---

### 11.15 提交信息写错了

如果刚刚提交，还没有 push，可以修改最后一次提交信息：

```bash
git commit --amend -m "new commit message"
```

如果已经 push 了，不建议新手修改历史。可以下一次提交时写清楚。

---

### 11.16 想撤销工作区修改

撤销某个文件的未提交修改：

```bash
git restore README.md
```

撤销所有未提交修改：

```bash
git restore .
```

注意：这会丢弃本地未提交内容。

---

### 11.17 想取消暂存

如果已经 `git add`，但还没 commit：

```bash
git restore --staged README.md
```

取消所有暂存：

```bash
git restore --staged .
```

文件内容不会丢，只是从暂存区退回工作区。

---

### 11.18 想回退到上一个提交

保留文件修改，只撤销 commit：

```bash
git reset --soft HEAD~1
```

撤销 commit，并把修改放回工作区：

```bash
git reset --mixed HEAD~1
```

彻底回退，丢弃修改：

```bash
git reset --hard HEAD~1
```

谨慎使用 `--hard`。

---

### 11.19 想回退版本

❌ 不改变，只追加新提交
```bash
git revert HEAD && git push
```

✅ 彻底删除历史：

```bash
git reset --hard HEAD~1 && git push --force-with-lease
```

---

### 11.20 想查看历史记录

```bash
git log
```

简洁显示：

```bash
git log --oneline
```

带分支图：

```bash
git log --oneline --graph --all
```

---

### 11.21 换电脑后如何继续项目

在新电脑上：

```bash
git clone git@github.com:username/my-blog.git
cd my-blog
npm install
```

然后正常开发：

```bash
git pull
git add .
git commit -m "update blog"
git push
```


---


## 12. 常用命令速查表

### 基础

```bash
git --version
git status
git log --oneline
git diff
```

### 配置

```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
git config --global --list
```

### 初始化和克隆

```bash
git init
git clone git@github.com:username/repo.git
```

### 提交

```bash
git add .
git commit -m "message"
```

### 远程仓库

```bash
git remote -v
git remote add origin git@github.com:username/repo.git
git remote set-url origin git@github.com:username/repo.git
git remote remove origin
```

### 推送和拉取

```bash
git pull
git push
git push -u origin main
```

### 分支

```bash
git branch
git switch main
git switch -c dev
git merge dev
git branch -d dev
```

### 撤销

```bash
git restore file
git restore .
git restore --staged file
git reset --soft HEAD~1
git reset --hard HEAD~1
```

### SSH

```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
cat ~/.ssh/id_ed25519.pub
ssh -T git@github.com
```


---


## 13. 推荐的个人项目 Git 习惯

### 13.1 每次写项目之前先拉取

```bash
git pull
```

避免远程和本地不一致。

---

### 13.2 每次提交前看状态

```bash
git status
```

确认哪些文件会被提交。

---

### 13.3 提交信息写清楚

推荐格式：

```text
add xxx
fix xxx
update xxx
remove xxx
```

例子：

```bash
git commit -m "add git usage guide"
git commit -m "fix deployment workflow"
git commit -m "update homepage style"
git commit -m "remove unused images"
```

---

### 13.4 不要提交依赖和构建产物

通常不要提交：

```text
node_modules/
dist/
.env
```

应该提交：

```text
src/
public/
package.json
package-lock.json
README.md
.gitignore
.github/workflows/
```

---

### 13.5 推送前先本地测试

前端项目推荐：

```bash
npm install
npm run build
```

构建成功后再提交和推送：

```bash
git add .
git commit -m "update project"
git push
```

---

### 13.6 一个人维护项目时的推荐流程

```bash
git pull
npm run build
git status
git add .
git commit -m "update blog"
git push
```

VS Code 可视化版：

```text
1. Pull
2. 修改文件
3. npm run build 测试
4. Source Control 查看 Changes
5. 点击 + 暂存
6. 输入 commit message
7. Commit
8. Push / Sync Changes
```


---


## 附录：一次完整 SSH + GitHub 推送示例

假设项目名是：

```text
my-blog
```

GitHub 仓库是：

```text
git@github.com:username/my-blog.git
```

完整流程：

```bash
# 进入项目
cd my-blog

# 初始化 Git
git init

# 设置 main 分支
git branch -M main

# 添加远程仓库
git remote add origin git@github.com:username/my-blog.git

# 查看状态
git status

# 添加文件
git add .

# 提交
git commit -m "init blog"

# 第一次推送
git push -u origin main
```

以后每次更新：

```bash
git pull
git add .
git commit -m "update blog"
git push
```


---


## 附录：Git 命令和 VS Code 操作对照表

| 目标 | Git 命令 | VS Code 操作 |
|---|---|---|
| 查看修改 | `git status` | Source Control 面板 |
| 查看差异 | `git diff` | 点击变更文件 |
| 暂存文件 | `git add file` | 文件右侧点 `+` |
| 暂存全部 | `git add .` | Changes 右侧点 `+` |
| 提交 | `git commit -m "message"` | 输入消息后点 Commit |
| 推送 | `git push` | Push / Sync Changes |
| 拉取 | `git pull` | Pull / Sync Changes |
| 查看远程 | `git remote -v` | 终端查看更清楚 |
| 切换分支 | `git switch branch` | 左下角分支名 |
| 新建分支 | `git switch -c branch` | 左下角分支名 → Create new branch |


---


## 最简记忆版

```text
保存文件，只是保存到电脑。
git add，是选择要提交的修改。
git commit，是保存一个本地版本。
git push，是上传到 GitHub。
git pull，是从 GitHub 下载最新版本。
```

日常命令：

```bash
git status
git add .
git commit -m "update"
git push
```

VS Code 日常操作：

```text
Source Control → + → 写提交信息 → Commit → Push
```


---
