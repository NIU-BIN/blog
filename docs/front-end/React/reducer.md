---
category: React
cover: https://cdn.pixabay.com/photo/2024/02/08/21/44/foliage-8561873_640.jpg
---

# reducer

## useReducer

当遇到需要同时修改多个状态，并且修改操作比较复杂，而且能将对状态的修改从组件中抽离出来。
useReducer 对比 useState 更注重描述 修改的过程 ，比如组件触发行为，useReducer 负责更新

```tsx
const [state, dispatch] = useReducer(reducer, initState, inAction?)
```

> 参数说明：
>
> 1. `reducer`：是一个函数，`(preState, action) => newState`。preState 表示旧状态，action 表示本次的行为，返回的 newState 表示处理完成后的新状态
> 2. `initState`：初始值
> 3. `inAction`： 状态初始化的时候的处理函数，是可选的，将 initState 传递给该函数，该函数处理完成后将返回值作为初始状态

> ✨ 注意：直接通过 state 修改对应的值可以修改，但是界面不会显示最新值

示例：

```tsx
import React, { useReducer } from "react";

const defaultState = {
  name: "zhangsan",
  age: 0,
};

type UserType = typeof defaultState;

type ActionType =
  | {
      type: "UPDATE_NAME";
      payload: string;
    }
  | {
      type: "INCREMENT_AGE";
      payload: number;
    };

const reducer = (preState: UserType, action: ActionType) => {
  console.log("preState: ", preState, action);
  switch (action.type) {
    case "UPDATE_NAME":
      return {
        ...preState,
        name: action.payload,
      };
    case "INCREMENT_AGE":
      return {
        ...preState,
        age: action.payload,
      };
    default:
      return preState;
  }
};

const initAction = (initState: UserType) => {
  return {
    ...initState,
    age: initState.age || 20,
  };
};

const Son1: React.FC<UserType & { dispatch: React.Dispatch<ActionType> }> = (
  props
) => {
  // const [state, dispatch] = useReducer(reducer, defaultState, initAction);

  const addAge = () => {
    props.dispatch({
      type: "INCREMENT_AGE",
      payload: props.age + 1,
    });
  };

  return (
    <>
      <div>我是Son1</div>
      <button onClick={addAge}>age+1</button>
      <div>
        {props.name}-{props.age}
      </div>
      <div>----------------</div>
    </>
  );
};

const Son2: React.FC<UserType> = (props) => {
  return (
    <>
      <div>我是Son2</div>
      <div>
        {props.name}-{props.age}
      </div>
    </>
  );
};

export const Father: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, defaultState, initAction);

  const change = () => {
    dispatch({
      type: "UPDATE_NAME",
      payload: "啊啊啊",
    });
  };

  return (
    <>
      <button onClick={change}>修改用户名</button>
      {state.name}-{state.age}
      <div>
        <Son1 {...state} dispatch={dispatch} />
        <Son2 {...state} />
      </div>
    </>
  );
};
```

### 使用 immer 编写简洁的 reducer 更新逻辑

先看看之前的逻辑，每次需要重新返回一个新对象，要将别的属性进行解构赋值，然后赋值新的属性值，比较麻烦

```tsx
const reducer = (preState: UserType, action: ActionType) => {
  switch (action.type) {
    case "UPDATE_NAME":
      return {
        ...preState,
        name: action.payload,
      };
    case "INCREMENT_AGE":
      return {
        ...preState,
        age: action.payload,
      };
    default:
      return preState;
  }
};
```

为了解决这种写法，我们可以使用 immer。

1. 安装 immer

```
npm i immer use-immer -S
```

2. 使用 useImmerReducer 代替 useReducer

```tsx
export const Father: React.FC = () => {
  const [state, dispatch] = useImmerReducer(reducer, defaultState, initAction);

  const change = () => {
    dispatch({
      type: "UPDATE_NAME",
      payload: "啊啊啊",
    });
  };

  return (
    <>
      <button onClick={change}>修改用户名</button>
      {state.name}-{state.age}
      <div>
        <Son1 {...state} dispatch={dispatch} />
        <Son2 {...state} />
      </div>
    </>
  );
};
```

