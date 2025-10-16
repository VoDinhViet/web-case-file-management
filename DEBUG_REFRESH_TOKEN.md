# 🐛 Debug Refresh Token bị văng

## 🔍 Các bước debug

### 1. Xem logs trong terminal

Chạy dev server và xem logs:
```bash
npm run dev
# hoặc
pnpm dev
```

### 2. Login và quan sát logs

Sau khi login, bạn sẽ thấy:
```
[Middleware] Request: {
  path: "/dashboard",
  hasAccessToken: true,
  hasRefreshToken: true,
  hasTokenExpiry: true,
  isAuthenticated: true
}

[Token Check] {
  path: "/dashboard",
  hasRefreshToken: true,
  hasTokenExpiry: true,
  minutesRemaining: 15,
  needsRefresh: false
}
```

### 3. Đợi đến khi cần refresh (< 5 phút)

Hoặc test nhanh bằng cách set cookie thủ công:
```javascript
// Trong browser console:
document.cookie = "token_expiry=" + (Date.now() + 4 * 60 * 1000);
// Refresh page
```

### 4. Xem logs khi refresh

#### ✅ Nếu refresh thành công:
```
[Token Refresh] Attempting to refresh token...

[API Call] Calling refresh token endpoint: {
  url: "http://localhost:3001/api/v1/auth/refresh",
  hasRefreshToken: true,
  refreshTokenLength: 245
}

[API Response] Refresh token response: {
  status: 200,
  ok: true
}

[API Response] Refresh successful: {
  hasAccessToken: true,
  hasRefreshToken: true,
  tokenExpires: 1734566400000,
  now: 1734565500000,
  expiresInMs: 900000,
  minutesUntilExpiry: 15,
  isValid: true  ← Phải là true!
}

[Token Refresh] ✅ Token refreshed successfully

[Cookie Update] Setting new cookies: {
  newExpiryTime: 1734566400000,
  now: 1734565500000,
  maxAgeSeconds: 900,
  maxAgeMinutes: 15
}
```

#### ❌ Nếu refresh thất bại:
```
[Token Refresh] Attempting to refresh token...

[API Response] Refresh token response: {
  status: 401,
  ok: false
}

[API Response] Refresh failed: { message: "..." }

[Token Refresh] ❌ Refresh failed - redirecting to login
```

---

## 🚨 Các vấn đề thường gặp

### Vấn đề 1: `isValid: false`

**Log:**
```
[API Response] Refresh successful: {
  tokenExpires: 900,  ← Sai! Phải là timestamp lớn
  now: 1734565500000,
  expiresInMs: -1734565499100,  ← Số âm!
  isValid: false  ← Token đã hết hạn
}
```

**Nguyên nhân**: Backend trả về `tokenExpires` là seconds thay vì timestamp

**Giải pháp**: Sửa backend:
```typescript
// ❌ SAI
return { tokenExpires: 900 }

// ✅ ĐÚNG
return { tokenExpires: Date.now() + ms(tokenExpiresIn) }
```

---

### Vấn đề 2: `status: 401` khi refresh

**Log:**
```
[API Response] Refresh token response: {
  status: 401,
  ok: false
}
```

**Nguyên nhân**: 
- Refresh token không hợp lệ
- Refresh token đã hết hạn
- Backend không nhận được refresh token đúng

**Debug**:
1. Check refresh token trong cookies (DevTools → Application → Cookies)
2. Check backend có nhận được refresh token không
3. Check format request body: `{ refreshToken: "..." }`

---

### Vấn đề 3: maxAge âm hoặc quá lớn

**Log:**
```
[Cookie Update] Setting new cookies: {
  maxAgeSeconds: -100,  ← Âm!
  maxAgeMinutes: -1
}
```

**Nguyên nhân**: `tokenExpires` < `Date.now()`

**Giải pháp**: Backend phải trả về timestamp trong tương lai

---

### Vấn đề 4: Refresh token không được gửi

**Log:**
```
[Token Check] ⚠️ No refresh token found for path: /dashboard
```

**Nguyên nhân**:
- Cookie `refresh_token` không tồn tại
- Cookie bị xóa
- Cookie không được set khi login

**Debug**:
1. Check DevTools → Application → Cookies
2. Xem có `refresh_token` không
3. Check khi login có set cookie `refresh_token` không

