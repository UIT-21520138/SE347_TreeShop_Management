import { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { Listbox, Popover } from "@headlessui/react";
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
              <input
                type="text"
                className="text-input w-16 py-1"
                value={idFilter}
                onChange={(e) => {
                  setIdFilter(e.target.value);
                }}
                placeholder="Mã"
              />

              {/* Search */}
              <input
                type="text"
                className="text-input flex-1 py-1"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                placeholder="Tìm kiếm sản phẩm"
              />
            </div>

            {/* LIST PRODUCT */}
            <div className="flex h-[68vh] flex-col overflow-scroll">
              <div className=" grid max-h-[100] min-h-[50] grid-cols-3 gap-2">
                {renderProduct
                  ?.filter((product) => {
                    if (product.quantity > 0) return product;
                  })
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
                        <p className="font-semibold text-blue-600">
                          {product.name}
                        </p>
                        <p className="text-sm font-semibold">
                          {"Mã: " + product.id}
                        </p>
                        <p className="text-sm font-semibold">
                          {"Loại: " + product.type?.name || "-"}
                        </p>
                        <p className="">
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
          <div className="ml-3 flex flex-1 flex-col rounded-md border py-1 px-2 shadow">
            <p className="text-center text-lg font-semibold">Hóa đơn</p>

            {/* LIST PRODUCT */}
            <table className="mt-2 w-full">
              <thead className="w-full rounded bg-blue-500 text-white">
                <tr className="flex h-11 w-full">
                  <th className="flex w-10 items-center justify-end px-2 text-center">
                    Mã
                  </th>
                  <th className="flex w-16 items-center justify-center px-2">
                    Ảnh
                  </th>
                  <th className="flex flex-1 items-center justify-start px-2">
                    Tên sản phẩm
                  </th>
                  <th className="flex w-28 items-center justify-end px-2">
                    Giá (VND)
                  </th>
                  <th className="flex w-24 items-center justify-end px-2">
                    Số lượng
                  </th>
                  <th className="flex w-20 items-center justify-center px-2"></th>
                </tr>
              </thead>

              <tbody
                className="flex h-[400px] w-full flex-col"
                style={{ overflowY: "overlay" }}
              >
                {selectedProducts?.length === 0 ? (
                  <tr className="mt-3 text-lg font-semibold">
                    <td className="flex w-full justify-center">
                      Chưa có sản phẩm trong hoá đơn
                    </td>
                  </tr>
                ) : (
                  selectedProducts?.map((product, index) => (
                    <tr
                      key={index}
                      className="flex border-b border-slate-200 hover:bg-slate-100"
                    >
                      <td className="flex w-10 items-center justify-end px-2 py-2">
                        {product?.id}
                      </td>
                      <td className="flex w-16 items-center justify-center px-2 py-2">
                        <img
                          src={product?.image || "/placeholder.png"}
                          className="h-10 w-10 rounded-full object-cover object-center"
                        />
                      </td>
                      <td className="flex flex-[2] items-center justify-start px-2 py-2">
                        {product?.name}
                      </td>
                      <td className="flex w-28 items-center justify-end px-2 py-2">
                        <PriceFormat>{product?.price}</PriceFormat>
                      </td>
                      <td className="flex w-24 items-center justify-end px-2 py-2">
                        <input
                          type="number"
                          min="1"
                          value={product?.orderQuantity || ""}
                          onChange={(e) =>
                            handleUpdateQuantityProduct(product, e.target.value)
                          }
                          className={clsx(
                            "text-input w-16 py-1 text-right text-base"
                          )}
                        />
                      </td>
                      <td className="flex w-20 items-center justify-center px-2 py-2">
                        <button
                          className="btn btn-sm btn-red"
                          onClick={() => handleDeleteProduct(product._id)}
                        >
                          <span>Xoá</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="flex grow items-center justify-between">
              <div className="flex items-center">
                <p className="font-semibold">
                  <span>Tổng tiền: </span>
                  <span className="text-xl text-blue-600">
                    <span>
                      <PriceFormat>{order.totalPrice}</PriceFormat>
                    </span>
                    <span> VNĐ</span>
                  </span>
                </p>
              </div>
              <button
                className={clsx("btn btn-blue btn-md")}
                disabled={!isValidCustomer || !order.totalPrice}
                onClick={() => setShowPaymentDialog(true)}
              >
                <span className="pr-2">
                  <i className="fa-solid fa-circle-plus"></i>
                </span>
                <span>Tạo hoá đơn</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PAYMENT DIALOG */}
      <div
        className={clsx(
          "fixed inset-0 z-[99999] hidden items-center justify-center bg-black/20 opacity-0 transition-opacity",
          {
            "!flex !opacity-100": showPaymentDialog,
          }
        )}
      >
        <div className="">
          <div className="w-[80vw] rounded-lg bg-white p-6">
            <div className=" text-center text-lg font-bold text-slate-900">
              Thanh toán hoá đơn
            </div>
            <div className="mt-5 flex space-x-6">
              {/* PRODUCT */}
              <div className="flex-1">
                <table className="mt-2 w-full">
                  <thead className="w-full rounded bg-blue-500 text-white">
                    <tr className="flex h-11 w-full">
                      <th className="flex w-10 items-center justify-end px-2 text-center">
                        Mã
                      </th>
                      <th className="flex w-16 items-center justify-center px-2">
                        Ảnh
                      </th>
                      <th className="flex flex-1 items-center justify-start px-2">
                        Tên sản phẩm
                      </th>
                      <th className="flex w-28 items-center justify-end px-2">
                        Giá (VND)
                      </th>
                      <th className="mr-2 flex w-24 items-center justify-end px-2">
                        Số lượng
                      </th>
                    </tr>
                  </thead>

                  <tbody
                    className="flex h-[400px] w-full flex-col"
                    style={{ overflowY: "overlay" }}
                  >
                    {selectedProducts?.length === 0 ? (
                      <tr className="mt-3 text-lg font-semibold">
                        <td className="flex w-full justify-center">
                          Chưa có sản phẩm trong hoá đơn
                        </td>
                      </tr>
                    ) : (
                      selectedProducts?.map((product, index) => (
                        <tr
                          key={index}
                          className="flex border-b border-slate-200 hover:bg-slate-100"
                        >
                          <td className="flex w-10 items-center justify-end px-2 py-2">
                            {product?.id}
                          </td>
                          <td className="flex w-16 items-center justify-center px-2 py-2">
                            <img
                              src={product?.image || "/placeholder.png"}
                              className="h-10 w-10 rounded-full object-cover object-center"
                            />
                          </td>
                          <td className="flex flex-[2] items-center justify-start px-2 py-2">
                            {product?.name}
                          </td>
                          <td className="flex w-28 items-center justify-end px-2 py-2">
                            <PriceFormat>{product?.price}</PriceFormat>
                          </td>
                          <td className="mr-2 flex w-24 items-center justify-end px-2 py-2">
                            {product?.orderQuantity}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* INFOR */}
              <div className="flex-1">
                <div className="space-y-2 border-b pb-2">
                  <div className="text-lg">
                    <span>Tên khách hàng: </span>
                    <span className="font-semibold">
                      {order?.customer?.name || ""}
                    </span>
                  </div>
                  <div className="text-lg">
                    <span>Số điện thoại: </span>
                    <span className="font-semibold">
                      {order?.customer?.phone || ""}
                    </span>
                  </div>
                  <div className="text-lg">
                    <span>Địa chỉ: </span>
                    <span className="font-semibold">
                      {order?.customer?.address || ""}
                    </span>
                  </div>
                  <div className="text-lg">
                    <span>Ngày lập hoá đơn: </span>
                    <span className="font-semibold">
                      <TimeNow className="inline font-semibold" />
                    </span>
                  </div>
                </div>

                <div className="mt-3 space-y-3 border-b pb-3">
                  <div className="text-lg">
                    <span>Tổng tiền: </span>
                    <span className="text-xl font-semibold text-blue-600">
                      <span>
                        <PriceFormat>{order?.totalPrice}</PriceFormat>
                      </span>
                      <span> VNĐ</span>
                    </span>
                  </div>
                  <div className="flex items-center text-lg">
                    <label className="mr-2" htmlFor="discount">
                      Giảm giá
                    </label>
                    <PriceInput
                      id="discount"
                      name="discount"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      className="w-56"
                      placeholder="Giảm giá"
                    />
                  </div>
                  <div className="text-lg">
                    <span>Thành tiền: </span>
                    <span className="text-xl font-semibold text-blue-600">
                      <span>
                        <PriceFormat>
                          {order?.totalPrice - discount}
                        </PriceFormat>
                      </span>
                      <span> VNĐ</span>
                    </span>
                  </div>
                  <div className="flex items-center text-lg">
                    <label className="mr-2" htmlFor="price">
                      Tiền nhận:
                    </label>
                    <PriceInput
                      id="price_AddProduct_page"
                      name="price"
                      value={receivedMoney}
                      onChange={(e) => setReceivedMoney(e.target.value)}
                      className="w-56"
                      placeholder="Tiền nhận"
                    />
                  </div>

                  <div className="text-lg">
                    <span>Tiền thừa: </span>
                    <span
                      className={clsx("text-xl font-semibold text-blue-600", {
                        "text-red-600": exchangeMoney < 0,
                      })}
                    >
                      <span>
                        <PriceFormat>{exchangeMoney}</PriceFormat>
                      </span>
                      <span> VNĐ</span>
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex justify-between">
                  <div
                    className={clsx("flex items-center text-blue-500", {
                      invisible: !loading,
                    })}
                  >
                    <i className="fa-solid fa-spinner animate-spin text-xl"></i>
                    <span className="text-lx pl-3 font-medium">
                      Đang tạo hoá đơn
                    </span>
                  </div>
                  <div className="flex justify-end">
                    <button
                      className="btn btn-blue btn-md"
                      onClick={() => setShowPaymentDialog(false)}
                    >
                      Quay lại
                    </button>
                    <button
                      className="btn btn-green btn-md"
                      disabled={exchangeMoney < 0}
                      onClick={() => createOrder()}
                    >
                      Thanh toán hoá đơn
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer hideProgressBar />
    </>
  );
}
//
//
export default AddOrder;
