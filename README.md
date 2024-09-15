## Dev

### Local dev with HMR
```sh
npm run dev
```

Bookmarklet:

```javascript
javascript:var sc = document.createElement("script"); sc.type = "module"; sc.innerHTML = `import "http://localhost:5184/@vite/client"; import main from "http://localhost:5184/src/main.tsx"; main();`; document.body.appendChild(sc); void 0
```

Note: "@vite/client" is useful to show build errors in browser, but HMR works fine without it.

### Local dev with prod build (and forced re-evaluation)

```sh
npm run build
npm run preview
```

Bookmarklet:
```
javascript:var sc = document.createElement("script"); sc.type = "module"; sc.innerHTML = `import "http://localhost:4184/main.js?${Math.random()}"; gitlabViewDrafts();`; document.body.appendChild(sc); void 0
```

## Prod 

### Execute from github.io

Branch configured in [Pages settings](https://github.com/simonbru/gitlab-view-drafts/settings/pages)

```javascript
javascript:var sc = document.createElement("script"); sc.type = "module"; sc.innerHTML = `import "https://simonbru.github.io/gitlab-view-drafts/dist/main.js"; gitlabViewDrafts();`; document.body.appendChild(sc); void 0
```

### Execute from jsdelivr (main branch)

Branches are cached for 12 hours:
https://www.jsdelivr.com/documentation#id-caching

```javascript
javascript:var sc = document.createElement("script"); sc.type = "module"; sc.innerHTML = `import "https://cdn.jsdelivr.net/gh/simonbru/gitlab-view-drafts@main/dist/main.js"; gitlabViewDrafts();`; document.body.appendChild(sc); void 0
```

### Execute from jsdelivr (dev branch)

Branches are cached for 12 hours:
https://www.jsdelivr.com/documentation#id-caching

```javascript
javascript:var sc = document.createElement("script"); sc.type = "module"; sc.innerHTML = `import "https://cdn.jsdelivr.net/gh/simonbru/gitlab-view-drafts@dev/dist/main.js"; gitlabViewDrafts();`; document.body.appendChild(sc); void 0
```

### Execute from github (dev branch)

⚠️ Broken because script is served with content-type "text/plain".

```javascript
javascript:var sc = document.createElement("script"); sc.type = "module"; sc.innerHTML = `import "https://raw.githubusercontent.com/simonbru/gitlab-view-drafts/dev/dist/main.js"; gitlabViewDrafts();`; document.body.appendChild(sc); void 0
```