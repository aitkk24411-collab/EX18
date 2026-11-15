# Kết quả xác minh – 15/11/2026

## Môi trường và phạm vi

- Windows, Node.js 24.18.0, npm 11.16.0.
- Chỉ tạo file trong `Ex18-GroupCustomers`; không sửa các project còn lại.
- Đã đọc trang 20–22 của bản PDF 123 trang tìm thấy tại `C:/Users/dell/OneDrive/Máy tính/CHUNG CƯ/The nestro/Bai-Tap-Phat-Trien-Web-Kinh-Doanh-Nang-Cao.pdf`.
- Giữ nguyên dữ liệu bài tập, sửa dấu phẩy thừa để JSON hợp lệ. Ảnh trích từ chính bảng trang 22, lưu cục bộ thành PNG.

## Lệnh thực thi

| Lệnh | Exit code | Kết quả |
| --- | --- | --- |
| `npm install` | 0 | Cài thành công, tạo package-lock.json |
| `npm run build` (sau thay đổi cuối cùng) | 0 | Angular/TypeScript/template compile thành công; bundle 224.63 kB |
| `npm start` | Đang chạy | Dev server tại http://127.0.0.1:4200/ |
| `npx playwright install chromium` | 0 | Cài Chromium/Headless Shell thành công |
| `npm run test:e2e` (sau cài browser) | 0 | **5 passed (16.0s)** |
| `npm audit --omit=dev --json` | 0 | 0 lỗ hổng dependency production tại thời điểm kiểm tra |

Lần chạy E2E đầu chưa thực thi được vì quá trình tải Chromium chưa hoàn tất. Sau khi cài browser xong, chạy lại toàn bộ 5 ca và đều PASS. Không bỏ qua ca kiểm thử nào.

`npm install` báo 16 cảnh báo mức moderate cho toàn bộ cây dependencies (bao gồm công cụ phát triển). Audit chỉ dependencies production trả 0. Không thực hiện nâng cấp phá vỡ phiên bản bằng `npm audit fix --force`.

## Đối chiếu yêu cầu

| Yêu cầu | Bằng chứng | Trạng thái |
| --- | --- | --- |
| Project độc lập trong một folder | package.json, angular.json, lockfile riêng; cài/build/start tại folder bài 18 | PASS |
| JSON đúng trường, đúng dữ liệu | HTTP 200, parse thành công; 2 nhóm có số khách 3 và 2; đối chiếu Id/Name/Email/Age với đề | PASS |
| 5 ảnh đúng người, đúng tên file | Trích ảnh bảng trang 22; kiểm tra trực quan; 5 URL HTTP 200, MIME image/png, chữ ký PNG và naturalWidth > 0 | PASS |
| Interface ICustomer, ICustomerGroup | src/app/models/customer.ts; strict TypeScript build | PASS |
| Injectable service và HttpClient | customer.service.ts; provideHttpClient tại main.ts; browser đọc JSON thật | PASS |
| Observable<ICustomerGroup[]> | Chữ ký getCustomers; kiểm tra TypeScript thành công | PASS |
| catchError, throwError, retry(3) | E2E giả lập 404 quan sát đúng 4 request, hiển thị lỗi sau retry | PASS |
| Không hardcode khách hàng trong component | Component chỉ gọi service; dữ liệu chỉ khai báo trong JSON (bản kỳ vọng nằm trong E2E) | PASS |
| Bảng Id, Name, Email, Age, # | Kiểm tra template và ảnh chụp Chromium | PASS |
| Vòng lặp nhóm và khách hàng lồng nhau | Hai @for; DOM đúng 2 tbody, lần lượt 3 và 2 dòng khách | PASS |
| Tiêu đề 1 - VIP, 2 - Normal | Playwright so khớp nội dung dòng nhóm | PASS |
| Property binding [src] | Kiểm tra template; ảnh DOM đúng src/alt và tải thành công | PASS |
| Loading, an toàn trước khi có dữ liệu | Giữ request để kiểm tra loading, bảng chưa xuất hiện; hoàn tất HTTP rồi hiện 5 dòng | PASS |
| Thông báo lỗi HTTP và phục hồi | 404, lỗi mạng, lỗi parse đều hiện thông báo; Thử lại tải JSON thật và xóa thông báo | PASS |
| CSS, căn chỉnh, màn hình nhỏ | Kiểm tra ảnh desktop; kiểm tra bảng cuộn ngang và trang không tràn ở viewport 390px | PASS |
| Route /customers | Mở trực tiếp và kiểm tra redirect từ / | PASS |
| Không cần backend | Chỉ Angular dev server + static assets | PASS |
| README và lệnh chạy | README.md hướng dẫn npm install, npm start, ng serve, build, E2E | PASS |

Không có yêu cầu chức năng FAIL. Kiểm thử trình duyệt được thực hiện trên Chromium, chưa kiểm tra riêng Firefox/Safari.

## Ảnh bằng chứng

- [Giao diện desktop](customers-desktop.png)
- [Giao diện mobile](customers-mobile.png)
- [Thông báo HTTP 404](customers-http-error.png)
- [Trang 22 tài liệu](reference-page22.png)
- [Bảng gốc và ảnh nhân vật](reference-table.png)
