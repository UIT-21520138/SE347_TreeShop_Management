import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Form,
  Input,
  Button,
  Typography,
  Row,
  Col,
  Spin,
  notification,
} from "antd";
import TimeNow from "../../components/TimeNow";
import AccountRule from "../../components/AccountRoleInput";

const { Title } = Typography;

const validationSchema = Yup.object({
  name: Yup.string()
    .required("Trường này bắt buộc")
    .min(2, "Tên phải có độ dài hơn 2 kí tự")
    .max(30, "Tên dài tối đa 30 kí tự"),
  email: Yup.string()
    .required("Trường này bắt buộc")
    .email("Email sai không đúng định dạng"),
});

function UpdateAccount() {
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  const showSuccessNoti = () =>
    notification.success({
      message: "Thành công",
      description: "Chỉnh sửa thông tin tài khoản thành công!",
    });

  const showErrorNoti = () =>
    notification.error({
      message: "Lỗi",
      description: "Có lỗi xảy ra!",
    });

  useEffect(() => {
    fetchAccountDetails();
  }, []);

  function fetchAccountDetails() {
    fetch(`http://localhost:302/api/account/${id}`)
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.success) {
          setAccount(resJson.account);
        } else {
          setAccount({});
        }
      });
  }

  const bacsicForm = useFormik({
    initialValues: {
      name: account.name || "",
      email: account.email || "",
      role: account.role?._id || "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: handleFormSubmit,
  });

  function handleFormSubmit(values) {
    setLoading(true);
  
    const updatedFields = {};
    Object.keys(values).forEach((key) => {
      if (values[key] !== bacsicForm.initialValues[key]) {
        updatedFields[key] = values[key];
      }
    });
  
    fetch(`http://localhost:302/api/account/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedFields),
    })
      .then((res) => res.json())
      .then((resJson) => {
        setLoading(false);
        if (resJson.success) {
          showSuccessNoti();
          navigate("/account"); // Redirect to /account
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
        Chỉnh sửa tài khoản
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
              {/* Cập nhật AccountRule để giống input khác */}
              <AccountRule
                name="role"
                onChange={bacsicForm.handleChange}
                onBlur={bacsicForm.handleBlur}
                value={bacsicForm.values.role}
                className="w-full py-[5px]" // Đảm bảo có cùng kích thước với các input khác
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={<span style={{ fontWeight: "bold" }}>Tài khoản</span>}>
              <div
                style={{
                  background: "#f5f5f5",
                  padding: 8,
                  borderRadius: 4,
                }}
              >
                {account.username}
              </div>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label={<span style={{ fontWeight: "bold" }}>Ngày chỉnh sửa</span>}>
          <div
            style={{
              background: "#f5f5f5",
              padding: 8,
              borderRadius: 4,
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
              {loading ? <Spin size="small" style={{ marginRight: 8 }} /> : null}
              Lưu
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default UpdateAccount;
