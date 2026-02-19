# TCP/IP 协议详解

[MDN HTTP 文档](https://developer.mozilla.org/zh-CN/docs/Web/HTTP)

## 1. 网络分层模型

### 1.1 OSI 七层模型 vs TCP/IP 四层模型

| OSI 七层模型 | TCP/IP 四层模型 | 作用 | 协议举例 |
| :--- | :--- | :--- | :--- |
| **应用层 (Application)** | **应用层** | 为用户提供服务 | HTTP, DNS, SMTP, FTP |
| **表示层 (Presentation)** | ^ | 数据格式化、加密、压缩 | SSL/TLS, JPEG |
| **会话层 (Session)** | ^ | 建立、管理会话 | RPC |
| **传输层 (Transport)** | **传输层** | 端到端的数据传输 | **TCP**, **UDP** |
| **网络层 (Network)** | **网络层** | 寻址和路由 | **IP**, ICMP, ARP |
| **数据链路层 (Data Link)** | **网络接口层** | 帧传输，MAC 寻址 | Ethernet, Wi-Fi |
| **物理层 (Physical)** | ^ | 比特流传输 | 光纤, 双绞线 |

---

## 2. TCP 三次握手 (Three-Way Handshake)

建立连接的过程，确认双方收发能力正常，同步序列号。

<TcpHandshakeDemo />

### 2.1 握手步骤详解

| 步骤 | 发送方 | 接收方 | 状态变化 | 报文内容 | 目的 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **第一次** | Client | Server | Client: SYN_SENT<br>Server: LISTEN | SYN=1, seq=x | 客户端请求建立连接 |
| **第二次** | Server | Client | Server: SYN_RCVD<br>Client: SYN_SENT | SYN=1, ACK=1, seq=y, ack=x+1 | 服务端同意连接，确认收到 SYN |
| **第三次** | Client | Server | Client: ESTABLISHED<br>Server: ESTABLISHED | ACK=1, seq=x+1, ack=y+1 | 客户端确认收到响应，连接建立 |

### 2.2 为什么需要三次握手？

- **防止旧的重复连接初始化**: 如果网络延迟导致旧的 SYN 包在连接释放后到达服务端，服务端回应 SYN+ACK，客户端收到后发现是旧请求（通过 seq 校验），发送 RST 中止连接。如果是两次握手，服务端在收到旧 SYN 后就建立了连接，浪费资源。
- **同步序列号**: 双方需要确认对方的初始序列号 (ISN) 才能保证后续传输的有序性。

---

## 3. TCP 四次挥手 (Four-Way Wavehand)

断开连接的过程，确保数据传输完毕，双方释放资源。

### 3.1 挥手步骤详解

| 步骤 | 发送方 | 接收方 | 状态变化 | 报文内容 | 目的 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **第一次** | Client | Server | Client: FIN_WAIT_1 | FIN=1, seq=u | 客户端请求断开连接 |
| **第二次** | Server | Client | Server: CLOSE_WAIT<br>Client: FIN_WAIT_2 | ACK=1, ack=u+1 | 服务端确认收到 FIN，但可能还有数据要发 |
| **第三次** | Server | Client | Server: LAST_ACK | FIN=1, seq=v | 服务端数据发送完毕，请求断开 |
| **第四次** | Client | Server | Client: TIME_WAIT<br>Server: CLOSED | ACK=1, ack=v+1 | 客户端确认，等待 2MSL 后彻底关闭 |

### 3.2 为什么需要四次挥手？

- TCP 是全双工的。客户端发送 FIN 只是表示它没有数据要发了，但仍可接收数据。服务端收到 FIN 后，可能还有未发送完的数据，所以先回一个 ACK 确认，等数据发完了再发 FIN。

### 3.3 为什么 TIME_WAIT 需要等待 2MSL？

- **确保最后一个 ACK 能到达服务端**: 如果 ACK 丢失，服务端会重传 FIN。客户端在 2MSL 内收到重传的 FIN，会再次发送 ACK 并重置计时器。
- **防止旧连接的数据包混入新连接**: 2MSL (Maximum Segment Lifetime) 足够让网络中残留的旧数据包失效。

---

## 4. TCP vs UDP

| 特性 | TCP (Transmission Control Protocol) | UDP (User Datagram Protocol) |
| :--- | :--- | :--- |
| **连接性** | 面向连接 (三次握手) | 无连接 (直接发包) |
| **可靠性** | 可靠 (重传、排序、校验) | 不可靠 (丢包不负责) |
| **有序性** | 保证顺序 | 不保证顺序 |
| **速度** | 较慢 (头部开销大 20字节) | 快 (头部开销小 8字节) |
| **应用场景** | 网页 (HTTP), 文件传输 (FTP), 邮件 (SMTP) | 视频会议, 直播, DNS, 在线游戏 |

---

## 5. TCP 流量控制与拥塞控制

### 5.1 流量控制 (Flow Control)

- **滑动窗口 (Sliding Window)**: 接收方通过 TCP Header 中的 Window 字段告诉发送方自己的缓冲区大小，发送方据此控制发送速率，防止接收方处理不过来。

### 5.2 拥塞控制 (Congestion Control)

- **慢启动 (Slow Start)**: 连接刚建立时，拥塞窗口 (cwnd) 指数级增长。
- **拥塞避免 (Congestion Avoidance)**: 当 cwnd 达到阈值 (ssthresh) 后，线性增长。
- **快重传 (Fast Retransmit)**: 收到 3 个重复 ACK 时，立即重传丢失的包，不必等待超时。
- **快恢复 (Fast Recovery)**: 发生快重传后，ssthresh 减半，cwnd 设置为 ssthresh，直接进入拥塞避免。
