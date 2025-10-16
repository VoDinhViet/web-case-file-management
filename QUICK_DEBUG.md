# 🚨 Quick Debug - Bị văng khi chuyển trang

## 📍 Bước 1: Xem logs ngay lập tức

Khi bạn login và chuyển trang, xem terminal:

### ✅ Log bình thường (Không bị văng):
```
[Middleware] Request: {
  path: "/dashboard",
  hasAccessToken: true,
  hasRefreshToken: true,
  hasTokenExpiry: true,
  isAuthenticated: true,
  accessTokenLength: 245,
  cookies: {
    accessToken: "eyJhbGciOiJIUzI1NiIs...",
    refreshToken: "eyJhbGciOiJIUzI1NiIs...",
    tokenExpiry: "1734566400000"
  }
}
```

### ❌ Log khi bị văng:
```
[Middleware] Request: {
  path: "/cases",
  hasAccessToken: false,  ← FALSE!
  hasRefreshToken: false,  ← FALSE!
  hasTokenExpiry: false,  ← FALSE!
  isAuthenticated: false,  ← FALSE!
  accessTokenLength: 0,  ← 0!
  cookies: {
    accessToken: "none",  ← NONE!
    refreshToken: "none",
    tokenExpiry: "none"
  }
}

[Middleware] ❌ Redirecting to login: {
  reason: "Not authenticated",
  pathname: "/cases",
  hasAccessToken: false,
  isPublicRoute: false
}
```

---

## 🔍 Bước 2: Check cookies trong Browser

### Mở DevTools:
1. **F12** hoặc **Right click → Inspect**
2. Tab **Application** (hoặc **Storage** trong Firefox)
3. Sidebar bên trái → **Cookies** → chọn domain của bạn

### Cần thấy 3 cookies:
```
Name: access_token
Value: eyJhbGciOiJIUzI1NiIs... (dài)
Path: /
Max-Age: 900 (hoặc thời gian còn lại)

Name: refresh_token
Value: eyJhbGciOiJIUzI1NiIs... (dài)
Path: /
Max-Age: 604800

Name: token_expiry
Value: 1734566400000 (số lớn)
Path: /
Max-Age: 900
```

### ❌ Nếu KHÔNG thấy cookies → Đây là vấn đề!

---

## 🐛 Nguyên nhân thường gặp

### 1. Cookies không được set (Path sai)

**Triệu chứng**: 
- Login thành công
- Chuyển trang → Bị văng ngay
- DevTools không có cookies

**Giải pháp**: Đã fix! Cookies giờ có `path: "/"`

---

### 2. Cookies bị xóa sau login

**Triệu chứng**:
- Ngay sau login thấy cookies
- Chuyển trang → Cookies biến mất

**Debug**:
```javascript
// Trong browser console SAU KHI LOGIN:
setInterval(() => {
  const cookies = document.cookie.split(';');
  console.log('Cookies count:', cookies.length);
  console.log('Has access_token:', cookies.some(c => c.includes('access_token')));
}, 1000);
```

Nếu cookies biến mất → Check backend có gửi Set-Cookie header xóa cookies không

---

### 3. Backend trả về tokenExpires quá ngắn

**Triệu chứng**:
- Login OK
- Sau vài giây → Bị văng

**Debug**:
Xem log khi login:
```
[API Response] Refresh successful: {
  tokenExpires: 1734566400000,
  now: 1734565500000,
  expiresInMs: 900000,
  minutesUntilExpiry: 15,  ← Phải > 0
  isValid: true  ← Phải true
}
```

Nếu `minutesUntilExpiry` < 1 → Backend trả về tokenExpires quá ngắn

---

### 4. Cookie sameSite/Secure issues

**Triệu chứng**:
- Localhost OK
- Deploy lên server → Bị văng

**Giải pháp**: 
- Hiện tại: `secure: false` (OK cho HTTP)
- Production: Cần HTTPS và `secure: true`

---

## 🧪 Test nhanh

