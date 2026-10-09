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

### ⚡ Sự cố 8: KỸ NĂNG CÁCH LY DỰ ÁN & PHÒNG CHỐNG TRỎ NHẦM TÊN MIỀN VĨNH VIỄN 100% (PERMANENT PROJECT ISOLATION SKILL)
* **Hiện tượng**: Truy cập `magnificatedu.vercel.app` bị hiển thị nhầm giao diện dự án khác (`eduvth` / *Hệ thống hỗ trợ dạy và học của Thầy Hảo*).
* **PHÂN TÍCH GỐC RỄ (ROOT CAUSE ANALYSIS)**:
  1. **Chưa gán Domain cấp Dự án (`vercel domains add`)**: Trước đây, domain `magnificatedu.vercel.app` chỉ được trỏ alias thủ công tạm thời (`vercel alias set`). Vì chưa được đăng ký làm domain chính thức của project `magnificatedu-giangviengiaoly` trên Vercel, nên mỗi khi dự án khác trong cùng tài khoản (`eduvth` / `Gamegiaoduc`) được triển khai hoặc gán alias, Vercel đã chuyển hướng nhầm domain `magnificatedu.vercel.app` sang dự án đó.
  2. **Thiếu file khóa cứng `.vercel/project.json`**: Trong thư mục cục bộ trước đây chỉ có `repo.json` mà thiếu `project.json`. Khi Vercel CLI thực thi trong môi trường có nhiều dự án chạy song song, nó có thể nhầm lẫn context của project hoạt động gần nhất.
  3. **Hạn mức Deployment (100 builds/ngày)**: Khi nhiều dự án cùng triển khai liên tục, Vercel chạm ngưỡng giới hạn free tier, dẫn đến việc bản build mới chưa lên được mà alias lại bị trỏ sai.

* **GIẢI PHÁP ĐÃ THIẾT LẬP VĨNH VIỄN (ĐÃ HOÀN TẤT & KHÓA BẢO MẬT)**:
  1. **Đăng ký Domain chính thức vào Project**:
     ```bash
     npx vercel domains add magnificatedu.vercel.app magnificatedu-giangviengiaoly
     ```
     > **Kết quả xác nhận từ Vercel:** `Success! Domain magnificatedu.vercel.app added to project magnificatedu-giangviengiaoly. The domain will automatically get assigned to your latest production deployment.`  
     > Kể từ thời điểm này, domain `magnificatedu.vercel.app` đã trở thành tài sản gắn chặt và vĩnh viễn với dự án MagnificatEdu, không bao giờ bị bất kỳ dự án nào khác chiếm quyền sở hữu hay ghi đè.

  2. **Tạo file cấu hình cố định `.vercel/project.json`**:
     ```json
     {
       "projectId": "prj_oqP8KmZbEir8DXEv05LuiMUlJUqm",
       "orgId": "team_n02dYmpXBbpMhIVCgUhJIjno"
     }
     ```
     Đảm bảo mọi lệnh Vercel CLI chạy trong thư mục này luôn 100% kết nối chính xác vào dự án `magnificatedu-giangviengiaoly`.

  3. **Xóa triệt để alias sai và liên kết lại cả 2 tên miền chuẩn**:
     - Domain chính: `https://magnificatedu.vercel.app`
     - Domain phụ: `https://magnificatedu-giangviengiaoly.vercel.app`

