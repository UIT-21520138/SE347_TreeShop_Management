import { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Listbox, Popover } from "@headlessui/react";
import clsx from "clsx";
import { useEffect } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";

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
function ProductType() {
  const [search, setSearch] = useState("");
  const [productTypes, setProductTypes] = useState([]);
  const navigate = useNavigate();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingProductTypeId, setDeletingProductTypeId] = useState(null);
  const showDeleteNoti = () => toast.success("Xóa loại sản phẩm thành công!");
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
    getProductTypes();
  }, []);

  function getProductTypes() {
    fetch("http://localhost:302/api/product-type")
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.success) {
          setProductTypes(resJson.productTypes);
        } else {
          setProductTypes([]);
        }
      });
  }

  function linkToDetail(id) {
    navigate("/product-type/detail/" + id);
  }

  function deleteProductType(id) {
    fetch("http://localhost:302/api/product-type/" + id, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((resJson) => {
        setShowDeleteDialog(false);
        if (resJson) {
          showDeleteNoti();
          getProductTypes();
        } else {
          showErorrNoti();
        }
      })
      .catch(() => {
        showErorrNoti();
        setShowDeleteDialog(false);
      });
  }

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col sm:flex-row space-x-0 sm:space-x-4">
          {/* title + reload btn */}
          <div className="flex items-center space-x-2">
            <label className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">
              Danh sách loại sản phẩm
            </label>
            <button
              type="button"
              className="ml-3 text-gray-800 hover:underline"
              onClick={() => getProductTypes()}
            >
              <span className="font-sm pr-1">
                <i className="fa fa-refresh" aria-hidden="true"></i>
              </span>
              <span className="">Tải lại</span>
            </button>
          </div>

          {/* Action group */}
          <div className="flex flex-grow mt-2 sm:mt-0">
            {/* Search */}
            <div className="mr-2 flex flex-grow">
              <input
                type="text"
                className="text-input flex-grow"
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                placeholder="Tìm kiếm loại sản phẩm"
              />
            </div>

            <Link
              to="/product-type/add"
              className={clsx("btn btn-md sm:btn-lg md:btn-xl btn-green", {
                hidden: isHiddenItem("product-type/create"),
              })}
            >
              <span className="pr-1">
                <i className="fa fa-share"></i>
              </span>
              <span>Thêm loại sản phẩm mới</span>
            </Link>
          </div>
        </div>

        {/* LIST */}
        <table className="mt-8 w-full">
          <thead className="w-full rounded bg-blue-500 text-white">
            <tr className="flex h-11 w-full">
              <th className="flex w-20 items-center justify-end px-2">Mã số</th>
              <th className="flex flex-1 sm:flex-2 md:flex-3 items-center justify-start pl-28">
                Tên loại sản phẩm
              </th>
              <th className="flex flex-1 sm:flex-2 md:flex-3 items-center justify-start px-2">
                Ngày thêm
              </th>
              <th className="flex w-48 sm:w-64 md:w-80 items-center justify-center px-2"></th>
            </tr>
          </thead>

          <tbody className="flex h-[75vh] w-full flex-col overflow-y-scroll">
            {productTypes
              ?.filter((productType) => {
                if (search === "") {
                  return productType;
                } else {
                  if (
                    removeVietnameseTones(
                      productType.name.toLowerCase()
                    ).includes(removeVietnameseTones(search.toLowerCase()))
                  ) {
                    var id = productType.id.toString();
                    return productType.id.toString().includes(id);
                  }
                }
              })
              ?.reverse()
              .map((productType) => (
                <tr
                  key={productType.id}
                  className="flex min-h-[56px] cursor-pointer border-b border-slate-200 hover:bg-slate-100"
                >
                  <td
                    className="flex w-20 items-center justify-center px-2"
                    onClick={() => linkToDetail(productType.id)}
                  >
                    {productType.id}
                  </td>

                  <td
                    className="flex flex-1 sm:flex-2 md:flex-3 items-center justify-start pl-28"
                    onClick={() => linkToDetail(productType.id)}
                  >
                    {productType.name}
                  </td>

                  <td
                    className="flex flex-1 sm:flex-2 md:flex-3 items-center justify-start px-2"
                    onClick={() => linkToDetail(productType.id)}
                  >
                    {moment(productType.createdAt).format(
                      "HH:mm:ss DD/MM/YYYY "
                    )}
                  </td>
                  <td className="flex w-48 sm:w-64 md:w-80 items-center justify-center px-2 py-2">
                    <div className="flex justify-end">
                      <Link
                        to={"/product-type/update/" + productType.id}
                        className={clsx(
                          "btn btn-sm sm:btn-md md:btn-lg btn-blue",
                          {
                            hidden: isHiddenItem("product-type/update"),
                          }
                        )}
                      >
                        <span className="pr-1">
                          <i className="fa-solid fa-pen-to-square"></i>
                        </span>
                        <span>Sửa</span>
                      </Link>
                      <button
                        className={clsx(
                          "btn btn-sm sm:btn-md md:btn-lg btn-red",
                          {
                            hidden: isHiddenItem("product-type/delete"),
                          }
                        )}
                        onClick={() => {
                          setShowDeleteDialog(true);
                          setDeletingProductTypeId(productType.id);
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
        <div className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 mx-auto">
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
                  setDeletingProductTypeId(null);
                  setShowDeleteDialog(false);
                }}
              >
                Quay lại
              </button>
              <button
                className="btn btn-md btn-red"
                onClick={() => deleteProductType(deletingProductTypeId)}
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

export default ProductType;
