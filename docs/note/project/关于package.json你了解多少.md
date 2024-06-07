---
category: project
cover: https://cdn.pixabay.com/photo/2024/05/15/12/31/lake-8763490_640.jpg
---

# 关于 package.json 你了解多少?

我们经常在项目中会看到`package.json`文件，却很少关注里面的东西，那今天就来带你了解改文件的含义以及学会对它的配置。

## 作用

`package.json` 文件是一个用于描述和管理项目的配置文件。它包含了项目的元数据信息，例如项目名称、版本号、作者、许可证等。同时，它还包含了项目的依赖项信息，包括项目所依赖的第三方库、框架以及工具等。通过 `package.json` 文件，我们可以方便地管理项目的依赖关系，使得项目的构建、发布和维护更加简单和可靠。下面是我们经常用的 `element-plus` 包的`package.json`

```json
{
  "name": "element-plus",
  "version": "2.3.12",
  "description": "A Component Library for Vue 3",
  "keywords": [
    "element-plus",
    "element",
    "component library",
    "ui framework",
    "ui",
    "vue"
  ],
  "homepage": "https://element-plus.org/",
  "bugs": {
    "url": "https://github.com/element-plus/element-plus/issues"
  },
  "license": "MIT",
  "main": "lib/index.js",
  "module": "es/index.mjs",
  "types": "es/index.d.ts",
  "exports": {
    ".": {
      "types": "./es/index.d.ts",
      "import": "./es/index.mjs",
      "require": "./lib/index.js"
    },
    "./es": {
      "types": "./es/index.d.ts",
      "import": "./es/index.mjs"
    },
    "./lib": {
      "types": "./lib/index.d.ts",
      "require": "./lib/index.js"
    },
    "./es/*.mjs": {
      "types": "./es/*.d.ts",
      "import": "./es/*.mjs"
    },
    "./es/*": {
      "types": ["./es/*.d.ts", "./es/*/index.d.ts"],
      "import": "./es/*.mjs"
    },
    "./lib/*.js": {
      "types": "./lib/*.d.ts",
      "require": "./lib/*.js"
    },
    "./lib/*": {
      "types": ["./lib/*.d.ts", "./lib/*/index.d.ts"],
      "require": "./lib/*.js"
    },
    "./*": "./*"
  },
  "unpkg": "dist/index.full.js",
  "jsdelivr": "dist/index.full.js",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/element-plus/element-plus.git"
  },
  "publishConfig": {
    "access": "public"
  },
  "style": "dist/index.css",
  "sideEffects": [
    "dist/*",
    "theme-chalk/**/*.css",
    "theme-chalk/src/**/*.scss",
    "es/components/*/style/*",
    "lib/components/*/style/*"
  ],
  "peerDependencies": {
    "vue": "^3.2.0"
  },
  "dependencies": {
    "@ctrl/tinycolor": "^3.4.1",
    "@element-plus/icons-vue": "^2.0.6",
    "@floating-ui/dom": "^1.0.1",
    "@popperjs/core": "npm:@sxzz/popperjs-es@^2.11.7",
    "@types/lodash": "^4.14.182",
    "@types/lodash-es": "^4.17.6",
    "@vueuse/core": "^9.1.0",
    "async-validator": "^4.2.5",
    "dayjs": "^1.11.3",
    "escape-html": "^1.0.3",
    "lodash": "^4.17.21",
    "lodash-es": "^4.17.21",
    "lodash-unified": "^1.0.2",
    "memoize-one": "^6.0.0",
    "normalize-wheel-es": "^1.2.0"
  },
  "devDependencies": {
    "@types/node": "*",
    "csstype": "^2.6.20",
    "vue": "^3.2.37",
    "vue-router": "^4.0.16"
  },
  "vetur": {
    "tags": "tags.json",
    "attributes": "attributes.json"
  },
  "web-types": "web-types.json",
  "browserslist": ["> 1%", "not ie 11", "not op_mini all"],
  "gitHead": "89d4ec863ce55fc3de2f0513631e76f695f8e791"
}
```

