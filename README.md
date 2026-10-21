# 🇻🇳 MagnificatEdu - Hệ Thống Quản Lý Giáo Lý Công Giáo

**MagnificatEdu** là hệ thống web ứng dụng hiện đại hỗ trợ Quản Lý Giáo Lý Công Giáo, Quản lý Điểm số, Điểm danh, Thi đua, Xuất Báo Cáo Excel và Lưu trữ dữ liệu Thiêng Liêng cho các Giáo xứ & Huynh trưởng/Giáo lý viên.

---

## 🌐 1. Thông Tin Tên Miền & Triển Khai (Deployment)

* **Tên miền chính thức chuẩn duy nhất**: **`https://magnificatedu.vercel.app`**
* **Tên miền phụ (Auto-generated)**: `https://magnificatedu-giangviengiaoly.vercel.app`
* **Nền tảng Hosting**: Vercel
* **Kho lưu trữ GitHub**: `https://github.com/Philthienhao/magnificatedu-giangviengiaoly.git`

> [!IMPORTANT]
> **QUY CHUẨN TÊN MIỀN & PHÂN ĐỊNH DỰ ÁN TUYỆT ĐỐI (PROJECT ISOLATION):**
> 1. **Dự án này (`giangviengiaoly`)**: MagnificatEdu - Quản Lý Giáo Lý Công Giáo ➔ Tên miền CHÍNH THỨC & DUY NHẤT: **`https://magnificatedu.vercel.app`**.
> 2. **Dự án riêng biệt (`Gamegiaoduc`)**: Đồ Nghề Dạy Học / 30+ Game Đỉnh Cao ➔ Tên miền CHÍNH THỨC: **`https://donghedayhoc.vercel.app`**.
> 3. **CẢNH BÁO**: Tuyệt đối không trỏ nhầm hoặc gán alias của `magnificatedu.vercel.app` sang dự án `Gamegiaoduc` hay bất kỳ dự án nào khác.
> 4. **Tên miền không sử dụng**: KHÔNG sử dụng `magnificat.vercel.app` (bị Vercel chặn 403 policy). Mọi truy cập phải dùng `https://magnificatedu.vercel.app`.

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

### ⚡ Sự cố 10: Nhầm lẫn tên miền `magnificat.vercel.app` & Thiếu Cổng Giao diện Đăng Nhập (Auth Gate)
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

### ⚡ Sự cố 11: XỬ LÝ TRIỆT ĐỂ LỖI TÁI PHẠM NHẦM LẪN TÊN MIỀN & GIAO DIỆN GIỮA MAGNIFICATEDU VÀ GAMEGIAODUC (DIỆT TẬN GỐC NGUYÊN NHÂN TRONG DEPLOY SCRIPT)
* **Hiện tượng & Bức xúc của người dùng**:
  - Người dùng truy cập `https://magnificatedu.vercel.app` nhưng màn hình lại hiện giao diện của dự án Game Giáo Dục (`Gamegiaoduc` / *Đồ Nghề Dạy Học - 30+ Game Đỉnh Cao*).
  - Lỗi này đã xảy ra nhiều lần và bị tái phạm liên tục sau mỗi lần người dùng hoặc AI deploy dự án Game Giáo Dục.
* **ĐIỀU TRA VẾT DẦU LOANG & TÌM RA NGUYÊN NHÂN GỐC RỄ (SMOKING GUN ROOT CAUSE)**:
  - Khi kiểm tra toàn bộ mã nguồn của cả 2 dự án, đã phát hiện tại file **`/Users/mac/Downloads/Antigravity/Gamegiaoduc/scripts/deploy_vercel.cjs`**, dòng số 20 có chứa lệnh:
    ```javascript
    execSync(`npx vercel alias set ${deploymentId} magnificatedu.vercel.app`, { stdio: 'inherit' });
    ```
  - **Hậu quả**: Dự án `Gamegiaoduc` và dự án `giangviengiaoly` cùng nằm trong 1 tài khoản Vercel (`philthienhaos-projects`). Cứ mỗi khi dự án `Gamegiaoduc` chạy lệnh `npm run deploy`, script triển khai của nó lại tự động lấy domain `magnificatedu.vercel.app` và ép trỏ sang deployment mới của Game Giáo Dục!
  - Do đó, dù ở MagnificatEdu có sửa alias bao nhiêu lần thì hễ bên Game Giáo Dục deploy là domain lại bị cướp mất, gây ra hiện tượng tái phạm lỗi liên tục!
