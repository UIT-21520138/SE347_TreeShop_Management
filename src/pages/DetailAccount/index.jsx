import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { date } from "yup";

function DetailAccount() {
    const { id } = useParams();
    const [account, setAccount] = useState([]);
    useEffect(() => {
        callApi();
    }, []);

    function callApi() {
        fetch('http://localhost:301/api/account/' + id)
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    setAccount(resJson.account);
                    console.log(account.role?.name);
                } else {
                    setAccount({});
                }
            });
    }
    return (
        <>
            <div className="container">
                <div className="w-full sm:w-3/4 md:w-1/2 mx-auto">
                    <form>
                        {/* <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-900  md:text-2xl">
                        ĐĂNG KÝ TÀI KHOẢN
                    </h1> */}
                        <div className="mt-4 flex flex-col sm:flex-row">
                            <div className="mr-8 flex w-full sm:w-1/2 flex-col space-y-2 text-lg">
                                <div className="form-group flex flex-col ">
                                    <label className="mb-1 select-none  font-semibold text-gray-900  ">
                                        Tên nhân viên
                                    </label>
                                    <div className="text-input disabled select-none py-[5px]">{account.name}</div>
                                </div>
                                <div className="form-group flex flex-col">
                                    <label htmlFor="email" className="mb-1 select-none  font-semibold text-gray-900  ">
                                        Địa chỉ email
                                    </label>
                                    <div className="text-input disabled select-none py-[5px]">{account.email}</div>
                                </div>
                                <div className="form-group flex flex-col">
                                    <label className="mb-1 select-none  font-semibold text-gray-900 " htmlFor="type">
                                        Chức vụ
                                    </label>

                                    <div className="text-input disabled select-none py-[5px]">{account.role?.name}</div>
                                </div>
                            </div>
                            <div className="mr-8 flex w-full sm:w-1/2 flex-col space-y-2 text-lg">
                                <div className="form-group flex flex-col ">
                                    <label
                                        htmlFor="account"
                                        className="mb-1 select-none  font-semibold text-gray-900  "
                                    >
                                        Tài khoản
                                    </label>
                                    <div className="text-input disabled select-none py-[5px]">{account.username}</div>
                                </div>

                                <div className="form-group flex flex-col ">
                                    <label
                                        htmlFor="password"
                                        className="mb-1 select-none  font-semibold text-gray-900  "
                                    >
                                        Mật khẩu
                                    </label>
                                    <div className="text-input disabled select-none py-[5px]">******</div>
                                </div>
                                <div className="form-group flex flex-col ">
                                    <label
                                        htmlFor="password"
                                        className="mb-1 select-none  font-semibold text-gray-900  "
                                    >
                                        Nhập lại mật khẩu
                                    </label>
                                    <div className="text-input disabled select-none py-[5px]">******</div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex flex-col sm:flex-row">
                            <div className="form-group mr-4 mt-3 flex w-full sm:w-1/2 flex-col ">
                                <label className="mb-1 cursor-default select-none text-lg font-semibold">
                                    Ngày thêm
                                </label>
                                <div className="text-input disabled select-none py-[5px]">
                                    {moment(account.createdAt).format('(HH:mm:ss)     DD/MM/YYYY')}
                                </div>
                            </div>
                            {/* PRICE */}
                        </div>
                        <div className="float-right mt-8 mr-2 flex flex-col sm:flex-row">
                            <div className="float-left mr-5 flex w-full sm:w-1/2 flex-col">
                                <Link to={'/account'} className="btn btn-blue btn-md">
                                    <span className="pr-1">
                                        <i className="fa-solid fa-circle-xmark"></i>
                                    </span>
                                    <span>Quay lại</span>
                                </Link>
                            </div>

                            <div className="float-right flex w-full sm:w-1/2 flex-col">
                                <Link to={'/account/update/' + account.id} className="btn btn-md btn-green">
                                    <span className="pr-2">
                                        <i className="fa fa-share" aria-hidden="true"></i>
                                    </span>
                                    <span>Chỉnh sửa</span>
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
//
//
export default DetailAccount;
