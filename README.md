## Dev

### Serve module
```sh
serve -l 5000
```

### Execute module

```javascript
javascript:var sc = document.createElement("script"); sc.type = "module"; sc.src = "http://localhost:5000/main.mjs"; document.body.appendChild(sc); void 0
```

### Execute default export from module

```javascript
javascript:var sc = document.createElement("script"); sc.type = "module"; sc.innerHTML = `import main from "http://localhost:5000/main.mjs"; main();`; document.body.appendChild(sc); void 0
```

### Execute default export from module with forced re-evaluation

```javascript
javascript:var sc = document.createElement("script"); sc.type = "module"; sc.innerHTML = `import main from "http://localhost:5000/main.mjs?${Math.random()}"; main();`; document.body.appendChild(sc); void 0
```

## Prod 

### Execute default export from module (github)

```javascript
javascript:var sc = document.createElement("script"); sc.type = "module"; sc.innerHTML = `import main from "https://simonbru.github.io/gitlab-view-drafts/main.mjs"; main();`; document.body.appendChild(sc); void 0
```

### From "dev" branch
```javascript
javascript:var sc = document.createElement("script"); sc.type = "module"; sc.innerHTML = `import main from "https://raw.githubusercontent.com/simonbru/gitlab-view-drafts/dev/main.mjs"; main();`; document.body.appendChild(sc); void 0
```

```javascript
javascript:var sc = document.createElement("script"); sc.type = "module"; sc.innerHTML = `import main from "https://cdn.jsdelivr.net/gh/simonbru/gitlab-view-drafts@dev/main.mjs"; main();`; document.body.appendChild(sc); void 0
```
