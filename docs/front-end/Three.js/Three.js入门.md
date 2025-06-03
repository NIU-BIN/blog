---
category: Three.js
cover: https://cdn.pixabay.com/photo/2025/04/21/14/54/daisies-9547672_1280.jpg
sticky: 3
---

# Three.js 入门

文档参考：

[官方文档](https://threejs.org/docs)

## 三要素

先从简单的一个需求来慢慢了解

需求：生成一个立方体

实现流程：

1.  创建场景

```js
const scene = new THREE.Scene();
```

2.  创建相机

```js
const camera = new THREE.PerspectiveCamera();
```

3. 过 `THREE.BoxGeometry` 创建一个立方体，并使用 `THREE.MeshBasicMaterial` 创建一个材质对象，两者通过 `THREE.Mesh()` 合为一个模型

4. 将模型添加进场景

```js
scene.add(cube);
```

5. 创建渲染器

```js
const renderer = new THREE.WebGLRenderer();
```

6. 将渲染器插入到 body 中，并且渲染整个窗口

```js
document.body.appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);
```

7.  将相机和场景添加近渲染器进行渲染

```js
renderer.render(scene, camera);
```

8.  为了有参考的东西，我们创建一个网格，并将网格添加进场景

```js
const girdHelper = new THREE.GridHelper(10, 10);
scene.add(girdHelper);
```

完整代码如下：

```js
import * as THREE from "./three.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera();
camera.position.z = 16; // z为直视物理的距离
camera.position.y = 4; // y为上下
camera.position.x = 3; // x为左右
// 创建立方体
// const geometry = new THREE.BoxGeometry(100, 100, 100);
const geometry = new THREE.BoxGeometry(2, 1, 1);

//创建一个材质对象Material
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000, //0xff0000设置材质颜色为红色
});

// 网格
const cube = new THREE.Mesh(geometry, material);
cube.position.set(0, 3, 0);
// 将内容添加进场景
scene.add(cube);

// 创建渲染器
const renderer = new THREE.WebGLRenderer();

document.body.appendChild(renderer.domElement);

// 调整窗口大小
renderer.setSize(window.innerWidth, window.innerHeight);

// 添加网格
const girdHelper = new THREE.GridHelper(10, 10);
scene.add(girdHelper);

// AxesHelper：辅助观察的坐标系
const axesHelper = new THREE.AxesHelper(150);
scene.add(axesHelper);

// 调用渲染器进行渲染(将场景和相机添加进去)
renderer.render(scene, camera);

// 让立方体动起来

// const animate = () => {
//   requestAnimationFrame(animate)
//   cube.rotation.x += 0.1
//   renderer.render(scene, camera)
// }
// animate()
```

从此案例我们基本可以知道核心的三点：

场景 Scene、相机 Camera、渲染器 Renderer

## 场景

```js
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // 设置场景颜色为黑色
scene.fog = new THREE.Fog(0xcccccc, 10, 15); // 添加雾
/* 
  Fog( color : Integer, near : Float, far : Float )
  color： 雾颜色
  near： 开始应用雾的最小距离。距离小于活动摄像机“near”个单位的物体将不会被雾所影响。默认值是1。
  far: 结束计算、应用雾的最大距离，距离大于活动摄像机“far”个单位的物体将不会被雾所影响。默认值是1000。
*/

// 添加背景图片
/* 
  setPath 图片根路径
  load 需要加载的图片，总共6张，上下左右前后

*/
scene.background = new THREE.CubeTextureLoader()
  .setPath("/")
  .load([
    "1111.png",
    "1111.png",
    "1111.png",
    "1111.png",
    "1111.png",
    "1111.png",
  ]);
```

## 透视相机

```js
const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000); // 创建透视相机
scene.add(camera);
```

PerspectiveCamera( fov : Number, aspect : Number, near : Number, far : Number )

- fov — 摄像机视锥体垂直视野角度
- aspect — 摄像机视锥体长宽比
- near — 摄像机视锥体近端面
- far — 摄像机视锥体远端面

## 渲染器

## 轨道控制器 OrbitControls

OrbitControls 可以使相机围绕目标进行轨道运动，OrbitControls 是一个附加组件，需要额外导入

```js
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// 添加轨道控制器(需要将相机和渲染节点传入)
const controls = new OrbitControls(camera, renderer.domElement);

// 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
controls.addEventListener("change", function () {
  renderer.render(scene, camera); //执行渲染操作
});
```

OrbitControls 本质就是改变相机的参数，比如改变相机的位置

```js
controls.addEventListener("change", function () {
  // 浏览器控制台查看相机位置变化
  console.log("camera.position", camera.position);
});
```

如果想让视角自动转动，可以通过 `autoRotate` 来控制，并且可以通过 `autoRotateSpeed` 属性来控制旋转的速率，但是需要在你的动画循环里调用`.update()`方法刷新控制器

```js
controls.autoRotate = true;
controls.autoRotateSpeed = 10;

const animate = () => {
  requestAnimationFrame(animate);
  controls.update();
};

animate();
```

如果想让你在手动拖动视角的时候带有惯性，则可以设置 `enableDamping` 属性来开启，并且可以配置阻尼系数，同样需要在你的动画循环里调用`.update()`方法刷新控制器`dampingFactor`

```js
controls.enableDamping = true;
controls.dampingFactor = 0.01;

const animate = () => {
  requestAnimationFrame(animate);
  controls.update();
};

animate();
```

## 三维坐标轴

使用 AxesHelper 来创建一个坐标轴（长度为 5），并添加进场景中

```js
const axesHelper = new THREE.AxesHelper(5);
axesHelper.position.y = 3;
scene.add(axesHelper);
```

three.js 坐标轴颜色红 R、绿 G、蓝 B 分别对应坐标系的 x、y、z 轴，对于 three.js 的 3D 坐标系默认 y 轴朝上

## 光源

### 网格材质

光源对物体的影响跟物体的材质有关系。网格材质主要分为以下几种：

- 不受光照影响
  - 基础材质 - MeshBasicMaterial
- 受光照影响
  - 漫反射 - MeshLambertMaterial
  - 高光 - MeshPhongMaterial
  - 物理：
    - MeshStandardMaterial
    - MeshPhysicalMaterial

1. 基础的网格材质不会受到光源的影响

```js
//MeshBasicMaterial不受光照影响
const material = new THREE.MeshBasicMaterial();
```

2. 漫反射网格材质
   一个立方体长方体使用 `MeshLambertMaterial` 材质，不同面和光线夹角不同，立方体不同面就会呈现出来不同的明暗效果。

```js
const material = new THREE.MeshLambertMaterial();
```

### 光源分类

- 环境光 - AmbientLight
- 点光源 - Pointlight
- 聚光灯光源 - Spotlight
- 平行光 - DirectionalLight

点光源可以理解为一个以自身为中心向周围发散的一个光源

```js
// 点光源包含两个参数： 光源颜色和光照强度
const pointLight = new THREE.PointLight(0xffffff, 1.0);
```

光照的强度也可以通过光源实例的属性 `intensity` 来设置:

```js
pointLight.intensity = 1.0; // 光照强度
```

### 光线衰减

在现实生活中，光线的强度会随着距离越来越弱，three.js 也可以实现

光源衰减属性`decay` 默认值是 2.0，如果你不希望衰减可以设置为 0.0。

```js
pointLight.decay = 0.0; //设置光源不随距离衰减
```

### 光源位置

```js
//点光源位置
pointLight.position.set(400, 0, 0); // 点光源放在x轴上
```
