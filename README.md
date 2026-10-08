# 🇻🇳 MagnificatEdu - Hệ Thống Quản Lý Giáo Lý Công Giáo

**MagnificatEdu** là hệ thống web ứng dụng hiện đại hỗ trợ Quản Lý Giáo Lý Công Giáo, Quản lý Điểm số, Điểm danh, Thi đua, Xuất Báo Cáo Excel và Lưu trữ dữ liệu Thiêng Liêng cho các Giáo xứ & Huynh trưởng/Giáo lý viên.

---

## 🌐 1. Thông Tin Tên Miền & Triển Khai (Deployment)

* **Tên miền chính thức chuẩn duy nhất**: **`https://magnificatedu.vercel.app`**
* **Tên miền phụ (Auto-generated)**: `https://magnificatedu-giangviengiaoly.vercel.app`
* **Nền tảng Hosting**: Vercel
* **Kho lưu trữ GitHub**: `https://github.com/Philthienhao/magnificatedu-giangviengiaoly.git`

> [!IMPORTANT]
> **Lưu ý về tên miền:**
> KHÔNG sử dụng tên miền `magnificat.vercel.app` (tên miền này không thuộc dự án và bị Vercel chặn chính sách 403). Mọi truy cập chính thức phải sử dụng `https://magnificatedu.vercel.app`.

---

## 📊 2. Tính Năng Điểm Số & ĐTB Cả Năm

Hệ thống tính điểm được thiết kế minh bạch với các chế độ:
1. **Học Kỳ I**: Điểm Chuyên cần, Miệng, 15 phút, 1 tiết, Thi HK1 -> $ĐTB_{HK1}$
2. **Học Kỳ II**: Điểm Chuyên cần, Miệng, 15 phút, 1 tiết, Thi HK2 -> $ĐTB_{HK2}$
3. **🌟 ĐTB CẢ NĂM**: 
   $$\text{ĐTB Cả Năm} = \frac{\text{ĐTB HK1} + \text{ĐTB HK2}}{2}$$

* **Xếp loại danh hiệu Cả Năm**:
  - **Xuất Sắc**: $\ge 9.0$
  - **Giỏi**: $8.0 - 8.9$
  - **Khá**: $6.5 - 7.9$
  - **Trung Bình**: $5.0 - 6.4$
  - **Yếu**: $< 5.0$

---

## 🛠️ 3. Nhật Ký Sự Cố & Hướng Dẫn Khắc Phục (Troubleshooting & Incident Prevention)

Để đảm bảo hệ thống vận hành ổn định và không tái diễn các lỗi sai trong quá khứ, dưới đây là bộ quy tắc xử lý:

### ⚡ Sự cố 1: Nhầm lẫn Tên miền / Giao diện hiển thị sai dự án khác
* **Nguyên nhân**: Vercel Alias bị gán nhầm sang dự án khác (`eduvth`).
* **Cách khắc phục**:
  ```bash
  npx vercel alias set magnificatedu-giangviengiaoly.vercel.app magnificatedu.vercel.app
  ```
* **Quy tắc**: Luôn kiểm tra danh sách Alias bằng `npx vercel alias ls` sau mỗi lần triển khai dự án lớn.

---

### ⚡ Sự cố 2: Trình duyệt lưu Cache không cập nhật tính năng mới
* **Nguyên nhân**: File JavaScript (`app_v2.js`, `app.js`) bị trình duyệt lưu đệm (browser cache).
* **Cách khắc phục**:
  1. Cấu hình `vercel.json` ép buộc kiểm tra revalidation:
     ```json
     "headers": [{ "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" }]
     ```
  2. Bổ sung tham số versioning trong `index.html`:
     ```html
     <script src="app_v2.js?v=v20261008_v300"></script>
     ```
  3. Cập nhật Badge phiên bản ở góc màn hình (ví dụ: `Giáo Lý Số v2026.10.08`).

---

### ⚡ Sự cố 3: Mất bộ điều hướng Điểm Trung Bình Cả Năm
* **Nguyên nhân**: Giao diện chỉ có nút xem HK1 và HK2 riêng lẻ.
* **Cách khắc phục**: 
  - Thêm thanh nút bấm phân đoạn (Segmented Control) trực quan ngay trên bảng điểm:
    - `[ 📘 Học Kỳ I ]`
    - `[ 📙 Học Kỳ II ]`
    - `[ 🌟 ĐTB CẢ NĂM = (HK1 + HK2) / 2 ]`
  - Đồng bộ logic xuất file Excel báo cáo cả năm.

---

### ⚡ Sự cố 4: Lỗi hiển thị Avatar/Logo (404 Not Found)
* **Nguyên nhân**: Nhập sai đường dẫn ảnh tĩnh hoặc dùng URL bên ngoài dễ bị hỏng.
* **Cách khắc phục**: Lưu tài nguyên tĩnh trực tiếp tại kho lưu trữ gốc:
  - `admin_avatar.png`
  - `brand_logo.jpg`

---

## 🚀 4. Hướng Dẫn Cập Nhật & Deploy Dự Án

Khi có thay đổi mã nguồn, thực hiện theo các bước sau:
```bash
# 1. Thêm thay đổi
git add .

# 2. Commit kèm mô tả rõ ràng
git commit -m "feat: cập nhật phiên bản mới v2026.10.08"

# 3. Push lên GitHub (Vercel sẽ tự động Build & Deploy)
git push origin main
```

---

*Hệ Thống Quản Lý Giáo Lý Công Giáo - MagnificatEdu © 2026*
