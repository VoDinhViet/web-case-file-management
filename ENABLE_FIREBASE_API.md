# 🔥 Enable Firebase Cloud Messaging API

## ❌ Lỗi hiện tại:
```
403 PERMISSION_DENIED: The caller does not have permission
```

## ✅ Giải pháp: Enable Firebase APIs

### Bước 1: Enable Firebase Cloud Messaging API

**Cách 1: Từ Firebase Console (Dễ nhất)**

1. Mở [Firebase Console](https://console.firebase.google.com/)
2. Chọn project **case-file-management**
3. Click vào **⚙️ Settings** (góc trên bên trái) > **Project Settings**
4. Tab **Cloud Messaging**
5. Tìm phần **Cloud Messaging API (V1)**
6. Nếu thấy **"Cloud Messaging API is disabled"**, click vào link **"manage API in Google Cloud Console"**
7. Hoặc click vào nút **"Enable"** nếu có

**Cách 2: Từ Google Cloud Console**

1. Mở [Google Cloud Console](https://console.cloud.google.com/)
2. Chọn project **case-file-management**
3. Vào **APIs & Services** > **Library**
4. Search "**Firebase Cloud Messaging API**"
5. Click vào result
6. Click nút **ENABLE** (màu xanh)
7. Đợi vài giây để API được enable

### Bước 2: Enable Firebase Installations API

1. Vẫn ở **APIs & Services** > **Library**
2. Search "**Firebase Installations API**"
3. Click vào result
4. Click nút **ENABLE**

### Bước 3: Kiểm tra API đã enable

1. Vào **APIs & Services** > **Enabled APIs & services**
2. Kiểm tra danh sách có:
   - ✅ Firebase Cloud Messaging API
   - ✅ Firebase Installations API
   - ✅ FCM Registration API (tự động enable)

---

## 📝 Cập nhật Environment Variables

### Tạo file `.env.local`:

```bash
# Copy file mẫu
cp .env.local.example .env.local
```

Hoặc tạo file mới `.env.local` với nội dung:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBg1r7Boa_TsNZTKcnN7L6pG1skJPeX6eg
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=case-file-management.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=case-file-management
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=case-file-management.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=803160656783
NEXT_PUBLIC_FIREBASE_APP_ID=1:803160656783:web:239c85e3f2119c506bd9fa

# VAPID Key
NEXT_PUBLIC_FIREBASE_VAPID_KEY=BFsf7RvmTCcUrEt3_rHh4PImXoRtocXVkH0gNcZbKDVMbdqPQkyP_WYHJBGqds7C-UDQTO3aI4taLRfhIdKckqM

# Backend URL
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## 🔄 Restart Development Server

```bash
# Stop server (Ctrl+C)
# Restart
npm run dev
```

---

## 🧪 Test

1. Mở browser
2. Mở Console (F12)
3. Hard reload: **Ctrl + Shift + R**
4. Click icon 🔔 ở header
5. Chấp nhận notification permission
6. Xem console log:

**Success output:**
```
🔥 Firebase Config: { apiKey: "AIzaSyBg1r...", projectId: "case-file-management", ... }
Service Worker registered: ...
Service Worker is ready
VAPID Key: BFsf7RvmTCcUrEt3_rHh...
VAPID Key length: 87
✅ FCM Token received successfully!
FCM Token (full): dXXXXXXXXXXXXXXXXX...
📤 Sending FCM token to backend...
🚀 [Server Action] Registering FCM token...
✅ Backend response: ...
```

---

## ⚠️ Nếu vẫn lỗi

### 1. Clear browser cache
- Hard reload: **Ctrl + Shift + R**
- Hoặc: DevTools > Application > Clear storage > Clear site data

### 2. Unregister old Service Worker
- DevTools (F12) > Application tab
- Service Workers
- Click **Unregister** cho tất cả workers
- Refresh page

### 3. Kiểm tra API restrictions
1. [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** > **Credentials**
3. Click vào API key **Browser key** (hoặc key có restrict)
4. **Application restrictions:**
   - Chọn **HTTP referrers**
   - Thêm: `http://localhost:*/*`
   - Thêm: `https://your-domain.com/*` (production)
5. **API restrictions:**
   - Chọn **Don't restrict key** (để test)
   - Hoặc chọn các API cần thiết:
     - Firebase Cloud Messaging API
     - Firebase Installations API
6. Click **Save**

### 4. Đợi vài phút
- Sau khi enable API, có thể mất 1-2 phút để áp dụng
- Đợi rồi thử lại

---

## 📊 Project Info

- **Project ID:** case-file-management
- **Firebase Console:** [https://console.firebase.google.com/project/case-file-management](https://console.firebase.google.com/project/case-file-management)
- **Google Cloud:** [https://console.cloud.google.com/apis/dashboard?project=case-file-management](https://console.cloud.google.com/apis/dashboard?project=case-file-management)

---

## ✅ Checklist

- [ ] Enable Firebase Cloud Messaging API
- [ ] Enable Firebase Installations API
- [ ] Tạo file `.env.local` với config đầy đủ
- [ ] File `firebase-messaging-sw.js` đã được cập nhật
- [ ] Restart dev server
- [ ] Clear browser cache / Hard reload
- [ ] Unregister old service workers
- [ ] Test notification permission

---

**Sau khi làm xong, test lại và FCM token sẽ nhận được thành công!** 🎉

