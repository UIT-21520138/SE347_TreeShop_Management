import { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import {
  Input,
  Button,
  Table,
  Modal,
  Form,
  Space,
  Typography,
  Spin,
} from "antd";
import clsx from "clsx";
import TimeNow from "../../components/TimeNow";
import PriceFormat from "../../components/PriceFormat";
import CustomerInput from "./CustomerInput";
import { useDispatch, useSelector } from "react-redux";
import { orderSelector } from "../../redux/selectors";
import { orderActions } from "../../redux/slices/orderSlice";
import { useMemo } from "react";
import PriceInput from "../../components/PriceInput";
import { toast, ToastContainer } from "react-toastify";

function removeVietnameseTones(stra) {
  var str = stra;
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str.replace(/ + /g, " ");
  str = str.trim();
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    " "
  );
  return str;
}
function AddOrder() {
  const order = useSelector(orderSelector);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const showSuccessNoti = () => toast.success("Tạo hoá đơn thành công!");
  const showErorrNoti = () => toast.error("Có lỗi xảy ra!");

  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [isValidCustomer, setIsValidCustomer] = useState(false);

  const [receivedMoney, setReceivedMoney] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [exchangeMoney, setExchangeMoney] = useState(0);

  const [search, setSearch] = useState("");
  const [idFilter, setIdFilter] = useState("");

  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [renderProduct, setRenderProduct] = useState([]);
  useEffect(() => {
    fetch("http://localhost:302/api/product")
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.success) {
          setProducts(resJson.products);
          setRenderProduct(resJson.products);
        } else {
          setProducts([]);
          setRenderProduct([]);
        }
      })
      .catch((error) => {
        console.log(error);
        setProducts([]);
        setRenderProduct([]);
      });
  }, []);

  useEffect(() => {
    setRenderProduct(
      products
        .filter((product) => {
          if (search === "") {
            return product;
          } else {
            if (
              removeVietnameseTones(product.name.toLowerCase()).includes(
                removeVietnameseTones(search.toLowerCase())
              ) ||
              removeVietnameseTones(product?.type.name.toLowerCase()).includes(
                removeVietnameseTones(search.toLowerCase())
              )
            ) {
              var id = product.id.toString();
              return product.id.toString().includes(id);
            }
          }
        })
        .filter((product) => {
          if (!idFilter) {
            return true;
          }
          return product.id == idFilter;
        })
    );
  }, [search, idFilter]);

  useEffect(() => {
    setSelectedProducts(
      order.details.map((detail) => {
        const matchedProduct = products.find(
          (product) => product._id === detail.product
        );
        if (!matchedProduct) {
          return {
            id: "",
            image: "",
            name: "",
            price: 0,
            quantity: 0,
            discount: 0,
          };
        }
        return {
          _id: matchedProduct._id,
          id: matchedProduct.id,
          image: matchedProduct.image,
          name: matchedProduct.name,
          price: detail.price,
          discount: detail.discount,
          quantity: matchedProduct.quantity,
          orderQuantity: detail.quantity,
        };
      })
    );
  }, [order, products]);

  useEffect(() => {
    setExchangeMoney(receivedMoney - (order?.totalPrice - discount));
  }, [order.totalPrice, receivedMoney, discount]);

  function handleAddProduct(product) {
    dispatch(orderActions.add(product));
  }
  function handleDeleteProduct(_id) {
    dispatch(orderActions.remove(_id));
  }
  function handleUpdateQuantityProduct(product, quantity) {
    dispatch(orderActions.updateQuantity({ product, quantity }));
  }

  function createOrder() {
    setLoading(true);
    fetch("http://localhost:302/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...order,
        receivedMoney,
        exchangeMoney,
        discount,
      }),
    })
      .then((res) => res.json())
      .then((resJson) => {
        setShowPaymentDialog(false);
        if (resJson.success) {
          setLoading(false);
          showSuccessNoti();
          dispatch(orderActions.reset());
          setReceivedMoney(0);
        } else {
          setLoading(false);
          showErorrNoti();
        }
      })
      .catch((error) => {
        console.log(error);
        setShowPaymentDialog(false);
        setLoading(false);
        showErorrNoti();
      });
  }

  return (
    <>
      <div className="container w-full">
  <CustomerInput setIsValid={setIsValidCustomer} />
  <div className="mt-2 flex">
    {/* LEFT VIEW */}
    <div className="flex flex-1 flex-col rounded-md border py-3 px-2 shadow">
      {/* HEADER ACTION GROUP */}
      <div className="flex space-x-2 pb-2">
        {/* ID */}
        <Input
          value={idFilter}
          onChange={(e) => setIdFilter(e.target.value)}
          placeholder="Mã"
          style={{ width: "100px" }}
        />

        {/* Search */}
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm sản phẩm"
        />
      </div>

      {/* LIST PRODUCT */}
      <div className="flex h-[68vh] flex-col overflow-scroll">
        <div className="grid max-h-[100] min-h-[50] grid-cols-3 gap-2">
          {renderProduct
            ?.filter((product) => product.quantity > 0)
            .map((product) => (
              <div
                key={product.id}
                className="cursor-pointer select-none overflow-hidden rounded-md border shadow hover:shadow-md"
                onClick={() => handleAddProduct(product)}
              >
                <img
                  className="aspect-[5/3] w-full object-cover"
                  src={product.image || "/placeholder.png"}
                />
                <div className="space-y-1 p-2">
                  <p className="font-semibold text-blue-600">{product.name}</p>
                  <p className="text-sm font-semibold">
                    {"Mã: " + product.id}
                  </p>
                  <p className="text-sm font-semibold">
                    {"Loại: " + product.type?.name || "-"}
                  </p>
                  <p>
                    <PriceFormat>{product.price}</PriceFormat>
                    <span className="ml-1">VNĐ</span>
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>

    {/* RIGHT ORDER */}
    <div
  className="ml-3 flex flex-col rounded-md border py-1 px-2 shadow"
  style={{ maxWidth: "50%", minWidth: "400px" }} // Giới hạn kích thước
>
  <p className="text-center text-lg font-semibold">Hóa đơn</p>

  {/* LIST PRODUCT */}
  <Table
    dataSource={selectedProducts.map((product, index) => ({
      key: index,
      id: product?.id,
      image: product?.image,
      name: product?.name,
      price: product?.price,
      orderQuantity: product?.orderQuantity,
    }))}
    columns={[
      {
        title: "Mã",
        dataIndex: "id",
        key: "id",
        align: "center",
        width: 60, // Cố định độ rộng
      },
      {
        title: "Ảnh",
        dataIndex: "image",
        key: "image",
        render: (image) => (
          <img
            src={image || "/placeholder.png"}
            alt="product"
            style={{ width: "40px", height: "40px", borderRadius: "4px" }}
          />
        ),
        align: "center",
        width: 80, // Cố định độ rộng
      },
      {
        title: "Tên sản phẩm",
        dataIndex: "name",
        key: "name",
        width: 150, // Giới hạn chiều rộng
      },
      {
        title: "Giá (VND)",
        dataIndex: "price",
        key: "price",
        render: (price) => <PriceFormat>{price}</PriceFormat>,
        align: "right",
        width: 100, // Cố định độ rộng
      },
      {
        title: "Số lượng",
        dataIndex: "orderQuantity",
        key: "orderQuantity",
        render: (_, product) => (
          <Input
            type="number"
            min="1"
            value={product?.orderQuantity || ""}
            onChange={(e) =>
              handleUpdateQuantityProduct(product, e.target.value)
            }
            style={{ width: "70px" }}
          />
        ),
        align: "center",
        width: 100, // Cố định độ rộng
      },
      {
        title: "Hành động",
        key: "action",
        render: (_, product) => (
          <Button danger onClick={() => handleDeleteProduct(product._id)}>
            Xoá
          </Button>
        ),
        align: "center",
        width: 100, // Cố định độ rộng
      },
    ]}
    pagination={false}
    scroll={{ y: 300 }} // Giới hạn chiều cao
    locale={{ emptyText: "Chưa có sản phẩm trong hoá đơn" }}
    style={{ overflow: "auto" }} // Đảm bảo không kéo dài bất thường
  />

  <div className="flex items-center justify-between" style={{ marginTop: "16px" }}>
    <div className="flex items-center">
      <p className="font-semibold">
        <span>Tổng tiền: </span>
        <span className="text-xl text-blue-600">
          <PriceFormat>{order.totalPrice}</PriceFormat> VNĐ
        </span>
      </p>
    </div>
    <Button
      type="primary"
      disabled={!isValidCustomer || !order.totalPrice}
      onClick={() => setShowPaymentDialog(true)}
    >
      <span className="pr-2">
        <i className="fa-solid fa-circle-plus"></i>
      </span>
      Tạo hoá đơn
    </Button>
  </div>
</div>

  </div>
</div>


      {/* PAYMENT DIALOG */}
      <Modal
        open={showPaymentDialog}
        onCancel={() => setShowPaymentDialog(false)}
        footer={null}
        title="Thanh toán hoá đơn"
        width="80%"
      >
        <div style={{ display: "flex", gap: "24px" }}>
          {/* Sản phẩm */}
          <div style={{ flex: 1 }}>
            <Table
              dataSource={selectedProducts.map((product, index) => ({
                key: index,
                id: product?.id,
                image: product?.image,
                name: product?.name,
                price: product?.price,
                orderQuantity: product?.orderQuantity,
              }))}
              columns={[
                {
                  title: "Mã",
                  dataIndex: "id",
                  key: "id",
                  align: "center",
                  width: 60,
                },
                {
                  title: "Ảnh",
                  dataIndex: "image",
                  key: "image",
                  render: (image) => (
                    <img
                      src={image || "/placeholder.png"}
                      alt="product"
                      style={{ width: 40, height: 40, borderRadius: "50%" }}
                    />
                  ),
                  align: "center",
                  width: 80,
                },
                {
                  title: "Tên sản phẩm",
                  dataIndex: "name",
                  key: "name",
                },
                {
                  title: "Giá (VND)",
                  dataIndex: "price",
                  key: "price",
                  render: (price) => <PriceFormat>{price}</PriceFormat>,
                  align: "right",
                },
                {
                  title: "Số lượng",
                  dataIndex: "orderQuantity",
                  key: "orderQuantity",
                  align: "center",
                },
              ]}
              pagination={false}
              scroll={{ y: 300 }}
              locale={{
                emptyText: "Chưa có sản phẩm trong hoá đơn",
              }}
            />
          </div>

          {/* Thông tin hoá đơn */}
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: 16 }}>
              <Typography.Text strong>Tên khách hàng:</Typography.Text>{" "}
              {order?.customer?.name || ""}
            </div>
            <div style={{ marginBottom: 16 }}>
              <Typography.Text strong>Số điện thoại:</Typography.Text>{" "}
              {order?.customer?.phone || ""}
            </div>
            <div style={{ marginBottom: 16 }}>
              <Typography.Text strong>Địa chỉ:</Typography.Text>{" "}
              {order?.customer?.address || ""}
            </div>
            <div style={{ marginBottom: 16 }}>
              <Typography.Text strong>Ngày lập hoá đơn:</Typography.Text>{" "}
              <TimeNow />
            </div>

            <div style={{ marginTop: 24, marginBottom: 16 }}>
              <Typography.Text strong>Tổng tiền: </Typography.Text>
              <Typography.Text style={{ color: "#1890ff" }}>
                <PriceFormat>{order?.totalPrice}</PriceFormat> VNĐ
              </Typography.Text>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Typography.Text strong>Giảm giá: </Typography.Text>
                <PriceInput
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  style={{ width: 150 }}
                  placeholder="Giảm giá"
                />
              </Space>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Typography.Text strong>Thành tiền: </Typography.Text>
              <Typography.Text style={{ color: "#1890ff" }}>
                <PriceFormat>{order?.totalPrice - discount}</PriceFormat> VNĐ
              </Typography.Text>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Typography.Text strong>Tiền nhận: </Typography.Text>
                <PriceInput
                  value={receivedMoney}
                  onChange={(e) => setReceivedMoney(e.target.value)}
                  style={{ width: 150 }}
                  placeholder="Tiền nhận"
                />
              </Space>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Typography.Text strong>Tiền thừa: </Typography.Text>
              <Typography.Text
                style={{
                  color: exchangeMoney < 0 ? "red" : "#1890ff",
                }}
              >
                <PriceFormat>{exchangeMoney}</PriceFormat> VNĐ
              </Typography.Text>
            </div>

            <div
              style={{
                marginTop: 24,
                display: "flex",
                justifyContent: "flex-end",
                gap: 16,
              }}
            >
              {loading && (
                <Space>
                  <Spin />
                  <Typography.Text>Đang tạo hoá đơn...</Typography.Text>
                </Space>
              )}
              <Button onClick={() => setShowPaymentDialog(false)}>
                Quay lại
              </Button>
              <Button
                type="primary"
                onClick={() => createOrder()}
                disabled={exchangeMoney < 0}
              >
                Thanh toán hoá đơn
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <ToastContainer hideProgressBar />
    </>
  );
}
//
//
export default AddOrder;
