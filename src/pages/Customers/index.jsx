import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Input, Modal, notification, Space, Typography } from "antd";
import { PlusOutlined, ReloadOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import "react-toastify/dist/ReactToastify.css";

function Customers() {
  const { Title } = Typography;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingCustomerId, setDeletingCustomerId] = useState(null);
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const openNotification = (type, message) => {
    notification[type]({ message });
  };

  useEffect(() => {
    getCustomers();
  }, []);

  function getCustomers() {
    setLoading(true);
    fetch("http://localhost:302/api/customer")
      .then((res) => res.json())
      .then((resJson) => {
        setLoading(false);
        if (resJson.success) {
          setCustomers(resJson.customers);
        } else {
          setCustomers([]);
        }
      })
      .catch((error) => {
        setLoading(false);
        setCustomers([]);
        console.error(error);
      });
  }

  function deleteCustomer(id) {
    fetch("http://localhost:302/api/customer/" + id, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((resJson) => {
        setShowDeleteDialog(false);
        if (resJson.success) {
          openNotification("success", "Xóa khách hàng thành công!");
          getCustomers();
        } else {
          openNotification("error", "Có lỗi xảy ra!");
        }
      })
      .catch(() => {
        openNotification("error", "Có lỗi xảy ra!");
        setShowDeleteDialog(false);
      });
  }

  const filteredCustomers = customers.filter((customer) => {
    return search.toLowerCase() === ""
      ? customer
      : customer.name.toLowerCase().includes(search) ||
          customer.phone.toLowerCase().includes(search);
  });

  const columns = [
    {
      title: "Mã KH",
      dataIndex: "id",
      key: "id",
      width: 100,
      align: "center",
    },
    {
      title: "Tên khách hàng",
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      align: "center",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      width: 300,
    },
    {
      title: "Hành động",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              setShowDeleteDialog(true);
              setDeletingCustomerId(record.id);
            }}
          >
            Xoá
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="container w-full sm:w-full md:w-full mx-auto">
      <div className="flex flex-row justify-between items-center mb-4">
        <Title level={3}>Danh sách khách hàng</Title>
        <Button type="default" onClick={getCustomers} icon={<ReloadOutlined />}>
          Tải lại
        </Button>
      </div>

      <div className="flex flex-row justify-between items-center mb-4">
        <Input
          placeholder="Tìm kiếm khách hàng"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 300 }}
          suffix={<SearchOutlined />}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/customer/add")}
        >
          Thêm khách hàng
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredCustomers}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ y: "75vh" }}
      />

      <Modal
        title="Xác nhận xoá"
        open={showDeleteDialog}
        onOk={() => deleteCustomer(deletingCustomerId)}
        onCancel={() => setShowDeleteDialog(false)}
        okText="Xoá"
        cancelText="Quay lại"
      >
        <p>Bạn có chắc chắn muốn xoá không? Hành động này không thể hoàn tác.</p>
      </Modal>
    </div>
  );
}

export default Customers;
