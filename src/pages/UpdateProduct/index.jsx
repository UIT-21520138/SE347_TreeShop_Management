import { Fragment, useState } from 'react';
import * as Yup from 'yup';
import { Formik, useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import ProductTypeInput from '../../components/ProductTypeInput';
import clsx from 'clsx';
import { useEffect } from 'react';
import TimeNow from '../../components/TimeNow';
import { useParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import PriceInput from '../../components/PriceInput';
import ImageInput from '../../components/ImageInput';

const validationSchema = Yup.object({
    name: Yup.string().required('Trường này bắt buộc'),
    price: Yup.number().required('Trường này bắt buộc').min(1, 'Giá phải lớn hơn 0'),
    quantity: Yup.number().required('Trường này bắt buộc').min(1, 'Số lượng phải lớn hơn 0'),
    type: Yup.string().required('Trường này bắt buộc'),
});

function UpdateProduct() {
    const [loading, setLoading] = useState(false);
    const showSuccessNoti = () => toast.success('Chỉnh sửa phẩm thành công!');
    const showErorrNoti = () => toast.error('Có lỗi xảy ra!');
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        callApi();
    }, []);

    const [product, setProduct] = useState({});
    function callApi() {
        fetch('http://localhost:5000/api/product' + '/' + id)
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    setProduct(resJson.product);
                } else {
                    setProduct({});
                }
            });
    }

    const bacsicForm = useFormik({
        initialValues: {
            name: product.name,
            price: product.price,
            quantity: product.quantity,
            type: product.type?._id,
            image: product.image,
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: handleFormsubmit,
    });

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

        fetch('http://localhost:5000/api/product' + '/' + id, {
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
                        navigate('/product');
                    }, 4000);
                    //navigate('/product')
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

    //const calc = bacsicForm.values.price * bacsicForm.values.quantity

    return (
        <div>
            <div className="container mx-auto px-4 sm:px-6 md:px-8">
                <div className="w-full">
                    <form onSubmit={bacsicForm.handleSubmit}>
                        {/* Id, Date ang image */}
                        <div className="flex flex-col sm:flex-row">
                            {/* ID   and date*/}
                            <div className="mr-0 sm:mr-12 mt-4 flex flex-col w-full sm:w-1/2">
                                <label className="mb-1 cursor-default text-lg font-semibold">Mã số</label>
                                <div id="name" className="text-input disabled select-none py-[5px]">
                                    {product.id}
                                </div>
                                <label className="mt-10 mb-1 cursor-default text-lg font-semibold">
                                    Ngày chỉnh sửa
                                </label>
                                <div className="text-input disabled select-none">
                                    <TimeNow />
                                </div>
                            </div>
                            {/* Image */}
                            <div className="form-group w-full sm:w-1/2 flex-col items-center justify-items-center ">
                                <ImageInput formik={bacsicForm} forikField="image" />
                            </div>
                        </div>

                        {/* type and name */}
                        <div className="mt-10 flex flex-col sm:flex-row">
                            {/* Type */}
                            <div className="mr-0 sm:mr-12 mt-2 flex flex-col w-full sm:w-1/2">
                                <label className="mb-1 text-lg font-semibold" htmlFor="type">
                                    Loại cây
                                </label>
                                <ProductTypeInput
                                    id="type"
                                    className={clsx('text-input cursor-pointer py-[5px]', {
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

                            {/* Name */}
                            <div className="mt-2 flex flex-col w-full sm:w-1/2">
                                <label className="mb-1 text-lg font-semibold" htmlFor="name">
                                    Tên cây
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
                                />
                                <span
                                    className={clsx('text-sm text-red-500 opacity-0', {
                                        'opacity-100': bacsicForm.touched.name && bacsicForm.errors.name,
                                    })}
                                >
                                    {bacsicForm.errors.name || 'No message'}
                                </span>
                            </div>
                        </div>

                        {/* Quanlity and Price */}
                        <div className="flex flex-col sm:flex-row">
                            {/* Quantity */}
                            <div className="mt-2 sm:mr-12 flex flex-col w-full sm:w-1/2">
                                <label className="mb-1 text-lg font-semibold" htmlFor="quantity">
                                    Số lượng
                                </label>
                                <input
                                    type="number"
                                    id="quantity"
                                    className={clsx('text-input w-full py-[5px]', {
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

                            {/* PRICE */}
                            <div className="mt-2 flex flex-col w-full sm:w-1/2">
                                <label className="mb-1 text-lg font-semibold" htmlFor="price">
                                    Giá mỗi cây
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

                        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between border-t pt-6">
                            <div
                                className={clsx('flex items-center text-blue-500', {
                                    invisible: !loading,
                                })}
                            >
                                <i className="fa-solid fa-spinner animate-spin text-lg"></i>
                                <span className="text-lx pl-3 font-medium">Đang chỉnh sửa sản phẩm</span>
                            </div>
                            <div className="mt-4 sm:mt-0 flex">
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
                                    <span>Lưu</span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UpdateProduct;
