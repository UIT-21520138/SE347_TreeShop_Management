import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button, Typography, Card, Row, Col } from "antd";
import moment from "moment";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { accountSelector } from "../../redux/selectors";

const { Title, Text } = Typography;

function DetailTypeProduct() {
  const { id } = useParams();
  const [productType, setProductType] = useState({});
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
    if (findResult) {
      return false;
    }
    return true;
  }

  useEffect(() => {
    callApi();
  }, []);

  function callApi() {
    fetch("http://localhost:302/api/product-type/" + id)
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.success) {
          setProductType(resJson.productType);
        } else {
          setProductType({});
        }
      });
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <Card
        title={<Title level={3} style={{ textAlign: "center" }}>Chi tiết loại sản phẩm</Title>}
        bordered={false}
      >
        {/* Product Type Details */}
        <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
          <Col span={12}>
            <Text strong>Mã loại sản phẩm</Text>
            <div style={{ padding: 10, background: "#f5f5f5", borderRadius: 4 }}>
              {productType.id || "-"}
            </div>
          </Col>
          <Col span={12}>
            <Text strong>Tên loại sản phẩm</Text>
            <div style={{ padding: 10, background: "#f5f5f5", borderRadius: 4 }}>
              {productType.name || "-"}
            </div>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
          <Col span={12}>
            <Text strong>Ngày thêm</Text>
            <div style={{ padding: 10, background: "#f5f5f5", borderRadius: 4 }}>
              {moment(productType.createdAt).format("(HH:mm:ss) DD/MM/YYYY") || "-"}
            </div>
          </Col>
        </Row>

        {/* Actions */}
        <Row justify="end" gutter={16} style={{ marginTop: 20 }}>
          <Col>
            <Link to="/product-type">
              <Button type="default">Quay lại</Button>
            </Link>
          </Col>
          <Col>
            <Link
              to={"/product-type/update/" + productType.id}
              className={clsx({ hidden: isHiddenItem("product-type/update") })}
            >
              <Button type="primary">Chỉnh sửa</Button>
            </Link>
          </Col>
        </Row>
      </Card>
    </div>
  );
}

export default DetailTypeProduct;
