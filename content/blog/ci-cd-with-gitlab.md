---
title: 'CI & CD with GitLab'
date: Wed, 27 Feb 2019 03:01:38 +0000
draft: false
tags: ['Servers', 'Software', 'Web Dev']
---

Save on the hassle of testing and deploying code & make GitLab do it for you!

In this tutorial we're going to set up a Staging environment as well, and this requires a little prep work. Create a `staging` branch in your Git repo based on `master`, if you don't have one. If you already use `dev`, `development`, or another name, that's fine, just replace `staging` with whichever branch name is appropriate for you.

If you're on GitHub or another Git forge, don't worry, you can still do this. Create an account on [gitlab.com](https://gitlab.com/) and create a repo using "[CI/CD for External Repositories](https://docs.gitlab.com/ee/ci/ci_cd_for_external_repos/)" (available for free to open source projects only). If you're on GitHub, it'll create a webhook that'll have GitHub trigger GitLab when a push happens so GitLab can make things happen. Otherwise, it checks the repo occasionally based on the URL you give it.

I'm using Heroku for this, so I created another Heroku app to deploy to and gave it the same environment variables, except that I set `NODE_ENV` to `staging`.

Additionally, I'm doing this with a Node.js application. Change any `npm` commands and the Docker image to whatever language you're using. [GitLab CI examples with other languages here](https://docs.gitlab.com/ce/ci/examples/README.html).

Let's get started with the GitLab CI config. Create a file called `.gitlab-ci.yml` with the following:

```yaml
image: node:latest  
  
stages:  
  - test  
  - deploy  
  
test:  
  stage: test  
  image: node:10  
  script:  
    - npm install  
    - npm test  
    - npm build  
  
production:  
  stage: deploy  
  image: ruby:latest  
  script:  
    - apt update -qy  
    - apt install -y ruby-dev  
    - gem install dpl  
    - dpl --provider=heroku --app=myapp --api-key=$HEROKU\_API\_KEY  
  only: master  
  
staging:  
  stage: deploy  
  image: ruby:latest  
  script:  
    - apt update -qy  
    - apt install -y ruby-dev  
    - gem install dpl  
    - dpl --provider=heroku --app=myapp-staging --api-key=$HEROKU\_API\_KEY  
  only: staging
```

This does quite a lot. First, it sets a default Docker image to Node.js on the latest version. This doesn't get use though since we override it later.

Next, we define this CI Pipeline as a two-step process: testing and deploying

The test is simple. First, we tell the CI to use Node.js 10.x Docker image and have it install dependencies. Then, we run the `npm test` and `npm build` commands. These commands should be specified in your `package.json`. Here are the full list of commands I personally use for testing, and why:

*   `npm test`: I use ESlint to do static code checking. It helps ensure best practices in syntax and optimization. Thus, it can also prevent a number of security issues
*   `npm build`: there's no point in deploying if the code isn't going to run. Do a test run of building the code before we push it. I have another article on [Bundling JS with Webpack & Babel](https://blog.ctmartin.me/?p=295) where I talk about how to set up building
*   `npm audit`: prevent pushing of known vulnerable (insecure) packages. If this fails, `npm update` usually fixes any issues
*   `npm run license-audit`: this one I don't normally use, but we need it for the project I'm doing this on. I use the NPM package `license-checker` with the `--onlyAllow` flag to ensure that we know all of the different licenses used on the project. If a dependency with a new license gets added that's not on the list, this will fail.

Then, the `master` and `staging` branches each have a deployment stage. The `only` clause tells the CI that we only allow the respective stage to happen when it's on those branches. Other branches can trigger the Test stage, but won't deploy. The `master` branch will deploy to a Heroku app called `myapp` and `staging` will deploy to `myapp-staging`. We'll add the API key later, so don't worry about that for now.

For deployment, we're using a Ruby package called `dpl`. It allows easy deployment to a variety of platforms. The [docs can be found here](https://github.com/travis-ci/dpl).

Heroku will soon start building applications on deployment, and we can manually opt-in now to take advantage of this feature. Add the following line to your `package.json`:

```js
"heroku-run-build-script": true,  

```

Additionally, if you haven't already, many Platform as a Service providers (including Heroku) need a language version if you don't want the oldest supported LTS version. Add the following lines to `package.json` for Node.js 10.x:

```js
"engines": {  
  "node": "10.x",  
  "npm": "6.7.x"  
},
```

Finally, we we need to tell GitLab our Heroku API key so it has permisison to deploy. Your API key can be found in the your Heroku settings page.

In GitLab, go to `Settings > CI/CD` and expand the `Environment variable` section. Add a variable called `HEROKU_API_KEY` and put the API key in the "Input variable value" field. The "Protected" flag allows you to only expose the API key to branches that use Branch Protection, thus making it less likely to be exposed. I recommend this setting. If you use it, you'll need to add the `master` and `staging` branches to the list in your repo's `Settings > Repository > Protected Branches` section. Note that this prevents force-pushing to branches, which may be a problem if you really like rebasing.

That was fairly painless. Now, when you push to any branch it will run CI tests and when you push to `master` or `staging` it will automatically deploy to Heroku for you! Combined with [a decent build script](https://blog.ctmartin.me/?p=295), this has made my life a LOT easier on the project I'm working on.

---

_This was learned while working on a research project with_ [_Professor Owen Gottlieb_](http://owengottlieb.org/)_._

---

_Updates:_  
_2019-07-31: Content reflow_