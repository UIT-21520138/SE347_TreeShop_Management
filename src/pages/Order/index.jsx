import { Fragment, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Listbox, Popover } from '@headlessui/react';
import clsx from 'clsx';
import { useEffect } from 'react';
import moment from 'moment';
import PriceFormat from '../../components/PriceFormat';
import { toast, ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';
import { accountSelector } from '../../redux/selectors';
function Orders() {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deletingOrderId, setDeletingOrderId] = useState(null);
    const [search, setSearch] = useState('');
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    const showDeleteNoti = () => toast.success('Xóa hoá đơn thành công!');
    const showErorrNoti = () => toast.error('Có lỗi xảy ra!');

    const [dateFilter, setDateFilter] = useState('all');

    function checkDateInFilter(order) {
        if (dateFilter === 'all') {
            return true;
        }
        if (
            dateFilter === 'yesterday' &&
            moment().subtract(1, 'days').format('YYYY-MM-DD') == moment(order.createdAt).format('YYYY-MM-DD')
        ) {
            return true;
        }
        if (dateFilter === 'today' && moment().format('YYYY-MM-DD') == moment(order.createdAt).format('YYYY-MM-DD')) {
            return true;
        }
        return false;
    }

    const account = useSelector(accountSelector);
    function isHiddenItem(functionName) {
        if (!account) {
            return true;
        }
        if (!functionName) {
            return false;
        }
        const findResult = account?.functions?.find((_func) => _func?.name === functionName);
        if (findResult) {
            return false;
        }
        return true;
    }
    useEffect(() => {
        getOrders();
    }, []);

    function getOrders() {
        fetch('http://localhost:301/api/order')
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    setOrders(resJson.orders);
                } else {
                    setOrders([]);
                }
            })
            .catch((error) => {
                console.log(error);
                setOrders([]);
            });
    }

    function deleteOrder(id) {
        fetch('http://localhost:301/api/order/' + id, {
            method: 'DELETE',
        })
            .then((res) => res.json())
            .then((resJson) => {
                setShowDeleteDialog(false);
                if (resJson) {
                    showDeleteNoti();
                    console.log('xóa');
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
        navigate('/order/detail/' + id);
    }

    return (
        <>
           <div className="container mx-auto px-4 sm:px-6 md:px-8">
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    {/* title + reload btn */}
                    <div className="flex items-center space-x-2">
                        <label className="text-2xl font-bold text-slate-800">Danh sách hóa đơn</label>
                        <button
                            type="button"
                            className="ml-3 text-gray-800 hover:underline"
                            onClick={() => getOrders()}
                        >
                            <span className="font-sm pr-1">
                                <i className="fa fa-refresh" aria-hidden="true"></i>
                            </span>
                            <span className="">Tải lại</span>
                        </button>
                    </div>

                    {/* Action group */}
                    <div className="flex flex-col sm:flex-row grow space-y-2 sm:space-y-0 sm:space-x-2">
                        {/* Search */}
                        <div className="flex space-x-2 grow">
                            <div
                                className={clsx(
                                    'ml-1 cursor-pointer rounded p-2 text-blue-600 transition hover:bg-gray-100',
                                    {
                                        '!bg-blue-500 !text-white': dateFilter === 'all',
                                    }
                                )}
                                onClick={() => setDateFilter('all')}
                            >
                                Tất cả
                            </div>
                            <div
                                className={clsx(
                                    'ml-1 cursor-pointer rounded p-2 text-blue-600 transition hover:bg-gray-100',
                                    {
                                        '!bg-blue-500 !text-white': dateFilter === 'yesterday',
                                    }
                                )}
                                onClick={() => setDateFilter('yesterday')}
                            >
                                Hôm qua
                            </div>
                            <div
                                className={clsx(
                                    'ml-1 cursor-pointer rounded p-2 text-blue-600 transition hover:bg-gray-100',
                                    {
                                        '!bg-blue-500 !text-white': dateFilter === 'today',
                                    }
                                )}
                                onClick={() => setDateFilter('today')}
                            >
                                Hôm nay
                            </div>
                        </div>

                        <Link
                            to="/order/add"
                            className={clsx('btn btn-md btn-green', {
                                hidden: isHiddenItem('order/create'),
                            })}
                        >
                            <span className="pr-1">
                                <i className="fa fa-share"></i>
                            </span>
                            <span>Tạo hoá đơn</span>
                        </Link>
                    </div>
                </div>

               {/* LIST */}
                <div className="mt-8 w-full sm:w-full md:w-full">
                    <div className="rounded bg-blue-500 text-white">
                        <div className="flex h-11 w-full">
                        <div className="flex w-16 items-center justify-end px-2">Mã</div>
                        <div className="flex flex-[2] items-center justify-start px-4">Tên khách hàng</div>
                        <div className="hidden sm:flex w-60 items-center justify-start px-2">Số điện thoại</div>
                        <div className="hidden sm:flex w-44 items-center justify-end px-2">Tổng tiền (VNĐ)</div>
                        <div className="hidden sm:flex w-56 items-center justify-end px-2">Ngày</div>
                        <div className="flex w-[140px] items-center justify-center px-2"></div>
                        </div>
                    </div>

                    <div className="flex h-[75vh] w-full flex-col overflow-y-scroll sm:overflow-y-auto">
                        {orders
                            ?.filter((order) => checkDateInFilter(order))
                            ?.reverse()
                            .map((order) => (
                                <div
                                    key={order.id}
                                    className="flex min-h-[56px] cursor-pointer border-b border-slate-200 hover:bg-slate-100"
                                    onClick={() => linkToDetail(order.id)}
                                >
                                    <div className="flex w-16 items-center justify-end px-2 py-2">{order.id}</div>
                                    <div className="flex flex-[2] items-center justify-start px-4 py-2">
                                        {order.customer?.name}
                                    </div>
                                    <div className="flex w-60 items-center justify-start px-2 py-2">
                                        {order.customer?.phone}
                                    </div>
                                    <div className="flex w-44 items-center justify-end px-2 py-2">
                                        <PriceFormat>{order.totalPrice}</PriceFormat>
                                    </div>
                                    <div className="flex w-56 items-center justify-end px-2 py-2">
                                        {moment(order.createdAt).format('HH:mm:ss DD/MM/YYYY ')}
                                    </div>
                                    <div className="flex w-[140px] items-center justify-center px-2 py-2">
                                        <div className="flex justify-end">
                                            <button
                                                className={clsx('btn btn-sm btn-red', {
                                                    hidden: isHiddenItem('order/delete'),
                                                })}
                                                onClick={(e) => {
                                                    {
                                                        e.stopPropagation();
                                                        setShowDeleteDialog(true);
                                                        setDeletingOrderId(order.id);
                                                    }
                                                }}
                                            >
                                                <span className="pr-1">
                                                    <i className="fa-solid fa-circle-xmark"></i>
                                                </span>
                                                <span>Xoá</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

                {/* DELETE DIALOG */}
                <div
                    className={clsx(
                        'fixed inset-0 z-[99999] hidden items-center justify-center bg-black/20 opacity-0 transition-opacity',
                        {
                            '!flex !opacity-100': showDeleteDialog,
                        }
                    )}
                >
                    <div className="">
                        <div className="min-w-[160px] max-w-[400px] rounded-lg bg-white p-6">
                            <div className="text-clr-text-dark font-bold">Bạn có chắc chắn muốn xoá không?</div>
                            <p className="mt-4">Lưu ý: Bạn không thể không phục lại sau khi xoá!</p>
                            <div className="mt-4 flex">
                                <button
                                    className="btn btn-blue btn-md"
                                    onClick={() => {
                                        setDeletingOrderId(null);
                                        setShowDeleteDialog(false);
                                    }}
                                >
                                    Quay lại
                                </button>
                                <button className="btn btn-md btn-red" onClick={() => deleteOrder(deletingOrderId)}>
                                    Xoá
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Orders;
