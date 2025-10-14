# API Client - Hướng dẫn sử dụng

## 🚀 Quick Start

### Import
```typescript
import { api, internalApi, getApi } from "@/lib/api";
```

### 3 Cách sử dụng

#### 1. External API (Backend) - Dùng `api`
```typescript
// GET
const users = await api.get<User[]>("/users");

// POST
const user = await api.post<User>("/users", { name: "John" });

// PUT
await api.put("/users/123", userData);

// PATCH
await api.patch("/users/123", { status: "active" });

// DELETE
await api.delete("/users/123");
```

#### 2. Internal API (Next.js Routes) - Dùng `internalApi`
```typescript
const stats = await internalApi.get("/api/dashboard/stats");
```

#### 3. Helper Function - Dùng `getApi()`
```typescript
const external = getApi(false);  // Backend API
const internal = getApi(true);   // Next.js API
```

---

## 📝 Ví dụ thực tế

### Server Actions (`actions/`)
```typescript
import { api } from "@/lib/api";

// GET với query params
export async function getCaseStats(userId?: string) {
  const query = userId ? `?userId=${userId}` : "";
  return await api.get<Stats>(`/reports/cases${query}`);
}

// POST
export async function createCase(data: CaseData) {
  return await api.post<Case>("/cases", data);
}

// PATCH
export async function updateStatus(id: string, status: string) {
  return await api.patch<Case>(`/cases/${id}`, { status });
}
```

### Components
```typescript
import { internalApi } from "@/lib/api";

async function fetchData() {
  const data = await internalApi.get("/api/users");
}
```

---

## ⚙️ Advanced

### Custom Headers
```typescript
await api.get("/data", {
  headers: {
    "Authorization": "Bearer token",
    "X-Custom": "value"
  }
});
```

### Cache Control (Next.js)
```typescript
await api.get("/data", {
  cache: "force-cache",
  next: { revalidate: 3600 }
});
```

### Dynamic Base URL
```typescript
// Thay đổi base URL
api.setBaseUrl("https://new-api.com");

// Lấy base URL
console.log(api.getBaseUrl());

// Tạo instance mới
import { ApiClient } from "@/lib/api";
const customApi = new ApiClient("https://custom.com");
```

---

## ✅ URL Tự động xử lý

```typescript
api.get("/users")      // ✅ https://api.com/users
api.get("users")       // ✅ https://api.com/users  
api.get("/api/users")  // ✅ https://api.com/api/users
```

---

## 🔧 Error Handling

```typescript
try {
  const data = await api.get<User[]>("/users");
} catch (error: any) {
  console.error(error.message); // "HTTP error! status: 404"
  console.error(error.status);  // 404
}
```

---

## 📌 Best Practices

✅ **DO**
```typescript
// External API - dùng api
await api.get("/reports/cases");

// Internal API - dùng internalApi  
await internalApi.get("/api/dashboard");

// Type-safe
await api.get<User[]>("/users");
```

❌ **DON'T**
```typescript
// Đừng dùng api cho Next.js routes
await api.get("/api/dashboard"); // ❌

// Đừng quên type
await api.get("/users"); // ❌ không type-safe
```

