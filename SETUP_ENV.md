# 🔐 Environment Variables Setup

## Firebase Push Notification Configuration

### 1. Tạo file `.env.local`

Tạo file `.env.local` ở thư mục root của project và thêm các biến sau:

```env
# Firebase Configuration
# Get these from Firebase Console: https://console.firebase.google.com/
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Cloud Messaging VAPID Key (Web Push certificates)
NEXT_PUBLIC_FIREBASE_VAPID_KEY=BFsf7RvmTCcUrEt3_rHh4PImXoRtocXVkH0gNcZbKDVMbdqPQkyP_WYHJBGqds7C-UDQTO3aI4taLRfhIdKckqM

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 2. VAPID Key đã có sẵn

VAPID Key (Web Push certificates) của bạn:
```
BFsf7RvmTCcUrEt3_rHh4PImXoRtocXVkH0gNcZbKDVMbdqPQkyP_WYHJBGqds7C-UDQTO3aI4taLRfhIdKckqM
```

✅ Đã được config sẵn trong template trên.

### 3. Lấy Firebase Config còn lại

Vào [Firebase Console](https://console.firebase.google.com/) của project bạn:

1. Click vào **⚙️ Settings** > **Project Settings**
2. Scroll xuống **Your apps** > Web app
3. Copy các giá trị:
   - `apiKey` → `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `authDomain` → `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `projectId` → `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `storageBucket` → `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `messagingSenderId` → `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `appId` → `NEXT_PUBLIC_FIREBASE_APP_ID`

### 4. Cập nhật Service Worker

Mở file `public/firebase-messaging-sw.js` và thay đổi Firebase config:

```javascript
firebase.initializeApp({
  apiKey: "YOUR_API_KEY",              // Copy từ Firebase Console
  authDomain: "YOUR_AUTH_DOMAIN",      // Copy từ Firebase Console
  projectId: "YOUR_PROJECT_ID",        // Copy từ Firebase Console
  storageBucket: "YOUR_STORAGE_BUCKET", // Copy từ Firebase Console
  messagingSenderId: "YOUR_SENDER_ID", // Copy từ Firebase Console
  appId: "YOUR_APP_ID"                 // Copy từ Firebase Console
});
```

### 5. Restart Dev Server

Sau khi thêm environment variables, restart dev server:

```bash
npm run dev
```

### 6. Test Notification

1. Mở browser (Chrome/Firefox)
2. Click vào icon 🔔 ở header
3. Chấp nhận notification permission
4. Mở Console (F12) → xem FCM token được log ra
5. Token tự động gửi lên backend qua Server Action

---

**Note**: File `.env.local` không được commit lên git (đã có trong `.gitignore`).

