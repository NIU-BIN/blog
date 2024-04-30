---
category: CSS
cover: https://cdn.pixabay.com/photo/2017/10/05/09/05/railway-2818748_640.jpg
---

# grid 布局

我们大多对于 `flex` 布局已经很熟悉了，虽然 `grid` 已经出来很久了，但是仍有一部分人不太了解 `grid`，那就今天带你走进 `grid` 的魔法中吧。

## 固定列数，且均分

![](http://tuchuang.niubin.site/image/css-20240430-1.png)

```css
.container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}
.container > div {
  padding: 20px;
  background: rgb(200, 250, 243);
  border: 1px solid rgb(134, 191, 255);
  border-radius: 4px;
}
```

`grid-template-columns` 用来设置列，同理，`grid-template-rows` 用来设置行。一般情况下这样设置 `grid-template-columns: 20px 50px 40px 80px;` 表示有四列，第一列 20px、第二列 50px...，当需要按比例分配列宽时 `grid` 有一个单位 `fr`，为了方便理解，类似于 `flex` 布局中的 `flex` 属性，如果我的列要按照 1:2:3:4 来划分，则只需要这样设置 `grid-template-columns: 1fr 2fr 3fr 4fr;`，如果需要等分四列的话即为 `grid-template-columns: 1fr 1fr 1fr 1fr;`，但如果列特别多的情况下，我们可以使用 `repeat` 方法来写 `grid-template-columns: repeat(4, 1fr);`

## 确定行数并确定行高

![](http://tuchuang.niubin.site/image/css-20240430-2.png)

```css
.container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 90px);
}
```

但不推荐这么做，因为常常这个数量是不可控的，此时可以使用 `grid-auto-rows` 来代替

```css
.container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  /* grid-template-rows: repeat(3, 90px); */
  grid-auto-rows: 90px;
}
```

效果也是一样的，但好的一点是他每一行的高度都设置了，数量多的时候也不受影响。

当列宽确定的时候，总会遇到这样的现象：

![](http://tuchuang.niubin.site/image/css-20240430-3.png)

```css
.container {
  display: grid;
  grid-template-columns: repeat(4, 150px);
  grid-auto-rows: 90px;
}
```

右边会空出一大截，这样有人会想到都有每行的默认高度，是不是也有每列的默认宽度呢，那我们试试

```css
.container {
  display: grid;
  /* grid-template-columns: repeat(4, 150px); */
  grid-auto-columns: 150px;
  grid-auto-rows: 90px;
}
```

![](http://tuchuang.niubin.site/image/css-20240430-4.png)

显然不行，那我们来看看列宽设置的种种情况吧

## 设置列宽

对于刚才上述问题，这时候有一个 `auto-fill` 属性，让一行能放几个就放下几个指定宽度的列，剩下的换行

```css
.container {
  display: grid;
  /* grid-template-columns: repeat(4, 150px); */
  grid-template-columns: repeat(auto-fill, 150px);
  grid-auto-rows: 90px;
}
```

![](http://tuchuang.niubin.site/image/css-20240430-5.png)
![](http://tuchuang.niubin.site/image/css-20240430-6.png)

这时候只要上层能放下该宽度的盒子时会自动上去，但是还是会留下一个空隙。但如果每列的最小宽度定了，一行的宽度不够再摆放一个盒子的时候让他们宽度均分，能再放下一个固定宽度盒子的时候继续放，这时候会用到一个 `minmax` 方法来确定最大最小宽度

```css
.container {
  display: grid;
  /* grid-template-columns: repeat(4, 150px); */
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-auto-rows: 90px;
}
```

![](http://tuchuang.niubin.site/image/css-20240430-7.png)
![](http://tuchuang.niubin.site/image/css-20240430-8.png)

🎉 完美！

## 设置间隔

如果想设置格子之间的间距的时候使用 `gap`

```css
.container {
  display: grid;
  /* grid-template-columns: repeat(4, 150px); */
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-auto-rows: 90px;
  /*  先行后列  */
  gap: 20px 10px;
}
```

![](http://tuchuang.niubin.site/image/css-20240430-9.png)

## 合并布局

如果将布局列为格子的话，某些格子需要进行合并。我们可以使用 `grid-row` 或者 `grid-column` 来确定某个元素可以横向合并几列，纵向合并几行。

```html
<div class="container">
  <div class="a">1</div>
  <div>2</div>
  <div class="b">3</div>
  <div>4</div>
  <div>5</div>
  <div>6</div>
  <div>7</div>
  <div>8</div>
  <div>9</div>
  <div>10</div>
</div>
```

```css
.container {
  display: grid;
  /* grid-template-columns: repeat(4, 150px); */
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-auto-rows: 90px;
  gap: 20px 10px;
}
.container > div {
  padding: 20px;
  background: rgb(200, 250, 243);
  border: 1px solid rgb(134, 191, 255);
  border-radius: 4px;
}
.a {
  grid-row: 1/3;
  grid-column: 1/4;
}
.b {
  grid-column: 5/7;
}
```

`grid-row: 1/3;`表示从第一行开始，第二行结束，`grid-column: 1/4;`表示从第一列开始，第三列结束

![](http://tuchuang.niubin.site/image/css-20240430-10.png)

如果嫌书写麻烦的话可以给盒子使用 `grid-area` 起别名然后使用模板 `grid-template-areas` 直接写布局

![](http://tuchuang.niubin.site/image/css-20240430-11.png)

```html
<div class="container2">
  <div class="a">a</div>
  <div class="b">b</div>
  <div class="c">c</div>
  <div class="d">d</div>
</div>
```

```css
.container2 {
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr 3fr;
  grid-template-rows: 1fr 6fr 1fr;
  grid-template-areas:
    "a a"
    "b c"
    "d d";
}
.a {
  grid-area: a;
}
.b {
  grid-area: b;
}
.c {
  grid-area: c;
}
.d {
  grid-area: d;
}
```

如果某一个地方需要空出来，就可以使用小数点 . 来当做占位符

![](http://tuchuang.niubin.site/image/css-20240430-12.png)

```css
.container2 {
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr 3fr;
  grid-template-rows: 1fr 6fr 1fr;
  grid-template-areas:
    "a ."
    "b c"
    "d d";
}
.a {
  grid-area: a;
}
.b {
  grid-area: b;
}
.c {
  grid-area: c;
}
.d {
  grid-area: d;
}
```
