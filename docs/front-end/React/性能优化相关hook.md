---
category: React
cover: https://cdn.pixabay.com/photo/2017/05/09/03/46/alberta-2297204_640.jpg
sticky: 2
---

# 性能优化相关 hook

## React.memo

当父组件被重新渲染的时候，子组件也会触发渲染，这样就多了无意义的性能开销，如果子组件的状态没有发生变化，则子组件是必须要被重新渲染的。
在 React Hooks 中我们可以使用 React.memo 来解决上述问题从而提高性能的目的。

```
const 组件 = React.memo(函数式组件)
```

```tsx
import React, { useEffect, useState } from "react";

const Father: React.FC = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("xiaoming");

  const add = () => {
    setCount(count + 1);
  };

  const changeName = () => {
    setName("1235");
  };

  return (
    <>
      <div>count: {count}</div>
      <div>name: {name}</div>
      <button onClick={add}>+1</button>
      <button onClick={changeName}>changeName</button>
      <Son count={count} />
    </>
  );
};

const Son: React.FC<{ count: number }> = React.memo((props) => {
  useEffect(() => {
    console.log("Son组件渲染");
  });
  return <div>Son: {props.count}</div>;
});

export default Father;
```

## useMemo

用于缓存变量，返回的是值

语法格式如下：

```tsx
const memorizeValue = useMemo(cb, array);

const memoValue = useMemo(() => {
  return 计算后的值;
}, [value]); // 表示监听的value的变化
```

其中：

1. cb：这是一个函数，用户处理计算的逻辑，必须使用 return 返回计算的结果
2. array： 这个数组中存储的是依赖项，只要依赖项发生变化都会触发 cb 的重新执行。使用 array 需要注意以下几点
   - 不传数组，每次更新都会重新计算
   - 空数组，只会计算一次
   - 依赖对应的值变化时会重新执行 cb

示例：

```tsx
const Father = () => {
  const [flag, setFlag] = useState(true);
  const [count, setCount] = useState(0);

  const add = () => {
    setCount(count + 1);
  };

  const changeFlag = () => {
    setFlag(!flag);
  };

  const tips = useMemo(() => {
    console.log("tips重新渲染");
    return flag ? (
      <p>哪里贵了，不要睁着眼瞎说好不好</p>
    ) : (
      <p>这些年有没有努力工作，工资涨没涨</p>
    );
  }, [flag]);

  return (
    <>
      <div>flag: {flag.toString()}</div>
      <div>
        <button onClick={changeFlag}>changeFlag</button>
      </div>
      {tips}
      <div>count: {count}</div>
      <button onClick={add}>+1</button>
    </>
  );
};
```

## useCallback

用于缓存函数，返回的是函数

语法格式如下：

```tsx
const memoCallback = useCallback(cb, array);
```

useCallback 会返回一个 memorized 回调函数供组件使用，从而防止组件 rerender 的时候反复创建相同的函数，能够节省内存的开销，提高性能。

其中：

1. cb：这是一个函数，用户处理业务逻辑，必须使用 return 返回计算的结果
2. array： 这个数组中存储的是依赖项，只要依赖项发生变化都会触发 cb 的重新执行。使用 array 需要注意以下几点
   - 不传数组，每次更新都会重新计算
   - 空数组，只会计算一次
   - 依赖对应的值变化时会重新执行 cb

```tsx
const set = new Set();

const Search = () => {
  const [keywords, setKeywords] = useState("");

  const change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeywords(e.target.value);
  };

  set.add(change);
  console.log(set.size); // 当输入的时候keywords改变 触发组件的渲染，使用set收集来验证是否函数会重复声明，结果是 每次输入东西都会触发重新创建函数

  return (
    <>
      <input type="text" value={keywords} onChange={change} />
      <div>keywords: {keywords}</div>
    </>
  );
};

export default Search;
```

> ✨ 注意：
> 当使用 change 时间的时候在 ts 中需要使用 `React.ChangeEvent<HTMLInputElement>`，其中的泛型需要根据当前的控件来确定

使用 useCallback 来解决当前问题

```tsx
const set = new Set();

const Search = () => {
  const [keywords, setKeywords] = useState("");

  const change = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setKeywords(e.target.value);
  }, []); // 因为当前函数只需要声明一次，所以使用空数组

  set.add(change);
  console.log(set.size); // 每次打印都是1

  return (
    <>
      <input type="text" value={keywords} onChange={change} />
      <div>keywords: {keywords}</div>
    </>
  );
};

export default Search;
```

案例：

```tsx
type SearchInputType = {
  changeKw: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Search = () => {
  const [kw, setKw] = useState("");

  const changeKw = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setKw(e.target.value);
  }, []);

  return (
    <>
      <div>kw: {kw}</div>
      <SearchInput changeKw={changeKw} />
      <SearchResult kw={kw} />
    </>
  );
};

const SearchInput: React.FC<SearchInputType> = React.memo((props) => {
  useEffect(() => {
    console.log("SearchInput 组件渲染");
  });

  return (
    <>
      <input type="text" onChange={props.changeKw} />
    </>
  );
});

type ResultType = {
  id: number;
  word: string;
};

const SearchResult: React.FC<{ kw: string }> = (props) => {
  const [result, setResult] = useState<ResultType[]>([]);

  useEffect(() => {
    if (props.kw) {
      fetch("http://api.liulongbin.top/v1/words?kw=" + props.kw)
        .then((res) => res.json())
        .then((res) => {
          console.log(res.code);
          if (res.code === 0) {
            setResult(res.data);
          } else {
            setResult([]);
          }
        });
    } else {
    }
  }, [props.kw]);

  return (
    <>
      {result.map((item) => {
        return <div key={item.id}>{item.word}</div>;
      })}
    </>
  );
};
```

## useTransition
