# 张浩宇个人作品集网站

React + Vite 静态作品集。页面包含首屏视觉、个人经历、精选项目、能力说明和联系入口，适合部署到 Vercel、Netlify、Cloudflare Pages 或任意静态站点服务。

## 本地运行

项目依赖已安装在当前工作区。推荐使用项目自带脚本：

```powershell
npm run dev
```

本地地址：

```text
http://127.0.0.1:5173/
```

如果使用 Codex 工作区内置 Node，可以使用：

```powershell
$env:PATH="C:\Users\WIDNOWS\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;$env:PATH"
& "C:\Users\WIDNOWS\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" ".\node_modules\vite\bin\vite.js" --host 127.0.0.1
```

## 构建与检查

上线前请运行：

```powershell
npm run check
```

`check` 会执行生产构建，并检查：

- 静态资源引用是否存在
- 优化图片映射是否完整
- 发布资源是否已复制到 `dist`
- JS gzip 体积是否超过预算
- 发布资源包是否重新膨胀
- 是否残留明显调试代码

单独构建：

```powershell
npm run build
```

本地预览生产包：

```powershell
npm run preview
```

## 部署说明

构建输出目录是：

```text
dist
```

建议部署在域名根路径，例如：

```text
https://your-domain.com/
```

当前页面资源使用 `/assets/...` 根路径。如果要部署到子目录，例如 `https://example.com/portfolio/`，需要先调整 Vite `base` 和页面中的资源路径策略。

推荐部署环境：

```text
Node ^20.19.0 或 >=22.12.0
```

项目已在 `package.json` 和 `.node-version` 中声明 Node 版本要求，避免线上构建环境漂移。

## 资源发布策略

`public/assets` 是素材库，里面保留原始图片和视频，方便后续继续替换、追加作品。

线上发布时不会把整个素材库复制进 `dist`。Vite 构建会通过 `scripts/published-assets.mjs` 只复制运行时需要的轻量资源，主要是：

- `public/assets/optimized` 中的 WebP 图片和轻量视频
- 页面直接引用且未被优化映射替代的媒体文件
- favicon 与首屏关键资源

如果新增作品图片，请同时补充对应的优化资源，并运行：

```powershell
npm run check
```

## 更新流程建议

1. 修改作品内容或替换素材。
2. 运行 `npm run check`。
3. 确认 `dist` 构建成功且发布资源体积没有异常变大。
4. 提交 Git 版本。
5. 让部署平台重新构建并发布。

目前 `preview.html` 只作为本地轻量预览入口，正式页面以 React + Vite 构建结果为准。
