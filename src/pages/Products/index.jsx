import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Table,
  Button,
  Input,
  Modal,
  Space,
  Typography,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Filter from "./Filter";
import PriceFormat from "../../components/PriceFormat";
import { useSelector } from "react-redux";
import { accountSelector } from "../../redux/selectors";

function removeVietnameseTones(stra) {
  // Hàm loại bỏ dấu tiếng Việt
  var str = stra;
  // Thực hiện các thay đổi trong hàm này...
  return str;
}

function Products() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({});
  const navigate = useNavigate();
  const showDeleteNoti = () => toast.success("Xóa sản phẩm thành công!");
  const showErorrNoti = () => toast.error("Có lỗi xảy ra!");
  const account = useSelector(accountSelector);

  useEffect(() => {
    getProducts();
  }, [filters]);

  function getProducts() {
    fetch(
      "http://localhost:302/api/product?" + `filters=${JSON.stringify(filters)}`
    )
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.success) {
          setProducts(resJson.products);
        } else {
          setProducts([]);
        }
      });
  }

  const confirmDeleteProduct = (id) => {
    setShowDeleteDialog(true);
    setDeletingProductId(id);
  };

  function deleteProduct() {
    fetch("http://localhost:302/api/product/" + deletingProductId, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((resJson) => {
        setShowDeleteDialog(false);
        if (resJson.success) {
          showDeleteNoti();
          getProducts();
        } else {
          showErorrNoti();
        }
      })
      .catch(() => {
        showErorrNoti();
        setShowDeleteDialog(false);
      });
  }

  function linkToDetail(id) {
    navigate("/product/detail/" + id);
  }

  const columns = [
    {
      title: "Mã số",
      dataIndex: "id",
      key: "id",
      render: (text, record) => (
        <Typography.Link onClick={() => linkToDetail(record.id)}>
          {text}
        </Typography.Link>
      ),
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img
          src={image || "/placeholder.png"}
          alt="product"
          style={{ width: 40, height: 40, borderRadius: "50%" }}
        />
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Typography.Link onClick={() => linkToDetail(record.id)}>
          {text}
        </Typography.Link>
      ),
    },
    {
      title: "Loại sản phẩm",
      dataIndex: ["type", "name"],
      key: "type",
    },
    {
      title: "Giá (VND)",
      dataIndex: "price",
      key: "price",
      render: (price) => <PriceFormat>{price}</PriceFormat>,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity) => (
        <span style={{ color: quantity === 0 ? "red" : "inherit" }}>
          {quantity}
        </span>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/product/update/${record.id}`)}
          >
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => confirmDeleteProduct(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const filteredProducts = products.filter((product) => {
    if (!search) return true;
    const searchText = removeVietnameseTones(search.toLowerCase());
    return (
      removeVietnameseTones(product.name.toLowerCase()).includes(searchText) ||
      removeVietnameseTones(product?.type?.name?.toLowerCase() || "").includes(
        searchText
      )
    );
  });

  return (
    <div className="container">
      <div style={{ marginBottom: 16 }}>
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <Typography.Title level={3}>Danh sách sản phẩm</Typography.Title>
          <Button
            onClick={() => getProducts()}
            icon={<i className="fa fa-refresh" />}
          >
            Tải lại
          </Button>
        </Space>
        <Row style={{ marginTop: 16 }} gutter={[16, 16]} align="middle">
          <Col flex="auto">
            <Input
              placeholder="Tìm kiếm sản phẩm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>
          <Col>
            <Filter
              onChange={(f) => setFilters({ ...f })}
              hasFilters={Object.keys(filters).length > 0}
            />
          </Col>
          <Col style={{ display: "flex", justifyContent: "flex-end" }}>
            <Space>
              <Link to="/product/views">
                <Button type="primary">Chuyển sang dạng lưới</Button>
              </Link>
              <Link to="/product/add">
                <Button type="primary">Thêm sản phẩm mới</Button>
              </Link>
            </Space>
          </Col>
        </Row>
      </div>
      <Table
        columns={columns}
        dataSource={filteredProducts.reverse()}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
      <ToastContainer />

      {/* Delete Confirmation Modal */}
      <Modal
        title="Xác nhận xóa"
        visible={showDeleteDialog}
        onCancel={() => setShowDeleteDialog(false)}
        onOk={deleteProduct}
        okText="Xóa"
        cancelText="Hủy"
      >
        Bạn có chắc chắn muốn xóa sản phẩm này không?
      </Modal>
    </div>
  );
}

export default Products;
