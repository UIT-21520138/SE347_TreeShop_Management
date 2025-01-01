import * as Yup from "yup";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Form, Input, Checkbox, Button, Spin, Row, Col, Typography, Card } from "antd";

const { Title } = Typography;

const validationSchema = Yup.object({
  name: Yup.string().required("Trường này bắt buộc"),
  description: Yup.string().required("Trường này bắt buộc"),
});

function AddRole() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // For navigation
  const showSuccessNoti = () => toast.success("Tạo chức vụ thành công!");
  const showErrorNoti = () => toast.error("Có lỗi xảy ra!");

  const [functions, setFunctions] = useState([]);
  const [selectedFunctionIds, setSelectedFunctionIds] = useState([]);
  const [checkAll, setCheckAll] = useState(false);

  useEffect(() => {
    fetch("http://localhost:302/api/function")
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.success) {
          setFunctions(resJson.functions);
        } else {
          setFunctions([]);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  const roleForm = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema,
    onSubmit: createRoles,
  });

  function createRoles(values) {
    setLoading(true);
    fetch("http://localhost:302/api/role", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...values, functions: selectedFunctionIds }),
    })
      .then((res) => res.json())
      .then((resJson) => {
        setLoading(false);
        if (resJson.success) {
          showSuccessNoti();
          navigate("/role"); // Navigate to the Role page after success
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
        Thêm mới chức vụ
      </Title>
      <Form
        onFinish={roleForm.handleSubmit}
        layout="vertical"
        style={{ background: "#fff", padding: 20, borderRadius: 8 }}
      >
        {/* Two-column layout for role name and description */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={<span style={{ fontWeight: "bold" }}>Tên chức vụ</span>}
              validateStatus={roleForm.touched.name && roleForm.errors.name ? "error" : ""}
              help={roleForm.touched.name && roleForm.errors.name}
            >
              <Input
                name="name"
                placeholder="Tên chức vụ"
                onChange={roleForm.handleChange}
                onBlur={roleForm.handleBlur}
                value={roleForm.values.name}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={<span style={{ fontWeight: "bold" }}>Mô tả chức vụ</span>}
              validateStatus={roleForm.touched.description && roleForm.errors.description ? "error" : ""}
              help={roleForm.touched.description && roleForm.errors.description}
            >
              <Input
                name="description"
                placeholder="Mô tả chức vụ"
                onChange={roleForm.handleChange}
                onBlur={roleForm.handleBlur}
                value={roleForm.values.description}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Permissions section */}
        <Card title="Chọn các quyền" style={{ marginTop: 20 }}>
          <Row gutter={[16, 16]}>
            {functions.map((func, index) => (
              <Col span={8} key={index}>
                <Checkbox
                  onChange={() => {
                    if (selectedFunctionIds.includes(func._id)) {
                      setSelectedFunctionIds(selectedFunctionIds.filter((id) => id !== func._id));
                    } else {
                      setSelectedFunctionIds([...selectedFunctionIds, func._id]);
                    }
                  }}
                  checked={selectedFunctionIds.includes(func._id)}
                >
                  {func.displayName}
                </Checkbox>
              </Col>
            ))}
          </Row>
        </Card>

        {/* Footer actions */}
        <Row justify="space-between" style={{ marginTop: 20 }}>
          <Col>
            <Checkbox
              checked={checkAll}
              onChange={(e) => {
                setCheckAll(e.target.checked);
                setSelectedFunctionIds(e.target.checked ? functions.map((func) => func._id) : []);
              }}
            >
              Chọn tất cả
            </Checkbox>
          </Col>
          <Col>
            <div style={{ display: "flex", gap: 16 }}>
              <Link to="/role">
                <Button danger>Hủy</Button>
              </Link>
              <Button type="primary" htmlType="submit" disabled={loading}>
                {loading ? <Spin size="small" style={{ marginRight: 8 }} /> : null}
                Thêm
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default AddRole;
