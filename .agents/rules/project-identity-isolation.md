# Rule: Nghiêm Cấm Nhầm Lẫn Danh Tính & Tên Miền Giữa MagnificatEdu và Gamegiaoduc

## 1. Bản Đồ Phân Định Tuyệt Đối
* **Dự án hiện tại (`giangviengiaoly`)**:
  - **Tên**: MagnificatEdu - Hệ Thống Quản Lý Giáo Lý Công Giáo
  - **Mã Vercel**: `magnificatedu-giangviengiaoly` (`prj_oqP8KmZbEir8DXEv05LuiMUlJUqm`)
  - **Tên miền DUY NHẤT**: **`https://magnificatedu.vercel.app`**
  - **Tiêu đề trang**: `<title>MagnificatEdu - Hệ Thống Quản Lý Giáo Lý Công Giáo</title>`
* **Dự án riêng biệt (`Gamegiaoduc`)**:
  - **Tên**: Đồ Nghề Dạy Học / Kho Game Giáo Dục (30+ Game đỉnh cao)
  - **Mã Vercel**: `eduvth` (`prj_eW3lFiJ7zWPtle2pHOkTMUtq4Rfs`)
  - **Tên miền chính thức**: **`https://donghedayhoc.vercel.app`**
  - **TUYỆT ĐỐI KHÔNG LIÊN QUAN ĐẾN `magnificatedu.vercel.app`**

## 2. Nguyên Nhân Lỗi Tái Diễn Đã Bị Tiêu Diệt Triệt Để
Trước đây, file `Gamegiaoduc/scripts/deploy_vercel.cjs` có dòng lệnh gán alias `magnificatedu.vercel.app` vào deployment của `Gamegiaoduc`. Dòng này đã được gỡ bỏ vĩnh viễn và push lên GitHub.

## 3. Quy Tắc Bắt Buộc Khi Thao Tác
1. Tuyệt đối không trỏ alias hay import mã nguồn giữa 2 dự án này.
2. Sau mỗi lần deploy tại `giangviengiaoly`, BẮT BUỘC kiểm tra:
   ```bash
   curl -sL https://magnificatedu.vercel.app | grep -i "<title>"
   ```
   Kết quả BẮT BUỘC phải là:
   `<title>MagnificatEdu - Hệ Thống Quản Lý Giáo Lý Công Giáo</title>`
