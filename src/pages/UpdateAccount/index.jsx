import { Fragment, useState } from 'react';
import { useEffect } from 'react';
import * as Yup from 'yup';
import { Formik, useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import clsx from 'clsx';
import TimeNow from '../../components/TimeNow';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';

import AccountRule from '../../components/AccountRoleInput';

const validationSchema = Yup.object({
    name: Yup.string()
        .required('Trường này bắt buộc')
        .min(2, 'Tên phải có độ dài hơn 2 kí tự')
        .max(30, 'Tên dài tối đa 30 kí tự'),
    email: Yup.string()
        .required('Trường này bắt buộc')
        .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, 'Email sai không đúng định dạng'),
    // password: Yup.string()
    //     .required('Vui lòng nhập nhập mật khẩu!')
    //     .min(6, 'Mật khẩu quá ngắn! mật khẩu phải có ít nhất 6 kí tự'),
    // rePassword: Yup.string().required('Vui lòng nhập nhập lại mật khẩu!'),
});

function UpdateAccount() {
    const [loading, setLoading] = useState(false);
    const showSuccessNoti = () => toast.success('Chỉnh sửa thông tin tài khoản thành công!');
    const showErorrNoti = () => toast.error('Có lỗi xảy ra!');
    const { id } = useParams();
    const [account, setAccount] = useState([]);
    useEffect(() => {
        callApi();
    }, []);

    function callApi() {
        fetch('http://localhost:5000/api/account/' + id)
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    setAccount(resJson.account);
                } else {
                    setAccount({});
                }
            });
    }
    const bacsicForm = useFormik({
        initialValues: {
            name: account.name,
            email: account.email,
            role: account.role?._id,
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: handleFormsubmit,
    });

    const navigate = useNavigate();

    function handleFormsubmit(values) {
        setLoading(true);

        // Check values changed
        let reqValue = {};
        Object.keys(values).forEach((key) => {
            if (values[key] !== bacsicForm.initialValues[key]) {
                reqValue[key] = values[key];
            }
        });

        console.log(reqValue);

        fetch('http://localhost:5000/api/account' + '/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reqValue),
        })
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    setLoading(false);
                    showSuccessNoti();
                    setTimeout(() => {
                        navigate('/account');
                    }, 4000);
                } else {
                    setLoading(false);
                    showErorrNoti();
                }
            })
            .catch(() => {
                setLoading(false);
                showErorrNoti();
            });
    }

    return (
        <>
            <div className="container mx-auto px-4 sm:px-6 md:px-8">
                <div className="w-full">
                    <form onSubmit={bacsicForm.handleSubmit}>
                        <div className="mt-4 flex flex-col sm:flex-row">
                            <div className="mr-8 flex w-full sm:w-1/2 flex-col space-y-2 text-lg">
                                <div className="form-group flex flex-col ">
                                    <label htmlFor="name" className="mb-1 select-none  font-semibold text-gray-900  ">
                                        Tên nhân viên
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        className={clsx(
                                            'focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300  p-2.5 text-gray-900    sm:text-sm',
                                            {
                                                invalid: bacsicForm.touched.name && bacsicForm.errors.name,
                                            }
                                        )}
                                        onChange={bacsicForm.handleChange}
                                        onBlur={bacsicForm.handleBlur}
                                        value={bacsicForm.values.name}
                                        placeholder="Tên nhân viên"
                                    />
                                    <span
                                        className={clsx('text-sm text-red-500 opacity-0', {
                                            'opacity-100': bacsicForm.touched.name && bacsicForm.errors.name,
                                        })}
                                    >
                                        {bacsicForm.errors.name || 'No message'}
                                    </span>
                                </div>
                                <div className="form-group flex flex-col sm:w-full md:w-1/2">
                                    <label htmlFor="email" className="mb-1 select-none font-semibold text-gray-900">
                                        Địa chỉ email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        className={clsx(
                                            'focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 sm:text-sm',
                                            {
                                                invalid: bacsicForm.touched.email && bacsicForm.errors.email,
                                            }
                                        )}
                                        onChange={bacsicForm.handleChange}
                                        onBlur={bacsicForm.handleBlur}
                                        value={bacsicForm.values.email}
                                        placeholder="Địa chi email"
                                    />
                                    <span
                                        className={clsx('text-sm text-red-500 opacity-0', {
                                            'opacity-100': bacsicForm.touched.email && bacsicForm.errors.email,
                                        })}
                                    >
                                        {bacsicForm.errors.email || 'No message'}
                                    </span>
                                </div>
                                <div className="form-group flex flex-col sm:w-full md:w-1/2">
                                    <label className="mb-1 select-none font-semibold text-gray-900" htmlFor="role">
                                        Chức vụ
                                    </label>

                                    <AccountRule
                                        id="role"
                                        className={clsx('text-input cursor-pointer py-[5px]', {
                                            invalid: bacsicForm.touched.type && bacsicForm.errors.type,
                                        })}
                                        onChange={bacsicForm.handleChange}
                                        onBlur={bacsicForm.handleBlur}
                                        value={bacsicForm.values.role}
                                        name="role"
                                    />

                                    <span
                                        className={clsx('text-sm text-red-500 opacity-0', {
                                            'opacity-100': bacsicForm.touched.type && bacsicForm.errors.type,
                                        })}
                                    >
                                        {bacsicForm.errors.type || 'No message'}
                                    </span>
                                </div>
                            </div>
                            <div className="mr-8 flex w-full sm:w-1/2 flex-col space-y-2 text-lg">
                                <div className="form-group flex flex-col ">
                                    <label
                                        htmlFor="username"
                                        className="mb-1 select-none  font-semibold text-gray-900  "
                                    >
                                        Tài khoản
                                    </label>
                                    <div id="username" className="text-input disabled mb-6 select-none py-[5px]">
                                        {account.username}
                                    </div>
                                </div>

                                <div className="form-group flex flex-col ">
                                    <label
                                        htmlFor="password"
                                        className="mb-1 select-none  font-semibold text-gray-900  "
                                    >
                                        Mật khẩu
                                    </label>
                                    <div id="password" className="text-input disabled  mb-5   select-none py-[5px]">
                                        *********
                                    </div>
                                </div>
                                <div className="form-group flex flex-col ">
                                    <label
                                        htmlFor="RePassword"
                                        className="mb-1 select-none  font-semibold text-gray-900  "
                                    >
                                        Nhập lại mật khẩu
                                    </label>
                                    <div id="RePassword" className="text-input disabled    select-none py-[5px]">
                                        *********
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex flex-col sm:flex-row">
                            <div className="form-group mr-4 mt-3 flex w-full sm:w-1/2 flex-col ">
                                <label className="mb-1 cursor-default select-none text-lg font-semibold">
                                    Ngày chỉnh sửa
                                </label>
                                <div className="rounded border border-slate-300 bg-slate-50 px-2 outline-none">
                                    <TimeNow />
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between border-t pt-6">
                            <div
                                className={clsx('flex items-center text-blue-500', {
                                    invisible: !loading,
                                })}
                            >
                                <i className="fa-solid fa-spinner animate-spin text-xl"></i>
                                <span className="text-lx pl-3 font-medium">Đang tạo sản phẩm</span>
                            </div>
                            <div className="flex">
                                <Link to={'/account'} className="btn btn-red btn-md">
                                    <span className="pr-2">
                                        <i className="fa-solid fa-circle-xmark"></i>
                                    </span>
                                    <span>Hủy</span>
                                </Link>
                                <button
                                    type="submit"
                                    className="btn btn-blue btn-md"
                                    disabled={!bacsicForm.dirty || loading}
                                >
                                    <span className="pr-1">
                                        <i className="fa-solid fa-circle-plus"></i>
                                    </span>
                                    <span className="">Lưu</span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default UpdateAccount;