### Test 1: Check cookies tồn tại
```javascript
// Browser console:
console.log(document.cookie);
// Phải thấy: "access_token=...; refresh_token=...; token_expiry=..."
```

### Test 2: Manual set cookie
```javascript
// Browser console:
document.cookie = "test_cookie=123; path=/";
console.log(document.cookie.includes('test_cookie')); // Phải true

// Nếu false → Browser không lưu cookies (có thể do incognito/privacy settings)
```

### Test 3: Check cookie path
```javascript
// Browser console - Check cookies
const cookies = document.cookie.split(';').map(c => c.trim());
cookies.forEach(c => console.log(c));

// Phải thấy access_token, refresh_token, token_expiry
```

---

## 🔧 Fix ngay

### Fix 1: Clear all cookies và login lại
```javascript
// Browser console:
document.cookie.split(';').forEach(c => {
  document.cookie = c.trim().split('=')[0] + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
});

// Reload và login lại
location.reload();
```

### Fix 2: Check backend có set cookies đúng không
```bash
# Terminal - Test login API
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}' \
  -v

# Check response có Set-Cookie headers không
```

---

## 📊 Flow kiểm tra

```
1. User login
   ↓
2. Check terminal logs: "Đăng nhập thành công"
   ↓
3. Check DevTools → Cookies → Có 3 cookies?
   │
   ├─ YES → OK, tiếp tục
   │
   └─ NO → STOP! Cookies không được set
            Check: 
            - Backend có trả đúng tokenExpires không?
            - Console có lỗi không?
            - Browser có block cookies không?
            
4. Navigate to /dashboard
   ↓
5. Check terminal logs
   │
   ├─ "hasAccessToken: true" → OK!
   │
   └─ "hasAccessToken: false" → PROBLEM!
      Check:
      - DevTools có cookies không?
      - Cookies có path: "/" không?
      - maxAge có > 0 không?

6. Navigate to /cases
   ↓
7. Check terminal logs
   │
   ├─ "hasAccessToken: true" → OK!
   │
   └─ "Redirecting to login" → PROBLEM!
      Check logs above để xem nguyên nhân
```

---

## 📞 Report bug format

Nếu vẫn lỗi, copy và gửi:

### 1. Terminal logs từ khi login:
```
[Middleware] Request: { ... }
[Token Check] { ... }
```

### 2. DevTools → Application → Cookies (Screenshot hoặc text):
```
access_token: có/không
refresh_token: có/không  
token_expiry: có/không
```

### 3. Console errors (nếu có):
```
Error: ...
```

### 4. Steps to reproduce:
```
1. Login tại /login
2. Redirect về /dashboard → OK/Fail?
3. Click navigate to /cases → OK/Fail?
4. Bị văng tại step nào?
```

---

## 💡 Checklist Debug

Khi bị văng, check từng bước:

- [ ] Terminal có log `[Middleware] Request` không?
- [ ] Log có show `hasAccessToken: true` không?
- [ ] DevTools có 3 cookies không?
- [ ] Cookies có `Path: /` không?
- [ ] `token_expiry` có giá trị số lớn (>1700000000000) không?
- [ ] maxAge có > 0 không?
- [ ] Console có lỗi không?
- [ ] Network tab có request 401/403 không?

---

## 🎯 Expected Behavior

### Sau khi login thành công:
1. ✅ Terminal show: "Đăng nhập thành công"
2. ✅ Redirect về /dashboard
3. ✅ DevTools có 3 cookies
4. ✅ Navigate to any page → Không bị văng
5. ✅ Terminal show `hasAccessToken: true` mỗi request

### Khi token sắp hết hạn:
1. ✅ Terminal show: "[Token Refresh] Attempting..."
2. ✅ API call thành công
3. ✅ Cookies được update
4. ✅ User tiếp tục dùng app (không bị văng)

### Khi token hết hạn hoàn toàn:
1. ✅ Terminal show: "[Token Refresh] ❌ Refresh failed"
2. ✅ Redirect về /login?sessionExpired=true
3. ✅ Cookies bị xóa