* **QUY TẮC BẤT DI BẤT DỊCH KHI VẬN HÀNH (MANDATORY SKILL FOR AGENTS & DEVS)**:
  - **Bước 1**: Luôn kiểm tra `.vercel/project.json` tồn tại trước khi thao tác Vercel.
  - **Bước 2**: Sau mỗi lần thay đổi mã nguồn, thực hiện cập nhật GitHub và Vercel:
    ```bash
    git add .
    git commit -m "feat/fix: mô tả"
    git push origin main
    git push origin main:gh-pages --force
    ```
  - **Bước 3 (Kiểm tra đối chiếu bắt buộc - Sanity Check)**:
    ```bash
    curl -sL https://magnificatedu.vercel.app | grep -i "<title>"
    ```
    > Kết quả bắt buộc: `<title>MagnificatEdu - Hệ Thống Quản Lý Giáo Lý Công Giáo</title>`. Nếu sai lệch, lập tức chạy:
    ```bash
    npx vercel alias set <LATEST_MAGNIFICATEDU_URL> magnificatedu.vercel.app
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

## 👥 6. KIẾN TRÚC XỬ LÝ LỚP HỌC 2 GIÁO VIÊN ĐỒNG CHỦ NHIỆM (CO-TEACHER PRIVACY & SHARED ACCESS ARCHITECTURE)

### 📌 1. Bối cảnh & Thách thức thực tế
Tại các Xứ đoàn Giáo lý Công giáo, một lớp học thường có **2 Giáo lý viên cùng phụ trách** (1 GLV Chủ nhiệm chính + 1 GLV Đồng phụ trách/trợ tá, hoặc 2 GLV đồng chủ nhiệm).
Yêu cầu đặt ra:
- **Bảo mật & Riêng tư 100%**: Mỗi GLV phải dùng tài khoản Gmail, mật khẩu, ảnh đại diện và thông tin cá nhân của riêng mình; **tuyệt đối không dùng chung tài khoản Gmail hoặc chia sẻ mật khẩu**.
- **Dữ liệu thống nhất & Không trùng lặp**: Cả 2 GLV đều phải truy cập vào đúng **1 lớp học duy nhất**, thấy cùng một danh sách học viên, cùng bảng điểm và nhật ký điểm danh theo thời gian thực mà không bị lệch dữ liệu.
- **Minh bạch trách nhiệm (Audit Trail)**: Khi Thầy A hoặc Cô B điểm danh hay sửa điểm, hệ thống phải ghi nhận chính xác ai là người thực hiện (`savedBy`).

---

### 📌 2. So sánh các phương án & Lý do chọn phương án tối ưu

| Tiêu chí | Phương án 1: Dùng chung 1 Gmail lớp (VD: `lop1a@gmail.com`) | Phương án 2: Nhân bản dữ liệu (Copy sang 2 tài khoản) | **Phương án 3: Liên kết Đồng Chủ nhiệm (Co-Teacher Linkage) ⭐ [ĐƯỢC CHỌN]** |
| :--- | :--- | :--- | :--- |
| **Tính riêng tư** | ❌ **Kém**: 2 người phải biết chung mật khẩu, lộ email cá nhân | ⚠️ Tạm ổn | ✅ **Tuyệt đối**: Mỗi GLV dùng Gmail & mật khẩu riêng 100% |
| **Tính toàn vẹn dữ liệu** | ⚠️ Dễ xung đột session đăng nhập | ❌ **Nguy hiểm**: Split-brain, GLV A điểm danh thì GLV B không thấy | ✅ **Đồng bộ thời gian thực**: Cùng trỏ vào 1 mã lớp `classId` |
| **Lịch sử thao tác** | ❌ Không biết ai điểm danh, ai sửa điểm | ❌ Lệch lịch sử | ✅ Ghi nhận rõ: `savedBy: T. Võ Thiện Hảo` hoặc `C. Thanh Thảo` |
| **Trải nghiệm sử dụng** | ❌ Phải đăng xuất tài khoản riêng để vào tài khoản lớp | ⚠️ Phức tạp khi sync | ✅ Đăng nhập 1 lần bằng tài khoản cá nhân là thấy lớp ngay |

---

### 📌 3. Chi tiết triển khai kỹ thuật trong hệ thống MagnificatEdu

1. **Cấu trúc Dữ liệu Lớp Học (`Class Model`)**:
   ```javascript
   {
     id: "cls_1791519...",
     name: "Thiếu Nhi 2A",
     grade: "Thiếu Nhi",
     room: "Phòng 204",
     schedule: "Chúa Nhật (08:00 - 09:30)",
     teacher: "Philiphê Võ Thiện Hảo",        // Tên GLV Chủ nhiệm 1
     teacherEmail: "philthienhao@gmail.com",     // Gmail GLV Chủ nhiệm 1
     coTeacher: "Matta Phạm Thị Thanh Thảo",    // Tên GLV Chủ nhiệm 2 (Đồng phụ trách)
     coTeacherEmail: "phamthithanhthao0103@gmail.com", // Gmail GLV Chủ nhiệm 2
     studentCount: 32
   }
   ```

2. **Hàm Truy Xuất Dữ Liệu Đa Chiều (`getAccessibleClasses`, `getAccessibleStudents`, `getAccessibleAttendanceLogs`)**:
   - Khi GLV đăng nhập, hệ thống tự động xác định các lớp mà GLV có quyền truy cập:
     ```javascript
     isMatch = (c.teacherEmail === myEmail) || (c.coTeacherEmail === myEmail);
     ```
   - Tự động gom toàn bộ học sinh và lịch sử điểm danh của lớp đó hiển thị cho cả 2 GLV.

3. **Cơ Chế Đồng Bộ 2 Chiều Lên Supabase Cloud & LocalStorage**:
   - Khi GLV Chủ nhiệm 1 hoặc 2 lưu thông tin lớp học, học viên hay điểm danh:
     - `syncAttendanceLogToCoTeachers(logEntry)`: Đẩy bản ghi điểm danh vào dữ liệu của cả 2 GLV trên đám mây.
     - `syncStudentToCoTeachers(stdData)`: Đồng bộ hồ sơ học sinh mới/chỉnh sửa cho cả 2 tài khoản.
     - `syncSeatingChartToCoTeachers(classId, chartData)`: Sơ đồ lớp học AI được cả 2 cùng quản lý.

4. **Giao Diện Trực Quan (UI/UX)**:
   - Trong Form Tạo/Sửa Lớp: Có bảng phân chia rõ ràng **GLV Chủ Nhiệm 1 (Chính)** và **GLV Chủ Nhiệm 2 (Đồng phụ trách)** kèm gợi ý Datalist từ danh sách GLV trong Giáo xứ.
   - Trên Thẻ Lớp Học: Hiển thị huy hiệu `👥 2 Chủ nhiệm`, tên và email của cả 2 GLV phụ trách.

---

## ⛪ 7. Danh Sách Toàn Bộ 62 Giáo Xứ & Giáo Họ Biệt Lập (Giáo Phận Đà Nẵng)

Hệ thống đã tích hợp toàn bộ **62 đơn vị mục vụ** gồm **56 Giáo Xứ** và **6 Giáo Họ Biệt Lập** thuộc Giáo Phận Đà Nẵng, giúp giáo viên chọn trực tiếp khi đăng ký tài khoản, đồng thời tài khoản Admin Master có thể phân loại, lọc và quản lý minh bạch từng giáo xứ.

### 📋 Danh Sách 56 Giáo Xứ:
1. Giáo xứ Chính Tòa
2. Giáo xứ An Hải
3. Giáo xứ An Hòa
4. Giáo xứ An Thượng
5. Giáo xứ Cẩm Lệ
6. Giáo xứ Chợ Chiều
7. Giáo xứ Chính Trạch
8. Giáo xứ Cồn Dầu
9. Giáo xứ Gia Phước
10. Giáo xứ Hòa Cường
11. Giáo xứ Hòa Thuận
12. Giáo xứ Ngọc Quang
13. Giáo xứ Nhượng Nghĩa
14. Giáo xứ Nội Hà
15. Giáo xứ Phước Tường
16. Giáo xứ Sơn Trà
17. Giáo xứ Tam Tòa
18. Giáo xứ Thanh Bình
19. Giáo xứ Thanh Đức
20. Giáo xứ An Ngãi Đông
21. Giáo xứ Đông Vinh
22. Giáo xứ Hòa Khánh
23. Giáo xứ Hòa Minh
24. Giáo xứ Hòa Ninh
25. Giáo xứ Hội Yên
26. Giáo xứ Phú Nghi
27. Giáo xứ Phước Kiều
28. Giáo xứ Song Mỹ
29. Giáo xứ Lệ Sơn
30. Giáo xứ Lộc Hòa
31. Giáo xứ Mông Triệu
32. Giáo xứ Phú Hạ
33. Giáo xứ Phú Thượng
34. Giáo xứ Thạch Nham
35. Giáo xứ Hội An
36. Giáo xứ Vĩnh Điện
37. Giáo xứ Ái Nghĩa
38. Giáo xứ Cẩm Sơn
39. Giáo xứ Hà Tân
40. Giáo xứ Hòa Lâm
41. Giáo xứ Hoằng Phước
42. Giáo xứ La Nang
43. Giáo xứ Phú Hương
44. Giáo xứ Trà Kiệu
45. Giáo xứ Trung Phước
46. Giáo xứ Xuân Thạnh
47. Giáo xứ An Sơn
48. Giáo xứ Bình Phong
49. Giáo xứ Hà Lam
50. Giáo xứ Khánh Thọ
51. Giáo xứ Tam Kỳ
52. Giáo xứ Tam Thành
53. Giáo xứ Thuận Yên
54. Giáo xứ Tiên Phước
55. Giáo xứ Vân Đóa
56. Giáo xứ Việt An

### 📍 Danh Sách 6 Giáo Họ Biệt Lập:
1. Giáo họ biệt lập Tùng Sơn
2. Giáo họ biệt lập Ô Gia
3. Giáo họ biệt lập Tam Lãnh
4. Giáo họ biệt lập Thái Đông
5. Giáo họ biệt lập Chiêm Sơn
6. Giáo họ biệt lập Đại Hiệp

### 🛠️ Cơ Chế Tích Hợp Đa Nền Tảng:
1. **Form Đăng Ký Giáo Viên Mới (`#teacher-reg-parish`)**: Phân nhóm rõ ràng theo `<optgroup>`:
   - `⛪ 56 Giáo Xứ (Giáo Phận Đà Nẵng)`
   - `📍 6 Giáo Họ Biệt Lập (Giáo Phận Đà Nẵng)`
   - `➕ Khác (Tự nhập tên Giáo xứ ngoài giáo phận)`
