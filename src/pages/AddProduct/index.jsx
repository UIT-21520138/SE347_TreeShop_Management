import { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import ProductTypeInput from "../../components/ProductTypeInput";
import PriceInput from "../../components/PriceInput";
import ImageInput from "../../components/ImageInput";
import "react-toastify/dist/ReactToastify.css";
import { Form, Input, InputNumber, Button, Spin, Row, Col } from "antd";
import TimeNow from "../../components/TimeNow";

const validationSchema = Yup.object({
  name: Yup.string().required("Trường này bắt buộc"),
  price: Yup.number()
    .required("Trường này bắt buộc")
    .min(1, "Giá phải lớn hơn 0"),
  quantity: Yup.number()
    .required("Trường này bắt buộc")
    .min(1, "Số lượng phải lớn hơn 0"),
  type: Yup.string().required("Trường này bắt buộc"),
});

function AddProduct() {
  const [loading, setLoading] = useState(false);
  const showSuccessNoti = () => toast.success("Tạo sản phẩm thành công!");
  const showErorrNoti = () => toast.error("Có lỗi xảy ra!");

  const navigate = useNavigate();

  const bacsicForm = useFormik({
    initialValues: {
      name: "",
      price: "",
      quantity: "",
      type: "",
      image: "",
    },
    validationSchema,
    onSubmit: handleFormsubmit,
  });

  function handleFormsubmit(values) {
    setLoading(true);
    fetch("http://localhost:302/api/product", {
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
          navigate("/product"); // Redirect to the product page after success
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
        <Form onFinish={bacsicForm.handleSubmit} layout="vertical">
          {/* Fields and Image in Two Columns */}
          <Row gutter={16}>
            <Col xs={24} sm={16}>
              <Form.Item
                label={<span style={{ fontWeight: "bold" }}>Tên sản phẩm</span>}
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
                  placeholder="Nhập tên sản phẩm"
                  value={bacsicForm.values.name}
                  onChange={bacsicForm.handleChange}
                  onBlur={bacsicForm.handleBlur}
                />
              </Form.Item>

             <Form.Item
  label={<span style={{ fontWeight: "bold" }}>Loại sản phẩm</span>}
  validateStatus={
    bacsicForm.touched.type && bacsicForm.errors.type
      ? "error"
      : ""
  }
  help={
    bacsicForm.touched.type && bacsicForm.errors.type
      ? bacsicForm.errors.type
      : ""
  }
>
  <ProductTypeInput
    id="type"
    name="type"
    value={bacsicForm.values.type}
    onChange={bacsicForm.handleChange}
    onBlur={bacsicForm.handleBlur}
    style={{ width: "100%" }} // Đảm bảo chiều rộng 100%
  />
</Form.Item>


              <Form.Item
                label={<span style={{ fontWeight: "bold" }}>Số lượng</span>}
                validateStatus={
                  bacsicForm.touched.quantity && bacsicForm.errors.quantity
                    ? "error"
                    : ""
                }
                help={
                  bacsicForm.touched.quantity && bacsicForm.errors.quantity
                    ? bacsicForm.errors.quantity
                    : ""
                }
              >
                <InputNumber
                  id="quantity"
                  name="quantity"
                  placeholder="Nhập số lượng"
                  value={bacsicForm.values.quantity}
                  onChange={(value) =>
                    bacsicForm.setFieldValue("quantity", value)
                  }
                  onBlur={bacsicForm.handleBlur}
                  min={1}
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item
                label={<span style={{ fontWeight: "bold" }}>Giá</span>}
                validateStatus={
                  bacsicForm.touched.price && bacsicForm.errors.price
                    ? "error"
                    : ""
                }
                help={
                  bacsicForm.touched.price && bacsicForm.errors.price
                    ? bacsicForm.errors.price
                    : ""
                }
              >
                <PriceInput
                  id="price_AddProduct_page"
                  name="price"
                  placeholder="Nhập giá mỗi sản phẩm"
                  value={bacsicForm.values.price}
                  onChange={(value) => bacsicForm.setFieldValue("price", value)}
                  onBlur={bacsicForm.handleBlur}
                />
              </Form.Item>

              <Form.Item
                label={<span style={{ fontWeight: "bold" }}>Ngày thêm</span>}
              >
                <div
                  style={{
                    background: "#f5f5f5",
                    padding: "8px",
                    borderRadius: "4px",
                  }}
                >
                  <TimeNow />
                </div>
              </Form.Item>
            </Col>

            <Col xs={24} sm={8}>
              <Form.Item
                label={<span style={{ fontWeight: "bold" }}>Hình ảnh</span>}
              >
                <ImageInput formik={bacsicForm} forikField="image" />
              </Form.Item>
            </Col>
          </Row>

          {/* Submit and Cancel Buttons */}
          <Row justify="space-between" align="middle" className="mt-6">
            <Col>
              {loading && (
                <Spin
                  indicator={
                    <i className="fa-solid fa-spinner animate-spin text-xl"></i>
                  }
                />
              )}
              <span className="text-lx pl-3 font-medium">
                {loading ? "Đang tạo sản phẩm" : ""}
              </span>
            </Col>

            <Col>
              <Link to={"/product"}>
                <Button type="default" danger>
                  <span className="pr-2">
                    <i className="fa-solid fa-circle-xmark"></i>
                  </span>
                  <span>Hủy</span>
                </Button>
              </Link>
              <Button
                type="primary"
                htmlType="submit"
                className="ml-4"
                disabled={!bacsicForm.dirty || loading}
              >
                <span className="pr-2">
                  <i className="fa-solid fa-circle-plus"></i>
                </span>
                <span>Thêm</span>
              </Button>
            </Col>
          </Row>
        </Form>
        <ToastContainer />
      </div>
    </>
  );
}

export default AddProduct;
