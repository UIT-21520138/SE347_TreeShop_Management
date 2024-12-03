import { Fragment, useState } from 'react';
import * as Yup from 'yup';
import { Formik, useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import clsx from 'clsx';
import TimeNow from '../../components/TimeNow';
import 'react-toastify/dist/ReactToastify.css';

const validationSchema = Yup.object({
    name: Yup.string().required('Trường này bắt buộc').max(30, 'Tên loại cây dài tối đa 30 kí tự'),
});

function AddProductType() {
    const [loading, setLoading] = useState(false);
    const showSuccessNoti = () => toast.success('Thêm thông tin loại sản phẩm thành công!');
    const showCD = () => toast.info('Bạn đã được chuyển sang trang thêm sản phẩm!');
    const showErorrNoti = () => toast.error('Có lỗi xảy ra!');

    const bacsicForm = useFormik({
        initialValues: {
            name: '',
        },
        validationSchema,
        onSubmit: handleFormsubmit,
    });

    const navigate = useNavigate();
    function handleFormsubmit(values) {
        console.log(values);
        setLoading(true);
        fetch('http://localhost:301/api/product-type', {
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
                    navigate('/product/add');
                    showCD();
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
            <div className="container min-w-full sm:min-w-[650px]">
                <div className="w-full">
                    <form
                        onSubmit={bacsicForm.handleSubmit}
                        className="mx-2 sm:mx-[15%] rounded-xl border border-slate-300 p-5"
                    >
                        <div className="mt-10 flex select-none items-center justify-center">
                            {/* Name */}
                            <div className="flex w-full flex-col space-y-2 text-lg">
                                <div className="form-group flex flex-col ">
                                    <label className="mb-1 select-none font-semibold" htmlFor="name">
                                        Tên loại sản phẩm
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        className={clsx('text-input w-full py-[5px]', {
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
                                    <label className="mb-1 cursor-default select-none text-lg font-semibold ">
                                        Ngày thêm
                                    </label>
                                    <div className="text-input disabled w-full select-none">
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
                                <span className="text-lx pl-3 font-medium">Đang tạo thông tin loại sản phẩm</span>
                            </div>
                            <div className="flex mt-4 sm:mt-0">
                                <Link to={'/product-type'} className="btn btn-red btn-md">
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

export default AddProductType;
