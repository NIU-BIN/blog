---
category: project
cover: https://cdn.pixabay.com/photo/2024/05/15/12/31/lake-8763490_640.jpg
---

# Monorepo 架构

## Monorepo 介绍

`Monorepo`是一种软件开发架构，可以将多个相关的代码或者组件存储在一个代码仓库中，在这个架构中每一个项目和组件都是一个目录。

`npm`、`yarn`、`pnpm` 这些包管理工具是用来安装依赖、管理项目依赖、发布包，他们都提供对工作区（`workspace`）的支持 ，这样就可以在一个代码仓库中管理多个项目或包，从而无需多个代码仓库。

> 包管理工具通过 workspace 功能来支持 Monorepo 模式，Workspace 是指在一个代码库中管理多个相关项目或模块的能力。

## 为什么说 pnpm 更适合 Monorepo？

1. 磁盘空间效率：

- pnpm 通过硬链接和内容寻址存储（Content-Addressable Storage）实现了极高的磁盘空间效率。在 Monorepo 中，多个项目可能共享相同的依赖项。pnpm 确保这些依赖项在磁盘上只存储一次，并通过硬链接在多个项目中共享，从而显著节省了磁盘空间。

2. 解决幽灵依赖问题：

- 幽灵依赖是指在 npm 或 yarn 的某些版本中，即使一个依赖项在`package.json`中未被明确声明，也可能因为其他依赖项间接地包含而被引入项目中。这可能导致项目在不同环境下表现不一致。pnpm 通过其独特的依赖解析和安装机制，有效地解决了这一问题，确保项目的依赖项清晰、一致。

3. 更好的依赖管理：

- 在 Monorepo 中，pnpm 允许项目之间共享相同的依赖项版本，从而减少了版本冲突和不必要的重复安装。此外，pnpm 还提供了更精细的依赖管理功能，如锁文件（`pnpm-lock.yaml`）来确保安装的依赖项版本一致性和可重复性。

4. 更快的安装速度：

- 由于 pnpm 采用了内容寻址存储和硬链接技术，它通常比 npm 和 yarn 具有更快的安装速度。在 Monorepo 中，这意味着开发人员可以更快地设置开发环境并开始工作。

5. 与 Monorepo 的协同工作：

- pnpm 与 Monorepo 的概念和工具（如 Lerna、Yarn Workspaces 等）紧密集成，提供了更好的支持和协同工作体验。例如，在 Monorepo 中，pnpm 可以轻松处理跨项目的依赖关系，并允许开发人员在不同项目之间无缝切换。

6. 安全性：

- pnpm 通过其独特的依赖解析和安装机制，减少了潜在的安全风险。例如，由于 pnpm 在磁盘上只存储一次依赖项，因此减少了恶意代码注入的可能性。此外，pnpm 还支持使用 HTTPS 协议从安全的源获取依赖项，进一步提高了项目的安全性。

包管理工具与 monorepo 的关系在于它们可以为 monorepo 提供依赖安装与依赖管理的支持，借助自身对 workspace 的支持，允许在 monorepo 中的不同子项目之间共享依赖项，并提供一种管理这些共享依赖项的方式，这可以简化依赖项管理和构建过程，并提高开发效率。

### Monorepo 架构有什么优势呢？

- **代码复用**

  由于项目共享同一个代码库，因此可以方便地抽离出共用的业务组件或工具，并通过 TypeScript、Lerna 或其他工具进行代码内引用，避免了在不同项目中重复编写相同功能代码的问题，提高了开发效率。

- **依赖复用**

  项目之间的引用路径内化于单一仓库，使得当某个项目的代码修改后，可以方便地追踪其影响的是其他哪些项目。此外，通过工具可以方便地进行版本依赖管理和版本号自动升级，确保所有项目都使用最新的代码，避免版本更新不及时的问题。

- **易于重构**

  Monorepo 架构使得能够明确知道代码的影响范围，并且可以对被影响的项目进行统一的测试，有利于不断优化代码。

- **集中管理**

  在 Monorepo 架构中，不同的前端项目都在同一个代码库中，方便管理和监控。这一点在需要同时对多个版本进行修改和维护的情况下尤为重要。

前端的 Monorepo 如何实现呢？那我们来看一下吧

## 使用 pnpm 构建 Monorepo 项目

使用 `pnpm` 搭建前端 Monorepo 项目是一个很好的选择，因为 `pnpm` 提供了一个高效且节省空间的包管理方式。

1. **环境安装**

确保你安装了 Node.js 和 npm。

安装 pnpm

```Shell
npm i pnpm -g
```

2. **初始化 Monorepo 项目**

创建项目文件夹，并初始化`package.json`

```Shell
npm init -y
```

创建下图所示项目结构并分别初始化`package.json`

![](http://tuchuang.niubin.site/image/project-20240511-1.png)

但是注意除了根目录的`package.json`，其他的`package.json`的`name`需要改为这种

```JSON
{
  "name": "@pnpm-monorepo/project1",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

3. **设置 workspaces**

有多种设置工作空间的方法：

- 第一种： 在 package.json 文件中添加一个`workspaces`字段来指定你的 Monorepo 项目包含哪些包，你可以指定具体包的路径

```JSON
{
  "name": "my-monorepo",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "packages/**",
    "project3"
  ]
}
```

在这个例子中，我们假设所有的包都放在 `packages` 目录下。

- 第二种：使用`pnpm-workspace.yaml`文件

```YAML
packages:
- packages/**
- project3
```

在这个例子中，将 packages 和 example 项目都放在 `packages` 目录下。

- 第三种：使用命令行参数

你可以在命令行中直接指定工作空间的路径，而不是使用 `pnpm-workspace.yaml` 文件

```Shell
pnpm install --recursive packages/**
```

> 这种一次只能添加一种

4. 将所有项目添加进工作空间

```Shell
pnpm i @pnpm-monorepo/project1 -w
```

![](http://tuchuang.niubin.site/image/project-20240511-2.png)

这时候就会发现根路径下的`package.json`多了以下东西

![](http://tuchuang.niubin.site/image/project-20240511-3.png)

我们试着在 project1 中创建一个 js 文件并导出一个方法

![](http://tuchuang.niubin.site/image/project-20240511-4.png)

我们在 project3 下面创建 vue 项目，引入 project1 导出的方法

![](http://tuchuang.niubin.site/image/project-20240511-5.png)

修改 project3 和根目录的`package.json`

```JSON
{
  "name": "@pnpm-monorepo/project3",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "vite --port 5555"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

```JSON
{
  "name": "pnpm-monorepo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "pnpm -C project3 dev"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@pnpm-monorepo/project1": "workspace:^",
    "@pnpm-monorepo/project2": "workspace:^",
    "@pnpm-monorepo/project3": "workspace:^",
    "@vitejs/plugin-vue": "^5.0.4",
    "vite": "^5.2.11",
    "vue": "^3.4.27"
  }
}
```

在根目录下执行 npm run dev 运行项目，打开控制台查看

![](http://tuchuang.niubin.site/image/project-20240511-6.png)

大功告成 🎉
