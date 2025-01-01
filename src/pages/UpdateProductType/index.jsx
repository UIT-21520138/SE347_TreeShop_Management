import { Fragment, useState, useEffect } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import clsx from "clsx";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import TimeNow from "../../components/TimeNow";

const validationSchema = Yup.object({
  name: Yup.string()
    .required("Trường này bắt buộc")
    .max(30, "Tên loại sản phẩm dài tối đa 30 kí tự"),
});

function UpdateProductType() {
  const [loading, setLoading] = useState(false);
  const [productType, setProductType] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  const showSuccessNoti = () =>
    toast.success("Chỉnh sửa thông tin loại sản phẩm thành công!");
  const showErrorNoti = () => toast.error("Có lỗi xảy ra!");

  useEffect(() => {
    fetch(`http://localhost:302/api/product-type/${id}`)
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.success) {
          setProductType(resJson.productType);
        } else {
          setProductType({});
        }
      });
  }, [id]);

  const formik = useFormik({
    initialValues: {
      name: productType.name || "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: handleFormSubmit,
  });

  function handleFormSubmit(values) {
    setLoading(true);
    fetch(`http://localhost:302/api/product-type/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((resJson) => {
        setLoading(false);
        if (resJson.success) {
          showSuccessNoti();
          setTimeout(() => navigate("/product-type"), 3000);
        } else {
          showErrorNoti();
        }
      })
      .catch(() => {
        setLoading(false);
        showErrorNoti();
      });
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8">
      <ToastContainer />
      <div className="max-w-2xl mx-auto">
        <form
          onSubmit={formik.handleSubmit}
          className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Chỉnh sửa loại sản phẩm
          </h2>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium">
              Mã loại sản phẩm
            </label>
            <div className="py-2 px-3 border border-gray-300 rounded-md bg-gray-100">
              {productType.id}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-medium">
              Tên loại sản phẩm
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={clsx(
                "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2",
                {
                  "border-red-500": formik.touched.name && formik.errors.name,
                  "focus:ring-blue-500": !formik.errors.name,
                }
              )}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              placeholder="Nhập tên loại sản phẩm"
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium">
              Thời gian chỉnh sửa
            </label>
            <div className="text-input disabled select-none">
              <TimeNow/>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Link
              to="/product-type"
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Hủy
            </Link>
            <button
              type="submit"
              disabled={!formik.dirty || loading}
              className={clsx(
                "px-4 py-2 text-white rounded-md",
                {
                  "bg-blue-500 hover:bg-blue-600": !loading,
                  "bg-gray-400": loading,
                }
              )}
            >
              {loading ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateProductType;
