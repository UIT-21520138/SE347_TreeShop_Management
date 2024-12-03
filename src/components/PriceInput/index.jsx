import clsx from 'clsx';
import PriceFormat from '../PriceFormat';

function PriceInput({ id, placeholder, className, touched, error, value, name, onChange, onBlur, ...props }) {
    return (
        <div className={clsx('relative', className)}>
            <input
                type="number"
                id={id}
                className="peer absolute opacity-0"
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                name={name}
                {...props}
            />
            <label
                htmlFor={id}
                className={clsx(
                    'text-input relative z-30 block w-full cursor-text py-[5px] peer-focus:border-blue-500 sm:text-lg md:text-xl',
                    {
                        invalid: touched && error,
                        'text-gray-400': !value,
                    }
                )}
            >
                {value ? <PriceFormat>{value}</PriceFormat> : placeholder}
            </label>
            <label className="lb-value absolute top-0 right-0 select-none px-[6%] py-1 text-lg text-gray-600 sm:text-xl md:text-2xl">
                VNĐ
            </label>
        </div>
    );
}

export default PriceInput;
