import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Typography, Card, Row, Col } from "antd";
import moment from "moment";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { accountSelector } from "../../redux/selectors";

const { Title, Text } = Typography;

function DetailCustomer() {
  const { id } = useParams();
  const [customer, setCustomer] = useState({});
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
    fetch("http://localhost:302/api/customer/" + id)
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.success) {
          setCustomer(resJson.customer);
        } else {
          setCustomer({});
        }
      });
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <Card
        title={<Title level={3} style={{ textAlign: "center" }}>Chi tiết khách hàng</Title>}
        bordered={false}
      >
        {/* Customer Details */}
        <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
          <Col span={12}>
            <Text strong>Mã khách hàng</Text>
            <div style={{ padding: 10, background: "#f5f5f5", borderRadius: 4 }}>
              {customer.id || "-"}
            </div>
          </Col>
          <Col span={12}>
            <Text strong>Số điện thoại</Text>
            <div style={{ padding: 10, background: "#f5f5f5", borderRadius: 4 }}>
              {customer.phone || "-"}
            </div>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
          <Col span={12}>
            <Text strong>Tên khách hàng</Text>
            <div style={{ padding: 10, background: "#f5f5f5", borderRadius: 4 }}>
              {customer.name || "-"}
            </div>
          </Col>
          <Col span={12}>
            <Text strong>Ngày thêm</Text>
            <div style={{ padding: 10, background: "#f5f5f5", borderRadius: 4 }}>
              {moment(customer.createdAt).format("(HH:mm:ss) DD/MM/YYYY") || "-"}
            </div>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
          <Col span={24}>
            <Text strong>Địa chỉ</Text>
            <div style={{ padding: 10, background: "#f5f5f5", borderRadius: 4 }}>
              {customer.address || "-"}
            </div>
          </Col>
        </Row>

        {/* Actions */}
        <Row justify="end" gutter={16} style={{ marginTop: 20 }}>
          <Col>
            <Link to="/customer">
              <Button type="default">Quay lại</Button>
            </Link>
          </Col>
          <Col>
            <Link
              to={"/customer/update/" + customer.id}
              className={clsx({ hidden: isHiddenItem("customer/update") })}
            >
              <Button type="primary">Chỉnh sửa</Button>
            </Link>
          </Col>
        </Row>
      </Card>
    </div>
  );
}

export default DetailCustomer;
