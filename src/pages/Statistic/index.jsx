import { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Table, Button, Modal, DatePicker, Typography, Card, Row, Col } from "antd";
import clsx from "clsx";
import { useEffect } from "react";
import moment from "moment";
import PriceFormat from "../../components/PriceFormat";
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { accountSelector } from "../../redux/selectors";

function Statistic() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingOrderId, setDeletingOrderId] = useState(null);
  const [money, setMoney] = useState(0);
  const [number, setNumber] = useState(0);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const showDeleteNoti = () => toast.success("Xóa hoá đơn thành công!");
  const showErorrNoti = () => toast.error("Có lỗi xảy ra!");
  const [value, setValue] = useState([moment().startOf("day"), moment().endOf("day")]);

  useEffect(() => {
    const newMoney = orders?.reduce((prevMoney, currOrder) => {
      if (isDateBetween(currOrder.createdAt, value[0], value[1])) {
        return prevMoney + currOrder.totalPrice;
      }
      return prevMoney;
    }, 0);
    const newNumber = orders?.filter((order) => {
      if (isDateBetween(order.createdAt, value[0], value[1])) {
        return true;
      }
      return false;
    })?.length;

    setMoney(newMoney);
    setNumber(newNumber);
  }, [value, orders]);

  function isDateBetween(createdAt, startDate, endDate) {
    const createdAtFormatted = moment(createdAt);
    return createdAtFormatted.isBetween(startDate, endDate, "day", "[]");
  }

  const account = useSelector(accountSelector);

  function isHiddenItem(functionName) {
    if (!account) {
      return true;
    }
    if (!functionName) {
      return false;
    }
    return !account?.functions?.some((_func) => _func?.name === functionName);
  }

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
      .catch(() => setOrders([]));
  }

  function deleteOrder(id) {
    fetch("http://localhost:302/api/order/" + id, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((resJson) => {
        setShowDeleteDialog(false);
        if (resJson) {
          showDeleteNoti();
          getOrders();
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
    navigate("/order/detail/" + id);
  }

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <Typography.Title level={3}>Thống kê hóa đơn</Typography.Title>
          <Button onClick={getOrders} icon={<i className="fa fa-refresh" />}>
            Tải lại
          </Button>
        </div>

        <div className="flex justify-between mt-4">
          <DatePicker.RangePicker
            value={value}
            onChange={(dates) => setValue(dates)}
            format="DD/MM/YYYY"
          />
          <Link
            to="/order/add"
            className={clsx("btn bg-green-600 text-white hover:bg-green-500", {
              hidden: isHiddenItem("order/create"),
            })}
          >
            <i className="fa fa-plus mr-2" />
            Tạo hoá đơn
          </Link>
        </div>

        <Row gutter={[16, 16]} className="mt-8">
  <Col xs={24} md={12}>
    <Card
      bordered={false}
      style={{
        backgroundColor: "#f0f9ff",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", 
      }}
      bodyStyle={{ textAlign: "center", padding: "24px" }}
    >
      <Typography.Text
        style={{
          fontSize: "20px",
          textTransform: "uppercase", 
          paddingBottom: "8px",
        }}
      >
        Số hoá đơn
      </Typography.Text>
      <Typography.Title
        level={2}
        style={{
          fontWeight: "bold",
          margin: "16px 0 0",
        }}
      >
        {number || 0}
      </Typography.Title>
    </Card>
  </Col>
  <Col xs={24} md={12}>
    <Card
      bordered={false}
      style={{
        backgroundColor: "#f6ffed",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", 
      }}
      bodyStyle={{ textAlign: "center", padding: "24px" }}
    >
      <Typography.Text
        style={{
          fontSize: "20px",
          textTransform: "uppercase", 
          paddingBottom: "8px",
          textAlign: "center", padding: "24px"
        }}
      >
        Tổng doanh thu (VNĐ)
      </Typography.Text>
      <Typography.Title
        level={2}
        style={{
          fontWeight: "bold",
          margin: "16px 0 0",
        }}
      >
        <PriceFormat>{money || 0}</PriceFormat>
      </Typography.Title>
    </Card>
  </Col>
</Row>


        <Table
          className="mt-8"
          dataSource={orders
            ?.filter((order) => isDateBetween(order.createdAt, value[0], value[1]))
            .reverse()
            .map((order) => ({
              key: order.id,
              id: order.id,
              name: order.customer?.name,
              phone: order.customer?.phone,
              totalPrice: order.totalPrice,
              createdAt: moment(order.createdAt).format("HH:mm:ss DD/MM/YYYY"),
            }))}
          columns={[
            { title: "Mã", dataIndex: "id", key: "id", width: 100 },
            { title: "Tên khách hàng", dataIndex: "name", key: "name" },
            { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
            {
              title: "Tổng tiền (VNĐ)",
              dataIndex: "totalPrice",
              key: "totalPrice",
              render: (price) => <PriceFormat>{price}</PriceFormat>,
            },
            { title: "Ngày", dataIndex: "createdAt", key: "createdAt" },
            {
              title: "Hành động",
              key: "action",
              render: (_, record) => (
                <Button
                  danger
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteDialog(true);
                    setDeletingOrderId(record.id);
                  }}
                >
                  Xoá
                </Button>
              ),
            },
          ]}
          pagination={false}
          scroll={{ y: 400 }}
          locale={{ emptyText: "Không có hóa đơn nào" }}
          onRow={(record) => ({
            onClick: () => linkToDetail(record.id),
          })}
        />

        <Modal
          open={showDeleteDialog}
          onCancel={() => setShowDeleteDialog(false)}
          footer={null}
          title="Xác nhận xoá"
        >
          <p>Lưu ý: Bạn không thể khôi phục lại sau khi xoá!</p>
          <div className="mt-4 flex justify-end gap-4">
            <Button onClick={() => setShowDeleteDialog(false)}>Quay lại</Button>
            <Button
              danger
              onClick={() => {
                deleteOrder(deletingOrderId);
              }}
            >
              Xoá
            </Button>
          </div>
        </Modal>
      </div>
    </>
  );
}

export default Statistic;