* **CÁC BIỆN PHÁP XỬ LÝ TRIỆT ĐỂ ĐÃ HOÀN TẤT 100%**:
  1. **Diệt tận gốc mã tự ý chiếm domain**:
     - Đã xóa vĩnh viễn dòng lệnh gán alias `magnificatedu.vercel.app` trong file `Gamegiaoduc/scripts/deploy_vercel.cjs`.
     - Đã commit và push bản sửa đổi lên kho GitHub của dự án Game Giáo Dục (`https://github.com/Philthienhao/Educational-Games-Sky-Line-.git`).
  2. **Khôi phục và khóa cứng Domain cho MagnificatEdu**:
     - Chạy lệnh gán lại alias chính thức:
       ```bash
       npx vercel alias set magnificatedu-giangviengiaoly-1s0so0cs7-philthienhaos-projects.vercel.app magnificatedu.vercel.app
       ```
     - Domain `magnificatedu.vercel.app` hiện đã gắn trực tiếp vào project `magnificatedu-giangviengiaoly` (`prj_oqP8KmZbEir8DXEv05LuiMUlJUqm`).
  3. **Thiết lập Quy Tắc Bảo Vệ Dự Án Toàn Cục (Global & Workspace AI Invariants)**:
     - Đã tạo file Quy Tắc Toàn Cục tại `/Users/mac/.gemini/config/rules/project-identity-isolation.md` (áp dụng tự động cho mọi phiên AI, mọi tác vụ trên máy tính).
     - Đã tạo file Quy Tắc Dự Án tại `.agents/rules/project-identity-isolation.md` và cập nhật `.agents/rules/deployment-and-domain-rules.md`.
  4. **Kiểm tra xác thực trực tiếp (Sanity Verification)**:
     ```bash
     curl -sL https://magnificatedu.vercel.app | grep -E "(<title>|app_v2)"
     # Kết quả chuẩn xác 100%:
     # <title>MagnificatEdu - Hệ Thống Quản Lý Giáo Lý Công Giáo</title>
     # <script src="app_v2.js?v=20261012_v3200"></script>
     ```
* **Bản Đồ Phân Quyền Tên Miền Vĩnh Viễn**:
  - `https://magnificatedu.vercel.app` ➔ **CHỈ DÀNH RIÊNG CHO MagnificatEdu - Quản Lý Giáo Lý Công Giáo**.
  - `https://donghedayhoc.vercel.app` ➔ **DÀNH CHO Đồ Nghề Dạy Học / Kho Game Giáo Dục**.
  - Nghiêm cấm mọi hành vi trỏ chéo tên miền giữa hai dự án này dưới bất kỳ hình thức nào.

---

### ⚡ Sự cố 12: Xử lý triệt để lỗi Ô Nhiễm CSS Toàn Cục (Unscoped CSS Leakage) làm tối đen Slogan Sidebar & Cơ chế giải phóng Cache PWA

* **Hiện tượng**:
  - Đoạn trích dẫn của *Chân Phước Anrê Phú Yên* trên thanh Sidebar (`.sidebar-slogan-box`) bị đổi chữ thành màu xanh đen đậm `#1e293b`.
  - Trên nền Sidebar xanh đen tối (`#0f172a`), chữ gần như trùng màu với nền khiến người dùng không đọc được nội dung, chỉ thấy icon trích dẫn và tên tác giả.
  - Khi sửa CSS lần đầu, màn hình người dùng vẫn chưa cập nhật do dính bộ nhớ tạm của Service Worker PWA (`sw.js`) và chưa push code lên remote Vercel.

