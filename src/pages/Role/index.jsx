import { Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Popover } from "@headlessui/react";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { toast } from "react-toastify";

function Roles() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingRoleId, setDeletingRoleId] = useState(null);
  const showDeleteNoti = () => toast.success("Xóa chức vụ thành công!");
  const showErorrNoti = () => toast.error("Có lỗi xảy ra!");

  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  useEffect(() => {
    getRoles();
  }, []);

  function getRoles() {
    fetch("http://localhost:302/api/role")
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.success) {
          setRoles(resJson.roles);
        } else {
          setRoles([]);
        }
      })
      .catch((error) => {
        console.log(error);
        setRoles([]);
      });
  }

  function linkToDetail(id) {
    navigate("/role/detail/" + id);
  }

  function deleteRole(id) {
    fetch("http://localhost:302/api/role/" + id, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((resJson) => {
        setShowDeleteDialog(false);
        if (resJson) {
          showDeleteNoti();
          console.log("xóa");
          getRoles();
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
          <div className="flex items-center space-x-2">
            <label className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">
              Danh sách chức vụ
            </label>
            <button
              type="button"
              className="ml-3 text-gray-800 hover:underline"
              onClick={() => getRoles()}
            >
              <span className="font-sm pr-1">
                <i className="fa fa-refresh" aria-hidden="true"></i>
              </span>
              <span>Tải lại</span>
            </button>
          </div>

          <div className="flex flex-grow mt-2 sm:mt-0 justify-between">
            <div></div>
            <Link
              to="/role/add"
              className="btn btn-md sm:btn-lg md:btn-xl bg-green-600 hover:bg-green-500"
            >
              <span className="pr-1">
                <i className="fa-solid fa-circle-plus"></i>
              </span>
              <span>Thêm chức vụ</span>
            </Link>
          </div>
        </div>
        <table className="mt-4 w-full">
          <colgroup>
            <col span="1" style={{ width: "10%" }} />
            <col span="1" style={{ width: "20%" }} />
            <col span="1" style={{ width: "40%" }} />
            <col span="1" style={{ width: "10%" }} />
          </colgroup>

          <thead className="h-11 rounded bg-blue-500 text-white">
            <tr>
              <th scope="col" className="text-center">
                Mã chức vụ
              </th>
              <th scope="col" className="text-left">
                Tên chức vụ
              </th>
              <th scope="col" className="text-left">
                Chú thích
              </th>
              <th scope="col"></th>
            </tr>
          </thead>

          <tbody>
            {roles.reverse().map((role) => (
              <tr
                key={role.id}
                className="cursor-pointer border-b border-slate-200 hover:bg-slate-100"
                onClick={() => linkToDetail(role.id)}
              >
                <td className="py-2 text-center">{role.id}</td>
                <td className="py-2 text-left">{role.name}</td>
                <td className="py-2 text-left">{role.description}</td>
                <td className="py-2 text-center">
                  <div
                    className="flex justify-end"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link
                      to={"/role/update/" + role.id}
                      className="btn btn-sm sm:btn-md md:btn-lg bg-blue-500 hover:bg-blue-400"
                    >
                      <span className="pr-1">
                        <i className="fa-solid fa-pen-to-square"></i>
                      </span>
                      <span>Sửa</span>
                    </Link>
                    <button
                      className="btn btn-sm sm:btn-md md:btn-lg bg-red-500 hover:bg-red-400"
                      onClick={() => {
                        setShowDeleteDialog(true);
                        setDeletingRoleId(role.id);
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
                  setDeletingRoleId(null);
                  setShowDeleteDialog(false);
                }}
              >
                Quay lại
              </button>
              <button
                className="btn btn-md btn-red"
                onClick={() => deleteRole(deletingRoleId)}
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

export default Roles;
