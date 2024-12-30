import { useEffect, useState } from 'react';

function ImageInput({ formik, forikField }) {
    const [img, setImg] = useState(formik.values[forikField]);

    const chooseFile = (e) => {
        const file = e.target.files[0];

        var fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onloadend = function (e) {
            const imageFile = e.target.result;
            formik.setFieldValue(forikField, imageFile);
        };
    };

    useEffect(() => {
        setImg(formik.values[forikField]);
    }, [formik.values[forikField]]);

    return (
        <div className="group relative h-60 w-full select-none overflow-hidden rounded border border-slate-300 bg-slate-50 hover:border-slate-400 sm:h-80 md:h-100">
            {!img ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center group-hover:bg-slate-100">
                    <i className="fa-solid fa-file-image text-4xl text-slate-900 sm:text-5xl md:text-6xl"></i>
                    <p className="font-semibold sm:text-lg md:text-xl">Chọn ảnh</p>
                </div>
            ) : (
                <img src={img} className="h-full w-full object-contain" alt="Ảnh sản phẩm" />
            )}

            {img && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 opacity-0 group-hover:opacity-100">
                    <i className="fa-solid fa-file-image mr-2 text-3xl text-slate-900 sm:text-4xl md:text-5xl"></i>
                    <span className="font-semibold text-slate-900 sm:text-lg md:text-xl">Chọn ảnh khác</span>
                </div>
            )}
            <input
                type="file"
                id="imageFile"
                accept="image/gif, image/ipeg, image/png, image/*"
                className="absolute inset-0 cursor-pointer opacity-0"
                onChangeCapture={chooseFile}
            />
        </div>
    );
}

export default ImageInput;