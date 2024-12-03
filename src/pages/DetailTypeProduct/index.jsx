import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { accountSelector } from '../../redux/selectors';

function DetailTypeProduct() {
    const { id } = useParams();
    const [productType, setProductType] = useState({});
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
        fetch('http://localhost:301/api/product-type' + '/' + id)
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    setProductType(resJson.productType);
                } else {
                    setProductType({});
                }
            });
    }
    return (
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="wrapper mx-[10%] rounded-xl border border-slate-300 p-5">
                <div className="mt-4 flex flex-col sm:flex-row">
                    <div className="mt-[4%] flex w-full sm:w-1/2 flex-col">
                        <label className="mb-1 cursor-default text-lg font-semibold">Mã loại sản phẩm</label>
                        <div className="text-input disabled select-none py-[5px]">{productType.id}</div>
                    </div>
                </div>
        
                <div className="mt-4 flex flex-col sm:flex-row">
                    <div className="mt-2 flex w-full sm:w-1/2 flex-col">
                        <label className="mb-1 cursor-default text-lg font-semibold" htmlFor="name">
                            Tên loại sản phẩm
                        </label>
                        <div className="text-input disabled select-none py-[5px]">{productType.name}</div>
                    </div>
                </div>
        
                <div className="mt-4 mb-4 flex flex-col sm:flex-row">
                    <div className="mt-2 flex w-full sm:w-1/2 flex-col">
                        <label className="mb-1 cursor-default text-lg font-semibold" htmlFor="date">
                            Ngày thêm
                        </label>
                        <div className="text-input disabled select-none py-[5px]">
                            {moment(productType.createdAt).format('(HH:mm:ss)     DD/MM/YYYY')}
                        </div>
                    </div>
                </div>
        
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-end border-t pt-6">
                    <Link to={'/product-type'} className="btn btn-blue btn-md mb-2 sm:mb-0 sm:mr-2">
                        <span className="pr-1">
                            <i className="fa-solid fa-circle-xmark"></i>
                        </span>
                        <span>Quay lại</span>
                    </Link>
                    <Link
                        to={'/product-type/update/' + productType.id}
                        className={clsx('btn btn-md btn-blue', {
                            hidden: isHiddenItem('product-type/update'),
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
export default DetailTypeProduct;
