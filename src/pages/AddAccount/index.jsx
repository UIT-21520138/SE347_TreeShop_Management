import { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Typography,
  notification,
  Row,
  Col,
  Spin,
} from "antd";
import TimeNow from "../../components/TimeNow";
import AccountRoleInput from "../../components/AccountRoleInput";
import "react-toastify/dist/ReactToastify.css";

const { Title } = Typography;

const validationSchema = Yup.object({
  role: Yup.string().required("Trường này bắt buộc"),
  name: Yup.string()
    .required("Trường này bắt buộc")
    .min(2, "Tên phải có độ dài hơn 2 kí tự")
    .max(30, "Tên dài tối đa 30 kí tự"),
  email: Yup.string()
    .required("Trường này bắt buộc")
    .email("Email sai không đúng định dạng"),
  username: Yup.string().required("Vui lòng nhập tên tài tài khoản!"),
  password: Yup.string()
    .required("Vui lòng nhập mật khẩu!")
    .min(6, "Mật khẩu quá ngắn! mật khẩu phải có ít nhất 6 kí tự"),
  RePassword: Yup.string()
    .required("Vui lòng nhập lại mật khẩu!")
    .oneOf([Yup.ref("password"), null], "Nhập lại mật khẩu không đúng"),
});

function AddAccount() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const showSuccessNoti = () =>
    notification.success({
      message: "Thành công",
      description: "Thêm thông tin tài khoản thành công!",
    });

  const showErrorNoti = () =>
    notification.error({
      message: "Lỗi",
      description: "Có lỗi xảy ra!",
    });

  const bacsicForm = useFormik({
    initialValues: {
      name: "",
      email: "",
      role: "",
      username: "",
      password: "",
      RePassword: "",
    },
    validationSchema,
    onSubmit: handleFormSubmit,
  });

  function handleFormSubmit(values) {
    setLoading(true);
    fetch("http://localhost:302/api/account", {
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
          navigate("/account"); // Redirect to the Account page after success
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
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <Title level={3} style={{ textAlign: "center", marginBottom: 20 }}>
        Thêm tài khoản mới
      </Title>
      <Form
        onFinish={bacsicForm.handleSubmit}
        layout="vertical"
        style={{ background: "#fff", padding: 20, borderRadius: 8 }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={<span style={{ fontWeight: "bold" }}>Tên nhân viên</span>}
              validateStatus={
                bacsicForm.touched.name && bacsicForm.errors.name ? "error" : ""
              }
              help={bacsicForm.touched.name && bacsicForm.errors.name}
            >
              <Input
                name="name"
                placeholder="Tên nhân viên"
                onChange={bacsicForm.handleChange}
                onBlur={bacsicForm.handleBlur}
                value={bacsicForm.values.name}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={<span style={{ fontWeight: "bold" }}>Địa chỉ email</span>}
              validateStatus={
                bacsicForm.touched.email && bacsicForm.errors.email
                  ? "error"
                  : ""
              }
              help={bacsicForm.touched.email && bacsicForm.errors.email}
            >
              <Input
                name="email"
                placeholder="Địa chỉ email"
                onChange={bacsicForm.handleChange}
                onBlur={bacsicForm.handleBlur}
                value={bacsicForm.values.email}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={<span style={{ fontWeight: "bold" }}>Chức vụ</span>}
              validateStatus={
                bacsicForm.touched.role && bacsicForm.errors.role ? "error" : ""
              }
              help={bacsicForm.touched.role && bacsicForm.errors.role}
            >
              <AccountRoleInput
                name="role"
                placeholder="Chọn chức vụ"
                onChange={bacsicForm.handleChange}
                onBlur={bacsicForm.handleBlur}
                value={bacsicForm.values.role}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={<span style={{ fontWeight: "bold" }}>Tài khoản</span>}
              validateStatus={
                bacsicForm.touched.username && bacsicForm.errors.username
                  ? "error"
                  : ""
              }
              help={bacsicForm.touched.username && bacsicForm.errors.username}
            >
              <Input
                name="username"
                placeholder="Tên tài khoản"
                onChange={bacsicForm.handleChange}
                onBlur={bacsicForm.handleBlur}
                value={bacsicForm.values.username}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={<span style={{ fontWeight: "bold" }}>Mật khẩu</span>}
              validateStatus={
                bacsicForm.touched.password && bacsicForm.errors.password
                  ? "error"
                  : ""
              }
              help={bacsicForm.touched.password && bacsicForm.errors.password}
            >
              <Input.Password
                name="password"
                placeholder="Mật khẩu"
                onChange={bacsicForm.handleChange}
                onBlur={bacsicForm.handleBlur}
                value={bacsicForm.values.password}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={
                <span style={{ fontWeight: "bold" }}>Nhập lại mật khẩu</span>
              }
              validateStatus={
                bacsicForm.touched.RePassword && bacsicForm.errors.RePassword
                  ? "error"
                  : ""
              }
              help={
                bacsicForm.touched.RePassword && bacsicForm.errors.RePassword
              }
            >
              <Input.Password
                name="RePassword"
                placeholder="Nhập lại mật khẩu"
                onChange={bacsicForm.handleChange}
                onBlur={bacsicForm.handleBlur}
                value={bacsicForm.values.RePassword}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={<span style={{ fontWeight: "bold" }}>Ngày thêm</span>}
        >
          <div
            style={{
              background: "#f5f5f5",
              padding: 10,
              borderRadius: 8,
              textAlign: "center",
            }}
          >
            <TimeNow />
          </div>
        </Form.Item>

        <Row justify="space-between" style={{ marginTop: 20 }}>
          <Col>
            <Link to="/account">
              <Button danger>Hủy</Button>
            </Link>
          </Col>
          <Col>
            <Button type="primary" htmlType="submit" disabled={loading}>
              {loading ? (
                <Spin size="small" style={{ marginRight: 8 }} />
              ) : null}
              Thêm
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default AddAccount;
