import { Fragment, useState } from 'react';
import * as Yup from 'yup';
import { Formik, useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import clsx from 'clsx';
import TimeNow from '../../components/TimeNow';
import 'react-toastify/dist/ReactToastify.css';

import AccountRoleInput from '../../components/AccountRoleInput';
const validationSchema = Yup.object({
    role: Yup.string().required('Trường này bắt buộc'),
    name: Yup.string()
        .required('Trường này bắt buộc')
        .min(2, 'Tên phải có độ dài hơn 2 kí tự')
        .max(30, 'Tên dài tối đa 30 kí tự'),
    email: Yup.string()
        .required('Trường này bắt buộc')
        .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, 'Email sai không đúng định dạng'),
    username: Yup.string().required('Vui lòng nhập tên tài tài khoản!'),
    password: Yup.string()
        .required('Vui lòng nhập nhập mật khẩu!')
        .min(6, 'Mật khẩu quá ngắn! mật khẩu phải có ít nhất 6 kí tự'),
    RePassword: Yup.string()
        .required('Vui lòng nhập nhập lại mật khẩu!')
        .oneOf([Yup.ref('password'), null], 'Nhập lại mật khẩu không đúng'),
});

function AddAccount() {
    const [loading, setLoading] = useState(false);
    const showSuccessNoti = () => toast.success('Thêm thông tin khách hàng thành công!');
    const showErorrNoti = () => toast.error('Có lỗi xảy ra!');

    const bacsicForm = useFormik({
        initialValues: {
            name: '',
            email: '',
            role: '',
            username: '',
            password: '',
            RePassword: '',
        },
        validationSchema,
        onSubmit: handleFormsubmit,
    });

    const navigate = useNavigate();

    function handleFormsubmit(values) {
        setLoading(true);
        fetch('http://localhost:301/api/account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    setLoading(false);
                    showSuccessNoti();
                    bacsicForm.resetForm();
                    bacsicForm.values.RePassword = '';
                } else {
                    setLoading(false);
                    console.log(values);
                    showErorrNoti();
                }
            })
            .catch(() => {
                setLoading(false);
                console.log(values);
                showErorrNoti();
            });
    }

    return (
        <>
            <div className="container">
                <div className="w-full">
                    <form onSubmit={bacsicForm.handleSubmit}>
                        {/* <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-900  md:text-2xl">
                            ĐĂNG KÝ TÀI KHOẢN
                        </h1> */}
                        <div className="mt-4 flex flex-col sm:flex-row">
                            <div className="mr-8 flex w-full sm:w-1/2 md:w-1/3 flex-col space-y-2 text-base sm:text-lg md:text-xl">
                                <div className="form-group flex flex-col">
                                    <label htmlFor="name" className="mb-1 select-none font-semibold text-gray-900 text-base sm:text-lg md:text-xl">
                                        Tên nhân viên
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        className={clsx(
                                            'focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 text-base sm:text-sm md:text-lg',
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

                                <div className="form-group flex flex-col">
                                    <label htmlFor="email" className="mb-1 select-none font-semibold text-gray-900 text-base sm:text-lg md:text-xl">
                                        Địa chỉ email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        className={clsx(
                                            'focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 text-base sm:text-sm md:text-lg',
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
                                <div className="form-group flex flex-col">
                                    <label htmlFor="role" className="mb-1 select-none font-semibold text-gray-900 text-base sm:text-lg md:text-xl">
                                        Chức vụ
                                    </label>

                                    <AccountRoleInput
                                        id="role"
                                        className={clsx(
                                            'text-input cursor-pointer py-[5px] text-base sm:text-sm md:text-lg',
                                            {
                                                invalid: bacsicForm.touched.role && bacsicForm.errors.role,
                                            }
                                        )}
                                        onChange={bacsicForm.handleChange}
                                        onBlur={bacsicForm.handleBlur}
                                        value={bacsicForm.values.role}
                                        name="role"
                                    />

                                    <span
                                        className={clsx('text-sm text-red-500 opacity-0', {
                                            'opacity-100': bacsicForm.touched.role && bacsicForm.errors.role,
                                        })}
                                    >
                                        {bacsicForm.errors.role || 'No message'}
                                    </span>
                                </div>
                            </div>
                            <div className="mr-8 flex w-full sm:w-1/2 md:w-1/3 flex-col space-y-2 text-base sm:text-lg md:text-xl">
                                <div className="form-group flex flex-col">
                                    <label htmlFor="username" className="mb-1 select-none font-semibold text-gray-900 text-base sm:text-lg md:text-xl">
                                        Tài khoản
                                    </label>
                                    <input
                                        type="text"
                                        name="username"
                                        id="username"
                                        className={clsx(
                                            'focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 text-base sm:text-sm md:text-lg',
                                            {
                                                invalid: bacsicForm.touched.username && bacsicForm.errors.username,
                                            }
                                        )}
                                        onChange={bacsicForm.handleChange}
                                        onBlur={bacsicForm.handleBlur}
                                        value={bacsicForm.values.username}
                                        placeholder="Tên tài khoản"
                                    />
                                    <span
                                        className={clsx('text-sm text-red-500 opacity-0', {
                                            'opacity-100': bacsicForm.touched.username && bacsicForm.errors.username,
                                        })}
                                    >
                                        {bacsicForm.errors.username || 'No message'}
                                    </span>
                                </div>

                                <div className="form-group flex flex-col">
                                    <label htmlFor="password" className="mb-1 select-none font-semibold text-gray-900 text-base sm:text-lg md:text-xl">
                                        Mật khẩu
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 text-base sm:text-sm md:text-lg"
                                        onChange={bacsicForm.handleChange}
                                        onBlur={bacsicForm.handleBlur}
                                        value={bacsicForm.values.password}
                                        placeholder="Mật khẩu"
                                    />
                                    <span
                                        className={clsx('text-sm text-red-500 opacity-0', {
                                            'opacity-100': bacsicForm.touched.password && bacsicForm.errors.password,
                                        })}
                                    >
                                        {bacsicForm.errors.password || 'No message'}
                                    </span>
                                </div>
                                <div className="form-group flex flex-col ">
                                    <label
                                        htmlFor="RePassword"
                                        className="mb-1 select-none font-semibold text-gray-900 text-base sm:text-lg md:text-xl"
                                    >
                                        Nhập lại mật khẩu
                                    </label>
                                    <input
                                        type="password"
                                        name="RePassword"
                                        id="RePassword"
                                        onChange={bacsicForm.handleChange}
                                        onBlur={bacsicForm.handleBlur}
                                        value={bacsicForm.values.RePassword}
                                        placeholder="Nhập lại mật khẩu"
                                        className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 text-base sm:text-sm md:text-lg"
                                    />
                                    <span
                                        className={clsx('text-sm text-red-500 opacity-0', {
                                            'opacity-100':
                                                bacsicForm.touched.RePassword && bacsicForm.errors.RePassword,
                                        })}
                                    >
                                        {bacsicForm.errors.RePassword || 'No message'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex flex-col sm:flex-row">
                            <div className="form-group mr-4 mt-3 flex basis-1/2 flex-col ">
                                <label className="mb-1 cursor-default select-none text-lg sm:text-xl md:text-2xl font-semibold">
                                    Ngày thêm
                                </label>
                                <div className="rounded border border-slate-300 bg-slate-50 px-2 outline-none">
                                    <TimeNow />
                                </div>
                            </div>
                            {/* PRICE */}
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
                            <div className="flex mt-4 sm:mt-0">
                                <Link to={'/product'} className="btn btn-red btn-md">
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
                                    <span className="pr-2">
                                        <i className="fa-solid fa-circle-plus"></i>
                                    </span>
                                    <span>Thêm</span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default AddAccount;
