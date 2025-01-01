import { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Form, Input, Button, Spin, Typography } from "antd";
import TimeNow from "../../components/TimeNow";
import "react-toastify/dist/ReactToastify.css";

const validationSchema = Yup.object({
  name: Yup.string()
    .required("Trường này bắt buộc")
    .max(30, "Tên loại cây dài tối đa 30 kí tự"),
});

function AddProductType() {
  const [loading, setLoading] = useState(false);
  const showSuccessNoti = () =>
    toast.success("Thêm thông tin loại sản phẩm thành công!");
  const showCD = () =>
    toast.info("Bạn đã được chuyển sang trang thêm sản phẩm!");
  const showErorrNoti = () => toast.error("Có lỗi xảy ra!");

  const bacsicForm = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema,
    onSubmit: handleFormsubmit,
  });

  const navigate = useNavigate();
  function handleFormsubmit(values) {
    console.log(values);
    setLoading(true);
    fetch("http://localhost:302/api/product-type", {
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
          navigate("/product/add");
          showCD();
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
    <div className="container" style={{ maxWidth: 600, margin: "auto" }}>
      <Typography.Title level={3} style={{ textAlign: "center", marginBottom: 20, fontWeight: "bold" }}>
        Thêm loại sản phẩm mới
      </Typography.Title>

      <Form
        onFinish={bacsicForm.handleSubmit}
        layout="vertical"
        style={{ padding: 20, border: "1px solid #d9d9d9", borderRadius: 10 }}
      >
        <Form.Item
          label={<span style={{ fontWeight: "bold" }}>Tên loại sản phẩm</span>}
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
            placeholder="Sen đá"
            value={bacsicForm.values.name}
            onChange={bacsicForm.handleChange}
            onBlur={bacsicForm.handleBlur}
          />
        </Form.Item>

        <Form.Item label={<span style={{ fontWeight: "bold" }}>Ngày thêm</span>}>
          <div style={{ background: "#f5f5f5", padding: "8px", borderRadius: "4px" }}>
            <TimeNow />
          </div>
        </Form.Item>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
          <Link to="/product-type">
            <Button danger type="default">
              Hủy
            </Button>
          </Link>
          <Button
            type="primary"
            htmlType="submit"
            disabled={!bacsicForm.dirty || loading}
          >
            {loading ? <Spin size="small" style={{ marginRight: 8 }} /> : null}
            Thêm
          </Button>
        </div>
      </Form>
      <ToastContainer />
    </div>
  );
}

export default AddProductType;
