import clsx from "clsx";
import { Fragment, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { accountSelector } from "../../redux/selectors";
function Customers() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingCustomerId, setDeletingCustomerId] = useState(null);

  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  const showDeleteNoti = () => toast.success("Xóa khách hàng thành công!");
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
    getCustomers();
  }, []);

  function getCustomers() {
    fetch("http://localhost:302/api/customer")
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.success) {
          setCustomers(resJson.customers);
        } else {
          setCustomers([]);
        }
      })
      .catch((error) => {
        console.log(error);
        setCustomers([]);
      });
  }

  function deleteCustomer(id) {
    fetch("http://localhost:302/api/customer/" + id, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((resJson) => {
        setShowDeleteDialog(false);
        if (resJson) {
          showDeleteNoti();
          console.log("xóa");
          getCustomers();
        } else {
          showErorrNoti();
        }
      })
      .catch(() => {
        showErorrNoti();
        setShowDeleteDialog(false);
      });
  }

  function LinkToDetail(id) {
    navigate("/customer/detail/" + id);
  }
  return (
    <>
      <div className="container w-full sm:w-full md:w-full mx-auto">
        <div className="flex flex-col sm:flex-row space-x-0 sm:space-x-4">
          {/* title + reload btn */}
          <div className="flex flex-col sm:flex-row space-x-0 sm:space-x-3">
            <label className="text-2xl font-bold text-slate-800">
              Danh sách khách hàng
            </label>
            <button
              type="button"
              className="mt-2 sm:mt-0 text-gray-800 hover:underline"
            >
              <span className="font-sm pr-1">
                <i className="fa fa-refresh" aria-hidden="true"></i>
              </span>
              <span className="">Tải lại</span>
            </button>
          </div>

          {/* Action group */}
          <div className="flex flex-col sm:flex-row mt-2 sm:mt-0 space-x-0 sm:space-x-2 grow">
            {/* Search */}
            <div className="mr-2 flex grow">
              <input
                type="text"
                className="text-input grow"
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                placeholder="Tìm kiếm khách hàng"
              />
            </div>

            <Link
              to="/customer/add"
              className={clsx("btn btn-md btn-green mt-2 sm:mt-0", {
                hidden: isHiddenItem("customer/create"),
              })}
            >
              <span className="pr-1">
                <i className="fa fa-share"></i>
              </span>
              <span>Thêm khách hàng</span>
            </Link>
          </div>
        </div>
        <table className="mt-8 w-full">
          <thead className="w-full rounded bg-blue-500 text-white">
            <tr className="flex h-11 w-full">
              <th className="flex w-20 items-center justify-end px-2">Mã KH</th>
              <th className="flex w-56 items-center justify-start px-2">
                Tên khách hàng
              </th>
              <th className="flex w-36 items-center justify-center px-2">
                Số điện thoại
              </th>
              <th className="flex flex-1 items-center justify-start px-2">
                Địa chỉ{" "}
              </th>
              <th className="flex w-[200px] items-center justify-center px-2"></th>
            </tr>
          </thead>

          <tbody className="flex h-[75vh] w-full flex-col overflow-y-scroll sm:overflow-y-auto">
            {customers
              .filter((customer) => {
                return search.toLowerCase() === ""
                  ? customer
                  : customer.name.toLowerCase().includes(search) ||
                      customer.phone.toLowerCase().includes(search);
              })
              ?.reverse()
              .map((customer, index) => (
                <tr
                  key={customer._id}
                  className="flex min-h-[56px] cursor-pointer border-b border-slate-200 hover:bg-slate-100"
                >
                  <td
                    className="flex w-20 items-center justify-end px-2 sm:px-4"
                    onClick={() => LinkToDetail(customer.id)}
                  >
                    {customer.id}
                  </td>
                  <td
                    className="flex w-56 items-center justify-start px-2 sm:px-4"
                    onClick={() => LinkToDetail(customer.id)}
                  >
                    {customer.name}
                  </td>
                  <td
                    className="flex w-36 items-center justify-center px-2 sm:px-4"
                    onClick={() => LinkToDetail(customer.id)}
                  >
                    {customer.phone}
                  </td>
                  <td
                    className="flex flex-1 items-center justify-start px-2 sm:px-4"
                    onClick={() => LinkToDetail(customer.id)}
                  >
                    {customer.address}
                  </td>
                  <td className="flex w-full sm:w-[200px] items-center justify-center px-2 sm:px-4 py-2">
                    <div className="flex justify-end">
                      <Link
                        to={"/customer/update/" + customer.id}
                        className={clsx("btn btn-sm btn-blue", {
                          hidden: isHiddenItem("customer/update"),
                        })}
                      >
                        <span className="pr-1">
                          <i className="fa-solid fa-pen-to-square"></i>
                        </span>
                        <span>Sửa</span>
                      </Link>
                      <button
                        className={clsx("btn btn-sm btn-red", {
                          hidden: isHiddenItem("customer/delete"),
                        })}
                        onClick={() => {
                          {
                            setShowDeleteDialog(true);
                            setDeletingCustomerId(customer.id);
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
        <div className="w-full sm:w-3/4 md:w-1/2 mx-auto">
          <div className="min-w-[160px] sm:min-w-[200px] md:min-w-[300px] max-w-[400px] rounded-lg bg-white p-6">
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
                  setDeletingCustomerId(null);
                  setShowDeleteDialog(false);
                }}
              >
                Quay lại
              </button>
              <button
                className="btn btn-md btn-red"
                onClick={() => deleteCustomer(deletingCustomerId)}
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

export default Customers;
