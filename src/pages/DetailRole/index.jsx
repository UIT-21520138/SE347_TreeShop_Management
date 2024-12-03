import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import clsx from 'clsx';

function DetailRole() {
    const { id } = useParams();

    const [functions, setFunctions] = useState([]);
    const [selectedFunctionIds, setSelectedFunctionIds] = useState([]);

    const [role, setRole] = useState({});
    useEffect(() => {
        // Get function
        fetch('http://localhost:301/api/function')
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    setFunctions(resJson.functions);
                } else {
                    setFunctions([]);
                }
            })
            .catch((error) => {
                console.log(error);
            });
        // Get role
        fetch('http://localhost:301/api/role' + '/' + id)
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    setRole(resJson.role);
                    setSelectedFunctionIds(resJson.role?.functions?.map((func) => func._id) || []);
                } else {
                    setRole({});
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    function isChecked(id) {
        return selectedFunctionIds.includes(id);
    }

    return (
        <div className="container h-full min-w-full sm:min-w-[790px]">
            <div className="mx-auto max-w-full sm:max-w-[800px]">
                <div className="mt-5 flex flex-col sm:flex-row items-center justify-center space-x-0 sm:space-x-4">
                    <div className="w-full sm:w-[300px]">
                        <div className="mb-2 inline-block font-semibold">Chức vụ:</div>
                        <div className="text-input disabled w-full py-[5px]">{role?.name}</div>
                        <span className="opacity-0">--</span>
                    </div>
                    <div className="flex-1">
                        <div className="mb-2 inline-block font-semibold">Mô tả chức vụ:</div>
                        <div className="text-input disabled w-full py-[5px]">{role?.description}</div>
                        <span className="opacity-0">--</span>
                    </div>
                </div>
        
                <div className="mt-5 flex flex-col sm:flex-row justify-center">
                    <div className="m-auto !h-[400px] w-full overflow-y-scroll rounded border border-gray-300 px-5 py-5 text-lg">
                        {functions.map((func, index) => (
                            <div
                                className="pointer-events-none flex cursor-pointer items-center border-b border-slate-300 px-2 hover:bg-slate-100"
                                key={index}
                            >
                                <input
                                    type="checkbox"
                                    className="accent-blue-500"
                                    id={'function-input-' + func._id}
                                    name={func.displayName}
                                    checked={isChecked(func._id)}
                                    onChange={() => {}}
                                />
        
                                <label htmlFor={'function-input-' + func._id} className="block flex-1 py-3 pl-8 ">
                                    {func.displayName}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
        
                <div className="mt-5 flex flex-col sm:flex-row items-center justify-end">
                    <div className="flex flex-col sm:flex-row">
                        <Link to={'/role/'} className="btn btn-blue btn-md mb-2 sm:mb-0 sm:mr-2">
                            <span className="pr-1">
                                <i className="fa-solid fa-circle-xmark"></i>
                            </span>
                            <span className="">Quay lại</span>
                        </Link>
        
                        <Link to={'/role/update/' + role?.id} className="btn btn-green btn-md">
                            <span className="pr-1">
                                <i className="fa-solid fa-pen-to-square"></i>
                            </span>
                            <span className="">Chỉnh sửa</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailRole;
