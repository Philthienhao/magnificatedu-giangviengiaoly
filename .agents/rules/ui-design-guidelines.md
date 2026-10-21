# Quy tắc thiết kế giao diện (UI Design Guidelines)

# Quy tắc thiết kế giao diện (UI Design Guidelines)

## Quy chuẩn thông báo tính năng mới trên hệ thống (7-Day Auto-Expiring Feature Announcement)
- **Quy tắc thời gian (Strict 7 Days)**: Mỗi khi có tính năng/chức năng mới cần giới thiệu cho Giáo lý viên, banner thông báo dạng thẻ nổi bật (như banner Game Giáo Lý Tương Tác) **chỉ được phép xuất hiện tối đa trong vòng 1 tuần (7 ngày)**.
- **Tự động gỡ bỏ (Zero UI Residue)**:
  - Sau khi đủ 1 tuần kể từ ngày ra mắt (`startDate`) hoặc đủ 1 tuần kể từ lần đầu thiết bị mở app (`feat_first_seen_`), hệ thống phải **tự động xoá bỏ hoàn toàn**, không hiển thị banner trong DOM, trả lại giao diện Tổng quan thanh thoát, chuẩn mực.
  - Cung cấp nút đóng nhanh `(x)` để người dùng có thể chủ động ẩn nếu đã nắm thông tin.
- **Khai báo tập trung**:
  - Mọi thông báo tính năng mới phải khai báo trong danh sách `SYSTEM_FEATURE_ANNOUNCEMENTS` ở cả `app_v2.js` và `app.js`, kèm theo `id`, `startDate` và `durationDays: 7`.
- **Giao diện Tổng quan sau khi hết hạn thông báo**:
  - Tối giản, trang trọng, đậm chất sư phạm Công Giáo.
  - Chỉ tập trung vào các số liệu thống kê thực tế (KPI cards), lịch học, biểu đồ và các lối tắt nghiệp vụ.

