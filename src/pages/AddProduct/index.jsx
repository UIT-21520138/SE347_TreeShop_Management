import { Fragment, useState } from 'react';
import * as Yup from 'yup';
import { Formik, useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import TypeProduct from '../../components/TypeProduct';
import clsx from 'clsx';
import { useEffect } from 'react';
import TimeNow from '../../components/TimeNow';

import 'react-toastify/dist/ReactToastify.css';
import PriceInput from '../../components/PriceInput';
import * as yup from 'yup';
import ProductTypeInput from '../../components/ProductTypeInput';
import ImageInput from '../../components/ImageInput';

const validationSchema = Yup.object({
    name: Yup.string().required('Trường này bắt buộc'),
    price: Yup.number().required('Trường này bắt buộc').min(1, 'Giá phải lớn hơn 0'),
    quantity: Yup.number().required('Trường này bắt buộc').min(1, 'Số lượng phải lớn hơn 0'),
    type: Yup.string().required('Trường này bắt buộc'),
});

function Addroduct() {
    const [loading, setLoading] = useState(false);
    const showSuccessNoti = () => toast.success('Tạo sản phẩm thành công!');
    const showErorrNoti = () => toast.error('Có lỗi xảy ra!');

    const bacsicForm = useFormik({
        initialValues: {
            name: '',
            price: '',
            quantity: '',
            type: '',
            image: '',
        },
        validationSchema,
        onSubmit: handleFormsubmit,
    });
    const navigate = useNavigate();
    function handleFormsubmit(values) {
        setLoading(true);
        fetch('http://localhost:301/api/product', {
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
                    // setTimeout(() => {
                    //     navigate('/product');
                    // }, 4000);
                    // navigate('/product');
                    bacsicForm.resetForm();
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
            <div className="container">
                <div className="w-full">
                    <form onSubmit={bacsicForm.handleSubmit}>
                        {/* (NAME AND TYPE) AND IMAGE*/}
                        <div className="mt-4 flex flex-col sm:flex-row">
                            `{/* NAME AND TYPE*/}
                            <div className="mr-8 flex w-full sm:w-1/2 flex-col space-y-2 text-lg">
                                <div className="form-group flex flex-col ">
                                    <label className="mb-1 select-none font-semibold text-base sm:text-lg md:text-xl" htmlFor="name">
                                        Tên sản phẩm
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        className={clsx('text-input py-[5px] text-base sm:text-sm md:text-lg', {
                                            invalid: bacsicForm.touched.name && bacsicForm.errors.name,
                                        })}
                                        onChange={bacsicForm.handleChange}
                                        onBlur={bacsicForm.handleBlur}
                                        value={bacsicForm.values.name}
                                        name="name"
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
                                    <label className="mb-1 select-none font-semibold text-base sm:text-lg md:text-xl" htmlFor="type">
                                        Loại sản phẩm
                                    </label>
                                    <ProductTypeInput
                                        id="type"
                                        className={clsx('text-input cursor-pointer py-[5px] text-base sm:text-sm md:text-lg', {
                                            invalid: bacsicForm.touched.type && bacsicForm.errors.type,
                                        })}
                                        onChange={bacsicForm.handleChange}
                                        onBlur={bacsicForm.handleBlur}
                                        value={bacsicForm.values.type}
                                        name="type"
                                    />

                                    <span
                                        className={clsx('text-sm text-red-500 opacity-0', {
                                            'opacity-100': bacsicForm.touched.type && bacsicForm.errors.type,
                                        })}
                                    >
                                        {bacsicForm.errors.type || 'No message'}
                                    </span>
                                </div>

                                <div className="form-group flex flex-col">
                                    <label className="mb-1 select-none font-semibold text-base sm:text-lg md:text-xl" htmlFor="quantity">
                                        Số lượng
                                    </label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        className={clsx('text-input w-full py-[5px] text-base sm:text-sm md:text-lg', {
                                            invalid: bacsicForm.touched.quantity && bacsicForm.errors.quantity,
                                        })}
                                        onChange={bacsicForm.handleChange}
                                        onBlur={bacsicForm.handleBlur}
                                        value={bacsicForm.values.quantity}
                                        name="quantity"
                                        placeholder="Nhập số lượng"
                                    />
                                    <span
                                        className={clsx('text-sm text-red-500 opacity-0', {
                                            'opacity-100': bacsicForm.touched.quantity && bacsicForm.errors.quantity,
                                        })}
                                    >
                                        {bacsicForm.errors.quantity || 'No message'}
                                    </span>
                                </div>
                            </div>

                           {/* IMAGE */}
                            <div className="form-group w-full sm:w-1/2 flex-col items-center justify-items-center">
                                <ImageInput formik={bacsicForm} forikField="image" />
                            </div>

                            {/* DATE AND PRICE */}
                            <div className="mt-4 flex flex-col sm:flex-row">
                                {/* DATE */}
                                <div className="form-group mt-3 flex w-full sm:w-1/2 flex-col">
                                    <label className="mb-1 cursor-default select-none text-base sm:text-lg md:text-xl font-semibold">
                                        Ngày thêm
                                    </label>
                                    <div className="rounded border border-slate-300 bg-slate-50 px-2 outline-none">
                                        <TimeNow />
                                    </div>
                                </div>

                                {/* PRICE */}
                                <div className="mt-3 sm:ml-4 sm:mt-0 flex w-full sm:w-1/2 flex-col">
                                    <label className="mb-1 text-base sm:text-lg md:text-xl font-semibold" htmlFor="price">
                                        Giá
                                    </label>
                                    <PriceInput
                                        id="price_AddProduct_page"
                                        onChange={bacsicForm.handleChange}
                                        onBlur={bacsicForm.handleBlur}
                                        value={bacsicForm.values.price}
                                        error={bacsicForm.errors.price}
                                        touched={bacsicForm.touched.price}
                                        name="price"
                                        placeholder="Nhập giá mỗi sản phẩm"
                                    />
                                    <span
                                        className={clsx('text-sm text-red-500 opacity-0', {
                                            'opacity-100': bacsicForm.touched.price && bacsicForm.errors.price,
                                        })}
                                    >
                                        {bacsicForm.errors.price || 'No message'}
                                    </span>
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
                            <div className="flex mt-4 sm:mt-0">
                                <Link to={'/product'} className="btn btn-red btn-md">
                                    <span className="pr-2">
                                        <i className="fa-solid fa-circle-xmark"></i>
                                    </span>
                                    <span>Hủy</span>
                                </Link>
                                <button
                                    type="submit"
                                    className="btn btn-blue btn-md ml-4"
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

export default Addroduct;
