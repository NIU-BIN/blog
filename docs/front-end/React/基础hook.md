---
category: React
cover: https://cdn.pixabay.com/photo/2014/04/14/20/11/pink-324175_640.jpg
sticky: 1
---

# 基础 hook

## 配置路径别名

1. ts 项目使用 node 相关 api 的时候需要安装 node 的类型声明

安装类型声明文件

```
pnpm i -D @types/node
```

2. 修改 vite.config.ts

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { join } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": join(__dirname, "/src"),
    },
  },
});
```

3. 修改 tsconfig.json，在 compilerOptions 新增 baseUrl 和 paths

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

## 函数式组件的类型

```tsx
import React from "react";

// React.FC<T>表示这是一个函数式组件, 泛型用来给props约定
const App: React.FC = () => {
  console.log("app");
  return <div>app</div>;
};

export default App;
```

## React.StrictMode

`React.StrictMode`在开发环境对函数式组件会连续调用两次来判断函数式组件是否为一个纯函数

```tsx
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## useState

### 状态变化时会触发函数组件的重新执行

在函数式组件中使用 useState 定义状态之后，每当状态发生改变，都会触发函数组件的重新执行，从而根据最新的数据更新 DOM 结构

:::tip
注意： 当函数式组件重新执行的时候不会重复调用 useState 方法给数据赋初始值，而是会复用上次的 state 值
:::

###以函数的形式为状态赋初始值

可以通过函数返回初始值的形式给状态赋值

```tsx
const [date, setDate] = useState(() => {
  const dt = new Date();
  return {
    year: dt.getFullYear(),
    month: dt.getMonth() + 1,
    day: dt.getDate(),
  };
});
```

:::tip
✨ 注意： 以函数形式给赋值的时候只有在组件首次渲染的时候才会执行，当函数式组件重新执行的时候会复用上次的更新的 state 值
:::

### useState 是异步变更状态的

调用 useState() 会返回变更状态的函数，这个函数内部是以异步的形式来修改状态的，所以修改后无法立即拿到最新的值

### 使用 useEffect 来监听数据的改变

```tsx
useEffect(() => {
  console.log("change", count);
}, [count]);
```

> useEffect 会在函数首次渲染完成之后执行一次

### 解决值更新不及时的 bug

当连续多次以相同的操作来更新状态值时，React 内部会对传递过来的新值进行比较，如果值相同，则屏蔽后续的更新行为，从而防止组件频繁渲染的问题，比如：

```tsx
const [count, setCount] = useState(0);

const addCount = () => {
  setCount(count + 1);
  setCount(count + 1);
};

// 执行后还是1
```

由于 setCount 是异步的，两次传进去的值都是 0，所以只渲染一次

为了解决上述的问题，我们通过函数的方式给状态赋值

```tsx
const addCount = () => {
  // 这种依旧是1
  // setCount(() => count + 1);
  // setCount(() => count + 1);
  setCount((count) => count + 1);
  setCount((count) => count + 1);
};
```

### 使用 setState 模拟组件的强制刷新

通过赋值新的对象来刷新组件，因为每次传入的对象的地址不一样，所以每次都会刷新

```tsx
const App: React.FC = () => {
  const [, forceUpdate] = useState({});

  const onRefresh = () => forceUpdate({});
  console.log("刷新了");

  return (
    <>
      <button onClick={onRefresh}>刷新</button>
    </>
  );
};

export default App;
```

## useRef

useRef 返回一个可变的 ref 对象，该对象只有一个 current 属性，可以在调用 useRef 函数时为其制定初始值，并且返回的这个 ref 对象在组件的整个生命周期内保持不变

useRef 主要解决以下场景：

1. 获取 DOM 元素或者子组件的实例对象
2. 存储渲染周期之间共享的数据

### 获取 dom 元素

```tsx
const App: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const getFocus = () => {
    inputRef.current?.focus();
  };
  console.log("刷新了");

  return (
    <>
      <input type="text" ref={inputRef} />
      <button onClick={getFocus}>聚焦</button>
    </>
  );
};
```

### 存储渲染周期之间共享数据

比如创建一个数据用来存储其他数据上次的值