2. **Hồ Sơ Cá Nhân GLV (`#prof-parish`)**: Giáo viên có thể xem và cập nhật lại Giáo xứ / Giáo họ mình đang sinh hoạt, tự động đồng bộ lên Supabase Cloud.
3. **Phân Quyền Admin Cấp 2 (`#delegation-target-parish-select`)**: Admin Master dễ dàng chọn bất kỳ Giáo xứ / Giáo họ nào trong số 62 đơn vị để ủy quyền quản trị.
4. **Admin Master Hub (`renderAdminUsers`)**:
   - Bộ lọc `#admin-parish-filter` hiển thị đủ 62 đơn vị kèm số lượng tài khoản thực tế đang hoạt động (ví dụ: `⛪ Giáo xứ Hòa Khánh (4 tài khoản)`).
   - Huy hiệu Giáo Xứ trực quan trên bảng:
     - Giáo xứ: biểu tượng `⛪` với tông xanh navy hoặc xanh lá.
     - Giáo họ biệt lập: biểu tượng `📍` với tông vàng hổ phách đặc trưng (`badge-mission`).
   - Hàm chuẩn hóa thanh điệu tiếng Việt (`normalizeParishName`): So khớp không phân biệt dấu cũ/mới (`Hoà Khánh` = `Hòa Khánh`).

---

*Hệ Thống Quản Lý Giáo Lý Công Giáo - MagnificatEdu © 2026*

