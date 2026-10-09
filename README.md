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

### ⚡ Sự cố 1: Nhầm lẫn Tên miền / Giao diện hiển thị sai dự án khác (`eduvth` / `Gamegiaoduc`)
* **Nguyên nhân**: 
  - Tên miền `magnificatedu.vercel.app` trước đây từng bị gán nhầm alias vào project khác (`eduvth` - Hệ thống hỗ trợ dạy và học của Thầy Hảo).
  - Khi gán alias mới nếu trỏ vào URL tĩnh có thể bị trỏ vào bản build cũ hoặc bị xung đột domain.
* **Cách khắc phục triệt để**:
  1. Xóa alias xung đột:
     ```bash
     npx vercel alias rm magnificatedu.vercel.app --yes
     ```
  2. Triển khai bản build mới nhất của dự án `magnificatedu-giangviengiaoly`:
     ```bash
     npx vercel --prod --yes
     ```
  3. Gán domain chính thức vào trực tiếp Deployment URL mới nhất:
     ```bash
     npx vercel alias set <DEPLOYMENT_URL> magnificatedu.vercel.app
     npx vercel alias set <DEPLOYMENT_URL> magnificatedu-giangviengiaoly.vercel.app
     ```
  4. Kiểm tra bằng `curl`:
     ```bash
     curl -sL https://magnificatedu.vercel.app | grep -i "<title>"
     # Kết quả chuẩn: <title>MagnificatEdu - Hệ Thống Quản Lý Giáo Lý Công Giáo</title>
     ```
* **Quy tắc bắt buộc**: Sau mỗi lần deploy Vercel, kiểm tra ngay bằng lệnh `npx vercel alias ls | grep magnificatedu` và `curl -sL https://magnificatedu.vercel.app | grep -i "<title>"` để đảm bảo tuyệt đối không nhầm sang dự án `eduvth`.

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
  3. Sử dụng thông số phiên bản cache-buster để đảm bảo tính thẩm mỹ tối giản cho thanh Sidebar/Header.

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

### ⚡ Sự cố 7: Cập nhật và phân chia câu Châm ngôn / Slogan theo vị trí giao diện
* **Yêu cầu**: Phân định chính xác 2 câu châm ngôn ở 2 vị trí khác nhau trong hệ thống:
  1. **Giao diện Tổng quan (Welcome Banner Overview)**: Sử dụng câu của *Mẹ Thánh Têrêsa Calcutta*:
     - Nội dung: *"Không phải tất cả chúng ta đều làm được những điều vĩ đại. Nhưng chúng ta có thể làm những điều nhỏ nhặt với tình yêu vĩ đại"*
  2. **Thanh Sidebar, Footer & Auth Modal**: Giữ nguyên câu châm ngôn truyền thống của *Chân Phước Anrê Phú Yên*:
     - Nội dung: *"Chúng ta hãy lấy tình yêu để đáp lại tình yêu của Chúa chúng ta, hãy lấy mạng sống đáp lại mạng sống."*
* **Cách khắc phục**:
  1. Giữ nguyên biến hằng số `SLOGAN_TEXT` và `SLOGAN_AUTHOR` trong `app_v2.js` và `app.js` cho Card Tổng quan Overview (`welcome-slogan-card`).
  2. Trả lại nội dung câu của Chân Phước Anrê Phú Yên tại các vị trí tĩnh trong `index.html` (Sidebar Box, Footer, Auth Modal).
  3. Cập nhật cache buster `index.html` lên `?v=20261008_v800`.

---

