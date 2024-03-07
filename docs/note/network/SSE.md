---
category: network
cover: https://cdn.pixabay.com/photo/2023/04/13/09/56/alps-7922246_640.jpg
---

# SSE

SSE（Server-Sent Events）是一种用于实现服务器主动向客户端推送数据的技术，也被称为“事件流”（Event Stream）。它基于 HTTP 协议，利用了其长连接特性，在客户端与服务器之间建立一条持久化连接，并通过这条连接实现服务器向客户端的实时数据推送。

SSE 是 WebSocket 的一种轻量代替方案，一般来说 HTTP 是没有办法做到服务器推送的，当服务端向客户端声明接下来要下发的内容的时候，客户端就会保持连接打开，SSE 就是利用这种原理，过程基本如下：

- 客户端向服务器发送一个 GET 请求，带有指定的 header，表示可以接收事件流类型，并禁用任何的事件缓存。
- 服务器返回一个响应，带有指定的 header，表示事件的媒体类型和编码，以及使用分块传输编码（chunked）来流式传输动态生成的内容。
- 服务器在有数据更新时，向客户端发送一个或多个名称：值字段组成的事件，由单个换行符分隔。事件之间由两个换行符分隔。服务器可以发送事件数据、事件类型、事件 ID 和重试时间等字段。
- 客户端使用 EventSource 接口来创建一个对象，打开连接，并订阅 onopen、onmessage 和 onerror 等事件处理程序来处理连接状态和接收消息。
- 客户端可以使用 GET 查询参数来传递数据给服务器，也可以使用 close 方法来关闭连接。

在请求头和响应头设置 `Content-Type: text/event-stream` 是实现 SSE 的关键。

## SSE 与 Socket 的区别

两者都可以实现服务端向客户端发送数据

1. 实现方式

SSE 基于 HTTP 协议，利用长连接特性通过浏览器发送一个 HTTP 请求，建立持久化连接，WebSocket 是通过特殊的升级协议（HTTP/1.1 Upgrade 或者 HTTP/2）建立新的 TCP 连接，与传统 HTTP 连接不同

1. 通道方向性：WebSocket 是全双工通道，支持双向通信，即客户端和服务器都可以相互发送和接收数据。相比之下，SSE 是单向通道，只允许服务器向浏览器端发送数据，客户端无法主动向服务器发送数据。
2. 协议特性：WebSocket 是一个新的通信协议，需要服务器端进行支持。而 SSE 则是基于 HTTP 协议实现的，利用了 HTTP 的长连接特性，在现有的服务器软件上都可以得到支持。此外，SSE 是一个轻量级的协议，相对简单，而 WebSocket 是通过特殊的升级协议（HTTP/1.1 Upgrade 或者 HTTP/2）建立新的 TCP 连接，与传统 HTTP 连接不同，相对复杂。
3. 数据传输：SSE 一般只用来传送文本数据，如果要传输二进制数据，需要进行编码后再传送。而 WebSocket 则默认支持传送二进制数据，支持的数据类型广泛
4. 断线重连：SSE 默认支持断线重连，当连接断开时，它可以自动确定何时重新连接，连接状态是由浏览器维护，客户端无法手动关闭或者重新打开连接。而 WebSocket 则需要开发者自行实现断线重连的逻辑。
5. 数据类型与 CORS：SSE 支持自定义发送的数据类型。然而，它不支持 CORS（跨源资源共享），这意味着 SSE 的 url（服务器网址）必须与当前网页的网址在同一个网域（domain），且协议和端口都必须相同。
6. 安全性：SSE 基于 HTTP 协议，风险相对较低，WebSocket 则需要通过额外的安全措施（SSL/TLS 加密）来确保数据传输的安全性，避免被窃听一级篡改

## 前端实现

在前端实现 SSE（Server-Sent Events）请求主要涉及到创建一个新的 `EventSource` 对象，并指定服务器提供的 SSE 端点 URL。一旦连接建立，浏览器会自动处理与服务器的连接，并在接收到新的事件时触发相应的事件处理函数。

> `EventSource` 对象是 HTML5 新增的一个客户端 API，用于通过服务器推送实时更新的数据和通知。

### EventSource API 介绍

1. `EventSource` 构造函数：

```js
const eventSource = new EventSource(url, options);
```

- `url`: 与服务器建立连接的 URL
- `options`: （可选参数）
  - `withCredentials`: Boolean，是否允许发送 Cookie 和 HTTP 认证信息，默认 false
  - `headers`: Object，表示要发送的信息头信息
  - `retryInterval`: Number，表示与服务器失去连接后，重新连接的时间间隔，默认 1000 毫秒

2. `EventSource.readyState` 属性:

`readyState`表示当前`EventSource`状态，该状态只读，不能设置，分别有以下几种状态：

- `CONNECTING`：表示正在和服务器建立连接。
- `OPEN`：表示已经建立连接，正在接收服务器发送的数据。
- `CLOSED`：表示连接已经被关闭，无法再接收服务器发送的数据。

### EventSource API 使用

```js
const eventSource = new EventSource("/api/sse-point");

// 监听open事件，当连接成功建立时触发
eventSource.onopen = (event) => {
  console.log("Connection to server opened.;");
};

// 监听message事件，当接收到服务器发送的数据时触发
eventSource.onmessage = (event) => {
  // event.data包含服务器发送的数据
  console.log("Received data:", event.data);
};

// 监听error事件，当连接发生错误时触发
eventSource.onerror = (error) => {
  // 当eventSource当前状态为关闭
  if (eventSource.readyState === EventSource.CLOSED) {
    // 连接已关闭，可能是正常关闭或由于错误而关闭
    console.log("Connection closed.");
  } else {
    // 连接过程中发生错误
    console.error("EventSource failed:", error);
  }
};

// 当不再需要SSE连接时，关闭它
eventSource.close();
```

### Node.js 作为后端处理 SSE

```js
import express from "express";

const app = express();

app.get("/api/sse-point", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream", // 核心返回数据流
    Connection: "close",
  });

  const data = fs.readFileSync("./index.txt", "utf8");
  const total = data.length;
  let current = 0;
  // mock SSE 数据
  let time = setInterval(() => {
    console.log(current, total);
    if (current >= total) {
      console.log("end");
      clearInterval(time);
      return;
    }
    //返回自定义事件名
    res.write(`event:lol\n`) / 返回数据;
    res.write(`data:${data.split("")[current]}\n\n`);
    current++;
  }, 300);
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
```
