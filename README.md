# Bài 18 – Json Array Model – Group Customers (*)

Project Angular độc lập cho môn Phát triển Web Kinh doanh Nâng cao, TS. Trần Duy Thanh. Đã đối chiếu trang 20–22 của `Bai-Tap-Phat-Trien-Web-Kinh-Doanh-Nang-Cao.pdf` (bản 123 trang tìm được trên máy). Không dùng backend.

## Chạy project

Yêu cầu Node.js 22.12+ (nhánh 22), hoặc Node.js 24; npm. Môi trường đã kiểm thử: Node.js 24.18.0, npm 11.16.0.

Mở terminal tại thư mục `Ex18-GroupCustomers`:

```sh
npm install
npm start
```

Mở **http://127.0.0.1:4200/customers** (hoặc http://localhost:4200/customers). Trang `/` tự chuyển đến `/customers`.

Cũng có thể chạy `npx ng serve` hoặc `ng serve` nếu đã cài Angular CLI. Dừng server bằng Ctrl+C. Nếu cổng 4200 đang bận: `npm start -- --port 4201`, sau đó mở cổng 4201.

## Cấu trúc và kiến thức

```text
Ex18-GroupCustomers/
├── public/assets/
│   ├── data/customers.json
│   └── avatars/
│       ├── obama-avatar.png
│       ├── unun-avatar.png
│       ├── putin-avatar.png
│       ├── hodao-avatar.png
│       └── binhbinh-avatar.png
├── src/
│   ├── app/
│   │   ├── models/customer.ts
│   │   ├── services/customer.service.ts
│   │   ├── group-customers/
│   │   │   ├── group-customers.component.ts
│   │   │   ├── group-customers.component.html
│   │   │   └── group-customers.component.css
│   │   └── app.component.ts
│   ├── main.ts
│   ├── index.html
│   └── styles.css
├── e2e/customers.spec.ts
├── docs/                         # Ảnh tài liệu và bằng chứng chạy
├── angular.json
├── package.json
├── package-lock.json
├── playwright.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── .gitignore
└── README.md
```

- Angular 21 standalone, bật kiểm tra TypeScript và template nghiêm ngặt.
- `ICustomer` và `ICustomerGroup` khai báo đúng trường; giữ nguyên `CustomterTypeName` theo đề.
- `CustomerService`: `@Injectable({ providedIn: 'root' })`, `HttpClient.get<ICustomerGroup[]>()`, trả `Observable<ICustomerGroup[]>`, `retry(3)`, `catchError()` và `throwError()`.
- `provideHttpClient()` đăng ký tại `main.ts`. Component chỉ nhận dữ liệu qua service; không chứa dữ liệu khách hàng hardcode.
- Template dùng hai vòng `@for` lồng nhau, tương đương `*ngFor`, tạo dòng nhóm và dòng khách hàng. Ảnh dùng property binding `[src]`.
- Signals cập nhật giao diện khi HTTP bất đồng bộ hoàn tất trong Angular không dùng Zone.js. Mảng ban đầu rỗng; hiển thị loading, thông báo lỗi và nút Thử lại. `takeUntilDestroyed()` hủy subscription khi rời component.
- `public` được khai báo trong `angular.json`: URL dữ liệu là `/assets/data/customers.json`, không có đoạn `/public` trong URL.
- JSON giữ nguyên toàn bộ tên, email, tuổi theo đề, bỏ các dấu phẩy thừa trong ví dụ PDF.
- 5 ảnh PNG được trích riêng từ ảnh bảng minh họa ở **trang 22** của PDF; đúng thứ tự Obama, Kim jong Un, Putin, Hồ Cẩm Đào, Tap Can Binh. Nguồn tài liệu: TS. Trần Duy Thanh, https://tranduythanh.com/. Chỉ dùng cho bài tập học tập. Chất lượng ảnh giữ theo ảnh nhúng trong PDF.
- `docs/reference-page22.png` và `docs/reference-table.png` giúp đối chiếu giao diện/nhân vật với tài liệu gốc.

## Kiểm tra và build

```sh
npm run build
npx playwright install chromium
npm run test:e2e
```

Playwright tự chạy Angular nếu cổng 4200 chưa có server; nếu đã chạy `npm start` thì dùng server đó. Đảm bảo server cổng 4200 là project này. Không thay đổi hay xóa JSON thật khi giả lập lỗi.

Các ca kiểm thử:

1. Đọc JSON thật qua HTTP 200, xác nhận 2 nhóm (VIP: 3, Normal: 2); đối chiếu toàn bộ 5 dòng với đề; ảnh có kích thước tự nhiên, HTTP 200 và chữ ký PNG hợp lệ; không có lỗi JavaScript. Kiểm tra route `/` chuyển `/customers`, bố cục desktop/mobile.
2. Giữ request HTTP chưa hoàn tất để kiểm tra loading; trả request rồi xác nhận bảng xuất hiện.
3. Giả lập HTTP 404: 1 lần đầu + 3 lần retry, hiển thị lỗi, kết thúc loading; bỏ giả lập rồi bấm Thử lại để tải thành công.
4. Giả lập mất kết nối để kiểm tra thông báo mạng.
5. Giả lập JSON có dấu phẩy thừa để kiểm tra lỗi parse được bắt an toàn.

Ảnh chụp sau kiểm thử: `docs/customers-desktop.png`, `docs/customers-mobile.png`, `docs/customers-http-error.png`. Kết quả thực thi được ghi trong `docs/verification.md`.

Kiểm tra thủ công dữ liệu: mở http://127.0.0.1:4200/assets/data/customers.json. Để thử lỗi mà không sửa file, dùng DevTools → Network request blocking chặn `*customers.json`, tải lại trang; bỏ chặn rồi bấm Thử lại.

Bản build nằm trong `dist/ex18-group-customers/browser`. Nếu đưa lên static hosting, cấu hình fallback về `index.html` để mở trực tiếp `/customers`.
