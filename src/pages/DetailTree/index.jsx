import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Row, Col, Form, Button, Image, Typography } from "antd";
import moment from "moment";
import { useSelector } from "react-redux";
import { accountSelector } from "../../redux/selectors";

const { Title, Text } = Typography;

function DetailTree() {
  const account = useSelector(accountSelector);

  function isHiddenItem(functionName) {
    if (!account) {
      return true;
    }
    if (!functionName) {
      return false;
    }
    const findResult = account?.functions?.find(
      (_func) => _func?.name === functionName
    );
    return !findResult;
  }

  const [img, setImg] = useState();
  const [product, setProduct] = useState({});
  const { id } = useParams();

  useEffect(() => {
    // Cleanup
    return () => {
      img && URL.revokeObjectURL(img.preview);
    };
  }, [img]);

  useEffect(() => {
    callApi();
  }, []);

  function callApi() {
    fetch(`http://localhost:302/api/product/${id}`)
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.success) {
          setProduct(resJson.product);
        } else {
          setProduct({});
        }
      });
  }

  return (
    <div className="container">
      <Title level={3}>Chi tiết cây</Title>

      <Row gutter={16} className="mt-4">
        {/* 2 cột text */}
        <Col xs={24} sm={8}>
          <Form layout="vertical">
            <Form.Item label={<Text strong>Mã sản phẩm</Text>}>
              <Text>{product.id}</Text>
            </Form.Item>
            <Form.Item label={<Text strong>Loại cây</Text>}>
              <Text>{product?.type?.name}</Text>
            </Form.Item>
            <Form.Item label={<Text strong>Ngày nhập cây</Text>}>
              <Text>
                {moment(product.createdAt).format("HH:mm:ss DD/MM/YYYY")}
              </Text>
            </Form.Item>
          </Form>
        </Col>

        <Col xs={24} sm={8}>
          <Form layout="vertical">
            <Form.Item label={<Text strong>Tên cây</Text>}>
              <Text>{product.name}</Text>
            </Form.Item>
            <Form.Item label={<Text strong>Số lượng</Text>}>
              <Text>{product.quantity}</Text>
            </Form.Item>
            <Form.Item label={<Text strong>Giá</Text>}>
              <Text>
                {product.price} VNĐ
              </Text>
            </Form.Item>
          </Form>
        </Col>

        {/* Ảnh ở cột thứ 3 */}
        <Col xs={24} sm={8}>
          <Form layout="vertical">
            <Form.Item label={<Text strong>Hình ảnh</Text>}>
              <Image
                src={product.image}
                alt={product.name}
                width="100%"
                style={{ maxHeight: "240px", objectFit: "contain" }}
              />
            </Form.Item>
          </Form>
        </Col>
      </Row>

      <Row justify="end" className="mt-8">
        <Col>
          <Link to="/product">
            <Button type="default" danger className="mr-4">
              Quay lại
            </Button>
          </Link>
          {!isHiddenItem("product/update") && (
            <Link to={`/product/update/${product.id}`}>
              <Button type="primary">Chỉnh sửa</Button>
            </Link>
          )}
        </Col>
      </Row>
    </div>
  );
}

export default DetailTree;
