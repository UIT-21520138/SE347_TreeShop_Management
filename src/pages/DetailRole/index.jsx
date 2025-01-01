import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Typography, Row, Col, Card, Checkbox, Spin } from "antd";

const { Title } = Typography;

function DetailRole() {
  const { id } = useParams();
  const [role, setRole] = useState({});
  const [functions, setFunctions] = useState([]);
  const [selectedFunctionIds, setSelectedFunctionIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch role details and associated functions
    const fetchRoleAndFunctions = async () => {
      try {
        const [roleRes, functionsRes] = await Promise.all([
          fetch(`http://localhost:302/api/role/${id}`).then((res) => res.json()),
          fetch("http://localhost:302/api/function").then((res) => res.json()),
        ]);

        if (roleRes.success && functionsRes.success) {
          setRole(roleRes.role);
          setFunctions(functionsRes.functions);
          setSelectedFunctionIds(
            roleRes.role?.functions?.map((func) => func._id) || []
          );
        } else {
          setRole({});
          setFunctions([]);
        }
      } catch (error) {
        console.error("Error fetching role or functions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoleAndFunctions();
  }, [id]);

  const isChecked = (id) => selectedFunctionIds.includes(id);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <Title level={3} style={{ textAlign: "center", marginBottom: 20 }}>
        Chi tiết chức vụ
      </Title>
      <Card style={{ background: "#fff", padding: 20, borderRadius: 8 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Typography.Text strong>Tên chức vụ:</Typography.Text>
            <div style={{ marginTop: 8 }}>{role.name || "N/A"}</div>
          </Col>
          <Col span={12}>
            <Typography.Text strong>Mô tả:</Typography.Text>
            <div style={{ marginTop: 8 }}>{role.description || "N/A"}</div>
          </Col>
        </Row>

        <Card title="Danh sách quyền" style={{ marginTop: 20 }}>
          <Row gutter={[16, 16]}>
            {functions.map((func) => (
              <Col span={8} key={func._id}>
                <Checkbox checked={isChecked(func._id)} disabled>
                  {func.displayName}
                </Checkbox>
              </Col>
            ))}
          </Row>
        </Card>

        <Row justify="end" style={{ marginTop: 20 }}>
          <Col>
            <Link to="/role">
              <Button danger style={{ marginRight: 8 }}>
                Quay lại
              </Button>
            </Link>
            <Link to={`/role/update/${role.id}`}>
              <Button type="primary">Chỉnh sửa</Button>
            </Link>
          </Col>
        </Row>
      </Card>
    </div>
  );
}

export default DetailRole;