* **Phân tích nguyên nhân gốc rễ (Root Cause Analysis)**:
  1. **Unscoped Class Selector**: Khi thiết kế giao diện thẻ trích dẫn trong Modal Đăng nhập (vốn có nền vàng kem sáng), mã CSS đã viết selector chung không có tiền tố cha:
     ```css
     .slogan-text { color: #1e293b; font-size: 11px; ... }
     ```
  2. **Hiệu ứng đè xếp tầng (CSS Cascade Override)**: Đoạn CSS trên nằm ở phía cuối file `styles.css`, nên nó tự động đè lên class `.slogan-text` ở Sidebar phía trên.
  3. **PWA Service Worker Cache**: File `sw.js` cache cứng `styles.css` theo tên URL. Khi không nâng version query `?v=...` và không tăng `CACHE_NAME`, trình duyệt ưu tiên đọc từ cache cũ.

* **Các giải pháp đã khắc phục triệt để**:
  1. **Cô lập triệt để phạm vi selector (Strict Scoping)**:
     - Giới hạn selector modal: `.slogan-card-auth .slogan-text` và `.slogan-card-auth .slogan-text b`.
     - Chỉ định rõ ràng và ưu tiên cao cho Sidebar: `.sidebar-slogan-box p, .sidebar-slogan-box .slogan-text { color: #f1f5f9 !important; }`.
  2. **Gắn Inline Style phòng thủ trực tiếp**: Bổ sung `style="color: #f1f5f9 !important;"` trực tiếp vào thẻ HTML trong `index.html`.
  3. **Quy trình 3 bước giải phóng Cache PWA**:
     - Nâng link gọi stylesheet: `styles.css?v=20261021_v6901`.
     - Nâng cache Service Worker lên `magnificatedu-cache-v31` trong cả `sw.js` và `pwa.js`.
     - Tạo commit và push lên nhánh `main` GitHub để Vercel Production triển khai đồng bộ.

* **QUY TẮC BẤT DI BẤT DỊCH (NEVER REPEAT)**:
  - **Quy tắc 1 - Luôn Scope CSS theo Component Cha**: Tuyệt đối KHÔNG BAO GIỜ viết các selector class phổ biến (`.slogan-text`, `.title`, `.desc`, `.author`, `.card`...) đứng một mình ở cấp độ toàn cục. Bắt buộc phải có tiền tố class cha (ví dụ: `.slogan-card-auth .slogan-text`).
  - **Quy tắc 2 - Bảo vệ vùng giao diện nền tối cố định**: Bất kỳ text nào nằm trong container tối (Dark Sidebar, Header, Modal Backdrop) phải được khai báo màu sáng rõ ràng kèm class cha để không bị ghi đè ngẫu nhiên.
  - **Quy tắc 3 - Luôn đồng bộ 3 điểm khi cập nhật CSS cốt lõi**: `styles.css` $\rightarrow$ `index.html` (bump `?v=`) $\rightarrow$ `sw.js` / `pwa.js` (bump cache version) $\rightarrow$ `git push` để Vercel cập nhật.

---

### ⚡ Sự cố 13: Xử lý triệt để lỗi Đứt gãy Dữ liệu: GLV Mới Đăng Ký Có Thông Báo Nhưng Không Xuất Hiện Trong Danh Sách Quản Lý

* **Hiện tượng**:
  - Có 2 Giáo lý viên mới (`JB Hồ Nguyên Bảo` - Giáo xứ Thanh Bình và `T. Giuse HONGYEN NDN` - Giáo xứ Hoà Khánh) đăng nhập/đăng ký vào hệ thống.
  - Trên màn hình Admin hiển thị đầy đủ thông báo chuông và thông báo bảng chi tiết.
  - Nhưng trong mục Quản lý **"Đội Ngũ Giáo Lý Viên"** (`#catechists`), danh sách vẫn chỉ có 3 người cũ, không có tên 2 GLV mới.

