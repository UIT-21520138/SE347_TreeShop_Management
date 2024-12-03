# SE347 TreeShop Management

Dự án **SE347 TreeShop Management** là hệ thống quản lý cửa hàng cây xanh. Hệ thống này cung cấp các tính năng quản lý sản phẩm, đơn hàng, tài khoản, thống kê và nhiều tính năng khác để giúp quản lý hiệu quả cửa hàng.

## Mô Tả Dự Án

Dự án này được phát triển với React, Vite và các công nghệ web hiện đại. Nó cung cấp một giao diện người dùng thân thiện với các tính năng quản lý dữ liệu như sản phẩm, đơn hàng, tài khoản người dùng, và các thống kê liên quan đến cửa hàng cây xanh.

## Cài Đặt

Để bắt đầu sử dụng dự án, bạn cần cài đặt một số phụ thuộc và chạy ứng dụng trên máy của bạn. Dưới đây là các bước cài đặt:

### Bước 1: Clone Dự Án

```bash
git clone https://github.com/UIT-21520138/SE347_TreeShop_Management.git
cd SE347_TreeShop_Management
```
### Bước 2: Cài Đặt Phụ Thuộc
Cài đặt tất cả các thư viện phụ thuộc cần thiết với npm hoặc yarn:
```básh
npm install
```
or
```báh
yarn install
```
### Bước 3: Chạy Dự Án
Sau khi cài đặt xong các phụ thuộc, bạn có thể chạy ứng dụng ở chế độ phát triển:
```básh
npm run dev
```
## Các Tính Năng Chính

### Dự án này bao gồm các tính năng chính sau:

#### 1. Quản lý Sản Phẩm
Thêm, sửa, xóa sản phẩm trong cửa hàng.
Xem danh sách sản phẩm và tìm kiếm sản phẩm theo tên, loại, giá.
##### 2. Quản lý Đơn Hàng
Quản lý đơn hàng của khách hàng.
Theo dõi tình trạng đơn hàng, cập nhật trạng thái đơn hàng.
#### 3. Quản lý Tài Khoản
Quản lý tài khoản người dùng với các quyền khác nhau (Admin, Nhân viên, Khách hàng).
Cập nhật thông tin tài khoản và mật khẩu.
#### 4. Thống Kê
Xem các báo cáo thống kê về doanh thu, sản phẩm bán chạy, và tình hình đơn hàng.
#### 5. Giao Diện Người Dùng
Giao diện trực quan, dễ sử dụng với thanh điều hướng (Sidebar) và các bảng điều khiển.
#### 6. Xác Thực và Phân Quyền
Hệ thống phân quyền người dùng với khả năng đăng nhập, đăng ký và phân quyền cho các loại người dùng khác nhau.
##### Các Thư Viện và Công Cụ Sử Dụng

- React: Framework chính để xây dựng giao diện người dùng.
- Vite: Công cụ build ứng dụng.
- React Router: Định tuyến giữa các trang trong ứng dụng.
- React-Redux: Quản lý trạng thái toàn cục của ứng dụng.
- Formik: Quản lý biểu mẫu trong ứng dụng.
- Yup: Thư viện xác thực dữ liệu.
- TailwindCSS: CSS framework giúp tạo kiểu giao diện nhanh chóng và dễ dàng.
- React-Toastify: Thông báo người dùng với các thông báo toast.
- Moment.js: Thư viện xử lý ngày giờ.
## Cấu Trúc Thư Mục

