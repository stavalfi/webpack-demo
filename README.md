Webpack Playground Repository
---

* Webpack `4.X.X` - Optimizations, loaders and plugins
* Babel `7.X.X` and babel-loader `8.X.X`
* Hot Module Replacement (`HMR`)
* Webpack visual analyzers: Jarvis and BundleAnalyzerPlugin
* Webpack serve
* Typescript `3.X.X`

Extra:
---

* React 16


Docs:
---

* [Official Webpack docs](https://webpack.js.org/concepts/)
* [SurviveJs/Webpack Book](https://github.com/survivejs/webpack-book) * Highly recommended book
* [webpack 4: mode and optimization](https://medium.com/webpack/webpack-4-mode-and-optimization-5423a6bc597a)
* [RIP CommonsChunkPlugin](https://gist.github.com/sokra/1522d586b8e5c0f5072d7565c2bee693)
* [Webpack 4 in production: How to make your life easier](https://medium.com/@hpux/webpack-4-in-production-how-make-your-life-easier-4d03e2e5b081)
* [Webpack 4 course – part four. Code splitting with SplitChunksPlugin](https://wanago.io/2018/06/04/code-splitting-with-splitchunksplugin-in-webpack-4/) * Recommended sereies
* [Webpack 4 Tutorial: from 0 Conf to Production Mode](https://www.valentinog.com/blog/webpack-tutorial/)
* [webpack 4: Code Splitting, chunk graph and the splitChunks optimization](https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366)


Run the project:
---

```javascript
git clone https://github.com/stavalfi/webpack-demo.git
cd webpack-demo
git checkout typescript-react
npm install
npm start
```

If you already have this project, then optn the terminal in the project folder and then:

```javascript
git fetch
git checkout typescript-react
git merge origin/typescript-react
npm install
npm start 
```

_Note:_ Start develope while the command `npm start ` is running inthe background. 

What you can/can't modify/add/remove in the `src` folder:
* modify `main.css` or remove it and create your own css files. You can create multiple css files located anywhere under `src` folder.
* You can modify `output-index-tamplate.html` but after each modification you need to manually refresh the broswer. This is not recommanded because this project is using react to change the `DOM`.
* Don't change `index.tsx`.
* You can and should modify/replace `Hello.tsx`. If you want to only change the DOM in your app, your should only write inside:
  `<div id="your-dom">do what you want here </div>`
* You are free to add more classes and components anywhere under src folder. It is recommanded to do in under specific folder like components if you are using React. Each `js`/`ts` file should be names as `XXX.tsx`.