import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import moment from 'moment';
import TimeNow from '../../components/TimeNow';
import TypeProduct from '../../components/TypeProduct';
function DetailTree() {
    const [img, setImg] = useState();
   
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

    const chooseFile = (e) => {
        const file = e.target.files[0];

        file.preview = URL.createObjectURL(file);

        setImg(file);
    };
    

    return (
        <div className="container">
            <div className="wrapper text-lg">
                <div className="flex flex-col sm:flex-row">
                    <div className="mr-0 sm:mr-12 mt-4 sm:mt-[4%] flex w-full sm:basis-1/2 flex-col">
                        <label className="mb-1 font-semibold">Mã số</label>
                        <div className="h-10 rounded-lg border border-gray-300 bg-gray-400 px-2 py-1 opacity-70">
                            {product.id}
                        </div>
                    </div>

                    <div className="w-full sm:basis-1/2 flex-col items-center justify-items-center mt-4 sm:mt-0">
                        <div className="h-60 w-full rounded-xl border-2 border-dashed border-cyan-300 bg-gray-100">
                            {img && (
                                <img
                                    src={img.preview}
                                    alt=""
                                    className="h-full w-full object-contain py-[1.5px]"
                                />
                            )}
                        </div>
                        <button className="btn btn-green btn-md relative w-full sm:w-1/2 sm:inset-x-1/4 mt-4 h-10 hover:bg-green-400">
                            <input
                                type="file"
                                name="file"
                                id="imageFile"
                                value={product.image}
                                accept="image/gif, image/ipeg, image/png"
                                className="absolute top-0 left-0 w-full cursor-pointer opacity-0"
                                onChangeCapture={chooseFile}
                            />
                        </button>
                    </div>


                    <button className="btn btn-green btn-md relative w-full sm:w-1/2 sm:inset-x-1/4 mt-4 h-10 hover:bg-green-400">
                        <p className="w-full text-lg">Chọn ảnh</p>
                        <input
                            type="file"
                            name="file"
                            id="imageFile"
                            accept="image/gif, image/ipeg, image/png"
                            className="absolute top-0 left-0 w-full cursor-pointer opacity-0"
                            onChange={chooseFile}
                        />
                    </button>

                    <div className="flex flex-col sm:flex-row mt-2">
                        <div className="mr-0 sm:mr-12 flex w-full sm:w-1/2 flex-col">
                            <label className="mb-1 font-semibold" htmlFor="type">
                                Loại cây
                            </label>
                            <input
                                type="text"
                                value={product.type}
                                onChange={handleInput}
                                id="type"
                                className="text-input py-[5px]"
                                required
                            /> 
                        </div>

                        <div className="mt-2 sm:mt-0 flex w-full sm:w-1/2 flex-col">
                            <label className="mb-1 font-semibold" htmlFor="name">
                                Tên cây
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={product.name}
                                className="text-input py-[5px]"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row mt-2">
                        <div className="mr-0 sm:mr-12 flex w-full sm:w-1/2 flex-col">
                            <label
                                className="mb-1 font-semibold"
                                htmlFor="quantity"
                            >
                                Số lượng
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="quantity"
                                    value={product.quantity}
                                    className="text-input w-full py-[5px]"
                                    id="quantity"
                                    required
                                />
                                <label
                                    htmlFor="quanlity"
                                    className="lb-value absolute top-0 right-0 select-none px-[6%] py-1 text-lg text-gray-600"
                                >
                                    Cây
                                </label>
                            </div>
                        </div>

                        <div className="mt-2 sm:mt-0 flex w-full sm:w-1/2 flex-col">
                            <label
                                className="mb-1 font-semibold"
                                htmlFor="value"
                            >
                                Giá mỗi cây
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    id="value"
                                    value={product.price}
                                    onChange={handleInput}
                                    className="text-input w-full py-[5px]"
                                    required
                                />
                                <label
                                    htmlFor="value"
                                    className="lb-value absolute top-0 right-0 select-none px-[6%] py-1 text-lg text-gray-600"
                                >
                                    VNĐ
                                </label>
                            </div>
                        </div>
                    </div>
                </div>                

                <div className="mt-2 flex flex-col sm:flex-row">
                    <div className="mr-0 sm:mr-12 mt-2 flex w-full sm:w-1/2 flex-col">
                        <label className="mb-1 font-semibold" htmlFor="date">
                            Ngày nhập cây
                        </label>
                        <div>
                            {moment(product.createdAt).format(
                                'HH:mm:ss DD/MM/YYYY '
                            )}
                        </div>
                    </div>

                    <div className="mt-2 sm:mt-0 flex w-full sm:w-1/2 flex-col">
                        <label
                            className="mb-1 font-semibold"
                            htmlFor="value-all"
                        >
                            Giá tổng
                        </label>
                        <div className="relative">
                            <div className="h-10 rounded-lg border border-gray-300 px-2 py-1">
                                {product.price*product.quantity}
                            </div>
                            <label
                                htmlFor="value-all"
                                className="lb-value absolute top-0 right-0 select-none px-[6%] py-1 text-lg text-gray-600"
                            >
                                VNĐ
                            </label>
                        </div>
                    </div>
                </div>

                <div className="float-right mt-5 ml-4 flex flex-col sm:flex-row w-full sm:w-1/2 pl-4">
                    <div className="mr-0 sm:mr-[3%] flex w-full sm:w-1/2 flex-col pl-[5%]">
                        <Link to="/product" className="btn btn-blue btn-md">
                            <span className="pr-1">
                                <i className="fa-solid fa-circle-xmark"></i>
                            </span>
                            <span className="text-lg">Quay lại</span>
                        </Link>
                    </div>
                    <div className="ml-0 sm:ml-[3%] mt-2 sm:mt-0 flex w-full sm:w-1/2 flex-col pr-[5%]">
                        <button className="btn btn-green btn-md">
                            <span className="pr-1">
                                <i className="fa-solid fa-circle-plus"></i>
                            </span>
                            <span className="text-lg">Cập nhật</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailTree;
