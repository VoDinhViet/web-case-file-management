# Hệ thống Quản lý Vụ án

Ứng dụng quản lý vụ án hiện đại được xây dựng với Next.js 15, TypeScript và shadcn/ui. Hệ thống được thiết kế để hỗ trợ quản lý toàn diện các vụ án hình sự với các tính năng chuyên nghiệp.

## 🚀 Tính năng chính

### Quản lý Vụ án
- **Tạo và chỉnh sửa vụ án**: Giao diện thân thiện để nhập thông tin vụ án
- **Tìm kiếm và lọc**: Tìm kiếm nâng cao với nhiều tiêu chí
- **Trạng thái vụ án**: Theo dõi trạng thái từ chưa xử lý đến đã đóng
- **Phân loại vụ án**: Hệ thống phân loại theo loại tội phạm
- **Thông tin chi tiết**: Xem và chỉnh sửa thông tin chi tiết vụ án

### Kế hoạch Điều tra
- **Kết quả điều tra ban đầu**: Ghi nhận kết quả điều tra về tố tụng
- **Tang vật vụ án**: Quản lý danh sách tang vật
- **Kế hoạch điều tra tiếp theo**: Lập kế hoạch chi tiết
- **Tổ chức thực hiện**: Phân công lực lượng và thời gian
- **Phương tiện, kinh phí**: Quản lý nguồn lực thực hiện

### Giao diện Người dùng
- **Dashboard**: Tổng quan thống kê vụ án
- **Bảng vụ án**: Hiển thị danh sách với các thao tác
- **Chi tiết vụ án**: Xem thông tin chi tiết và kế hoạch
- **Dark Mode**: Hỗ trợ chế độ tối
- **Responsive**: Tối ưu cho mọi thiết bị

## 📋 Công nghệ sử dụng

- **Framework**: [Next.js 15](https://nextjs.org/) với App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms**: React Hook Form + Zod validation
- **Themes**: next-themes
- **Code Quality**: Biome (linting & formatting)

## 🏗️ Cấu trúc Dự án

```
fe-case-managerment-app/
├── app/                          # Next.js app router
│   ├── (dashboard)/             # Dashboard layout group
│   │   ├── cases/              # Trang quản lý vụ án
│   │   │   ├── [id]/          # Chi tiết vụ án
│   │   │   │   ├── page.tsx   # Trang chi tiết
│   │   │   │   └── plans/     # Tab kế hoạch
│   │   │   ├── create/        # Tạo vụ án mới
│   │   │   └── page.tsx       # Danh sách vụ án
│   │   ├── dashboard/         # Trang chủ
│   │   └── layout.tsx         # Layout dashboard
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Trang chủ
├── components/
│   ├── features/              # Components theo tính năng
│   │   └── cases/            # Components vụ án
│   │       ├── case-detail/  # Chi tiết vụ án
│   │       ├── case-plans/   # Kế hoạch điều tra
│   │       └── cases-table/  # Bảng danh sách
│   ├── layout/               # Layout components
│   └── ui/                   # shadcn/ui components
├── lib/                      # Utility functions
├── types/                    # TypeScript types
├── schemas/                  # Zod validation schemas
├── actions/                  # Server actions
└── public/                   # Static assets
```

## 🛠️ Cài đặt và Chạy

### Yêu cầu hệ thống
- Node.js 20+
- npm, yarn hoặc pnpm

### Cài đặt

1. Clone repository:
```bash
git clone <repository-url>
cd fe-case-managerment-app
```

2. Cài đặt dependencies:
```bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

3. Chạy development server:
```bash
npm run dev
# hoặc
yarn dev
# hoặc
pnpm dev
```

4. Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt

## 📝 Scripts có sẵn

- `npm run dev` - Chạy development server với Turbopack
- `npm run build` - Build cho production
- `npm run start` - Chạy production server
- `npm run lint` - Chạy Biome linter
- `npm run format` - Format code với Biome

## 🎯 Tính năng Chi tiết

### Quản lý Vụ án
- **Tạo vụ án**: Form động dựa trên template
- **Chỉnh sửa**: Cập nhật thông tin vụ án
- **Tìm kiếm**: Tìm kiếm theo tên, trạng thái, loại tội phạm
- **Lọc**: Lọc theo nhiều tiêu chí
- **Xóa**: Xóa vụ án với xác nhận

### Kế hoạch Điều tra
- **Kết quả điều tra**: Ghi nhận kết quả ban đầu
- **Tang vật**: Quản lý danh sách tang vật vụ án
- **Mục đích**: Xác định mục đích điều tra tiếp theo
- **Nội dung**: Lập danh sách công việc cần thực hiện
- **Lực lượng**: Phân công lực lượng tham gia
- **Thời gian**: Thiết lập thời gian bắt đầu và kết thúc
- **Kinh phí**: Quản lý nguồn kinh phí và phương tiện

### Giao diện
- **Dashboard**: Thống kê tổng quan
- **Bảng dữ liệu**: Hiển thị danh sách với pagination
- **Form động**: Tạo form dựa trên template
- **Date Picker**: Chọn ngày tháng với locale Việt Nam
- **Responsive**: Tối ưu cho mobile và desktop

## 🔧 Cấu hình

### Environment Variables
Tạo file `.env.local`:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### shadcn/ui Configuration
Components được cấu hình trong `components.json`:
- Style: New York
- Color: Neutral
- CSS Variables: Enabled
- Icon Library: Lucide React

## 📱 Responsive Design

Ứng dụng được thiết kế responsive với các breakpoint:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🎨 Theming

Hỗ trợ các chế độ:
- Light mode
- Dark mode
- System preference

Themes được cấu hình trong `app/globals.css` sử dụng CSS variables.


## 📄 License
AlvisDev
