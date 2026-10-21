# Quy Tắc Tính Toàn Vẹn Dữ Liệu & Đồng Bộ Thực Thể (Data Integrity & Entity Materialization Invariants)

## 1. Bắt Buộc Đồng Bộ Thực Thể Cùng Sự Kiện (Entity Materialization on Events)
- **Tuyệt đối không để sự kiện chỉ là một chuỗi văn bản thông báo đơn thuần**:
  - Khi một hành động của người dùng (Đăng ký mới, Đăng nhập lần đầu, Nộp điểm số, Đổi thông tin lớp học...) gửi thông báo về cho Admin:
    - BẮT BUỘC phải đồng thời lưu/cập nhật đối tượng thực thể tương ứng (`catechists`, `classes`, `students`, `accountsList`) vào cơ sở dữ liệu (`adminData`).
    - Không bao giờ chỉ gọi `notifications.unshift(notifItem)` mà bỏ quên việc cập nhật mảng thực thể quản lý tương ứng.

## 2. Cơ Chế Tự Phục Hồi Dữ Liệu Từ Nhật Ký (Self-Healing Fallback)
- **Tự động bóc tách và phục hồi từ nhật ký khi phát hiện thiếu sót**:
  - Các hàm hiển thị dữ liệu tổng hợp (`getParishGlobalData`, `renderCatechists`) phải luôn tích hợp cơ chế tự phục hồi (`syncCatechistsFromNotifications`).
  - Khi người dùng truy cập trang, hệ thống tự động kiểm tra chéo với danh sách thông báo hoặc dữ liệu phân tán để bù đắp bất kỳ bản ghi nào chưa kịp nạp vào danh sách chính thức.
