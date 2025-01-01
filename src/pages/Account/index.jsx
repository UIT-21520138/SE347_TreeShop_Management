import { useState, useEffect } from "react";
import { Table, Button, Input, Modal, Space, Typography } from "antd";
import { PlusOutlined, ReloadOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function removeVietnameseTones(stra) {
  let str = stra;
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, "");
  str = str.replace(/\u02C6|\u0306|\u031B/g, "");
  str = str.replace(/ +/g, " ");
  str = str.trim();
  str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|'|"|&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
  return str;
}

function Accounts() {
  const { Title } = Typography;
  const [search, setSearch] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const showDeleteNoti = () => toast.success("Xóa tài khoản thành công!");
  const showErrorNoti = () => toast.error("Có lỗi xảy ra!");

  useEffect(() => {
    getAccounts();
  }, []);

  const getAccounts = () => {
    setLoading(true);
    fetch("http://localhost:302/api/account")
      .then((res) => res.json())
      .then((resJson) => {
        setLoading(false);
        if (resJson.success) {
          setAccounts(resJson.accounts.reverse());
        } else {
          setAccounts([]);
        }
      })
      .catch(() => {
        setLoading(false);
        setAccounts([]);
      });
  };

  const filteredAccounts = accounts.filter((account) =>
    removeVietnameseTones(account.username.toLowerCase()).includes(removeVietnameseTones(search.toLowerCase())) ||
    removeVietnameseTones(account.name.toLowerCase()).includes(removeVietnameseTones(search.toLowerCase()))
  );

  const deleteAccount = (id) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa tài khoản này không?",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: () => {
        fetch(`http://localhost:302/api/account/${id}`, { method: "DELETE" })
          .then((res) => res.json())
          .then((resJson) => {
            if (resJson.success) {
              showDeleteNoti();
              getAccounts();
            } else {
              showErrorNoti();
            }
          })
          .catch(() => showErrorNoti());
      },
    });
  };

  const columns = [
    {
      title: "Mã số",
      dataIndex: "id",
      key: "id",
      align: "center",
      width: 100,
    },
    {
      title: "Tên tài khoản",
      dataIndex: "username",
      key: "username",
      width: 150,
    },
    {
      title: "Tên nhân viên",
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "Địa chỉ email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Chức vụ",
      dataIndex: ["role", "name"],
      key: "role",
      render: (role) => role || "-",
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
              e.stopPropagation();
              navigate(`/account/update/${record.id}`);
            }}
          >
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              deleteAccount(record.id);
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
      <div className="flex flex-row justify-between items-center mb-4">
        <Title level={3}>Danh sách tài khoản</Title>
        <Button type="default" onClick={getAccounts} icon={<ReloadOutlined />}>
          Tải lại
        </Button>
      </div>

      <div className="flex flex-row justify-between items-center mb-4">
        <Input
          placeholder="Tìm kiếm tài khoản"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 300 }}
          suffix={<SearchOutlined />}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate("/account/add")}>
          Thêm tài khoản
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredAccounts}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ y: "75vh" }}
        onRow={(record) => ({
          onClick: () => navigate(`/account/detail/${record.id}`),
        })}
      />
    </div>
  );
}

export default Accounts;