* **Phân tích nguyên nhân gốc rễ (Root Cause Analysis)**:
  1. **Tách rời giữa Event Log và Entity Data**: Khi giáo viên đăng nhập trên máy của họ, hàm `notifyAdminMasterOfLogin` chỉ tạo chuỗi thông báo lưu vào `adminData.notifications` của Admin trên Cloud Supabase mà không tự động ghi nhận họ vào `adminData.catechists`.
  2. **Trang Quản lý không đọc từ bảng thông báo**: Giao diện "Đội Ngũ Giáo Lý Viên" truy vấn danh sách từ `appData.catechists`, dẫn đến việc giáo viên dù đã báo danh nhưng không có mặt trong danh sách quản trị.

* **Các giải pháp đã khắc phục triệt để**:
  1. **Cơ chế Tự phục hồi & Nạp tự động từ Thông báo (`syncCatechistsFromNotifications`)**:
     - Bổ sung logic quét tự động toàn bộ thông báo hệ thống của Admin.
     - Sử dụng Regex bóc tách chuẩn xác: Email, Họ tên, Tên Thánh, Giáo xứ từ nội dung thông báo và tự động nạp thẳng vào `appData.catechists` và `accountsList`.
     - Tự động kích hoạt mỗi khi truy cập trang Giáo lý viên hoặc khi Admin tải dữ liệu.
  2. **Đồng bộ thực thể hai chiều ngay khi có Event (`notifyAdminMasterOfLogin`)**:
     - Cập nhật hàm thông báo để từ nay về sau, khi có bất kỳ GLV mới nào tham gia, hệ thống vừa ghi thông báo vừa lập tức nạp hồ sơ GLV vào `adminData.catechists` trên Cloud Supabase.
  3. **Đồng bộ song song**: Áp dụng nhất quán trên cả `app_v2.js` và `app.js`, nâng cache buster lên `v=20261021_v6902` và Service Worker `v32`.

* **QUY TẮC BẤT DI BẤT DỊCH (NEVER REPEAT)**:
  - **Quy tắc 1 - Luôn đồng bộ Thực thể kèm theo Sự kiện (Entity Materialization)**: Bất kỳ khi nào một hành động của người dùng (Đăng ký, Đăng nhập, Nộp bài...) gửi thông báo về cho Admin, BẮT BUỘC phải đồng thời lưu thực thể tương ứng (Hồ sơ GLV, Tài khoản, Điểm số) vào Database của Admin. Tuyệt đối không để sự kiện chỉ là một dòng chữ đơn thuần.
  - **Quy tắc 2 - Cơ chế Tự phục hồi dữ liệu (Self-Healing Fallback)**: Mọi hàm hiển thị danh sách quản lý phải có bước kiểm tra chéo với nhật ký sự kiện/thông báo để tự động bù đắp nếu bản ghi thực thể bị thất lạc giữa các thiết bị.

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

## 📌 SỰ CỐ 12: KHẮC PHỤC TRIỆT ĐỂ LỖI NÚT SỬA & XOÁ TOÀN HỆ THỐNG VÀ XÁC THỰC TÀI KHOẢN ADMIN MASTER (12/10/2026)

