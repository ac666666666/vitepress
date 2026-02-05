# 计算机网络

## 1. HTTP/HTTPS
- **HTTP 1.1**: 长连接 (Keep-Alive), 管道化。
- **HTTP 2.0**: 多路复用 (Multiplexing), 头部压缩 (HPACK), 服务端推送。
- **HTTP 3.0**: 基于 UDP (QUIC)，解决 TCP 队头阻塞。
- **HTTPS**: HTTP + SSL/TLS，非对称加密交换密钥，对称加密传输数据。

## 2. TCP 三次握手与四次挥手
- **三次握手**: 确认双方收发能力正常，同步序列号。
- **四次挥手**: 确保数据传输完毕，双方释放资源。

## 3. 从输入 URL 到页面展示
1. DNS 解析
2. TCP 连接
3. 发送 HTTP 请求
4. 服务器处理并返回
5. 浏览器解析渲染 (HTML -> DOM, CSS -> CSSOM -> Render Tree -> Layout -> Paint)
