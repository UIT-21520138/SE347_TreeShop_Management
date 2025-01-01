import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Table, Modal, Space, Typography, Input } from "antd";
import { PlusOutlined, ReloadOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

function Roles() {
  const { Title } = Typography;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingRoleId, setDeletingRoleId] = useState(null);
  const [roles, setRoles] = useState([]);
  const [searchText, setSearchText] = useState(""); // For search functionality
  const [loading, setLoading] = useState(false); // Loading indicator for table
  const navigate = useNavigate();

  const showDeleteNoti = () => toast.success("Xóa chức vụ thành công!");
  const showErrorNoti = () => toast.error("Có lỗi xảy ra!");

  useEffect(() => {
    getRoles();
  }, []);

  const getRoles = () => {
    setLoading(true); // Show loading spinner
    fetch("http://localhost:302/api/role")
      .then((res) => res.json())
      .then((resJson) => {
        setLoading(false);
        if (resJson.success) {
          setRoles(resJson.roles.reverse());
        } else {
          setRoles([]);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        setRoles([]);
      });
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredRoles = roles.filter((role) => {
    return (
      role.name.toLowerCase().includes(searchText.toLowerCase()) ||
      role.description.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const confirmDeleteRole = (id) => {
    setShowDeleteDialog(true);
    setDeletingRoleId(id);
  };

  const deleteRole = () => {
    fetch(`http://localhost:302/api/role/${deletingRoleId}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((resJson) => {
        setShowDeleteDialog(false);
        if (resJson) {
          showDeleteNoti();
          getRoles();
        } else {
          showErrorNoti();
        }
      })
      .catch(() => {
        showErrorNoti();
        setShowDeleteDialog(false);
      });
  };

  const handleRowClick = (record) => {
    navigate(`/role/detail/${record.id}`);
  };

  const columns = [
    {
      title: "Mã chức vụ",
      dataIndex: "id",
      key: "id",
      align: "center",
      width: 150,
    },
    {
      title: "Tên chức vụ",
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: "Chú thích",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Hành động",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation(); // Prevent row click
              navigate(`/role/update/${record.id}`);
            }}
          >
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={(e) => {
              e.stopPropagation(); // Prevent row click
              confirmDeleteRole(record.id);
            }}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="container" style={{ padding: "20px" }}>
      {/* Header Section */}
      <div className="flex flex-row justify-between items-center mb-4">
        <Title level={3}>Danh sách chức vụ</Title>
        <Button
          type="default"
          onClick={getRoles}
          icon={<ReloadOutlined />}
        >
          Tải lại
        </Button>
      </div>

      {/* Search and Add Section */}
      <div className="flex flex-row justify-between items-center mb-4">
        <Input
          placeholder="Tìm kiếm chức vụ"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
          suffix={<SearchOutlined />}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/role/add")}
        >
          Thêm chức vụ
        </Button>
      </div>

      {/* Table Section */}
      <Table
        columns={columns}
        dataSource={filteredRoles}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ y: "75vh" }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record), // Navigate to detail page on row click
        })}
      />

      {/* Delete Confirmation Dialog */}
      <Modal
        title="Xác nhận xóa"
        visible={showDeleteDialog}
        onCancel={() => setShowDeleteDialog(false)}
        onOk={deleteRole}
        okText="Xóa"
        cancelText="Hủy"
      >
        Bạn có chắc chắn muốn xóa chức vụ này không?
      </Modal>
    </div>
  );
}

export default Roles;