3. 修改 reducer，我们就可以直接通过修改 preState 的属性来完成 state 值的更新，非常的银杏

```tsx
const reducer = (preState: UserType, action: ActionType) => {
  switch (action.type) {
    case "UPDATE_NAME":
      preState.name = action.payload;
      break;
    case "INCREMENT_AGE":
      preState.age = action.payload;
      break;
    default:
      return preState;
  }
};
```

## useContext

使用步骤：

1. 在全局创建 Context 对象
2. 在父组件中使用 Context.provider
3. 在子组件中使用 useContext 使用数据

```tsx
import React, { createContext, useContext, useState } from "react";

type IContext = {
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
};

const MyContext = createContext<IContext>({} as IContext);

const Father: React.FC = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      father === {count}
      <div>-----------------</div>
      <MyContext.Provider value={{ count, setCount }}>
        <Child />
      </MyContext.Provider>
    </div>
  );
};

const Child: React.FC = () => {
  return (
    <div>
      Child
      <div>-----------------</div>
      <Son />
    </div>
  );
};

const Son: React.FC = () => {
  const { count, setCount } = useContext(MyContext);
  return (
    <div>
      Son <button onClick={() => setCount(count + 1)}>修改</button>
      <div>{count}</div>
    </div>
  );
};

export default Father;
```

## 以非侵入的方式使用 Context

为了保证父组件中代码的单一性，也为了提高 Provider 的通用性，我们可以将 Context.Provider 封装到独立的 Wrapper 函数式组件中

> ✨ 注意：
> props 的 children 在 ts 中 需要添加类型 `React.PropsWithChildren`

```tsx
import React, { createContext, useContext, useState } from "react";

interface IContext {
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
}

const AppContext = createContext<IContext>({} as IContext);

const AppWrapper: React.FC<React.PropsWithChildren> = (props) => {
  const [count, setCount] = useState(0);

  return (
    <AppContext.Provider value={{ count, setCount }}>
      {props.children}
    </AppContext.Provider>
  );
};

const Father: React.FC = () => {
  return (
    <>
      <AppWrapper>
        <Child />
      </AppWrapper>
    </>
  );
};

const Child: React.FC = () => {
  const { count } = useContext(AppContext);
  return (
    <>
      count ----{count}
      <Son />
    </>
  );
};

const Son: React.FC = () => {
  const { count, setCount } = useContext(AppContext);

  const add = () => {
    setCount(count + 1);
  };
  return (
    <>
      <div>count: {count}</div>
      <button onClick={add}>+1</button>
    </>
  );
};

export default Father;
```

## 使用 useContext 重构 useReducer 案例

使用 useContext 将 useReducer 返回的 state 和 dispatch 进行共享

```tsx
import React, { createContext, useContext, useReducer } from "react";

interface IState {
  name: string;
  age: number;
  count: number;
}

interface IActionType {
  type: "CHANGE_NAME";
  payload: string;
}

const defaultState: IState = {
  name: "xiaoming",
  age: 12,
  count: 0,
};

const reducer = (preState: IState, action: IActionType) => {
  switch (action.type) {
    case "CHANGE_NAME":
      return {
        ...preState,
        name: action.payload,
      };
      break;

    default:
      return preState;
      break;
  }
};

interface IContext {
  state: IState;
  dispatch: React.Dispatch<IActionType>;
}

const MyContext = createContext({} as IContext);

const AppWrapper: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, defaultState);

  return (
    <MyContext.Provider value={{ state, dispatch }}>
      <Father />
    </MyContext.Provider>
  );
};

const Father: React.FC = () => {
  const { state } = useContext(MyContext);

  return (
    <div>
      Father {state.name}
      <Son1 />
      <Son2 />
    </div>
  );
};

const Son1 = () => {
  return <div>Son1</div>;
};

const Son2 = () => {
  return (
    <div>
      Son2
      <GrandSon />
    </div>
  );
};

const GrandSon = () => {
  const { dispatch } = useContext(MyContext);

  const changeName = () => {
    dispatch({
      type: "CHANGE_NAME",
      payload: "niu",
    });
  };
  return <div onClick={changeName}>GrandSon</div>;
};

export default AppWrapper;
```
