---
title: 'Bundling JS with Webpack & Babel'
date: Wed, 27 Feb 2019 03:06:30 +0000
draft: false
related:
  - "/blog/ci-cd-with-gitlab.md"
tags: ['FOSS', 'Programming', 'Web Dev']
---

This tutorial will walk through retroactively adding Webpack & Babel to a Node.js project.

The first step in changing your dependency management is to inventory the packages you're using. For the project I'm going to do this on, the objective is to migrate away from using CDNs and bundle them instead. This is also a good time to implement Content Security Policy for additional security, since by inventorying you will know what scripts are being loaded. [Here are the Helmet docs on CSP](https://helmetjs.github.io/docs/csp/).

Here are the dependencies we want to migrate:

*   Bootstrap
*   React

To start, let's install Webpack & Babel as well as a few packages to make them usable:

```bash
npm install webpack webpack-cli @babel/core @babel/preset-env @babel/preset-react babel-loader css-loader style-loader --save-dev
```

That's a lot of packages. Let's break them down:

*   `webpack`: Webpack
*   `webpack-cli`: The ability to run Webpack as a command (needed for adding an `npm build` script to `package.json`)
*   `css-loader` & `style-loader`: lets us compile CSS files and handle CSS `@imports`
*   `@babel/core` & `@babel/preset-env`: Babel
*   `@babel/preset-react`: lets Babel compile React `.jsx` files
*   `babel-loader`: lets Webpack call Babel to compile JS & JSX

As a side note, if you have Babel's CLI tools in your dependencies, it will be ok to remove them as Webpack will handle invoking Babel.

Ok, let's set up Babel now. Create a file called `.babelrc` at the top of your project and put the following in it:

```json
{  
   "presets": ["@babel/preset-env", "@babel/preset-react"]  
}
```

This tells Babel to load the presets we gave it before. Next, we need to import the libraries we're going to call. In this case, Bootstrap, React, & their dependencies.

```bash
npm install bootstrap jquery popper.js react react-dom prop-types
```

In order for Webpack to recognize these dependencies in the main scripts we'll need to import them. Otherwise, we may be unable to access their code in the browser even if we can get the page to load. In this project the main JS file is called `main.jsx`. Here are the `import` statements we're goint to need:

```js
import $ from 'jquery';  
import 'popper.js';  
import 'bootstrap';  
import React from 'react';  
import ReactDOM from 'react-dom';
```

Well, that was easy. In the case of our code, it required no refactoring of the `main.jsx` file. However, we have another trick we need to do for our codebase. We have a file of generic helpers called `utils.jsx` that we need to import. In our `main.jsx` file we need to add the following:

```js
import {
  sendData,
  handleError,
  notifyUser
} from 'utils.jsx';
```

That's not enough on its own to make Webpack import `utils.jsx` however. We also need to modify `utils.jsx` to make it use the JS module syntax. Since this file also uses a little React, we need to import React in it:

```js
import React from 'react';  
import ReactDOM from 'react-dom';  
```

And then we need to export the functions in it so that they can be imported by `main.jsx`. To the bottom of the file, add:

```js
export {  
  sendData,  
  handleError,  
  notifyUser,  
}
```

Now, we need to tell Webpack how to bundle this JavaScript together. Make a file in the top of your project called `webpack.config.js` and put the following in it:

```js
module.exports = {  
  entry: {  
    'main': './client/main.jsx',  
  },  
  output: {  
    filename: '[name].js',  
    path: __dirname + '/assets',  
  },  
  module: {  
    rules: [  
      {  
        test: /\.(js|jsx)$/,  
        exclude: /node_modules/,  
        use: {  
          loader: 'babel-loader',  
        }  
      },  
    ]  
  }  
}
```

Ok, that was a lot. Let's break it down. First, we're telling Webpack where the `main.jsx` file is so it can bundle it. Then we're telling it to put the bundled result in the `/assets` folder using a name based on what we called the entry point. In this case, we called the entry `main` so it will come out as `main.js`. Then, we're telling Webpack to use Babel to compile files ending in `.js` and `.jsx`, but to ignore anything in a `node_modules` folder since we don't need to recompile every dependency anywhere, we only want the front-end code and only when it's imported.

We can go a bit further though. Let's also have Webpack bundle CSS files. This is a bit ugly since Webpack wraps the CSS in JS and injects it into the DOM at runtime, but it does allow for dependency handling. To my `main.css` file I'm going to add an import for Bootstrap:

```css
@import url('~bootstrap/dist/css/bootstrap.min.css');
```

The Tilde (`~`) tells Webpack that it's importing from a package.

Now, I need to Webpack how to handle CSS files. To the `rules` section add the following:

```js
{  
  test: /.css$/,  
  use: ['style-loader', 'css-loader']  
}
```

And then add an entry to the `entry` section for the CSS file. As a reminder, Webpack bundles CSS by wrapping it in JS, so you will get a `.js` file out. In total, your `webpack.config.js` file should look something like this:

```js
module.exports = {  
   entry: {  
     "main": './client/main.jsx',  
     "main.css": './client/main.css',  
   },  
   output: {  
     filename: '[name].js',  
     path: __dirname + '/assets',  
   },  
   module: {  
     rules: [  
       {  
         test: /.(js|jsx)$/,  
         exclude: /node_modules/,  
         use: {  
           loader: "babel-loader",  
         }  
       },  
       {  
         test: /.css$/,  
         use: ['style-loader', 'css-loader']  
       }  
     ]  
   }  
 };
```

You might want to add the bundled files to your `.gitignore` since `npm build` will create them when we're done. Create with or add to your `.gitignore` the following:

```
# Webpack Bundles  
assets/main.js  
assets/main.css.js
```

Now, add a build script to your `package.json`. Add the following to the `scripts` section:

```js
"build": "webpack --mode production",  

```

Finally, update your page to use the bundles. Remove all `<script>` and `<style>` tags that load your `main.jsx`, `utils.jsx`, React, Bootstrap, and their dependencies. Then, add two `<script>` tags that load `/assets/main.js` and `/assets/main.css.js`.

Congrats! You're done! In the next part I'll talk about [Continuous Integration and Continuous Deployment]({{< ref "/blog/bundling-js-with-webpack-babel.md" >}}), which will make deploying this code even easier.

---

_This was learned while working on a research project with_ [_Professor Owen Gottlieb_](http://owengottlieb.org/)_._

---

_Updates:_  
_2019-07-31: Content reflow_  
_2019-03-22: Typo fix_
