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
  // Hàm loại bỏ dấu tiếng Việt
  var str = stra;
  // Thực hiện các thay đổi trong hàm này...
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
        if (resJson.success) {
          showDeleteNoti();
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
          {/* title + reload btn */}
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
              <span>Tải lại</span>
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
            <Link to="/product/add" className="btn btn-md btn-green">
              <span className="pr-1">
                <i className="fa fa-plus"></i>
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
                    return true;
                  }
                }
                return false;
              })
              .reverse()
              .map((product) => (
                <tr
                  key={product.id}
                  className={clsx(
                    "flex cursor-pointer border-b border-slate-200 hover:bg-slate-100"
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
                  <td className="flex w-[200px] items-center justify-center py-2">
                    <Link to={`/product/edit/${product.id}`} className="btn btn-sm btn-blue">
                      Sửa
                    </Link>
                    <button
                      className="btn btn-sm btn-red"
                      onClick={() => {
                        setDeletingProductId(product.id);
                        setShowDeleteDialog(true);
                      }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* DELETE Dialog */}
        {showDeleteDialog && (
          <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-black">
            <div className="modal-content p-4 bg-white rounded-lg">
              <h3>Xóa sản phẩm?</h3>
              <div className="flex space-x-4 mt-4">
                <button
                  className="btn btn-md btn-red"
                  onClick={() => deleteProduct(deletingProductId)}
                >
                  Xóa
                </button>
                <button
          className="btn btn-md bg-gray-500 text-white hover:bg-gray-600"
          onClick={() => setShowDeleteDialog(false)}
        >
          Hủy
        </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
}

export default Products;