## 基本字段

- **name**

  项目名称。该字段不能设置为空，它和版本号组成唯一的标识来代表整个项目，字母不能大些，可以使用`-`，`_`符号，如果需要在 [npm](https://www.npmjs.com/) 平台发布，需要保证你的 `name` 在平台是唯一的。

- **version**

  项目的版本号。需要发布 npm 平台的时候改字段为必输。

- **description**

  项目描述。该字段可以在 npm 平台搜索该包的时候起到作用。
  ![](http://tuchuang.niubin.site/image/project-20240605-1.png)

- **keywords**

  关键词。在 npm 平台搜索的关键词，该字段为数组，可设置多个关键词。

- **homepage**

  项目的主页 URL。

- **bugs**

  项目提交问题的地址。

- **license**

  项目的许可证（软件的开源协议）。

  ![](http://tuchuang.niubin.site/image/project-20240605-2.png)

- **main**

  npm 包的 `CommonJS` 入口文件。如果不设置则默认查找这个包根目录下的 `index.js` 文件。当我们使用 `require` 引入包的时候则会查找 `main` 对应路径的文件进行引入。这个文件应该遵循 `CommonJS` 模块规范，并且基于 `ES5` 规范编写。

- **module**

  npm 包的 `ESM` 规范的入口文件。这样的文件可以使用 `ES6` 的 `import/export` 语法，并支持 `Tree Shaking` 等特性。`main` 和 `module` 字段在 package.json 中共同存在时，分别用于指定不同模块规范下的入口文件，以满足不同环境和工具的需求。

  > 平时我们引入三方包的时候例如 `import ElementPlus from "element-plus";`，他会先找到这个包，然后在包里面的`package.json`文件中找到 `module`对应的入口文件，等于你引入的就是这个 es 下的 `index.mjs` 文件
  > ![](http://tuchuang.niubin.site/image/project-20240605-3.png) > ![](http://tuchuang.niubin.site/image/project-20240605-4.png)

- **types**

  `TypeScript` 类型定义文件的路径。

- **exports**

  定义包的子路径导出映射。

  ```json
  "exports": {
    ".": {
      "import": "./index.esm.js", // 当使用 ESM 语法导入包时，解析到这个文件
      "require": "./index.cjs" // 当使用 require() 导入包时，解析到这个文件
    },
    "./feature": {
      "import": "./feature/esm/index.js", // 当导入特定的特性时，为 ESM 提供不同的入口点
      "require": "./feature/cjs/index.js" // 当导入特定的特性时，为 CommonJS 提供不同的入口点
    }
  },
  ```

- **unpkg**

  CDN 服务地址。

  > "unpkg": "dist/index.full.js" 相当于映射 https://unpkg.com/element-plus@2.3.12/dist/index.full.js

- **repository**

  包代码存放仓库地址。可以为字符串（仓库地址），可以为对象如上面的`element-plus`中的`repository`

- **publishConfig**

  npm 包的发布指定特定的配置。改配置将覆盖全局或用户级别的 npm 配置。这对于需要将包发布到私有 npm 仓库或具有特殊发布需求的场景特别有用。

  > publishConfig 是一个对象包含以下属性:
  >
  > `registry`：指定 npm 包的发布仓库地址。（私有 npm 仓库可以在这指定 url）
  >
  > `access`：包的访问级别（默认 `public` 公开，`restricted` 私有）
  >
  > `tag`：为发布的 npm 包指定一个标签。默认情况下 npm 包会使用 `latest` 标签发布，你可以手动指定为 `beta`

- **style**

  该字段不是标准的 npm 字段，代表包中的样式文件路径。当 style 字段被设置时，某些工具（如 Webpack 的某些 loader 或构建脚本）可能会自动处理或包含这个样式文件。这通常用于那些希望将样式文件直接包含在其包中的前端库或组件。

- **sideEffects**

  用于告知打包工具（如 Webpack）哪些文件或模块在引入时具有副作用，从而影响 tree shaking 的行为。

  > 在 package.json 中，sideEffects 字段是 Webpack v4 及更高版本引入的一个特性，用于标记项目中的某些文件或模块是否包含副作用（side effects）。这个字段对于 Webpack 的 tree shaking（树摇）优化至关重要。
  > 通过正确配置 sideEffects，打包工具可以更有效地移除未使用的代码，减小最终打包文件的大小。

- **peerDependencies**

  对等依赖。 `peerDependencies` 字段用于声明一个 package 与依赖它的宿主应用程序所使用的其他 package 之间的兼容性限制。例如上面的`element-plus`中的`peerDependencies`是依赖的`vue@3.2.0`的版本，也就是你当前项目的 vue 版本不能低于`vue@3.2.0`，否则会出现兼容性报错。

- **dependencies**

  项目的生产环境中所必须的依赖包。

- **devDependencies**

  开发阶段需要的依赖包。比如 less、scss、eslint 等。

  > npm 安装包时常见的基本参数以及作用：
  >
  > 1. 无参数 （npm install <包名>）
  >    默认会添加到 package.json 文件中的 `dependencies` 中。
  > 2. --save 或者 -S
  >    同上。
  > 3. --save-dev 或者 -D
  >    添加到 package.json 文件中的 `dependencies` 中，通常用于开发环境依赖的包。
  > 4. --global 或 -g
  >    将包安装到全局环境，而不是当前项目的本地环境，这可以让这个包在任何项目使用，一般用于工具包。
  > 5. --production
  >    仅安装到生产环境
  > 6. --no-save
  >    安装的包但不会添加到 package.json 中的依赖项中。
  > 7. --no-package-lock
  >    安装包时不生成 package-lock.json 文件。

- **browserslist**

  > "> 1%"：表示支持全球使用率超过 1% 的浏览器。
  > "not ie 11"：不支持 ie11。
  > "not op_mini all"：不支持所有版本的 Opera Mini 浏览器。

### 重要字段补充

除了 `element plus` 的 `package.json`中的字段外，还有一些常见以及重要的，下面做一补充：

- **scripts**

  项目的脚本命令，这些命令可以通过 `npm run <script-name>` 来执行。

- **bin**

  指定命令以及对应执行文件路径。这些文件通常会有可执行权限，并且包含一些可以在命令行中运行的代码。例如：

  ```json
  {
    "name": "my-tool",
    "version": "1.0.1",
    "bin": {
      "my-tool": "./bin/index.js"
    },
    "scripts": {
      "start": "node index.js"
    }
    //...
  }
  ```

- **files**

  发布 npm 时指定需要上传的文件或者目录。如果你有少数不上传的文件，那可以创建一个.npmignore 文件（类似于.gitignore，但该文件不会上传 npm），去掉你不需要上传的文件，其余都上传。例如：

  ```
  node_modules
  packages
  ```

- **engines**

  当前包或者项目依赖的环境。有些项目所以来的包跟 npm 的版本或者 node 版本有要求，不符合版本的时候项目经常启动不起来，该文件只是说明该项目所需要的 node 版本，并非起到限制作用。

## package-lock.json（npm）、pnpm-lock.yaml（pnpm）

这些文件会在首次使用 `npm`/`pnpm` 安装依赖的时候生成，用于锁定项目依赖的确切版本，包含主模块和所有依赖的子模块。主要用于避免由于依赖版本更新导致的不一致问题，保证是相同的依赖树。当我们更新某个包的版本的时候，同时也会修改 `package-lock.json`。
依赖项的存储方式有所不同，`pnpm` 使用“硬链接”来存储依赖项，而 `npm` 和 `yarn` 则复制依赖项到每个项目的 `node_modules` 目录中。
