# NSWC Crane Stem Lending Library

A Vue 3 Single Page Applicating (SPA) utilizing Vite and Bootstrap. CraneLendingLibrary.org is hosted within Git Hub Pages, set to host from the "gh-pages" branch.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run End-to-End Tests with [Nightwatch](https://nightwatchjs.org/)

```sh
# When using CI, the project must be built first.
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chrome
npm run test:e2e -- --env chrome
# Runs the tests of a specific file
npm run test:e2e -- tests/e2e/example.js
# Runs the tests in debug mode
npm run test:e2e -- --debug
```
    
### Run Headed Component Tests with [Nightwatch Component Testing](https://nightwatchjs.org/guide/component-testing/introduction.html)
  
```sh
npm run test:unit
npm run test:unit -- --headless # for headless testing
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
## Project Deployment

### Compile and Minify for Production

```sh
npm run build
```

### Push production files to the "gh-pages" branch
```sh
git subtree push --prefix dist origin gh-pages
```

### switch to "gh-pages" branch
```sh
git checkout gh-pages
```

### Copy CNAME file to Dist
```sh
copy CNAME ./dist
```

### Commit Changes to "gh-pages" branch
```sh
git commit -m "commit message describing changes"
```
### Push Changes to GH-Pages branch
```sh
git push
```