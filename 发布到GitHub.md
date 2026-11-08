# 把 my-site 发布到 GitHub（中文步骤）

## 已经上线了

- 仓库：<https://github.com/Goodray111/Agnb666>
- 线上：**<https://goodray111.github.io/Agnb666/>**

> ⚠️ Pages 地址是**小写**的 `Agnb666`，不是 `AgnB666`。GitHub Pages 的地址与仓库名的
> 大小写一致（仓库实际叫 `Agnb666`）。大写的那个地址会返回 404，这不是站点坏了。

四个页面都能直接打开：

- <https://goodray111.github.io/Agnb666/>
- <https://goodray111.github.io/Agnb666/quotes.html>
- <https://goodray111.github.io/Agnb666/project.html>
- <https://goodray111.github.io/Agnb666/machine.html>

以后每次 `git push`，Pages 会在一分钟内自动重新构建（Settings → Pages 里已经是
`Deploy from a branch · main · / (root)`），不需要再做任何设置。

---

# 当时的完整步骤（留作记录）

---

## 方式 A：一键脚本（推荐，30 秒）

### A1. 建仓库（二选一）

**A1-a　让脚本建（需要多给一个权限）**
- 申请 token 时：Repository access 选 **All repositories**；Permissions 勾 **Administration: Read and write** + **Contents: Read and write**
- 然后直接运行脚本，第 2 步它会自己调用 API 建好公开仓库。

**A1-b　手动建（权限给得最少，推荐）**
1. 打开 <https://github.com/new>
2. Repository name 填 **`my-site`**
3. 选 **Public**
4. **不要**勾 Add a README / .gitignore / license（必须是空仓库，否则第一次 push 会冲突）
5. 点 **Create repository**
6. 看到 “Quick setup” 页面就说明建好了，**不要**照着它的命令操作

### A2. 申请 token

1. 打开 <https://github.com/settings/personal-access-tokens/new>
2. **Token name**：`my-site-publish`
3. **Expiration**：7 days（用完自动失效，最安全）
4. **Repository access**：选 **Only select repositories** → 选刚建的 `Goodray111/my-site`
5. **Permissions → Repository permissions**，只改两项：
   - **Contents** → **Read and write**（推代码）
   - **Pages** → **Read and write**（开 Pages）
   - 其余保持 No access
6. 点 **Generate token**，复制 `github_pat_...`（页面关掉就再也看不到了）

### A3. 运行脚本

1. 打开这个文件夹：`C:\Users\15750\Desktop\新建文件夹\web-projects\my-site`
2. 在地址栏输入 `powershell` 回车（或右键 → 在终端中打开）
3. 粘贴执行：

```powershell
powershell -ExecutionPolicy Bypass -File .\publish-github.ps1 -Repo AgnB666 -SkipCreate
```

> 仓库已经是现成的 `AgnB666`，所以一定要带 `-Repo AgnB666`（脚本默认找 `my-site`）。
> 如果哪天你把这个仓库改名成了 `my-site`，就直接不带 `-Repo` 运行。

4. 提示 `Paste your GitHub token (input hidden):` 时，**右键粘贴** token，回车（输入过程不显示字符，正常）
5. 脚本会依次打印 `[1/5]`…`[5/5]`：
   - 检查账号 → 确认仓库 → 推 22 次提交 → 开 Pages → 等构建
6. 看到绿色 **Done.** 就成功了，打开 <https://goodray111.github.io/Agnb666/>

token 只在内存里用一次，不会写进 `.git/config`。

### A4. 如果脚本报错

| 报错 | 原因 | 处理 |
|---|---|---|
| `Cannot create the repository with this token` | token 没有 Administration 权限 | 用 A1-b 手动建仓库，命令加 `-SkipCreate -Repo AgnB666` |
| `remote: Permission to ... denied` | Contents 没有给 Read and write | 回 A2 第 5 步补上，重新生成 token |
| `github.com/... does not exist yet` | 仓库没建 | 先做 A1-b |
| `无法加载文件 ... 因为在此系统上禁止运行脚本` | 执行策略 | 用上面带 `-ExecutionPolicy Bypass` 的命令；仍不行就右键 `.ps1` → 属性 → 勾“解除锁定” |

---

## 方式 B：手动（不运行脚本）

1. 打开 <https://github.com/new>，仓库名 **`AgnB666`**，**Public**，不要勾 README / .gitignore / license，点 Create。
2. 打开 **Git Bash**（开始菜单里搜 Git Bash），执行：

```bash
cd "/c/Users/15750/Desktop/新建文件夹/web-projects/my-site"
git remote add origin https://github.com/Goodray111/Agnb666.git
git push -u origin main
```

3. 弹窗要求登录时，选 **Token**，粘贴刚才的 token（不是密码）。
4. 回到仓库页面 → **Settings → Pages** → Source 选 **Deploy from a branch** → Branch 选 **main** → 文件夹 **/ (root)** → **Save**。
5. 等 1–2 分钟，刷新 **Actions** 页，看到绿色的 ✓ 后打开 <https://goodray111.github.io/Agnb666/>。

---

## 验收（交作业前逐条点一遍）

- [ ] 仓库是 **Public**
- [ ] 仓库首页能看到 **22 commits**（11/8 十二次、11/9 五次、11/10 五次），日期分别是 11/8、11/9、11/10
- [ ] Pages 已开启，**main / root**
- [ ] 线上四个页面都能打开：`/`、`/quotes.html`、`/project.html`、`/machine.html`
- [ ] 手机上打开同一个网址，导航折叠成菜单按钮
- [ ] 之后每次 `git push`，线上会自动更新（1 分钟左右）

---

## 之后每天怎么继续提交

```bash
cd "/c/Users/15750/Desktop/新建文件夹/web-projects/my-site"
git add -A
git commit -m "Describe what you changed"
git push
```

想让历史更像“每天做一点”，就每天改一点、提交一次；不要一天把 15 次全推完。

---

## 交作业时要填的东西

| 表单项 | 内容 |
| --- | --- |
| Title | Learning HTML |
| GitHub repository | `https://github.com/Goodray111/Agnb666` |
| Live site | `https://goodray111.github.io/Agnb666/` |
| 五张图 | `images/cover.png`（1200×630，96 KB）、`images/screenshot-desktop.png`（1920×1080）、`images/screenshot-mobile.png`（375×812）、`images/icons/apple-touch-icon.png`（180×180）、`images/icons/favicon-32.png`（32×32） |
| Status | Completed |

Short description 可以直接用：

> A four-page learning site about HTML, CSS and JavaScript, with eighteen quotes, eight project ideas and a useless machine.

---

## 常见问题

**`git: command not found`** — 这次已经装好了 Git，重开一个终端即可；或直接用 Git Bash。

**`remote: Permission denied`** — token 权限不够。Fine-grained 要勾 **Contents: Read and write**，经典 token 要勾 **repo**。

**Pages 显示 404** — 先确认 Pages 的 Source 是 `main` + `/ (root)`；再确认仓库根目录有 `index.html`（有，就在根目录）。

**页面样式丢了** — 检查仓库里是否有 `css/style.css`、`js/`、`images/`；`git add -A` 时它们必须被提交进去。