### ⚡ Sự cố 8: Đóng gói quy tắc cách ly dự án & phòng chống nhầm tên miền Vercel vĩnh viễn
* **Hiện tượng**: Truy cập `magnificatedu.vercel.app` hiển thị giao diện của dự án khác (`eduvth` / *Hệ thống hỗ trợ dạy và học của Thầy Hảo*).
* **Nguyên nhân cốt lõi**:
  1. Tài khoản Vercel quản lý nhiều dự án giáo dục song song.
  2. Domain `magnificatedu.vercel.app` bị trỏ nhầm alias sang dự án `eduvth`. Lệnh cũ gán alias tĩnh không cập nhật được bản build mới nhất hoặc bị xung đột domain.
  3. Thiếu bước kiểm tra tiêu đề `<title>` tự động sau khi deploy.
* **Quy trình chuẩn hóa vĩnh viễn (Bắt buộc thực hiện khi deploy)**:
  1. Triển khai build mới: `npx vercel --prod --yes` (lấy URL deployment mới nhất `<DEPLOYMENT_URL>`).
  2. Xóa alias sai nếu bị kẹt: `npx vercel alias rm magnificatedu.vercel.app --yes`.
  3. Gán alias chính xác vào `<DEPLOYMENT_URL>` mới nhất:
     ```bash
     npx vercel alias set <DEPLOYMENT_URL> magnificatedu.vercel.app
     npx vercel alias set <DEPLOYMENT_URL> magnificatedu-giangviengiaoly.vercel.app
     ```
  4. **Bắt buộc kiểm tra đối chiếu (Sanity Check)**:
     ```bash
     curl -sL https://magnificatedu.vercel.app | grep -i "<title>"
     # Kết quả hợp lệ duy nhất: <title>MagnificatEdu - Hệ Thống Quản Lý Giáo Lý Công Giáo</title>
     ```

---

### ⚡ Sự cố 9: Reset toàn bộ thông số mẫu tĩnh trên Dashboard sang cơ chế tự động tính toán theo dữ liệu thực tế
* **Hiện tượng**: Giao diện Tổng quan (Dashboard) hiển thị các thông số mẫu tĩnh từ ban đầu dù hệ thống chưa có dữ liệu thực tế:
  - 4 ô điểm danh hôm nay cố định: 78 Có mặt, 3 Đi trễ, 2 Vắng có phép, 1 Vắng không phép.
  - Tỷ lệ chuyên cần cố định: 96.8%.
  - Lịch học trong tuần hiển thị các lớp mẫu (Khai Tâm 1, Ấu Nhi 2A, Thiếu Nhi 2B...).
  - Biểu đồ tròn phân bố học lực hiển thị tỷ lệ mẫu cố định [45, 30, 20, 5].
* **Nguyên nhân**: Mã nguồn `renderOverview` trước đây đặt cứng các giá trị HTML và mảng dữ liệu Chart.js thay vì truy vấn từ đối tượng `appData`.
* **Cách khắc phục triệt để**:
  1. **Tình hình điểm danh & Tỷ lệ chuyên cần**: Tự động tính toán từ `appData.attendanceLogs`. Nếu chưa có dữ liệu điểm danh, hiển thị `0` và `0%` kèm thông báo trạng thái "Chưa có dữ liệu". Khi giáo viên điểm danh, số liệu tự động nhảy đúng thực tế.
  2. **Lịch học trong tuần**: Tự động gom nhóm theo lịch thực tế của các lớp trong `appData.classes`. Nếu chưa có lớp hoặc chưa xếp lịch, hiển thị ô trạng thái tinh gọn hướng dẫn tạo lớp mới.
  3. **Biểu đồ phân bố học lực**: Tự động phân loại xếp hạng của từng học viên theo điểm số thực tế. Nếu chưa có học viên nào được nhập điểm, hiển thị thông báo hướng dẫn và chỉ vẽ biểu đồ khi có dữ liệu điểm thực tế.
  4. Đồng bộ logic tính toán giữa `app_v2.js` và `app.js`, nâng cache buster lên `v=20261008_v1100`.
  5. Đã xử lý giải phóng quota Vercel bằng cách dọn dẹp các deployment rác, triển khai deployment mới `h52x07avo` và gán alias `magnificatedu.vercel.app`.
  6. Đã kiểm chứng trực tiếp bằng Browser Subagent: toàn bộ số liệu mẫu tĩnh (78, 3, 2, 1, Khai Tâm 1, Ấu Nhi 2A, biểu đồ bánh [45, 30, 20, 5]) đã biến mất 100%, sẵn sàng tự động cập nhật khi có dữ liệu.