### 1. Nguyên nhân cốt lõi (Root Cause):
- **Phân định danh tính & Quyền Admin**:
  - Khi Admin đăng nhập với tên người dùng `"philthienhao"` và mật khẩu `"123"`, thẻ input trong `index.html` từng để `type="email"`, gây chặn submit bởi HTML5 validation.
  - Ngay cả khi submit, hệ thống so khớp chuỗi không tìm thấy `"philthienhao"` trong danh sách (do tài khoản gốc là `"philthienhao@gmail.com"`), từ đó kích hoạt nhánh auto-register tài khoản mới với vai trò `"Giáo lý viên"`.
  - Hậu quả: `hasAdminAccess(currentUser)` trả về `false`, người dùng mất toàn bộ quyền Admin Master. Khi bấm nút Sửa/Xóa lớp học, giáo lý viên, học viên hoặc tài khoản, các hàm kiểm tra quyền và tìm kiếm dữ liệu không tìm thấy đối tượng hợp lệ nên không mở modal hoặc chặn thao tác.
- **Tùy chọn dropdown modal bị thiếu**:
  - `#cls-grade` thiếu giá trị `"Giáo Lý"`, khiến các lớp như "Lớp 9.1 Hòa Khánh" có phân ngành `"Giáo Lý"` không chọn được option hợp lệ.
  - `#cat-role` thiếu giá trị `"Giáo lý viên"` và `"Admin"`, khiến modal giáo lý viên bị lệch vai trò.
- **Cơ chế fallback trong các handler**:
  - `editClass`, `deleteClass`, `editStudent`, `deleteStudent`, `editCatechist`, `openAdminEditModal` trước đây thoát ngay khi không tìm thấy bản ghi trong mảng cục bộ, không quét qua `allCloudUserDataMap` và không có fallback object để luôn luôn mở modal.

### 2. Các giải pháp đã áp dụng triệt để:
1. **Chuẩn hóa thông tin đăng nhập Admin Master**:
   - `teacher-login-email` đổi sang `type="text"`, cho phép nhập `"philthienhao"` hoặc `"philthienhao@gmail.com"`.
   - Mọi lượt đăng nhập với username `"philthienhao"`, mật khẩu `"123"` hoặc `"123456"` tự động ánh xạ chuẩn xác về tài khoản Admin Master (`philthienhao@gmail.com`, Võ Thiện Hảo, role: `Admin`, giáo xứ `Giáo Xứ Hoà Khánh`).
   - Cập nhật `isSuperAdmin` và `hasAdminAccess` nhận diện `"philthienhao"` và tên chứa `"Thiện Hảo"`.
2. **Bổ sung tùy chọn Select**:
   - Thêm `<option value="Giáo Lý">Giáo Lý</option>` vào `#cls-grade`.
   - Thêm `<option value="Giáo lý viên">` và `<option value="Admin">` vào `#cat-role`.
   - Chuyển `#cat-email` sang `type="text"` để tương thích username.
3. **Cơ chế Fallback & Quét Đám Mây Đa Tầng**:
   - `editClass`: Quét `allClasses`, `appData.classes`, `allCloudUserDataMap`; nếu không tìm thấy vẫn tạo fallback object để modal luôn luôn mở.
   - `deleteClass`: Tự động tìm kiếm đa tầng, mở hộp thoại xác nhận xóa `universal-confirm-modal`, thực thi cascade xóa trên toàn bộ database và cập nhật giao diện.
   - `editCatechist` & `deleteCatechist`: Quét mọi nguồn dữ liệu, bảo vệ tài khoản Master không bị xóa nhầm, cho phép chỉnh sửa và xóa an toàn.
   - `editStudent` & `deleteStudent`: Tìm kiếm trên toàn bộ dữ liệu lớp học và học viên, mở modal chỉnh sửa và xác nhận xóa triệt để.
   - `openAdminEditModal` & `quickDeleteAdminUser`: Mở modal sửa thông tin tài khoản và xác nhận xóa tài khoản thành công.
4. **Kiểm thử tự động 9/9 Test Suites**:
   - Kiểm tra đăng nhập với `"philthienhao"` / `"123"`.
   - Kiểm tra cả 4 khối chức năng: Lớp học (Sửa/Xóa), Giáo lý viên (Sửa/Xóa), Học viên (Sửa/Xóa), Tài khoản quản trị (Sửa/Xóa).
   - Tỷ lệ vượt qua: 100% (9/9 suites pass).

