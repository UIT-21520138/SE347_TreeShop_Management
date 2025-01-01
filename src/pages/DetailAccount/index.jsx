import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Typography, Row, Col, Button, Card } from "antd";
import moment from "moment";

const { Title } = Typography;

function DetailAccount() {
  const { id } = useParams();
  const [account, setAccount] = useState({});

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
      })
      .catch((error) => console.error("Error fetching account:", error));
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <Title level={3} style={{ textAlign: "center", marginBottom: 20 }}>
        Chi tiết tài khoản
      </Title>
      <Card style={{ borderRadius: 8, padding: 20, background: "#fff" }}>
        <Row gutter={16}>
          <Col span={12}>
            <div style={{ marginBottom: 16 }}>
              <Typography.Text strong>Tên nhân viên:</Typography.Text>
              <div style={{ background: "#f5f5f5", padding: 8, borderRadius: 4 }}>
                {account.name || "-"}
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Typography.Text strong>Địa chỉ email:</Typography.Text>
              <div style={{ background: "#f5f5f5", padding: 8, borderRadius: 4 }}>
                {account.email || "-"}
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Typography.Text strong>Chức vụ:</Typography.Text>
              <div style={{ background: "#f5f5f5", padding: 8, borderRadius: 4 }}>
                {account.role?.name || "-"}
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: 16 }}>
              <Typography.Text strong>Tài khoản:</Typography.Text>
              <div style={{ background: "#f5f5f5", padding: 8, borderRadius: 4 }}>
                {account.username || "-"}
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Typography.Text strong>Mật khẩu:</Typography.Text>
              <div style={{ background: "#f5f5f5", padding: 8, borderRadius: 4 }}>
                ******
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Typography.Text strong>Nhập lại mật khẩu:</Typography.Text>
              <div style={{ background: "#f5f5f5", padding: 8, borderRadius: 4 }}>
                ******
              </div>
            </div>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <div style={{ marginBottom: 16 }}>
              <Typography.Text strong>Ngày thêm:</Typography.Text>
              <div style={{ background: "#f5f5f5", padding: 8, borderRadius: 4 }}>
                {account.createdAt
                  ? moment(account.createdAt).format("(HH:mm:ss) DD/MM/YYYY")
                  : "-"}
              </div>
            </div>
          </Col>
        </Row>
        <Row justify="space-between" style={{ marginTop: 20 }}>
          <Col>
            <Link to="/account">
              <Button danger>
                <i className="fa-solid fa-circle-xmark" style={{ marginRight: 8 }}></i>
                Quay lại
              </Button>
            </Link>
          </Col>
          <Col>
            <Link to={`/account/update/${account.id}`}>
              <Button type="primary">
                <i className="fa-solid fa-pen-to-square" style={{ marginRight: 8 }}></i>
                Chỉnh sửa
              </Button>
            </Link>
          </Col>
        </Row>
      </Card>
    </div>
  );
}

export default DetailAccount;
