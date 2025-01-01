import { useState } from "react";
import * as Yup from "yup";
import { Formik, useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Spin, Typography, notification } from "antd";
import { ToastContainer, toast } from "react-toastify";
import { CheckOutlined, LoadingOutlined } from "@ant-design/icons";
import TimeNow from "../../components/TimeNow";
import "react-toastify/dist/ReactToastify.css";

const { Title } = Typography;

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
  const navigate = useNavigate();

  const showSuccessNoti = () =>
    notification.success({
      message: "Thành công",
      description: "Thêm thông tin khách hàng thành công!",
    });

  const showErorrNoti = () =>
    notification.error({
      message: "Lỗi",
      description: "Có lỗi xảy ra!",
    });

  const bacsicForm = useFormik({
    initialValues: {
      name: "",
      phone: "",
      address: "",
    },
    validationSchema,
    onSubmit: handleFormsubmit,
  });

  function handleFormsubmit(values) {
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
        setLoading(false);
        if (resJson.success) {
          showSuccessNoti();
          bacsicForm.resetForm();
        } else {
          showErorrNoti();
        }
      })
      .catch(() => {
        setLoading(false);
        showErorrNoti();
      });
  }

  return (
    <div className="container" style={{ maxWidth: 600, margin: "auto" }}>
      <Title level={3} style={{ textAlign: "center", marginBottom: 20, fontWeight: "bold" }}>
        Thêm khách hàng mới
      </Title>

      <Form
        onFinish={bacsicForm.handleSubmit}
        layout="vertical"
        style={{ padding: 20, border: "1px solid #d9d9d9", borderRadius: 10 }}
      >
        <Form.Item
          label={<span style={{ fontWeight: "bold" }}>Tên khách hàng</span>}
          validateStatus={
            bacsicForm.touched.name && bacsicForm.errors.name
              ? "error"
              : ""
          }
          help={
            bacsicForm.touched.name && bacsicForm.errors.name
              ? bacsicForm.errors.name
              : ""
          }
        >
          <Input
            id="name"
            name="name"
            placeholder="Nhập tên khách hàng"
            value={bacsicForm.values.name}
            onChange={bacsicForm.handleChange}
            onBlur={bacsicForm.handleBlur}
          />
        </Form.Item>

        <Form.Item
          label={<span style={{ fontWeight: "bold" }}>Số điện thoại</span>}
          validateStatus={
            bacsicForm.touched.phone && bacsicForm.errors.phone
              ? "error"
              : ""
          }
          help={
            bacsicForm.touched.phone && bacsicForm.errors.phone
              ? bacsicForm.errors.phone
              : ""
          }
        >
          <Input
            id="phone"
            name="phone"
            placeholder="Nhập số điện thoại"
            value={bacsicForm.values.phone}
            onChange={bacsicForm.handleChange}
            onBlur={bacsicForm.handleBlur}
          />
        </Form.Item>

        <Form.Item label={<span style={{ fontWeight: "bold" }}>Ngày thêm</span>}>
          <div
            style={{
              background: "#f5f5f5",
              padding: "8px 12px",
              borderRadius: "4px",
              textAlign: "center",
            }}
          >
            <TimeNow />
          </div>
        </Form.Item>

        <Form.Item
          label={<span style={{ fontWeight: "bold" }}>Địa chỉ</span>}
          validateStatus={
            bacsicForm.touched.address && bacsicForm.errors.address
              ? "error"
              : ""
          }
          help={
            bacsicForm.touched.address && bacsicForm.errors.address
              ? bacsicForm.errors.address
              : ""
          }
        >
          <Input
            id="address"
            name="address"
            placeholder="Nhập địa chỉ khách hàng"
            value={bacsicForm.values.address}
            onChange={bacsicForm.handleChange}
            onBlur={bacsicForm.handleBlur}
          />
        </Form.Item>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Link to="/customer">
            <Button danger type="default">
              Hủy
            </Button>
          </Link>
          <Button
            type="primary"
            htmlType="submit"
            disabled={!bacsicForm.dirty || loading}
          >
            {loading ? <LoadingOutlined style={{ marginRight: 8 }} /> : null}
            Thêm
          </Button>
        </div>
      </Form>

      <ToastContainer />
    </div>
  );
}

export default AddCustomer;