```tsx
const App: React.FC = () => {
  const [count, setCount] = useState(0);
  const preCountRef = useRef<number>();

  const add = () => {
    preCountRef.current = count;
    setCount(count + 1);
  };

  return (
    <>
      <div>
        旧值：{preCountRef.current} 新值： {count}
      </div>
      <button onClick={add}>聚焦</button>
    </>
  );
};
```

### 组件 rerender 的时候 useRef 不会重新初始化

count 在更新的过程中，时间一直不变

```tsx
const App: React.FC = () => {
  const [count, setCount] = useState(0);
  const time = useRef<number>(Date.now());

  const add = () => {
    setCount(count + 1);
  };

  return (
    <>
      <div>{time.current}</div>
      <button onClick={add}>聚焦</button>
    </>
  );
};
```

### useRef 定义的数据，通过 `.current` 给重新赋值的时候不会触发 render

不会触发 render，当然视图也不会刷新，但是值变化了

```tsx
const App: React.FC = () => {
  const [count] = useState(0);
  const time = useRef<number>(Date.now());

  const change = () => {
    console.log("change");
    time.current = Date.now();
  };

  return (
    <>
      <div>
        {time.current} {count}
      </div>
      <button onClick={change}>change</button>
    </>
  );
};
```

### 不要将 ref.current 作为其他 hooks 的依赖项

当 time 改变的时候不会打印"time 改变了"

```tsx
const App: React.FC = () => {
  const [count] = useState(0);
  const time = useRef<number>(Date.now());

  const change = () => {
    console.log("change");
    time.current = Date.now();
  };

  useEffect(() => {
    console.log("time改变了");
  }, [time.current]);

  return (
    <>
      <div>
        {time.current} {count}
      </div>
      <button onClick={change}>change</button>
    </>
  );
};

export default App;
```

### forwardRef

ref 的作用是获取实例，但是函数组件不存在实例，因此没办法通过 ref 获取函数组件的实例引用，所以 forwardRef 就是来解决这个问题的，他不是一个 hooks，是 react 提供的一个函数

父组件需要访问的子组件需要通过`React.forwardRef`进行包裹，使用`useImperativeHandle`指定 ref 然后将需要暴露出去的数据通过函数 return 出去

useImperativeHandle 有三个参数，第三个参数决定是否需要将更新后的数据暴露出去，为空数组的时候只会传递初始值，也就是第二个参数的方法只会执行一次

```
useImperativeHandle(ref, Function, [依赖])
```

```tsx
import React, { useImperativeHandle, useRef, useState } from "react";

interface Idata {
  data: number;
  change: () => void;
}

// 在ts中有些参数不适用但是还是会报警告，这时候可以使用_代替，这块将props换为_
const Child = React.forwardRef((_, ref) => {
  const [data, setData] = useState(1);

  const change = () => {
    setData((data) => data + 1);
  };

  useImperativeHandle(ref, () => {
    return {
      data,
      change,
    };
  });
  return (
    <>
      <div>{data}</div>
    </>
  );
});

const App: React.FC = () => {
  const childRef = useRef<Idata>(null);

  const getChild = () => {
    console.log("childRef:", childRef);
    childRef.current?.change();
  };

  return (
    <>
      <button onClick={getChild}>getChild</button>
      <Child ref={childRef} />
    </>
  );
};

export default App;
```

## useEffect

```
useEffect(fn, deps?)
```

### useEffect 执行时机

1. 首次渲染完成必会执行一次。如果没有为 useEffect 设置依赖项数组，则副作用函数会在函数组件每次进行渲染完成后执行（比如可以在副作用函数中获取最新的 dom）。

```tsx
const App: React.FC = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("触发渲染执行");
  });

  const add = () => {
    setCount(count + 1);
  };

  return (
    <>
      <button onClick={add}>+1</button>
      <div>{count}</div>
    </>
  );
};

export default App;
```

2. 当设置依赖项之后，只有依赖项的值发生改变的时候才会执行副作用函数，副作用函数式在组件每次渲染完成后判断依赖项是否发生变化在决定是否执行

3. 当依赖项设置为空数组的时候只会在第一次渲染完成的时候执行一次，相当于 vue 的 onMounted

:::tip
✨ 注意事项：

