import { Fragment, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import TypeProduct from '../../components/TypeProduct';
import clsx from 'clsx';
import { useEffect } from 'react';

import moment from 'moment';
import TimeNow from '../../components/TimeNow';

import { useSelector } from 'react-redux';
import { accountSelector } from '../../redux/selectors';

function DetailTree() {
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

    const [img, setImg] = useState();

    useEffect(() => {
        //cleanup
        return () => {
            img && URL.revokeObjectURL(img.preview);
        };
    }, [img]);

    const [product, setProduct] = useState({});
    useEffect(() => {
        //cleanup
        return () => {
            img && URL.revokeObjectURL(img.preview);
        };
    }, [img]);
    const { id } = useParams();
    useEffect(() => {
        callApi();
    }, []);

    function callApi() {
        fetch('http://localhost:301/api/product' + '/' + id)
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    setProduct(resJson.product);
                } else {
                    setProduct({});
                }
            });
    }

    return (
        <div className="container">
            <div className="w-full">
                <div className="mt-4 flex flex-col sm:flex-row">
                    <div className="mr-0 sm:mr-8 mt-3 flex w-full sm:w-1/2 flex-col space-y-4 text-lg">
                        <div className="form-group mt-10 flex flex-col">
                            <label className="mb-1 cursor-default font-semibold " htmlFor="name">
                                Mã sản phẩm
                            </label>
                            <div id="name" className="text-input disabled select-none py-[5px]">
                                {product.id}
                            </div>
                        </div>
                        <div className="form-group flex flex-col ">
                            <label className="mb-1 cursor-default font-semibold " htmlFor="name">
                                Tên cây
                            </label>
                            <div id="name" className="text-input disabled select-none py-[5px]">
                                {product.name}
                            </div>
                        </div>
                    </div>

                    <div className="form-group w-full sm:w-1/2 flex-col items-center justify-items-center mt-4 sm:mt-0">
                        <div className="h-60 w-full select-none overflow-hidden rounded border border-slate-300 bg-slate-50">
                            <img src={product.image} alt="" className="h-full w-full object-contain" />
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row">
                    <div className="form-group mr-0 sm:mr-4 mt-3 flex w-full sm:basis-1/2 flex-col">
                        <label className="mb-1 cursor-default text-lg font-semibold" htmlFor="type">
                            Loại cây
                        </label>
                        <div id="name" className="text-input disabled  select-none py-[5px]">
                            {product?.type?.name}
                        </div>
                    </div>

                    <div className="form-group ml-0 sm:ml-4 mt-3 flex w-full sm:basis-1/2 flex-col">
                        <label className="mb-1 cursor-default text-lg font-semibold" htmlFor="quantity">
                            Số lượng
                        </label>
                        <div id="quantity" className="ml-lg text-input disabled py-[5px]">
                            {product.quantity}
                        </div>
                    </div>
                </div>

                <div className="mt-2 flex flex-col sm:flex-row">
                    <div className="form-group mr-0 sm:mr-4 mt-3 flex w-full sm:basis-1/2 flex-col">
                        <label className="mb-1 cursor-default text-lg font-semibold" htmlFor="date">
                            Ngày nhập cây
                        </label>
                        <div className="text-input disabled py-[5px] text-xl">
                            {moment(product.createdAt).format('HH:mm:ss DD/MM/YYYY ')}
                        </div>
                    </div>

                    <div className="ml-0 sm:ml-4 mt-3 flex w-full sm:basis-1/2 flex-col">
                        <label className="mb-1 cursor-default text-lg font-semibold" htmlFor="price">
                            Giá
                        </label>
                        <div className="relative">
                            <div id="price" className="text-input disabled w-full select-none py-[5px]">
                                {product.price}
                            </div>
                            <label
                                htmlFor="price"
                                className="lb-value absolute top-0 right-0 select-none px-[6%] py-1 text-lg text-gray-600"
                            >
                                VNĐ
                            </label>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                    <Link to={'/product'} className="btn btn-blue btn-md w-full sm:w-auto">
                        <span className="pr-2">
                            <i className="fa-solid fa-circle-xmark"></i>
                        </span>
                        <span>Quay lại</span>
                    </Link>

                    <Link
                        to={'/product/update/' + product.id}
                        className={clsx('btn btn-md btn-green w-full sm:w-auto mt-2 sm:mt-0', {
                            hidden: isHiddenItem('product/update'),
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
    );
}
//
//
export default DetailTree;
