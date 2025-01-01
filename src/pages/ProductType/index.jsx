import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Table, Button, Input, Modal, notification, Space, Typography } from "antd";
import { PlusOutlined, ReloadOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { accountSelector } from "../../redux/selectors";
import moment from "moment";

function removeVietnameseTones(stra) {
  var str = stra;
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, "");
  str = str.replace(/\u02C6|\u0306|\u031B/g, "");
  str = str.replace(/ +/g, " ");
  str = str.trim();
  str = str.replace(/!|@|%|\^|\*|\(|\)|\+|=|<|>|\?|\/|,|\.|:|;|'|"|&|#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
  return str;
}

function ProductType() {
  const { Title } = Typography;
  const [search, setSearch] = useState("");
  const [productTypes, setProductTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingProductTypeId, setDeletingProductTypeId] = useState(null);
  const navigate = useNavigate();
  const account = useSelector(accountSelector);

  const openNotification = (type, message) => {
    notification[type]({ message });
  };

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

  useEffect(() => {
    getProductTypes();
  }, []);

  function getProductTypes() {
    setLoading(true);
    fetch("http://localhost:302/api/product-type")
      .then((res) => res.json())
      .then((resJson) => {
        setLoading(false);
        if (resJson.success) {
          setProductTypes(resJson.productTypes);
        } else {
          setProductTypes([]);
        }
      })
      .catch(() => setLoading(false));
  }

  function linkToDetail(id) {
    navigate("/product-type/detail/" + id);
  }

  function deleteProductType(id) {
    fetch("http://localhost:302/api/product-type/" + id, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((resJson) => {
        setShowDeleteDialog(false);
        if (resJson) {
          openNotification("success", "Xóa loại sản phẩm thành công!");
          getProductTypes();
        } else {
          openNotification("error", "Có lỗi xảy ra!");
        }
      })
      .catch(() => {
        openNotification("error", "Có lỗi xảy ra!");
        setShowDeleteDialog(false);
      });
  }

  const filteredProductTypes = productTypes.filter((productType) => {
    if (!search) return true;
    return removeVietnameseTones(productType.name.toLowerCase()).includes(
      removeVietnameseTones(search.toLowerCase())
    );
  });

  const columns = [
    {
      title: "Mã số",
      dataIndex: "id",
      key: "id",
      align: "center",
      width: 100,
      render: (text, record) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => linkToDetail(record.id)}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Tên loại sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => linkToDetail(record.id)}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Ngày thêm",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date, record) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => linkToDetail(record.id)}
        >
          {moment(date).format("HH:mm:ss DD/MM/YYYY")}
        </div>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space>
          {!isHiddenItem("product-type/update") && (
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => navigate(`/product-type/update/${record.id}`)}
            >
              Sửa
            </Button>
          )}
          {!isHiddenItem("product-type/delete") && (
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                setShowDeleteDialog(true);
                setDeletingProductTypeId(record.id);
              }}
            >
              Xoá
            </Button>
          )}
        </Space>
      ),
    },
  ];
  

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Space style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <Title level={3}>Danh sách loại sản phẩm</Title>
          <Button onClick={getProductTypes} icon={<i className="fa fa-refresh" />}>
            Tải lại
          </Button>
        </Space>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
  <Input
    placeholder="Tìm kiếm loại sản phẩm"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    style={{ width: 300 }}
    suffix={<SearchOutlined />} // Thêm icon tìm kiếm ở cuối input
  />
  {!isHiddenItem("product-type/create") && (
    <Button type="primary" onClick={() => navigate("/product-type/add")}>
      Thêm loại sản phẩm mới
    </Button>
  )}
</div>


      <Table
        dataSource={filteredProductTypes}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Xác nhận xoá"
        visible={showDeleteDialog}
        onCancel={() => setShowDeleteDialog(false)}
        onOk={() => deleteProductType(deletingProductTypeId)}
        okText="Xoá"
        cancelText="Quay lại"
      >
        Bạn có chắc chắn muốn xoá không? Hành động này không thể hoàn tác.
      </Modal>
    </div>
  );
}

export default ProductType;