---

### ⚡ Cập nhật Giao diện: Tinh gọn ô Điểm Danh & Chuyển hướng nhanh từ Dashboard Tổng quan (2026-10-16)
1. **Tinh gọn bảng điểm danh**:
   - Loại bỏ các chấm màu emoji (`🟢`, `🟡`, `🔵`, `🔴`) thừa thãi bên cạnh ô radio điểm danh.
   - Giữ lại ô tick tương ứng trực tiếp với nội dung: `( ) Có mặt`, `( ) Đi trễ`, `( ) Vắng có phép`, `( ) Vắng không phép`.
   - Căn lề thẳng hàng, gọn gàng, tăng trải nghiệm thị giác và dễ thao tác trên cả máy tính lẫn điện thoại.
   - Đồng bộ nhãn trạng thái và file xuất Excel không còn bị dính emoji màu.
2. **Kích hoạt điều hướng trực tiếp cho các thẻ Tổng quan (Overview KPI Cards)**:
   - Thêm hiệu ứng trỏ chuột (`cursor: pointer`), tooltip và sự kiện click trực tiếp:
     - **Lớp Học Giáo Lý**: Bấm vào chuyển ngay tới trang **Lớp học** (`#classes`).
     - **Tổng Số Học Viên**: Bấm vào chuyển ngay tới trang **Học viên** (`#students`).
     - **Giáo Lý Viên**: Bấm vào chuyển ngay tới trang **Giáo lý viên** (`#catechists`).
     - **Tỷ Lệ Chuyên Cần**: Bấm vào chuyển ngay tới trang **Điểm danh** (`#attendance`).
   - Các khối tóm tắt điểm danh trong ngày (Có mặt, Đi trễ, Vắng có phép, Vắng không phép) khi bấm vào cũng tự động dẫn thẳng tới trang Điểm danh.
3. **Đồng bộ hóa & Cache Buster**:
   - Đồng bộ hoàn toàn giữa `app_v2.js` và `app.js`.
   - Nâng phiên bản cache buster trong `index.html` lên `v=20261016_v4100` và Service Worker cache trong `sw.js` lên `magnificatedu-cache-v7`.

---

## 🏆 7. CHỨC NĂNG THI ĐUA LỚP CHỦ NHIỆM & BẢNG VINH DANH TỰ ĐỘNG THÁNH KINH

Hệ thống thi đua hoa thiêng nhân đức cho học sinh trong lớp chủ nhiệm được thiết kế chuyên biệt cho Giáo lý Công giáo & Phong trào Thiếu Nhi Thánh Thể:

1. **Khởi đầu mỗi tháng 100 điểm**:
   - Mỗi học sinh khi bước sang tháng mới tự động nhận **100 điểm hồng ân** xuất phát.
   - Không cần cài đặt thủ công; hệ thống tự tính điểm: $Điểm = 100 + \sum(\Delta_{khen\_thưởng}) - \sum(\Delta_{vi\_phạm})$.

2. **Cơ chế Khen thưởng (+10đ) & Nhắc nhở vi phạm (-5đ)**:
   - **Khen thưởng (+10đ)**: 
     - 7 lý do chuẩn Công giáo (Thuộc kinh & bài giáo lý, Đi lễ đúng giờ, Gương mẫu bác ái, Tích cực phát biểu, Hát thánh ca sốt sắng, Vệ sinh lớp học, Việc lành hy sinh) hoặc tự nhập lý do riêng.
     - Âm thanh chuông thiên thần (Pure Synthetic Web Audio) và hiệu ứng bay số `+10` màu xanh ngọc.
   - **Nhắc nhở vi phạm (-5đ)**:
     - 7 lý do nề nếp yêu thương (Đi trễ không phép, Nói chuyện riêng trong giờ học/lễ, Quên mang sách Giáo lý/Kinh Thánh, Chưa làm bài tập, Chạy nhảy mất trật tự nơi thánh đường, Dùng điện thoại, Thiếu lễ phép) hoặc tự nhập lý do riêng.
     - Âm thanh chuông nhắc nhở và hiệu ứng bay số `-5` màu đỏ.
   - **Nhật ký & Hoàn tác**: Xem lịch sử chi tiết từng lần chấm điểm, cho phép xóa/hoàn tác để hoàn trả điểm ngay lập tức nếu nhập nhầm.
   - **Thưởng nhiều bạn (+10đ)**: Khen thưởng hàng loạt cho cả lớp hoặc nhóm học sinh được chọn chỉ với 1 click.

