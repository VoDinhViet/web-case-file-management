# 📊 Refresh Token Logs - Quick Reference

## 🎯 Xem logs ở đâu?

Mở **Terminal** (nơi chạy `npm run dev` hoặc `pnpm dev`) để xem logs của middleware.

---

## 📝 Các loại logs

### ✅ Request thông thường

```
[Middleware] Request: {
  path: "/dashboard",
  hasAccessToken: true,
  hasRefreshToken: true,
  hasTokenExpiry: true,
  isAuthenticated: true
}
```

**Ý nghĩa**: Request vào route protected, có đầy đủ tokens

---

### 🔍 Token check - Không cần refresh

```
[Token Check] {
  path: "/dashboard",
  hasRefreshToken: true,
  hasTokenExpiry: true,
  minutesRemaining: 25,
  needsRefresh: false
}
```

**Ý nghĩa**: Token còn 25 phút → Không cần refresh (> 5 phút)

---

### ⚡ Token check - Cần refresh

```
[Token Check] {
  path: "/cases",
  hasRefreshToken: true,
  hasTokenExpiry: true,
  minutesRemaining: 3,
  needsRefresh: true
}
```

**Ý nghĩa**: Token còn 3 phút → Sẽ tự động refresh

---

### ♻️ Refresh thành công

```
[Token Refresh] Attempting to refresh token...

[API Call] Calling refresh token endpoint: {
  url: "http://localhost:3001/api/v1/auth/refresh",
  hasRefreshToken: true
}

[API Response] Refresh token response: {
  status: 200,
  ok: true
}

[API Response] Refresh successful: {
  hasAccessToken: true,
  hasRefreshToken: true,
  tokenExpires: 1734566400000  // Timestamp in milliseconds (Date.now() + duration)
}

[Token Refresh] ✅ Token refreshed successfully
```

**Ý nghĩa**: 
- Token được refresh thành công
- `tokenExpires` là timestamp (ms), VD: `1734566400000`
- Frontend tự động convert sang seconds cho cookie maxAge
- User tiếp tục sử dụng app không bị gián đoạn

---

### ❌ Refresh thất bại

```
[Token Refresh] Attempting to refresh token...

[API Response] Refresh token response: {
  status: 401,
  ok: false
}

[API Response] Refresh failed: { message: "Invalid refresh token" }

[Token Refresh] ❌ Refresh failed - redirecting to login
```

**Ý nghĩa**: Refresh token không hợp lệ/hết hạn → Redirect về login

---

### ⚠️ Warning - Thiếu refresh token

```
[Middleware] Request: {
  path: "/profile",
  hasAccessToken: true,
  hasRefreshToken: false,
  hasTokenExpiry: false,
  isAuthenticated: true
}

[Token Check] ⚠️ No refresh token found for path: /profile
```

**Ý nghĩa**: Có access token nhưng thiếu refresh token → Có thể do login cũ

---

### ⚠️ Warning - Thiếu token expiry

```
[Token Check] ⚠️ No token expiry found for path: /settings
```

**Ý nghĩa**: Thiếu thông tin expiry → Không thể tự động refresh

---

## 🔧 Troubleshooting

### Vấn đề: Không thấy logs refresh token

**Nguyên nhân**:
- Token còn > 5 phút → Chưa cần refresh
- Đang ở public route (login, register)

**Giải pháp**:
1. Check cookie `token_expiry` trong DevTools
2. Đợi hoặc set expiry thủ công để test

---

### Vấn đề: Refresh liên tục

**Logs sẽ như này**:
```
[Token Refresh] Attempting to refresh token...
[Token Refresh] ✅ Token refreshed successfully
[Token Check] minutesRemaining: 4, needsRefresh: true
[Token Refresh] Attempting to refresh token...
```

**Nguyên nhân**:
- Backend trả về `tokenExpires` quá ngắn (< 5 phút)
- Cookie không được set đúng

**Giải pháp**:
1. Check backend response có đúng format không
2. Check cookie có được set sau refresh không

---

### Vấn đề: Token hết hạn ngay lập tức

**Logs**:
```
[Token Check] minutesRemaining: -15, needsRefresh: true
[Token Refresh] ❌ Refresh failed - redirecting to login
```

**Nguyên nhân**:
- `token_expiry` cookie bị sai
- Server time không sync với client time

**Giải pháp**:
1. Clear cookies và login lại
2. Check system time
3. Check backend có trả đúng `tokenExpires` (số giây)

---

## 🧪 Cách test refresh token

### Test 1: Token sắp hết hạn

```javascript
// Trong browser console:
document.cookie = "token_expiry=" + (Date.now() + 4 * 60 * 1000);
// Refresh page → Sẽ thấy log refresh token
```

### Test 2: Token đã hết hạn

```javascript
// Trong browser console:
document.cookie = "token_expiry=" + (Date.now() - 1000);
// Refresh page → Sẽ redirect về login
```

### Test 3: Không có refresh token

```javascript
// Trong browser console:
document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
// Refresh page → Sẽ thấy warning log
```

---

## 📈 Luồng logs thông thường

### Scenario 1: User vừa login
```
1. [Middleware] Request → hasAccessToken: true, hasRefreshToken: true
2. [Token Check] minutesRemaining: 58, needsRefresh: false
3. → Continue bình thường
```

### Scenario 2: Token còn 3 phút
```
1. [Middleware] Request → hasAccessToken: true, hasRefreshToken: true
2. [Token Check] minutesRemaining: 3, needsRefresh: true
3. [Token Refresh] Attempting to refresh token...
4. [API Response] Refresh successful
5. [Token Refresh] ✅ Token refreshed successfully
6. → Continue với token mới
```

### Scenario 3: Refresh token hết hạn
```
1. [Middleware] Request → hasAccessToken: true, hasRefreshToken: true
2. [Token Check] minutesRemaining: 2, needsRefresh: true
3. [Token Refresh] Attempting to refresh token...
4. [API Response] status: 401, ok: false
5. [Token Refresh] ❌ Refresh failed - redirecting to login
6. → Redirect /login?sessionExpired=true
```

---

## 🎓 Tips

- Logs hiển thị trong **terminal**, không phải browser console
- Middleware chạy trước mỗi request đến protected routes
- Refresh tự động khi còn < 5 phút
- Mỗi log có prefix `[Middleware]`, `[Token Check]`, `[Token Refresh]`, `[API Call]`, `[API Response]` để dễ filter
- Sử dụng `grep` để filter logs nếu cần:
  ```bash
  # Filter chỉ xem refresh logs
  npm run dev | grep "Token Refresh"
  
  # Filter chỉ xem API calls
  npm run dev | grep "API"
  ```

---

## 📌 Log Colors (nếu terminal hỗ trợ)

- ✅ **Green checkmark**: Success
- ❌ **Red X**: Error/Failed
- ⚠️ **Yellow warning**: Warning/Missing data
- 🔍 **Magnifying glass**: Debug info

