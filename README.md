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

### ⚡ Nâng cấp 5: Tùy chỉnh Linh hoạt Sơ đồ Lớp Học (Số Hàng, Số Dãy & 1-6 Em/Bàn)
* **Yêu cầu & Thực trạng**: Các phòng học có kích thước bàn ghế khác nhau, mỗi bàn ngồi từ 2-3-4-5-6 học sinh cùng nhau.
* **Cách khắc phục**:
  1. Bổ sung bộ tùy chọn 3 thông số trên thanh công cụ sơ đồ lớp:
     - `Số Hàng` (1 - 15 Hàng)
     - `Số Dãy` (1 - 12 Dãy bàn)
     - `Số em/bàn` (Tùy chọn 1, 2, 3, 4, 5, 6 em ngồi cùng 1 bàn)
  2. Mỗi bàn học được dựng khung container chứa đúng `N` ô ghế cho từng học sinh.
  3. Cập nhật cửa sổ modal "Sắp Xếp Chỗ Ngồi" & thuật toán sắp xếp tự động phân học sinh chính xác theo ma trận `(Hàng x Dãy x Số em/bàn)`.
  4. Đảm bảo tương thích 100% với dữ liệu sơ đồ cũ.

---

### ⚡ Sự cố 6: Lỗi Scope (ReferenceError) không vào được tab "📷 AI Sơ Đồ & Ảnh Chụp"
* **Nguyên nhân**: Hàm trợ lý sơ đồ chỗ ngồi (`getSeatIdFromChart`, `isSeatAbsentInChart`) bị khai báo bên trong scope cục bộ của `renderAttendance()`, trong khi hàm render tab sơ đồ AI (`renderAISeatingSection()`) và các modal cấu hình lại ở ngoài scope `renderAttendance()`. Khi bấm vào tab "📷 AI Sơ Đồ & Ảnh Chụp", ứng dụng gọi `renderAISeatingSection()` dẫn đến lỗi `ReferenceError: isSeatAbsentInChart is not defined`.
* **Cách khắc phục**:
  1. Di chuyển `getSeatIdFromChart` và `isSeatAbsentInChart` lên scope cấp cao (Top-level Module scope) trong cả `app_v2.js` và `app.js`.
  2. Bổ sung khai báo `topParishName` và `topParishSub` trong `renderAppHeaderAndSidebar()`.
  3. Chuẩn hóa so sánh ID dạng chuỗi `String(s.classId) === String(selectedClassId)` & `String(s.id) === String(stId)` tránh lệch kiểu dữ liệu (String vs Number).
  4. Cập nhật cache buster `index.html` lên `?v=20261008_v600`.
  5. Tạo kịch bản kiểm thử Node.js `test_seating_scope.js` để tự động giả lập và xác minh trước khi công bố.

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

## 🤖 5. Quy Trình Vận Hành & Quy Tắc Điểm Danh AI Sơ Đồ Lớp Học

Để chức năng **Quét Điểm Danh AI qua Ảnh Chụp** đạt độ chính xác 100% và tự động nhận diện tên từng học sinh vắng mặt, Giáo viên thực hiện theo 2 giai đoạn:

### 📌 Giai đoạn 1: Thiết lập Ma trận Đầu Năm (Làm 1 lần duy nhất)
1. **Cấu hình Sơ đồ Lớp**: Chọn số Hàng x Số Dãy x Số em/bàn phù hợp với thực tế phòng học.
2. **Chụp Ảnh Lớp Mẫu (Baseline Photo)**: Đứng ở bục giảng chụp 1 tấm ảnh cả lớp đầy đủ đầu năm.
3. **Ánh xá Tên Học Sinh (Seat Assignment)**: Bấm `🪑 Sắp Xếp Chỗ Ngồi` ➔ Bấm `🪄 Sắp Xếp Tự Động` để gán học sinh vào từng vị trí bàn từ Hàng 1 - Dãy 1 đến hết ➔ Bấm `Lưu Sơ Đồ`.

### 📌 Giai đoạn 2: Điểm danh tự động mỗi buổi học (Chỉ 5 giây)
1. **Chụp Ảnh Buổi Học**: Đầu giờ học bấm `📸 CHỤP / TẢI ẢNH HÔM NAY`.
2. **AI Tự Động Phân Tích & Gọi Tên**: AI so sánh vùng ảnh với Ảnh Mẫu Đầu Năm ➔ Tự động phát hiện ghế trống ➔ Truy xuất Ma trận Tọa độ ➔ Đánh dấu `🔴 VẮNG` kèm **Đích Danh Tên Học Sinh** ngồi ghế đó.
3. **Lưu Nhật Ký**: Giáo viên chạm tay trực tiếp vào sơ đồ để tinh chỉnh nếu cần ➔ Bấm `Lưu Kết Quả Điểm Danh AI`.

---

*Hệ Thống Quản Lý Giáo Lý Công Giáo - MagnificatEdu © 2026*