Dưới đây là cấu trúc thư mục của dự án:
```bash
SE347_TreeShop_Management/
├── public/                   # Tệp tĩnh như ảnh, logo, v.v.
│   ├── home_img.png          # Ảnh sử dụng trên trang chủ
│   └── thegreen.png          # Logo hoặc biểu tượng sử dụng trong ứng dụng
│
└── src/                      # Mã nguồn của dự án
    ├── assets/               # Các tài nguyên như hình ảnh, biểu tượng, v.v.
    │   ├── images/           # Hình ảnh sử dụng trong ứng dụng
    │   └── icons/            # Các biểu tượng (icons) sử dụng trong UI
    │
    ├── components/           # Các component UI tái sử dụng
    │   ├── AccountRoleInput.jsx  # Component nhập vai trò tài khoản
    │   ├── ImageInput.jsx       # Component nhập ảnh (cho phép người dùng upload ảnh)
    │   ├── PriceFormat.jsx      # Component xử lý và hiển thị định dạng giá
    │   ├── ProductTypeInput.jsx # Component nhập loại sản phẩm
    │   ├── TimeNow.jsx          # Component hiển thị thời gian hiện tại
    │   └── TypeProduct.jsx      # Component nhập loại sản phẩm trong các form
    │
    ├── layouts/               # Các layout của ứng dụng
    │   ├── components/         # Các component UI tái sử dụng
    │   │   ├── Header.jsx             # Component Header, chứa thanh điều hướng hoặc logo
    │   │   └── Sidebar.jsx            # Component Sidebar, menu điều hướng bên trái
    │   ├── DefaultLayout.jsx  # Layout mặc định của các trang
    │   ├── FullLayout.jsx     # Layout đầy đủ bao gồm Header và Sidebar
    │   └── AuthLayout.jsx     # Layout cho phần quản lý
    │
    ├── pages/                 # Các trang của ứng dụng
    │   ├── Account.jsx         # Trang quản lý tài khoản
    │   ├── AddAccount.jsx      # Trang thêm tài khoản mới
    │   ├── AddCustomer.jsx     # Trang thêm khách hàng mới
    │   ├── AddOrder.jsx        # Trang thêm đơn hàng mới
    │   ├── AddProduct.jsx      # Trang thêm sản phẩm mới
    │   ├── AddProductType.jsx  # Trang thêm loại sản phẩm
    │   ├── AddRole.jsx         # Trang thêm vai trò người dùng
    │   ├── Customers.jsx       # Trang quản lý khách hàng
    │   ├── DetailAccount.jsx   # Trang chi tiết tài khoản
    │   ├── DetailCustomer.jsx  # Trang chi tiết khách hàng
    │   ├── DetailOrder.jsx     # Trang chi tiết đơn hàng
    │   ├── DetailRole.jsx      # Trang chi tiết vai trò người dùng
    │   ├── DetailTree.jsx      # Trang chi tiết cây xanh
    │   ├── DetailTreeBixoa.jsx # Trang chi tiết cây xanh (Xóa)
    │   ├── DetailTypeProduct.jsx # Trang chi tiết loại sản phẩm
    │   ├── Home.jsx            # Trang chính của ứng dụng
    │   ├── Login.jsx           # Trang đăng nhập
    │   ├── Order.jsx           # Trang quản lý đơn hàng
    │   ├── Product.jsx         # Trang quản lý sản phẩm
    │   ├── ProductType.jsx     # Trang quản lý loại sản phẩm
    │   ├── ProductView.jsx     # Trang xem sản phẩm
    │   ├── Role.jsx            # Trang quản lý vai trò người dùng
    │   ├── Statistic.jsx       # Trang thống kê
    │   ├── UpdateAccount.jsx   # Trang cập nhật tài khoản
    │   ├── UpdateCustomer.jsx  # Trang cập nhật khách hàng
    │   ├── UpdateProduct.jsx   # Trang cập nhật sản phẩm
    │   ├── UpdateProductType.jsx # Trang cập nhật loại sản phẩm
    │   └── UpdateRole.jsx      # Trang cập nhật vai trò người dùng
    │
    ├── redux/                  # Cấu hình và các slice của Redux
    │   ├── store.js            # Tạo store Redux và kết nối với ứng dụng
    │   ├── slices/             # Các phần quản lý trạng thái trong Redux
    │   │   ├── accountSlice.js # Quản lý trạng thái tài khoản người dùng
    │   │   └── orderSlice.js   # Quản lý trạng thái đơn hàng
    │   └── selectors/          # Các actions của Redux
    │       ├── accountSelector.js
    │       ├── orderSelector.js
    │       └── index.js
    │
    ├── routes/                 # Định nghĩa các route của ứng dụng
    │   └── index.js           # Định nghĩa các routes chính trong ứng dụng
    │
    ├── data/                 
    │   └── address.json       
    │
    ├── App.jsx                # Tệp chính của ứng dụng React
    └── main.jsx               # Tệp entry để render ứng dụng React vào DOM
```
