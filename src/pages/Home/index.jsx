import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Table, Spin } from "antd";
import { UserOutlined, ShoppingCartOutlined, DollarOutlined, AppstoreOutlined } from "@ant-design/icons";
import moment from "moment";

const formatCurrency = (number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
};

function Home() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    recentOrders: [],
    topProducts: [],
  });

  const [loading, setLoading] = useState(true);

  const fetchData = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch: ${url}`);
      const data = await response.json();
      if (!data.success) throw new Error(`API Error: ${url}`);
      return data;
    } catch (error) {
      toast.error(error.message || "An error occurred");
      console.error(error);
      return null;
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [customersData, ordersData, productsData] = await Promise.all([
          fetchData("http://localhost:302/api/customer"),
          fetchData("http://localhost:302/api/order"),
          fetchData("http://localhost:302/api/product"),
        ]);

        if (customersData && ordersData && productsData) {
          const totalUsers = customersData.customers?.length || 0;
          const totalOrders = ordersData.orders?.length || 0;
          const totalRevenue = ordersData.orders?.reduce((sum, order) => sum + order.totalPrice, 0) || 0;
          const recentOrders = ordersData.orders?.slice(-4).reverse() || [];
          const totalProducts = productsData.products?.length || 0;
          const topProducts = productsData.products
            ?.sort((a, b) => b.soldQuantity - a.soldQuantity)
            .slice(0, 4) || [];

          setStats({
            totalUsers,
            totalOrders,
            totalRevenue,
            totalProducts,
            recentOrders,
            topProducts,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin tip="Đang tải dữ liệu..." size="large" />
      </div>
    );
  }

  const orderColumns = [
    { title: "Mã", dataIndex: "id", key: "id" },
    { title: "Khách Hàng", dataIndex: ["customer", "name"], key: "customerName" },
    { 
      title: "Tổng Tiền (VND)", 
      dataIndex: "totalPrice", 
      key: "totalPrice", 
      render: (text) => (text ? formatCurrency(text) : "N/A") 
    },
    { title: "Ngày", dataIndex: "createdAt", key: "createdAt", render: (date) => moment(date).format("HH:mm:ss DD/MM/YYYY") },
  ];

  const productColumns = [
    { title: "Mã", dataIndex: "id", key: "id" },
    { title: "Tên Sản Phẩm", dataIndex: "name", key: "name" },
    { 
      title: "Giá (VND)", 
      dataIndex: "price", 
      key: "price", 
      render: (text) => (text ? formatCurrency(text) : "N/A") 
    },
    { title: "Số Lượng", dataIndex: "quantity", key: "quantity" },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Bảng Điều Khiển</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Người Dùng" value={stats.totalUsers} icon={<UserOutlined />} color="#4caf50" />
        <StatCard title="Đơn Hàng" value={stats.totalOrders} icon={<ShoppingCartOutlined />} color="#2196f3" />
        <StatCard title="Doanh Thu" value={formatCurrency(stats.totalRevenue)} icon={<DollarOutlined />} color="#ff9800" />
        <StatCard title="Sản Phẩm" value={stats.totalProducts} icon={<AppstoreOutlined />} color="#9c27b0" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
        <div className="bg-gray-50 shadow-lg rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Hoá Đơn Gần Đây</h3>
          <Table dataSource={stats.recentOrders} columns={orderColumns} rowKey="id" pagination={false} />
        </div>

        <div className="bg-gray-50 shadow-lg rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Sản Phẩm Hàng Đầu</h3>
          <Table dataSource={stats.topProducts} columns={productColumns} rowKey="id" pagination={false} />
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white shadow p-4 rounded-lg flex items-center">
    <div className="text-3xl mr-4" style={{ color: color }}>{icon}</div>
    <div>
      <h4 className="text-sm font-semibold text-gray-500 uppercase">{title}</h4>
      <p className="text-xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default Home;
