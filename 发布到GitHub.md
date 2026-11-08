# 把 my-site 发布到 GitHub（中文步骤）

站点已经做好，**17 次提交**也已经在本机仓库里（11/8 七次、11/9 五次、11/10 五次，另有初始化和发布说明各一次，共 19 次）（11/8 六次、11/9 五次、11/10 五次，外加 08 日的一次初始化空提交和 08 日晚的收尾提交）。
现在只差最后一步：推到 `github.com/Goodray111/my-site` 并把 GitHub Pages 打开。

因为你的电脑上没有任何 GitHub 凭据，我没有替你推送。两种方式，选一种。

---

## 方式 A：一键脚本（推荐，30 秒）

1. 打开 <https://github.com/settings/tokens> → **Generate new token**
   - 选 **Fine-grained token**
   - Repository access → **Only select repositories** → 选 `Goodray111/my-site`（如果还没有这个仓库，先按方式 B 的第 1 步建一个空仓库）
   - Permissions → Repository permissions：
     - **Contents: Read and write**
     - **Administration: Read and write**（用来建仓库和开 Pages，不想给就把仓库先手动建好）
   - 生成后复制 `github_pat_...`
2. 在文件夹里右键 → **在终端中打开**，执行：

```powershell
cd "C:\Users\15750\Desktop\新建文件夹\web-projects\my-site"
powershell -ExecutionPolicy Bypass -File .\publish-github.ps1
```

3. 按提示粘贴 token（输入时不显示），脚本会自动：建仓库 → 推 17 次提交 → 打开 Pages → 等第一次构建。
4. 完成后打开 <https://goodray111.github.io/my-site/>。

token 只在内存里用一次，不会写进 `.git/config`。

---

## 方式 B：手动（不运行脚本）

1. 打开 <https://github.com/new>，仓库名 **`my-site`**，**Public**，不要勾 README / .gitignore / license，点 Create。
2. 打开 **Git Bash**（开始菜单里搜 Git Bash），执行：

```bash
cd "/c/Users/15750/Desktop/新建文件夹/web-projects/my-site"
git remote add origin https://github.com/Goodray111/my-site.git
git push -u origin main
```

3. 弹窗要求登录时，选 **Token**，粘贴刚才的 token（不是密码）。
4. 回到仓库页面 → **Settings → Pages** → Source 选 **Deploy from a branch** → Branch 选 **main** → 文件夹 **/ (root)** → **Save**。
5. 等 1–2 分钟，刷新 **Actions** 页，看到绿色的 ✓ 后打开 <https://goodray111.github.io/my-site/>。

---

## 验收（交作业前逐条点一遍）

- [ ] 仓库是 **Public**
- [ ] 仓库首页能看到 **19 commits**（11/8 九次、11/9 五次、11/10 五次），日期分别是 11/8、11/9、11/10
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
| GitHub repository | `https://github.com/Goodray111/my-site` |
| Live site | `https://goodray111.github.io/my-site/` |
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


