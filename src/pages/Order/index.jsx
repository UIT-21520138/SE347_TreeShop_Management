import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  Input,
  Space,
  Typography,
  Modal,
  Select,
} from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import moment from "moment";
import PriceFormat from "../../components/PriceFormat";
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { accountSelector } from "../../redux/selectors";

const { Option } = Select;

function Orders() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingOrderId, setDeletingOrderId] = useState(null);
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState([]);
  const [dateFilter, setDateFilter] = useState("all");
  const navigate = useNavigate();

  const showDeleteNoti = () => toast.success("Xóa hoá đơn thành công!");
  const showErrorNoti = () => toast.error("Có lỗi xảy ra!");
  const account = useSelector(accountSelector);

  useEffect(() => {
    getOrders();
  }, []);

  function getOrders() {
    fetch("http://localhost:302/api/order")
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.success) {
          setOrders(resJson.orders);
        } else {
          setOrders([]);
        }
      })
      .catch(() => {
        setOrders([]);
      });
  }

  const confirmDeleteOrder = (id) => {
    setShowDeleteDialog(true);
    setDeletingOrderId(id);
  };

  function deleteOrder() {
    fetch("http://localhost:302/api/order/" + deletingOrderId, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((resJson) => {
        setShowDeleteDialog(false);
        if (resJson) {
          showDeleteNoti();
          getOrders();
        } else {
          showErrorNoti();
        }
      })
      .catch(() => {
        showErrorNoti();
        setShowDeleteDialog(false);
      });
  }

  function linkToDetail(id) {
    navigate("/order/detail/" + id);
  }

  function checkDateInFilter(order) {
    if (dateFilter === "all") {
      return true;
    }
    if (
      dateFilter === "yesterday" &&
      moment().subtract(1, "days").format("YYYY-MM-DD") ===
        moment(order.createdAt).format("YYYY-MM-DD")
    ) {
      return true;
    }
    if (
      dateFilter === "today" &&
      moment().format("YYYY-MM-DD") ===
        moment(order.createdAt).format("YYYY-MM-DD")
    ) {
      return true;
    }
    return false;
  }

  const columns = [
    {
      title: "Mã",
      dataIndex: "id",
      key: "id",
      render: (text) => (
        <Typography.Link onClick={() => linkToDetail(text)}>{text}</Typography.Link>
      ),
    },
    {
      title: "Tên khách hàng",
      dataIndex: ["customer", "name"],
      key: "customerName",
    },
    {
      title: "Số điện thoại",
      dataIndex: ["customer", "phone"],
      key: "customerPhone",
    },
    {
      title: "Tổng tiền (VNĐ)",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => <PriceFormat>{price}</PriceFormat>,
    },
    {
      title: "Ngày",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => moment(date).format("HH:mm:ss DD/MM/YYYY"),
  },
  {
    title: "Trạng thái đơn hàng",  
    dataIndex: "status",  
    key: "status",
    render: (status) => {
      switch (status) {
        case "pending":
          return <span style={{ color: "orange" }}>Chờ xử lý</span>;
        case "paid":
          return <span style={{ color: "green" }}>Đã thanh toán</span>;
        case "aborted":
          return <span style={{ color: "red" }}>Hủy bỏ</span>;
        default:
          return <span>Không xác định</span>;
      }
    },
  },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              confirmDeleteOrder(record.id);
            }}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="container">
      <div style={{ marginBottom: 16 }}>
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <Typography.Title level={3}>Danh sách hóa đơn</Typography.Title>
          <Button onClick={getOrders} icon={<i className="fa fa-refresh" />}>Tải lại</Button>
        </Space>
      </div>
      <Space style={{ marginBottom: 16, width: "100%" }}>
  <Select
    value={dateFilter}
    onChange={(value) => setDateFilter(value)}
    style={{ width: 200 }}
  >
    <Option value="all">Tất cả</Option>
    <Option value="yesterday">Hôm qua</Option>
    <Option value="today">Hôm nay</Option>
  </Select>
  <Link to="/order/add">
    <Button type="primary" icon={<PlusOutlined />}>
      Tạo hóa đơn
    </Button>
  </Link>
</Space>

      <Table
        columns={columns}
        dataSource={orders.filter(checkDateInFilter)}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        onRow={(record) => ({
          onClick: () => linkToDetail(record.id), 
        })}
      />
      <ToastContainer />

      {/* Delete Confirmation Modal */}
      <Modal
        title="Xác nhận xóa"
        visible={showDeleteDialog}
        onCancel={() => setShowDeleteDialog(false)}
        onOk={deleteOrder}
        okText="Xóa"
        cancelText="Hủy"
      >
        Bạn có chắc chắn muốn xóa hóa đơn này không?
      </Modal>
    </div>
  );
}

export default Orders;
