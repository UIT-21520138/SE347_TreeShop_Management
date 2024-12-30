import clsx from "clsx";
import { Fragment, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
function Accounts() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingAccountId, setDeletingAccountId] = useState(null);

  const [search, setSearch] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [renderAccounts, setRenderAccounts] = useState([]);
  const navigate = useNavigate();

  const showDeleteNoti = () => toast.success("Xóa tài khoản thành công!");
  const showErorrNoti = () => toast.error("Có lỗi xảy ra!");

  useEffect(() => {
    getAccounts();
  }, []);

  function getAccounts() {
    fetch("http://localhost:302/api/account")
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.success) {
          setAccounts(resJson.accounts);
          setRenderAccounts(resJson.accounts);
        } else {
          setRenderAccounts([]);
          setAccounts([]);
        }
      })
      .catch((error) => {
        console.log(error);
        setAccounts([]);
        setRenderAccounts([]);
      });
  }

  useEffect(() => {
    setRenderAccounts(
      accounts?.filter((account) => {
        if (search === "") {
          return account;
        } else {
          if (
            removeVietnameseTones(account?.username.toLowerCase()).includes(
              removeVietnameseTones(search.toLowerCase())
            ) ||
            removeVietnameseTones(account?.name.toLowerCase()).includes(
              removeVietnameseTones(search.toLowerCase())
            )
          ) {
            var id = account.id.toString();
            return account.id.toString().includes(id);
          }
        }
      })
    );
  }, [search]);

  function deleteAccount(id) {
    fetch("http://localhost:302/api/account/" + id, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((resJson) => {
        setShowDeleteDialog(false);
        if (resJson) {
          showDeleteNoti();
          getAccounts();
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
    navigate("/account/detail/" + id);
  }
  return (
    <>
      <div className="container w-full">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          {/* tite + reload btn */}
          <div className="flex">
            <label className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800">
              Danh sách tài khoản
            </label>
            <button
              type="button"
              className="ml-3 text-gray-800 hover:underline"
            >
              <span className="font-sm pr-1 sm:text-base md:text-lg">
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
                className="text-input grow sm:text-base md:text-lg"
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                placeholder="Tìm kiếm tài khoản"
              />
            </div>
          </div>

          <Link
            to="/account/add"
            className="btn btn-md bg-green-600 hover:bg-green-500 text-sm sm:text-base md:text-lg"
          >
            <span className="pr-1">
              <i className="fa fa-share"></i>
            </span>
            <span>Thêm tài khoản</span>
          </Link>
        </div>
        <table className="mt-8 w-full">
          <thead className="w-full rounded bg-blue-500 text-white">
            <tr className="flex h-11 w-full">
              <th className="flex w-20 items-center justify-center px-2 text-sm sm:text-base md:text-lg">
                Mã số
              </th>
              <th className="flex w-36 items-center justify-start px-2 text-sm sm:text-base md:text-lg">
                Tên tài khoản
              </th>
              <th className="flex w-56 items-center justify-start px-2 text-sm sm:text-base md:text-lg">
                Tên nhân viên
              </th>
              <th className="flex flex-1 items-center justify-start px-2 text-sm sm:text-base md:text-lg">
                Địa chỉ email{" "}
              </th>
              <th className="flex flex-1 items-center justify-start px-2 text-sm sm:text-base md:text-lg">
                Chức vụ
              </th>
              <th className="flex w-[200px] items-center justify-center px-2 text-sm sm:text-base md:text-lg"></th>
            </tr>
          </thead>

          <tbody
            className="flex h-[75vh] w-full flex-col"
            style={{ overflowY: "overlay" }}
          >
            {renderAccounts.reverse().map((account) => (
              <tr
                key={account._id}
                className="flex min-h-[56px] cursor-pointer border-b border-slate-200 hover:bg-slate-100"
              >
                <td
                  className="flex w-20 items-center justify-center px-2 text-sm sm:text-base md:text-lg"
                  onClick={() => LinkToDetail(account.id)}
                >
                  {account.id}
                </td>
                <td
                  className="flex w-36 items-center justify-start px-2 text-sm sm:text-base md:text-lg"
                  onClick={() => LinkToDetail(account.id)}
                >
                  {account.username}
                </td>
                <td
                  className="flex w-56 items-center justify-start px-2 text-sm sm:text-base md:text-lg"
                  onClick={() => LinkToDetail(account.id)}
                >
                  {account.name}
                </td>
                <td
                  className="flex flex-1 items-center justify-start px-2 text-sm sm:text-base md:text-lg"
                  onClick={() => LinkToDetail(account.id)}
                >
                  {account.email}
                </td>
                <td
                  className="flex flex-1 items-center justify-start px-2 text-sm sm:text-base md:text-lg"
                  onClick={() => LinkToDetail(account.id)}
                >
                  {account.role?.name || "-"}
                </td>
                <td className="flex w-[200px] items-center justify-center px-2 py-2 text-sm sm:text-base md:text-lg">
                  <div className="flex justify-end">
                    <Link
                      to={"/account/update/" + account.id}
                      className="btn btn-sm btn-blue"
                    >
                      <span className="pr-1">
                        <i className="fa-solid fa-pen-to-square"></i>
                      </span>
                      <span>Sửa</span>
                    </Link>
                    <button
                      className="btn btn-sm btn-red"
                      onClick={() => {
                        {
                          setShowDeleteDialog(true);
                          setDeletingAccountId(account.id);
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
          <div className="min-w-[160px] sm:min-w-[200px] md:min-w-[300px] max-w-[400px] rounded-lg bg-white p-6">
            <div className="text-clr-text-dark font-bold text-sm sm:text-base md:text-lg">
              Bạn có chắc chắn muốn xoá không?
            </div>
            <p className="mt-4 text-sm sm:text-base md:text-lg">
              Lưu ý: Bạn không thể không phục lại sau khi xoá!
            </p>
            <div className="mt-4 flex">
              <button
                className="btn btn-blue btn-md text-sm sm:text-base md:text-lg"
                onClick={() => {
                  setDeletingAccountId(null);
                  setShowDeleteDialog(false);
                }}
              >
                Quay lại
              </button>
              <button
                className="btn btn-md btn-red text-sm sm:text-base md:text-lg"
                onClick={() => deleteAccount(deletingAccountId)}
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

export default Accounts;
