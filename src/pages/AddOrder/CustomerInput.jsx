import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { Row, Col, Input, Typography } from "antd";
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
    <Row gutter={[16, 16]} className="rounded-md border px-2 pt-2 shadow">
      <Col xs={24} sm={8}>
        <Typography.Text strong>Số điện thoại</Typography.Text>
        <Input
          type="text"
          value={formik.values.phone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="phone"
          placeholder="Số điện thoại"
          status={formik.touched.phone && formik.errors.phone ? "error" : ""}
        />
        <Typography.Text type="danger">
          {formik.touched.phone && formik.errors.phone}
        </Typography.Text>
      </Col>
      <Col xs={24} sm={8}>
        <Typography.Text strong>Tên khách hàng</Typography.Text>
        <Input
          type="text"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="name"
          placeholder="Tên khách hàng"
          disabled={isExistCustomer}
          status={formik.touched.name && formik.errors.name ? "error" : ""}
        />
        <Typography.Text type="danger">
          {formik.touched.name && formik.errors.name}
        </Typography.Text>
      </Col>
      <Col xs={24} sm={8}>
        <Typography.Text strong>Địa chỉ</Typography.Text>
        <Input
          type="text"
          value={formik.values.address}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="address"
          placeholder="Địa chỉ"
          disabled={isExistCustomer}
          status={formik.touched.address && formik.errors.address ? "error" : ""}
        />
        <Typography.Text type="danger">
          {formik.touched.address && formik.errors.address}
        </Typography.Text>
      </Col>
    </Row>
  );
}

export default CustomerInput;