1. 不要在 useEffect 中改变依赖项的值，会造成死循环
2. 多个功能不同的副作用尽量分开声明，不要写到一个 useEffect 中
   :::

### 清理副作用

useEffect 可以返回一个函数，用于清除副作用函数，一般用于清除定时器、事件监听、页面跳转清理网络请求等.
下面是一个取消请求的例子：

```tsx
const Child: React.FC = () => {
  const [color, setColor] = useState(0);
  useEffect(() => {
    const controller = new AbortController();

    fetch("https://api.liulongbin.top/v1/color", { signal: controller.signal })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setColor(res.data.color);
      })
      .catch((err) => {
        console.log("err: ", err.message);
      });

    return () => {
      console.log("我要走了");
      controller.abort();
    };
  }, []);
  return <>child {color}</>;
};

const App: React.FC = () => {
  const [count, setCount] = useState(0);
  const [showChild, setShowChild] = useState(true);

  useEffect(() => {
    console.log("触发渲染执行");
  }, []);

  const change = () => {
    // setCount(count + 1);
    setShowChild(!showChild);
  };

  return (
    <>
      <button onClick={change}>change</button>
      <div>{showChild && <Child />}</div>
      <div>{count}</div>
    </>
  );
};

export default App;
```

清理时间监听的例子：

```tsx
const Child: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    window.addEventListener("mousemove", mouseHander);
    return () => window.removeEventListener("mousemove", mouseHander);
  }, []);

  let timer: null | NodeJS.Timeout = null;

  const mouseHander = (e: MouseEvent) => {
    if (timer) return;
    timer = setTimeout(() => {
      console.log("鼠标移动", e);
      setPosition({
        x: e.clientX,
        y: e.clientY,
      });
      timer = null;
    }, 500);
  };

  return (
    <>
      鼠标位置：{position.x}, {position.y}
    </>
  );
};

const App: React.FC = () => {
  const [count, setCount] = useState(0);
  const [showChild, setShowChild] = useState(true);

  useEffect(() => {
    console.log("触发渲染执行");
  }, []);

  const change = () => {
    // setCount(count + 1);
    setShowChild(!showChild);
  };

  return (
    <>
      <button onClick={change}>change</button>
      <div>{showChild && <Child />}</div>
      <div>{count}</div>
    </>
  );
};

export default App;
```

将获取鼠标位置的逻辑封装为 hooks

hooks 文件

```tsx
import { useEffect, useState } from "react";

export const useMousePosition = (delay: number = 500) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    window.addEventListener("mousemove", mouseHander);
    return () => window.removeEventListener("mousemove", mouseHander);
  }, []);

  let timer: null | NodeJS.Timeout = null;

  const mouseHander = (e: MouseEvent) => {
    if (timer) return;
    timer = setTimeout(() => {
      console.log("鼠标移动", e);
      setPosition({
        x: e.clientX,
        y: e.clientY,
      });
      timer = null;
    }, delay);
  };

  return position;
};
```

使用

```tsx
import React, { useEffect, useState } from "react";
import { useMousePosition } from "@/hooks";

const Child: React.FC = () => {
  const position = useMousePosition();

  return (
    <>
      鼠标位置：{position.x}, {position.y}
    </>
  );
};

const App: React.FC = () => {
  const [count, setCount] = useState(0);
  const [showChild, setShowChild] = useState(true);

  useEffect(() => {
    console.log("触发渲染执行");
  }, []);

  const change = () => {
    // setCount(count + 1);
    setShowChild(!showChild);
  };

  return (
    <>
      <button onClick={change}>change</button>
      <div>{showChild && <Child />}</div>
      <div>{count}</div>
    </>
  );
};

export default App;
```

## useLayoutEffect

用法和 useEffect 相似，用途相当于 vue 中的 created

### useLayoutEffect 与 useEffect 的区别

| hook 名称       | 执行时机                 | 执行过程                     |
| --------------- | ------------------------ | ---------------------------- |
| useEffect       | 浏览器重新绘制`之后`触发 | 异步执行，不阻塞浏览器的绘制 |
| useLayoutEffect | 浏览器重新绘制`之前`触发 | 异步执行，阻塞浏览器的绘制   |
