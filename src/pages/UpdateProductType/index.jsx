import { Fragment, useState } from 'react';
import * as Yup from 'yup';
import { Formik, useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import clsx from 'clsx';
import { useParams } from 'react-router-dom';
import TimeNow from '../../components/TimeNow';
import { useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';

const validationSchema = Yup.object({
    name: Yup.string().required('Trường này bắt buộc').max(30, 'Tên loại cây dài tối đa 30 kí tự'),
});

function UpdateProductType() {
    const [loading, setLoading] = useState(false);
    const showSuccessNoti = () => toast.success('Chỉnh sửa thông tin loại sản phẩm thành công!');
    const showErorrNoti = () => toast.error('Có lỗi xảy ra!');

    const { id } = useParams();
    const [productType, setProductType] = useState({});
    useEffect(() => {
        callApi();
    }, []);

    function callApi() {
        fetch('http://localhost:5000/api/product-type' + '/' + id)
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    setProductType(resJson.productType);
                } else {
                    setProductType({});
                }
            });
    }
    const bacsicForm = useFormik({
        initialValues: {
            name: productType.name,
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: handleFormsubmit,
    });

    const navigate = useNavigate();
    function handleFormsubmit(values) {
        console.log(values);
        setLoading(true);
        fetch('http://localhost:5000/api/product-type/' + id, {
            method: 'PUT',
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
                    setTimeout(() => {
                        navigate('/product-type');
                    }, 3000);
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
            <div className="container sm:min-w-[650px] mx-auto px-4 sm:px-6 md:px-8">
                <div className="w-full">
                    <form
                        onSubmit={bacsicForm.handleSubmit}
                        className="mx-auto sm:mx-[10%] rounded-xl border border-slate-300 p-5"
                    >
                        <div className="mt-10 flex flex-col sm:items-center justify-center">
                            <div className="flex w-full flex-col space-y-2 text-lg">
                                <div className="form-group flex flex-col">
                                    <label className="mb-1 cursor-default text-lg font-semibold">
                                        Mã loại sản phẩm
                                    </label>
                                    <div className="text-input disabled select-none py-[5px]">{productType.id}</div>
                                </div>

                                <div className="form-group flex flex-col">
                                    <label className="mb-1 mt-3 font-semibold" htmlFor="name">
                                        Tên loại sản phẩm
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        className={clsx('text-input py-[5px]', {
                                            invalid: bacsicForm.touched.name && bacsicForm.errors.name,
                                        })}
                                        onChange={bacsicForm.handleChange}
                                        onBlur={bacsicForm.handleBlur}
                                        value={bacsicForm.values.name}
                                        name="name"
                                        placeholder="Sen đá"
                                    />
                                    <span
                                        className={clsx('text-sm text-red-500 opacity-0', {
                                            'opacity-100': bacsicForm.touched.name && bacsicForm.errors.name,
                                        })}
                                    >
                                        {bacsicForm.errors.name || 'No message'}
                                    </span>
                                </div>

                                <div className="form-group flex w-full flex-col ">
                                    <label className="mb-1 cursor-default text-lg font-semibold">Ngày thêm</label>
                                    <div className="text-input disabled select-none">
                                        <TimeNow />
                                    </div>
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
                                <span className="text-lx pl-3 font-medium">Đang chỉnh sửa thông tin loại sản phẩm</span>
                            </div>
                            <div className="mt-4 sm:mt-0 flex justify-end">
                                <Link to={'/product-type'} className="btn btn-red btn-md">
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
                                    <span>Lưu</span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default UpdateProductType;
