import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import clsx from 'clsx';

const validationSchema = Yup.object({
    name: Yup.string().required('Trường này bắt buộc'),
    description: Yup.string().required('Trường này bắt buộc'),
});

function AddRole() {
    const [loading, setLoading] = useState(false);
    const showSuccessNoti = () => toast.success('Tạo chức vụ thành công!');
    const showErorrNoti = () => toast.error('Có lỗi xảy ra!');

    const [functions, setFunctions] = useState([]);
    const [selectedFunctionIds, setSelectedFunctionIds] = useState([]);
    const [checkAll, setCheckAll] = useState(false);

    useEffect(() => {
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
    }, []);

    const roleForm = useFormik({
        initialValues: {
            name: '',
            description: '',
        },
        validationSchema,
        onSubmit: createRoles,
    });

    function isChecked(id) {
        return selectedFunctionIds.includes(id);
    }

    function handleToggleCheckAll(e) {
        setCheckAll(e.target.checked);
        if (e.target.checked) {
            setSelectedFunctionIds(functions.map((func) => func._id));
        } else {
            setSelectedFunctionIds([]);
        }
    }

    function handleToggleFunc(id) {
        if (isChecked(id)) {
            // checked --> not checked
            setCheckAll(false);
            const tempArray = [...selectedFunctionIds];
            const index = tempArray.indexOf(id);
            if (index > -1) {
                tempArray.splice(index, 1);
            }
            setSelectedFunctionIds(tempArray);
        } else {
            // not checked --> checked
            if (selectedFunctionIds.length === functions.length - 1) {
                setCheckAll(true);
            }
            setSelectedFunctionIds([...selectedFunctionIds, id]);
        }
    }

    function createRoles(values) {
        setLoading(true);
        fetch('http://localhost:301/api/role', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...values, functions: selectedFunctionIds }),
        })
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    setLoading(false);
                    showSuccessNoti();
                    roleForm.resetForm();
                    setSelectedFunctionIds([]);
                    setCheckAll(false);
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
        <div className="container h-full sm:min-w-[790px] md:min-w-[800px]">
            <form className="mx-auto max-w-full sm:max-w-[800px]" onSubmit={roleForm.handleSubmit}>
                <div className="mt-5 flex flex-col sm:flex-row items-center justify-center space-x-0 sm:space-x-4">
                    <div className="w-full sm:w-[300px] md:w-[400px]">
                        <label htmlFor="role-name" className="mb-2 inline-block font-semibold">
                            Chức vụ:
                        </label>
                        <input
                            type="text"
                            id="role-name"
                            className={clsx('text-input w-full py-[5px]', {
                                invalid: roleForm.touched.name && roleForm.errors.name,
                            })}
                            placeholder="Tên chức vụ"
                            onChange={roleForm.handleChange}
                            onBlur={roleForm.handleBlur}
                            value={roleForm.values.name}
                            name="name"
                        />
                        <span
                            className={clsx('text-sm text-red-500 opacity-0', {
                                'opacity-100': roleForm.touched.name && roleForm.errors.name,
                            })}
                        >
                            {roleForm.errors.name || 'No message'}
                        </span>
                    </div>
                    <div className="flex-1 sm:w-full md:w-[600px]">
                        <label htmlFor="role-description" className="mb-2 inline-block font-semibold">
                            Mô tả chức vụ:
                        </label>
                        <input
                            type="text"
                            id="role-description"
                            className={clsx('text-input w-full py-[5px]', {
                                invalid: roleForm.touched.description && roleForm.errors.description,
                            })}
                            placeholder="Mô tả chức vụ"
                            onChange={roleForm.handleChange}
                            onBlur={roleForm.handleBlur}
                            value={roleForm.values.description}
                            name="description"
                        />
                        <span
                            className={clsx('text-sm text-red-500 opacity-0', {
                                'opacity-100': roleForm.touched.description && roleForm.errors.description,
                            })}
                        >
                            {roleForm.errors.description || 'No message'}
                        </span>
                    </div>
                </div>

                <div className="mt-5 flex flex-col sm:flex-row justify-center">
                    <div className="m-auto !h-[400px] w-full sm:w-[600px] md:w-[800px] overflow-y-scroll rounded border border-gray-300 px-5 py-5 text-lg">
                        {functions.map((func, index) => (
                            <div
                                className="flex cursor-pointer items-center border-b border-slate-300 px-2 hover:bg-slate-100"
                                key={index}
                            >
                                <input
                                    type="checkbox"
                                    className="accent-blue-500"
                                    id={'function-input-' + func._id}
                                    name={func.displayName}
                                    checked={isChecked(func._id)}
                                    onChange={() => handleToggleFunc(func._id)}
                                />

                                <label htmlFor={'function-input-' + func._id} className="block flex-1 py-3 pl-8 ">
                                    {func.displayName}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-5 flex flex-col sm:flex-row items-center justify-between">
                    <div className="flex cursor-pointer items-center text-lg mb-4 sm:mb-0">
                        <input
                            type="checkbox"
                            className="accent-blue-500"
                            id="checkall"
                            checked={checkAll}
                            onChange={handleToggleCheckAll}
                        />
                        <label htmlFor="checkall" className="inline-block py-3 pl-5">
                            Chọn tất cả
                        </label>
                    </div>

                    <div className="flex mt-4 sm:mt-0">
                        <div
                            className={clsx('mr-3 flex items-center text-blue-500', {
                                invisible: !loading,
                            })}
                        >
                            <i className="fa-solid fa-spinner animate-spin text-xl"></i>
                            <span className="text-lx pl-3 font-medium">Đang tạo chức vụ</span>
                        </div>
                        <Link to={'/role/'} className="btn btn-red btn-md">
                            <span className="pr-1">
                                <i className="fa-solid fa-circle-xmark"></i>
                            </span>
                            <span className="">Hủy</span>
                        </Link>

                        <button type="submit" className="btn btn-green btn-md" disabled={!roleForm.dirty || loading}>
                            <span className="pr-1">
                                <i className="fa-solid fa-circle-plus"></i>
                            </span>
                            <span className="">Thêm</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default AddRole;
