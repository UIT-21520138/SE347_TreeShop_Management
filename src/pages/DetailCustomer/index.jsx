import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { accountSelector } from '../../redux/selectors';

function DetailCustomer() {
    const { id } = useParams();
    const [customer, setCustomer] = useState({});
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
        callApi();
    }, []);

    function callApi() {
        fetch('http://localhost:301/api/customer' + '/' + id)
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    setCustomer(resJson.customer);
                } else {
                    setCustomer({});
                }
            });
    }
    return (
        <div className="container">
            <div className="wrapper">
                <div className="mt-4 flex flex-col sm:flex-row">
                    <div className="mt-[4%] flex flex-1 sm:basis-1/2 flex-col">
                        <label className="mb-1 cursor-default text-lg font-semibold">Mã khách hàng</label>
                        <div className="text-input disabled select-none py-[5px]">{customer.id}</div>
                    </div>
                </div>
        
                <div className="mt-2 flex flex-col sm:flex-row">
                    <div className="mt-2 flex flex-1 sm:basis-1/2 flex-col">
                        <label className="mb-1 cursor-default text-lg font-semibold" htmlFor="phone" defaultValue={0}>
                            Số điện thoại
                        </label>
                        <div className="text-input disabled select-none py-[5px]">{customer.phone}</div>
                    </div>
                </div>
        
                <div className="mt-2 flex flex-col sm:flex-row">
                    <div className="mt-2 flex flex-1 sm:basis-1/2 flex-col">
                        <label className="mb-1 cursor-default text-lg font-semibold" htmlFor="name">
                            Tên khách hàng
                        </label>
                        <div className="text-input disabled select-none py-[5px]">{customer.name}</div>
                    </div>
                </div>
        
                <div className="mt-4 flex flex-col sm:flex-row">
                    <div className="mr-2 mt-2 flex flex-1 sm:basis-1/2 flex-col">
                        <label className="mb-1 cursor-default text-lg font-semibold" htmlFor="date">
                            Ngày thêm
                        </label>
                        <div className="text-input disabled select-none py-[5px]">
                            {moment(customer.createdAt).format('(HH:mm:ss)     DD/MM/YYYY')}
                        </div>
                    </div>
                </div>
        
                <div className="mt-4 flex flex-col sm:flex-row">
                    <div className="mr-2 mt-2 flex w-full sm:basis-1/2 flex-col">
                        <label className="mb-1 cursor-default text-lg font-semibold" htmlFor="address">
                            Địa chỉ
                        </label>
                        <div className="text-input disabled select-none py-[5px]">{customer.address}</div>
                    </div>
                </div>
        
                <div className="float-right mt-8 mr-2 flex flex-col sm:flex-row">
                    <div className="float-left mr-5 flex flex-1 sm:basis-1 flex-col">
                        <Link to={'/customer'} className="btn btn-blue btn-md">
                            <span className="pr-1">
                                <i className="fa-solid fa-circle-xmark"></i>
                            </span>
                            <span>Quay lại</span>
                        </Link>
                    </div>
        
                    <div className="float-right flex flex-1 sm:basis-1 flex-col">
                        <Link
                            to={'/customer/update/' + customer.id}
                            className={clsx('btn btn-md btn-green', {
                                hidden: isHiddenItem('customer/update'),
                            })}
                        >
                            <span className="pr-2">
                                <i className="fa fa-share" aria-hidden="true"></i>
                            </span>
                            <span>Chỉnh sửa</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
//
//
export default DetailCustomer;
