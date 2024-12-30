import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Filter from "./Filter";
import PriceFormat from "../../components/PriceFormat";
import clsx from "clsx";

import { useSelector } from "react-redux";
import { accountSelector } from "../../redux/selectors";

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

function Products() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({});
  const navigate = useNavigate();
  const showDeleteNoti = () => toast.success("Xóa sản phẩm thành công!");
  const showErorrNoti = () => toast.error("Có lỗi xảy ra!");
  const account = useSelector(accountSelector);
  function isHiddenItem(functionName) {
    if (!account) {
      return true;
    }
    if (!functionName) {
      return false;
    }
    const findResult = account?.functions?.find(
      (_func) => _func?.name === functionName
    );
    if (findResult) {
      return false;
    }
    return true;
  }

  useEffect(() => {
    getProducts();
  }, [filters]);

  function getProducts() {
    fetch(
      "http://localhost:302/api/product?" + `filters=${JSON.stringify(filters)}`
    )
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.success) {
          setProducts(resJson.products);
        } else {
          setProducts([]);
        }
      });
  }

  function deleteProduct(id) {
    fetch("http://localhost:302/api/product/" + id, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((resJson) => {
        setShowDeleteDialog(false);
        if (resJson) {
          showDeleteNoti();
          console.log("xóa");
          getProducts();
        } else {
          showErorrNoti();
        }
      })
      .catch(() => {
        showErorrNoti();
        setShowDeleteDialog(false);
      });
  }

  function linkToDetail(id) {
    navigate("/product/detail/" + id);
  }

  return (
    <>
      <div className="container">
        <div className="flex space-x-4">
          {/* tite + reload btn */}
          <div className="flex">
            <label className="text-2xl font-bold text-slate-800">
              Danh sách sản phẩm
            </label>
            <button
              type="button"
              className="ml-3 text-gray-800 hover:underline"
              onClick={() => getProducts()}
            >
              <span className="font-sm pr-1">
                <i className="fa fa-refresh" aria-hidden="true"></i>
              </span>
              <span className="">Tải lại</span>
            </button>
          </div>

          {/* Action group */}
          <div className="flex grow">
            {/* Search */}
            <div className="mr-2 flex grow">
              <input
                type="text"
                className="text-input grow"
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                placeholder="Tìm kiếm sản phẩm"
              />
            </div>

            {/* FILTER */}
            <Filter
              onChange={(f) => setFilters({ ...f })}
              hasFilters={Object.keys(filters).length > 0}
            />

            <Link to="/product/views" className="btn btn-md btn-green">
              <span className="pr-1">
                <i className="fa fa-share"></i>
              </span>
              <span>Chuyển sang dạng lưới</span>
            </Link>
            <Link
              to="/product/add"
              className={clsx("btn btn-md btn-green", {
                hidden: isHiddenItem("product/create"),
              })}
            >
              <span className="pr-1">
                <i className="fa fa-share"></i>
              </span>
              <span>Thêm sản phẩm mới</span>
            </Link>
          </div>
        </div>

        {/* LIST */}
        <table className="mt-8 w-full">
          <thead className="w-full rounded bg-blue-500 text-white">
            <tr className="flex h-11 min-h-[56px] w-full">
              <th className="flex w-16 items-center justify-end px-2">Mã số</th>
              <th className="flex w-24 items-center justify-center px-2">
                Ảnh
              </th>
              <th className="flex flex-[2] items-center justify-start px-2">
                Tên sản phẩm
              </th>
              <th className="flex flex-[1] items-center justify-start px-2">
                Loại sản phẩm
              </th>
              <th className="flex w-28 items-center justify-end px-2">
                Giá (VND)
              </th>
              <th className="flex w-24 items-center justify-end px-2">
                Số lượng
              </th>
              <th className="flex w-[200px] items-center justify-center px-2"></th>
            </tr>
          </thead>

          <tbody
            className="flex h-[75vh] w-full flex-col"
            style={{ overflowY: "overlay" }}
          >
            {products
              .filter((product) => {
                if (search === "") {
                  return product;
                } else {
                  if (
                    removeVietnameseTones(product.name.toLowerCase()).includes(
                      removeVietnameseTones(search.toLowerCase())
                    ) ||
                    removeVietnameseTones(
                      product?.type.name.toLowerCase()
                    ).includes(removeVietnameseTones(search.toLowerCase()))
                  ) {
                    var id = product.id.toString();
                    return product.id.toString().includes(id);
                  }
                }
              })
              ?.reverse()
              .map((product) => (
                <tr
                  key={product.id}
                  className={clsx(
                    "flex cursor-pointer border-b border-slate-200 hover:bg-slate-100",
                    {}
                  )}
                >
                  <td
                    className="flex w-16 items-center justify-end px-2 py-2"
                    onClick={() => linkToDetail(product.id)}
                  >
                    {product.id}
                  </td>
                  <td
                    className="flex w-24 items-center justify-center px-2 py-2"
                    onClick={() => linkToDetail(product.id)}
                  >
                    <img
                      src={product.image || "/placeholder.png"}
                      className="h-10 w-10 rounded-full object-cover object-center"
                    />
                  </td>
                  <td
                    className={clsx(
                      "flex flex-[2] items-center justify-start px-2 py-2",
                      {
                        "line-through": product.quantity === 0,
                      }
                    )}
                    onClick={() => linkToDetail(product.id)}
                  >
                    {product.name}
                  </td>
                  <td
                    className="flex flex-[1] items-center justify-start px-2 py-2"
                    onClick={() => linkToDetail(product.id)}
                  >
                    {product.type?.name || "-"}
                  </td>
                  <td
                    className="flex w-28 items-center justify-end px-2 py-2"
                    onClick={() => linkToDetail(product.id)}
                  >
                    <PriceFormat>{product.price}</PriceFormat>
                  </td>
                  <td
                    className={clsx(
                      "flex w-24 items-center justify-end px-2 py-2",
                      {
                        "text-red-600": product.quantity === 0,
                      }
                    )}
                    onClick={() => linkToDetail(product.id)}
                  >
                    {product.quantity}
                  </td>
                  <td className="flex w-[200px] items-center justify-center px-2 py-2">
                    <div className="flex justify-end">
                      <Link
                        to={"/product/update/" + product.id}
                        className={clsx("btn btn-sm btn-blue", {
                          hidden: isHiddenItem("product/update"),
                        })}
                      >
                        <span className="pr-1">
                          <i className="fa-solid fa-pen-to-square"></i>
                        </span>
                        <span>Sửa</span>
                      </Link>
                      <button
                        className={clsx("btn btn-sm btn-red", {
                          hidden: isHiddenItem("product/delete"),
                        })}
                        onClick={() => {
                          {
                            setShowDeleteDialog(true);
                            setDeletingProductId(product.id);
                          }
                        }}
                      >
                        <span className="pr-1">
                          <i className="fa-solid fa-circle-xmark"></i>
                        </span>
                        <span>Xoá</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* DELETE DIALOG */}
      <div
        className={clsx(
          "fixed inset-0 z-[99999] hidden items-center justify-center bg-black/20 opacity-0 transition-opacity",
          {
            "!flex !opacity-100": showDeleteDialog,
          }
        )}
      >
        <div className="">
          <div className="min-w-[160px] max-w-[400px] rounded-lg bg-white p-6">
            <div className="text-clr-text-dark font-bold">
              Bạn có chắc chắn muốn xoá không?
            </div>
            <p className="mt-4">
              Lưu ý: Bạn không thể không phục lại sau khi xoá!
            </p>
            <div className="mt-4 flex">
              <button
                className="btn btn-blue btn-md"
                onClick={() => {
                  setDeletingProductId(null);
                  setShowDeleteDialog(false);
                }}
              >
                Quay lại
              </button>
              <button
                className="btn btn-md btn-red"
                onClick={() => deleteProduct(deletingProductId)}
              >
                Xoá
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Products;
