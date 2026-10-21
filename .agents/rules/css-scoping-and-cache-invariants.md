# Quy Tắc Cô Lập CSS & Vô Hiệu Hóa Cache PWA (CSS Scoping & Cache Invariants)

## 1. Bắt Buộc Giới Hạn Phạm Vi Cho Selector CSS (Strict CSS Scoping)
- **Tuyệt đối không khai báo selector class chung chung ở cấp độ root / unscoped**:
  - Không viết `.slogan-text`, `.slogan-author`, `.title`, `.subtitle`, `.card-desc` đứng một mình.
  - Mọi class con PHẢI luôn có tiền tố class cha rõ ràng, ví dụ:
    - Đúng: `.slogan-card-auth .slogan-text`, `.sidebar-slogan-box .slogan-text`
    - Sai: `.slogan-text { color: #1e293b; }`
- **Bảo vệ độ tương phản trên vùng nền tối**:
  - Các phần tử đặt trong vùng nền tối cố định (Dark Sidebar `#0f172a`, Dark Header, Modal Backdrop) phải được khai báo màu sáng rõ ràng (`#f1f5f9`, `#ffffff`, `#e2e8f0`) kèm `!important` hoặc inline style cố định nếu cần thiết, đảm bảo không bao giờ bị CSS từ component sáng màu khác ghi đè.

## 2. Quy Trình Đồng Bộ 3 Điểm Khi Cập Nhật CSS Cốt Lõi (PWA Cache Invalidation)
Khi chỉnh sửa `styles.css` hoặc các file CSS/JS dùng chung:
1. **Nâng Query Version trong HTML**:
   - Tăng chuỗi query version trong [index.html](file:///Users/mac/Downloads/Antigravity/giangviengiaoly/index.html) (ví dụ: `styles.css?v=YYYYMMDD_vXXXX`).
2. **Nâng Phiên Bản Cache Service Worker**:
   - Tăng `CACHE_NAME` trong [sw.js](file:///Users/mac/Downloads/Antigravity/giangviengiaoly/sw.js) (ví dụ: `magnificatedu-cache-v31`).
   - Tăng query đăng ký Service Worker trong [pwa.js](file:///Users/mac/Downloads/Antigravity/giangviengiaoly/pwa.js).
3. **Commit & Push Đồng Bộ Lên Vercel**:
   - Luôn commit và push code lên nhánh `main` để Vercel Production tự động triển khai bản build mới nhất cho người dùng.