---

### ⚡ Sự cố 7: Nhầm lẫn tên miền `magnificat.vercel.app` & Thiếu Cổng Giao diện Đăng Nhập (Auth Gate)
* **Hiện tượng**:
  - Truy cập `magnificat.vercel.app` bị lỗi 403 Forbidden (`Request to GET / on magnificat.vercel.app not allowed by policy`).
  - Mở website không thấy giao diện đăng nhập, tự động nhảy thẳng vào Dashboard Quản trị viên của Thầy Hảo mà không hỏi tài khoản của giáo viên.
  - Giáo viên không biết đăng nhập ở đâu, hoặc khi bấm Đăng xuất thì không thoát hẳn phiên làm việc.
* **Nguyên nhân**:
  1. Tên miền `magnificat.vercel.app` không thuộc dự án và bị chính sách tường lửa Vercel chặn. Tên miền chuẩn duy nhất của hệ thống là **`https://magnificatedu.vercel.app`**.
  2. Hàm `loadCurrentUser()` trước đây tự động gán tài khoản mặc định `philthienhao@gmail.com` khi `localStorage` trống, làm mất màn hình đăng nhập.
  3. Cổng đăng nhập (`#google-auth-modal`) trước đây chỉ là một pop-up ẩn với `display: none` thay vì cơ chế Cổng Đăng Nhập (Auth Gate) bảo vệ toàn bộ ứng dụng.
* **Cách khắc phục triệt để**:
  1. Thiết lập Cổng Đăng Nhập toàn màn hình (**Auth Gate**): Nếu chưa đăng nhập hoặc vừa bấm Đăng xuất, ẩn toàn bộ ứng dụng và hiển thị Giao diện Đăng Nhập & Đăng Ký Giáo Lý Viên trang trọng, đậm chất Công Giáo.
  2. Bổ sung nút **⚡ Đăng Nhập Nhanh: Quản Trị Viên (Võ Thiện Hảo)** (1 chạm) giúp kiểm thử nhanh hoặc dành cho Admin.
  3. Bổ sung nút **Đăng Xuất Trực Tiếp** ở cả Topbar Header và Sidebar Footer để giáo viên thoát tài khoản an toàn bất cứ lúc nào.
  4. Đồng bộ tài khoản đám mây (**Supabase Cloud User Sync**): Tự động đồng bộ tài khoản đăng ký từ Supabase để giáo viên đăng ký ở thiết bị/điện thoại nào cũng có thể đăng nhập trên máy tính khác.
  5. Đồng bộ mã nguồn giữa `app_v2.js` và `app.js`, nâng cache buster lên `v=20261009_v1300`.

---

## 🚀 4. Hướng Dẫn Cập Nhật & Deploy Dự Án Chuẩn 4 Bước

Khi có thay đổi mã nguồn, thực hiện đúng quy trình sau:
```bash
# 1. Thêm thay đổi & Commit
git add .
git commit -m "feat/fix: mô tả chi tiết thay đổi"

# 2. Push lên GitHub (main & gh-pages)
git push origin main
git push origin main:gh-pages --force

# 3. Triển khai Vercel Production & Gán Alias
npx vercel --prod --yes
npx vercel alias set <DEPLOYMENT_URL> magnificatedu.vercel.app
npx vercel alias set <DEPLOYMENT_URL> magnificatedu-giangviengiaoly.vercel.app

# 4. Kiểm tra đối chiếu tiêu đề trang (Sanity Check)
curl -sL https://magnificatedu.vercel.app | grep -i "<title>"
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