---

### Vấn đề 5: Token expiry không được check

**Log:**
```
[Token Check] ⚠️ No token expiry found for path: /profile
```

**Nguyên nhân**:
- Cookie `token_expiry` không tồn tại
- Không được set khi login

**Debug**: Check khi login có set `token_expiry` không

---

## 🔧 Manual Testing

### Test 1: Force refresh ngay lập tức
```javascript
// Browser console:
document.cookie = "token_expiry=" + (Date.now() + 1000); // 1 second
location.reload();
```

### Test 2: Check cookie values
```javascript
// Browser console:
document.cookie.split(';').forEach(c => console.log(c.trim()));
```

### Test 3: Check token expiry
```javascript
// Browser console:
const tokenExpiry = document.cookie
  .split('; ')
  .find(row => row.startsWith('token_expiry='))
  ?.split('=')[1];

const expiry = parseInt(tokenExpiry);
const now = Date.now();
const remaining = expiry - now;
const minutes = Math.floor(remaining / 1000 / 60);

console.log({
  expiry,
  now,
  remaining,
  minutes,
  needsRefresh: remaining < 5 * 60 * 1000
});
```

---

## 📊 Checklist khi debug

- [ ] Terminal logs có hiển thị không?
- [ ] `[Middleware] Request` có hiện không?
- [ ] `hasAccessToken` và `hasRefreshToken` có `true` không?
- [ ] `minutesRemaining` có giá trị hợp lý không? (0-60)
- [ ] Khi `needsRefresh: true`, có gọi API refresh không?
- [ ] API refresh trả về status 200 không?
- [ ] `tokenExpires` là timestamp (> 1700000000000) không?
- [ ] `isValid: true` không?
- [ ] `maxAgeSeconds` > 0 không?
- [ ] Cookies được set trong browser không? (Check DevTools)

---

## 🎯 Backend Requirements

Backend PHẢI:

1. **Endpoint `/api/v1/auth/refresh`**
   - Method: POST
   - Body: `{ refreshToken: string }`
   - Response 200: `{ accessToken, refreshToken, tokenExpires }`

2. **`tokenExpires` phải là timestamp (milliseconds)**
   ```typescript
   const tokenExpires = Date.now() + ms(tokenExpiresIn);
   // VD: 1734566400000 (NOT 900!)
   ```

3. **Validate refresh token**
   - Check token có hợp lệ không
   - Check token chưa hết hạn
   - Return 401 nếu invalid

---

## 💡 Tips

### Xem raw logs
```bash
npm run dev 2>&1 | tee logs.txt
# Logs sẽ được lưu vào logs.txt
```

### Filter logs
```bash
npm run dev | grep "Token Refresh"
npm run dev | grep "API Response"
```

### Test với curl
```bash
curl -X POST http://localhost:3001/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"YOUR_REFRESH_TOKEN_HERE"}'
```

---

## 📞 Cần trợ giúp?

Nếu vẫn bị văng, hãy copy và gửi:

1. **Terminal logs** từ khi login đến khi bị văng
2. **Cookies** trong DevTools (Application → Cookies)
3. **Network tab** request đến `/api/v1/auth/refresh`
4. **Backend logs** (nếu có)

---

## 🎓 Expected Flow

### Login thành công
```
1. User login
2. Backend trả về: { accessToken, refreshToken, tokenExpires: 1734566400000 }
3. Frontend set cookies:
   - access_token (maxAge: 900s)
   - refresh_token (maxAge: 7 days)
   - token_expiry ("1734566400000")
4. User dùng app bình thường
```

### Token sắp hết hạn (< 5 phút)
```
5. User navigate to page
6. Middleware check: minutesRemaining = 3
7. Middleware gọi /api/v1/auth/refresh
8. Backend trả về tokens mới với tokenExpires mới
9. Middleware set cookies mới
10. User tiếp tục dùng app (không bị văng)
```

### Refresh thất bại
```
5. User navigate to page
6. Middleware check: minutesRemaining = 3
7. Middleware gọi /api/v1/auth/refresh
8. Backend trả về 401 (refresh token hết hạn)
9. Middleware clear cookies
10. Middleware redirect to /login?sessionExpired=true
```

