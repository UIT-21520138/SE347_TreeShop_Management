import clsx from "clsx";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { orderActions } from "../../redux/slices/orderSlice";
import { orderSelector } from "../../redux/selectors";

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

function CustomerInput({ setIsValid }) {
  const [isExistCustomer, setIsExistCustomer] = useState(false);

  const dispatch = useDispatch();
  const customer = useSelector(orderSelector)?.customer;

  const formik = useFormik({
    initialValues: {
      name: customer.name,
      phone: customer.phone,
      address: customer.address,
    },
    validationSchema,
  });

  useEffect(() => {
    fetch(
      "http://localhost:302/api/customer?" +
        `filters={"phone": "${formik.values.phone}"}`
    )
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.success && resJson.customers?.length !== 0) {
          const parseCustomer = {
            _id: resJson.customers[0]._id,
            phone: resJson.customers[0].phone,
            name: resJson.customers[0].name,
            address: resJson.customers[0].address,
          };
          dispatch(orderActions.updateCustomer(parseCustomer));
          setIsExistCustomer(true);
          formik.setFieldValue("name", parseCustomer.name);
          formik.setFieldValue("address", parseCustomer.address);
        } else {
          dispatch(
            orderActions.updateCustomer({
              ...formik.values,
            })
          );
          setIsExistCustomer(false);
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(
          orderActions.updateCustomer({
            ...formik.values,
          })
        );
        setIsExistCustomer(false);
      });
  }, [formik.values]);

  useEffect(() => {
    if (!formik.dirty) {
      formik.validateForm();
    }
    setIsValid(formik.isValid);
  }, [formik.isValid]);

  useEffect(() => {
    if (!customer.name && !customer.phone && !customer.address) {
      formik.resetForm();
    }
  }, [customer]);

  return (
    <form className="flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 rounded-md border px-2 pt-2 shadow">
      <div className="flex w-full sm:w-56 flex-col">
        <label className="mb-1 font-semibold" htmlFor="phone">
          Số điện thoại
        </label>
        <input
          type="text"
          id="phone"
          className={clsx("text-input py-1", {
            invalid: formik.touched.phone && formik.errors.phone,
          })}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.phone}
          name="phone"
          placeholder="Số điện thoại"
        />
        <span
          className={clsx("text-xs text-red-500 opacity-0", {
            "opacity-100": formik.touched.phone && formik.errors.phone,
          })}
        >
          {formik.errors.phone || "No message"}
        </span>
      </div>
      <div className="flex w-full sm:w-64 flex-col">
        <label className="mb-1 font-semibold" htmlFor="name">
          Tên khách hàng
        </label>
        <input
          type="text"
          id="name"
          className={clsx("text-input py-1", {
            invalid: formik.touched.name && formik.errors.name,
            "disabled pointer-events-none": isExistCustomer,
          })}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
          name="name"
          placeholder="Tên khách hàng"
        />
        <span
          className={clsx("text-xs text-red-500 opacity-0", {
            "opacity-100": formik.touched.name && formik.errors.name,
          })}
        >
          {formik.errors.name || "No message"}
        </span>
      </div>
      <div className="flex w-full sm:flex-grow flex-col">
        <label className="mb-1 font-semibold" htmlFor="address">
          Địa chỉ
        </label>
        <input
          type="text"
          id="address"
          className={clsx("text-input py-1", {
            invalid: formik.touched.address && formik.errors.address,
            "disabled pointer-events-none": isExistCustomer,
          })}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.address}
          name="address"
          placeholder="Địa chỉ"
        />
        <span
          className={clsx("text-xs text-red-500 opacity-0", {
            "opacity-100": formik.touched.address && formik.errors.address,
          })}
        >
          {formik.errors.address || "No message"}
        </span>
      </div>
    </form>
  );
}

export default CustomerInput;
