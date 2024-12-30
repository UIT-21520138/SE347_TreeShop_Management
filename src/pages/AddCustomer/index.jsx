import { Fragment, useState } from "react";
import * as Yup from "yup";
import { Formik, useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import clsx from "clsx";
import TimeNow from "../../components/TimeNow";
import "react-toastify/dist/ReactToastify.css";

const validationSchema = Yup.object({
  name: Yup.string()
    .required("Trường này bắt buộc")
    .min(2, "Tên phải có độ dài hơn 2 kí tự")
    .max(30, "Tên dài tối đa 30 kí tự"),
  address: Yup.string().required("Trường này bắt buộc"),
  phone: Yup.string()
    .required("Trường này bắt buộc")
    .matches(/^[\+|0]([0-9]{9,14})\b/, "Số điện thoại không hợp lệ"),
});

function AddCustomer() {
  const [loading, setLoading] = useState(false);
  const showSuccessNoti = () =>
    toast.success("Thêm thông tin khách hàng thành công!");
  const showErorrNoti = () => toast.error("Có lỗi xảy ra!");

  const bacsicForm = useFormik({
    initialValues: {
      name: "",
      phone: "",
      address: "",
    },
    validationSchema,
    onSubmit: handleFormsubmit,
  });

  const navigate = useNavigate();

  function handleFormsubmit(values) {
    console.log(values);
    setLoading(true);
    fetch("http://localhost:302/api/customer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.success) {
          setLoading(false);
          showSuccessNoti();
          bacsicForm.resetForm();
        } else {
          setLoading(false);
          showErorrNoti();
        }
      })
      .catch(() => {
        setLoading(false);
        showErorrNoti();
      });
  }

  return (
    <>
      <div className="container">
        <div className="w-full sm:w-3/4 md:w-1/2">
          <form onSubmit={bacsicForm.handleSubmit}>
            <div className="mt-4 flex flex-col sm:flex-row">
              {/* Name */}
              <div className="mr-8 flex w-full sm:w-1/2 flex-col space-y-2 text-base sm:text-lg md:text-xl">
                <div className="form-group flex flex-col ">
                  <label
                    className="mb-1 select-none font-semibold "
                    htmlFor="name"
                  >
                    Tên khách hàng
                  </label>
                  <input
                    type="text"
                    id="name"
                    className={clsx(
                      "text-input py-[5px] text-base sm:text-sm md:text-lg",
                      {
                        invalid:
                          bacsicForm.touched.name && bacsicForm.errors.name,
                      }
                    )}
                    onChange={bacsicForm.handleChange}
                    onBlur={bacsicForm.handleBlur}
                    value={bacsicForm.values.name}
                    name="name"
                    placeholder="Nguyễn Văn A"
                  />
                  <span
                    className={clsx("text-sm text-red-500 opacity-0", {
                      "opacity-100":
                        bacsicForm.touched.name && bacsicForm.errors.name,
                    })}
                  >
                    {bacsicForm.errors.name || "No message"}
                  </span>
                </div>

                <div className="form-group flex flex-col">
                  <label
                    className="mb-1 select-none font-semibold text-base sm:text-lg md:text-xl"
                    htmlFor="phone"
                  >
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    id="phone"
                    className={clsx(
                      "text-input w-full py-[5px] text-base sm:text-sm md:text-lg",
                      {
                        invalid:
                          bacsicForm.touched.phone && bacsicForm.errors.phone,
                      }
                    )}
                    onChange={bacsicForm.handleChange}
                    onBlur={bacsicForm.handleBlur}
                    value={bacsicForm.values.phone}
                    name="phone"
                    placeholder="0987654321"
                  />
                  <span
                    className={clsx("text-sm text-red-500 opacity-0", {
                      "opacity-100":
                        bacsicForm.touched.phone && bacsicForm.errors.phone,
                    })}
                  >
                    {bacsicForm.errors.phone || "No message"}
                  </span>
                </div>

                <div className="form-group flex flex-col sm:flex-row basis-1/2">
                  <label className="mb-1 cursor-default select-none text-lg sm:text-xl md:text-2xl font-semibold ">
                    Ngày thêm
                  </label>
                  <div className="text-input disabled select-none text-base sm:text-sm md:text-lg">
                    <TimeNow />
                  </div>
                </div>
              </div>
            </div>

            {/* DATE AND PRICE */}
            <div className="mt-4 flex flex-col sm:flex-row">
              <div className="mt-3 flex w-full flex-col">
                <label
                  className="mb-1 select-none text-lg sm:text-xl md:text-2xl font-semibold "
                  htmlFor="address"
                >
                  Địa chỉ
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="address"
                    className={clsx(
                      "text-input w-full py-[5px] text-base sm:text-sm md:text-lg",
                      {
                        invalid:
                          bacsicForm.touched.address &&
                          bacsicForm.errors.address,
                      }
                    )}
                    onChange={bacsicForm.handleChange}
                    onBlur={bacsicForm.handleBlur}
                    value={bacsicForm.values.address}
                    name="address"
                    placeholder="Nhập địa chỉ khách hàng"
                  />
                </div>
                <span
                  className={clsx("text-sm text-red-500 opacity-0", {
                    "opacity-100":
                      bacsicForm.touched.address && bacsicForm.errors.address,
                  })}
                >
                  {bacsicForm.errors.address || "No message"}
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between border-t pt-6">
              <div
                className={clsx("flex items-center text-blue-500", {
                  invisible: !loading,
                })}
              >
                <i className="fa-solid fa-spinner animate-spin text-xl sm:text-2xl md:text-3xl"></i>
                <span className="text-lx pl-3 font-medium">
                  Đang tạo thông tin khách hàng
                </span>
              </div>
              <div className="flex mt-4 sm:mt-0">
                <Link to={"/customer"} className="btn btn-red btn-md">
                  <span className="pr-2">
                    <i className="fa-solid fa-circle-xmark"></i>
                  </span>
                  <span>Hủy</span>
                </Link>
                <button
                  type="submit"
                  className="btn btn-blue btn-md"
                  disabled={!bacsicForm.dirty || loading}
                >
                  <span className="pr-2">
                    <i className="fa-solid fa-circle-plus"></i>
                  </span>
                  <span>Thêm</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddCustomer;
