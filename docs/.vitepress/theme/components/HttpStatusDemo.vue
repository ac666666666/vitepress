<script setup>
import { ref } from "vue";

const selectedStatus = ref("200");
const requestUrl = ref("/api/user/1");
const responseBody = ref("");
const loading = ref(false);

const statusCodes = {
  200: { text: "OK", desc: "请求成功", body: '{ "id": 1, "name": "Admin" }' },
  301: {
    text: "Moved Permanently",
    desc: "永久重定向 (资源已迁移)",
    body: "<html><body>Moved Permanently</body></html>",
  },
  302: {
    text: "Found",
    desc: "临时重定向 (临时跳转)",
    body: "<html><body>Found</body></html>",
  },
  304: { text: "Not Modified", desc: "协商缓存命中 (使用本地缓存)", body: "" },
  400: {
    text: "Bad Request",
    desc: "请求参数错误",
    body: '{ "error": "Invalid ID format" }',
  },
  401: {
    text: "Unauthorized",
    desc: "未登录/Token失效",
    body: '{ "error": "Token missing" }',
  },
  403: {
    text: "Forbidden",
    desc: "无权限访问",
    body: '{ "error": "Access denied" }',
  },
  404: {
    text: "Not Found",
    desc: "资源不存在",
    body: '{ "error": "User not found" }',
  },
  500: {
    text: "Internal Server Error",
    desc: "服务器内部错误",
    body: '{ "error": "Database connection failed" }',
  },
  502: {
    text: "Bad Gateway",
    desc: "网关错误 (上游服务无响应)",
    body: "<html><body>502 Bad Gateway</body></html>",
  },
};

const sendRequest = () => {
  loading.value = true;
  responseBody.value = "";
  setTimeout(() => {
    loading.value = false;
    responseBody.value = statusCodes[selectedStatus.value].body;
  }, 600);
};
</script>

<template>
  <div class="demo-container">
    <h3>HTTP 状态码模拟器</h3>

    <div class="controls">
      <div class="control-group">
        <label>请求地址:</label>
        <input v-model="requestUrl" disabled class="url-input" />
      </div>

      <div class="control-group">
        <label>模拟服务端响应:</label>
        <select v-model="selectedStatus">
          <option v-for="(info, code) in statusCodes" :key="code" :value="code">
            {{ code }} - {{ info.text }}
          </option>
        </select>
      </div>

      <button @click="sendRequest" :disabled="loading">
        {{ loading ? "请求中..." : "发送请求" }}
      </button>
    </div>

    <div class="response-panel" v-if="responseBody || loading">
      <div class="status-line" :class="'status-' + selectedStatus[0]">
        <span class="code">{{ selectedStatus }}</span>
        <span class="text">{{ statusCodes[selectedStatus].text }}</span>
      </div>
      <div class="desc">{{ statusCodes[selectedStatus].desc }}</div>
      <pre class="body" v-if="responseBody">{{ responseBody }}</pre>
      <div class="body empty" v-else-if="!loading && !responseBody">
        (Empty Response Body)
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  background: #f9f9f9;
}
.controls {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}
.control-group {
  display: flex;
  align-items: center;
  gap: 10px;
}
.url-input {
  flex: 1;
  padding: 5px;
  background: #eee;
  border: 1px solid #ccc;
}
select {
  padding: 5px;
  flex: 1;
}
button {
  padding: 8px 16px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:disabled {
  background: #aaa;
  cursor: not-allowed;
}
.response-panel {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 15px;
  border-radius: 6px;
  font-family: monospace;
}
.status-line {
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 5px;
}
.status-2 {
  color: #4caf50;
} /* 2xx Success */
.status-3 {
  color: #2196f3;
} /* 3xx Redirection */
.status-4 {
  color: #ff9800;
} /* 4xx Client Error */
.status-5 {
  color: #f44336;
} /* 5xx Server Error */

.desc {
  color: #aaa;
  margin-bottom: 10px;
  font-size: 0.9em;
}
.body {
  background: #2d2d2d;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  margin: 0;
}
.empty {
  color: #666;
  font-style: italic;
}
</style>
