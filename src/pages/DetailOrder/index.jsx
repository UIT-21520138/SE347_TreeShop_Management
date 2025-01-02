import { useReactToPrint } from 'react-to-print';
import moment from 'moment';
import { Link, useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import PriceFormat from '../../components/PriceFormat';

function DetailOrder() {
  const { id } = useParams();
  const [order, setOrder] = useState({});
  const [detailOrder, setDetailOrder] = useState([]);
  const printComponentRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost:302/api/order/" + id)
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.success) {
          setOrder(resJson.order);

          // call detail
          fetch(
            "http://localhost:302/api/detail-order/find-by-order-id/" +
              resJson.order._id
          )
            .then((res) => res.json())
            .then((resJson) => {
              if (resJson.success) {
                setDetailOrder(resJson.detailOrders);
              } else {
                setDetailOrder([]);
              }
            })
            .catch((error) => {
              console.log(error);
              setDetailOrder([]);
            });
        } else {
          setOrder({});
        }
      })
      .catch((error) => {
        console.log(error);
        setOrder({});
      });
  }, []);

  const handlePrint = useReactToPrint({
    contentRef: printComponentRef,
    onBeforeGetContent: () => {
      if (!order._id || detailOrder.length === 0) {
        return Promise.reject('No data to print');
      }
      return new Promise((resolve) => {
        setTimeout(resolve, 500);
      });
    },
    removeAfterPrint: true,
    onError: (error) => {
      console.error('Print failed:', error);
      alert('Không thể in hoá đơn. Vui lòng thử lại.');
    }
  });

  return (
    <div className="container">
      <div 
        ref={printComponentRef}
        style={{ display: 'block' }}
      >
        <div className="mt-5 flex flex-col sm:flex-row space-x-0 sm:space-x-6">
          {/* PRODUCT */}
          <div className="flex-1">
            <table className="mt-2 w-full">
              <thead className="w-full rounded bg-blue-500 text-white">
                <tr className="flex h-11 w-full">
                  <th className="flex w-10 items-center justify-end px-2 text-center sm:text-left">
                    Mã
                  </th>
                  <th className="flex w-16 items-center justify-center px-2">
                    Ảnh
                  </th>
                  <th className="flex flex-1 items-center justify-start px-2">
                    Tên sản phẩm
                  </th>
                  <th className="flex w-28 items-center justify-end px-2 sm:text-right">
                    Giá (VND)
                  </th>
                  <th className="mr-2 flex w-24 items-center justify-end px-2 sm:text-right">
                    Số lượng
                  </th>
                </tr>
              </thead>

              <tbody
                className="flex h-[400px] w-full flex-col"
                style={{ overflowY: "overlay" }}
              >
                {detailOrder?.map((detail, index) => (
                  <tr
                    key={index}
                    className="flex border-b border-slate-200 hover:bg-slate-100"
                  >
                    <td className="flex w-10 items-center justify-end px-2 py-2 sm:text-left">
                      {detail.product?.id}
                    </td>
                    <td className="flex w-16 items-center justify-center px-2 py-2">
                      <img
                        src={detail.product?.image || "/placeholder.png"}
                        className="h-10 w-10 rounded-full object-cover object-center"
                      />
                    </td>
                    <td className="flex flex-[2] items-center justify-start px-2 py-2">
                      {detail.product?.name}
                    </td>
                    <td className="flex w-28 items-center justify-end px-2 py-2 sm:text-right">
                      <PriceFormat>{detail.price || 0}</PriceFormat>
                    </td>
                    <td className="mr-2 flex w-24 items-center justify-end px-2 py-2 sm:text-right">
                      {detail.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* INFOR */}
          <div className="flex-1">
            <div className="space-y-2 border-b pb-2">
              <div className="text-base sm:text-lg">
                <span>Tên khách hàng: </span>
                <span className="font-semibold">
                  {order?.customer?.name || ""}
                </span>
              </div>
              <div className="text-base sm:text-lg">
                <span>Số điện thoại: </span>
                <span className="font-semibold">
                  {order?.customer?.phone || ""}
                </span>
              </div>
              <div className="text-base sm:text-lg">
                <span>Địa chỉ: </span>
                <span className="font-semibold">
                  {order?.customer?.address || ""}
                </span>
              </div>
              <div className="text-base sm:text-lg">
                <span>Ngày lập hoá đơn: </span>
                <span className="font-semibold">
                  {moment(order.createdAt).format("HH:mm:ss DD/MM/YYYY ")}
                </span>
              </div>
            </div>

            <div className="mt-3 space-y-3 border-b pb-3">
              <div className="text-base sm:text-lg">
                <span>Tổng tiền: </span>
                <span className="text-xl font-semibold text-blue-600">
                  <span>
                    <PriceFormat>{order?.totalPrice}</PriceFormat>
                  </span>
                  <span> VNĐ</span>
                </span>
              </div>
              <div className="text-base sm:text-lg">
                <span>Giảm giá: </span>
                <span className="text-xl font-semibold text-blue-600">
                  <span>
                    <PriceFormat>{order?.discount || 0}</PriceFormat>
                  </span>
                  <span> VNĐ</span>
                </span>
              </div>
              <div className="flex items-center text-base sm:text-lg">
                <label className="mr-2" htmlFor="price">
                  Thành tiền:
                </label>
                <span className="text-2xl font-semibold text-blue-600">
                  <span>
                    <PriceFormat>
                      {order?.totalPrice - (order?.discount || 0)}
                    </PriceFormat>
                  </span>
                  <span> VNĐ</span>
                </span>
              </div>
              <div className="flex items-center text-base sm:text-lg">
                <label className="mr-2" htmlFor="price">
                  Tiền nhận:
                </label>
                <span className="text-xl font-semibold text-blue-600">
                  <span>
                    <PriceFormat>{order?.receivedMoney}</PriceFormat>
                  </span>
                  <span> VNĐ</span>
                </span>
              </div>
              <div className="text-base sm:text-lg">
                <span>Tiền trả lại: </span>
                <span className="text-xl font-semibold text-blue-500">
                  <span>
                    <PriceFormat>{order?.exchangeMoney}</PriceFormat>
                  </span>
                  <span> VNĐ</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
        <Link to="/order" className="btn btn-blue btn-md w-full sm:w-auto">
          Quay lại
        </Link>
        <button 
          className="btn btn-green btn-md w-full sm:w-auto"
          onClick={handlePrint}
          disabled={!order._id || detailOrder.length === 0}
        >
          In hoá đơn
        </button>
      </div>
    </div>
  );
}

export default DetailOrder;