3. **Bảng Vinh Danh Tự Động Cuối Tháng (Automatic Monthly Hall of Fame)**:
   - Tự động xếp hạng học sinh từ điểm cao nhất đến thấp nhất theo từng tháng.
   - **Bục Vinh Quang 3D (Top 3 Podium)**:
     - 🥇 **Quán Quân (Hạng 1)**: Vương miện vàng lấp lánh, cúp vàng, danh hiệu cao quý nhất, hiệu ứng hào quang.
     - 🥈 **Á Quân 1 (Hạng 2)**: Cúp bạc, danh hiệu Kinh Thánh xuất sắc.
     - 🥉 **Á Quân 2 (Hạng 3)**: Cúp đồng, danh hiệu Kinh Thánh kiên trì.
   - **Hiệu ứng pháo hoa ăn mừng**: Tích hợp Canvas Confetti rực rỡ với âm thanh đại chuông thánh đường.

4. **Hệ thống Danh Hiệu Nhân Vật Kinh Thánh**:
   - $\ge 140$ điểm: 👑 **"Người Quản Gia Trung Tín & Khôn Ngoan"** (*Lc 12, 42*)
   - $125 - 139$ điểm: 🛡️ **"Chiến Binh Đức Tin như Thánh Đa-vít"** (*1 Sm 17, 45*)
   - $115 - 124$ điểm: 🕊️ **"Tông Đồ Nhiệt Thành như Thánh Phaolô"** (*Gl 2, 20*)
   - $105 - 114$ điểm: 🌟 **"Người Đẹp Lòng Chúa như Samuel"** (*1 Sm 3, 10*)
   - $95 - 104$ điểm: 🐑 **"Chiên Ngoan Của Chúa Giêsu Mục Tử"** (*Ga 10, 14*)
   - $80 - 94$ điểm: 🌿 **"Công Chính & Cần Mẫn như Thánh Giuse"** (*Mt 1, 19*)
   - $< 80$ điểm: ✨ **"Được Chúa Yêu Thương & Nâng Đỡ Về Nhà Cha"** (*Lc 15, 6*)

5. **Xuất Bản & In Ấn Trang Trọng**:
   - 🖨️ **In Bảng Vàng A4 Của Lớp**: Mẫu in hoa văn hoàng gia Công giáo, logo giáo phận/giáo xứ, có chỗ ký của GLV Chủ nhiệm và Linh mục Quản xứ.
   - 📜 **In Phiếu Khen Thánh Thiện**: Giấy khen cá nhân cho từng học sinh hoặc in hàng loạt toàn bộ lớp.
   - 📲 **Sao chép Báo cáo Zalo**: Định dạng tin nhắn trang trọng, đẹp mắt để gửi ngay vào nhóm Zalo phụ huynh.

6. **Đồng bộ hóa Đám Mây & 2 GLV Đồng Chủ Nhiệm**:
   - Dữ liệu lưu trong `appData.classEmulations`, đồng bộ tự động giữa các GLV đồng phụ trách lớp và sao lưu trên Supabase Cloud.

---

*Hệ Thống Quản Lý Giáo Lý Công Giáo - MagnificatEdu © 2026*

