import { Listbox, Popover } from '@headlessui/react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import PriceInput from '../../components/PriceInput';

let a = {
    'type.id': {
        $in: [1, 2],
    },
    price: { $gte: 0, $lte: 100000 },
    quantity: { $gte: 2, $lte: 100 },
};

function Filter({ onChange, hasFilters = false }) {
    const [productTypes, setProductTypes] = useState([]);
    const [filters, setfilters] = useState({});
    const [selectedProductTypes, setSelectedProductTypes] = useState([]);
    const [priceFrom, setPriceFrom] = useState('');
    const [priceTo, setPriceTo] = useState('');
    const [quantityFrom, setQuantityFrom] = useState('');
    const [quantityTo, setQuantityTo] = useState('');
    useEffect(() => {
        fetch('http://localhost:301/api/product-type')
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    setProductTypes(resJson.productTypes);
                } else {
                    setProductTypes([]);
                }
            });
    }, []);

    // Handle type change
    useEffect(() => {
        if (selectedProductTypes.length === 0) {
            delete filters['type.id'];
            return;
        }
        setfilters({
            ...filters,
            'type.id': {
                $in: selectedProductTypes.map((type) => type.id),
            },
        });
    }, [selectedProductTypes]);

    // Handle priceFrom change
    useEffect(() => {
        if (priceFrom) {
            setfilters({ ...filters, price: { ...filters.price, $gte: Number(priceFrom) } });
            return;
        }
        if (filters?.price?.$lte) {
            delete filters?.price?.$gte;
            return;
        }
        delete filters.price;
    }, [priceFrom]);

    // Handle priceTo change
    useEffect(() => {
        if (priceTo) {
            setfilters({ ...filters, price: { ...filters.price, $lte: Number(priceTo) } });
            return;
        }
        if (filters?.price?.$gte) {
            delete filters?.price?.$lte;
            return;
        }
        delete filters.price;
    }, [priceTo]);

    // Handle quantityFrom change
    useEffect(() => {
        if (quantityFrom) {
            setfilters({ ...filters, quantity: { ...filters.quantity, $gte: Number(quantityFrom) } });
            return;
        }
        if (filters?.quantity?.$lte) {
            delete filters?.quantity?.$gte;
            return;
        }
        delete filters.quantity;
    }, [quantityFrom]);

    // Handle quantityTo change
    useEffect(() => {
        if (quantityTo) {
            setfilters({ ...filters, quantity: { ...filters.quantity, $lte: Number(quantityTo) } });
            return;
        }
        if (filters?.quantity?.$gte) {
            delete filters?.quantity?.$lte;
            return;
        }
        delete filters.quantity;
    }, [quantityTo]);

    function handleClearFilters() {
        setPriceFrom('');
        setPriceTo('');
        setQuantityFrom('');
        setQuantityTo('');
        setSelectedProductTypes([]);
    }

    return (
        <Popover className="relative mr-2">
            <Popover.Button
                className={clsx(
                    'btn btn-md h-full !min-w-0 bg-slate-200 !px-3 sm:!px-4 md:!px-5 text-slate-600 outline-none hover:bg-slate-300',
                    {
                        '!bg-blue-500 !text-white hover:!bg-blue-600': hasFilters,
                    }
                )}
            >
                <i className="fas fa-filter"></i>
            </Popover.Button>

            <Popover.Panel
                as="div"
                className="absolute right-0 z-10 min-w-[280px] sm:min-w-[320px] md:min-w-[360px] rounded border bg-white px-4 py-3 shadow"
            >
                <h2 className="mb-2 text-lg sm:text-xl md:text-2xl font-semibold">Lọc sản phẩm</h2>

                <hr />
                <div className="my-3 space-y-3 sm:space-y-4 md:space-y-5">
                    <div>
                        <div className="mb-1 font-semibold">Loại sản phẩm</div>
                        <Listbox
                            className="relative"
                            as="div"
                            value={selectedProductTypes}
                            onChange={setSelectedProductTypes}
                            multiple
                        >
                            <Listbox.Button
                                as="div"
                                className="text-input flex min-h-[36px] sm:min-h-[40px] md:min-h-[44px] cursor-pointer items-center"
                            >
                                <div className="mr-2 flex-[1]">{`Đã chọn (${selectedProductTypes.length})`}</div>
                                <i className="fa-solid fa-chevron-down"></i>
                            </Listbox.Button>
                            <Listbox.Options className="absolute top-full right-0 left-0 z-50 rounded-md border bg-white text-lg sm:text-xl md:text-2xl shadow">
                                {productTypes.map((type) => (
                                    <Listbox.Option
                                        key={type._id}
                                        value={type}
                                        className="cursor-pointer border-t px-3 sm:px-4 md:px-5 py-1 sm:py-2 md:py-3 hover:text-blue-500"
                                    >
                                        {({ selected }) => (
                                            <div className="flex items-center">
                                                <i
                                                    className={clsx('fa-solid fa-check pr-2', {
                                                        'opacity-0': !selected,
                                                    })}
                                                ></i>
                                                <span>{type.name}</span>
                                            </div>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Listbox>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center">
                        <div className="flex flex-1 flex-col">
                                <PriceInput
                                    id="filterPriceFrom"
                                    value={priceFrom}
                                    onChange={(e) => setPriceFrom(e.target.value)}
                                    placeholder="Từ"
                                    className="text-input py-1 sm:py-2 md:py-3"
                                />
                            </div>
                            <div className="px-1 sm:px-2 md:px-3">-</div>
                            <div className="flex flex-1 flex-col">
                                <PriceInput
                                    id="filterPriceTo"
                                    value={priceTo}
                                    onChange={(e) => setPriceTo(e.target.value)}
                                    placeholder="Đến"
                                    className="text-input py-1 sm:py-2 md:py-3"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center">
                            <div className="flex flex-1 flex-col">
                                <input
                                    type="number"
                                    className="text-input py-1 sm:py-2 md:py-3"
                                    value={quantityFrom}
                                    onChange={(e) => setQuantityFrom(e.target.value)}
                                    placeholder="Từ"
                                />
                            </div>
                            <div className="px-1 sm:px-2 md:px-3">-</div>
                            <div className="flex flex-1 flex-col">
                                <input
                                    type="number"
                                    className="text-input py-1 sm:py-2 md:py-3"
                                    value={quantityTo}
                                    onChange={(e) => setQuantityTo(e.target.value)}
                                    placeholder="Đến"
                                />
                            </div>
                        </div>
                        <div className="mt-4 sm:mt-5 md:mt-6 flex justify-end border-t pt-3 sm:pt-4 md:pt-5">
                            <button
                                className="btn btn-red btn-md sm:btn-lg md:btn-xl"
                                onClick={() => {
                                    handleClearFilters();
                                    onChange({});
                                }}
                            >
                                <span className="pr-2">
                                    <i className="fa-solid fa-circle-xmark"></i>
                                </span>
                                <span>Xoá lọc</span>
                            </button>
                            <button type="submit" className="btn btn-blue btn-md sm:btn-lg md:btn-xl" onClick={() => onChange(filters)}>
                                <span className="pr-2">
                                    <i className="fa-solid fa-circle-plus"></i>
                                </span>
                                <span>Lọc</span>
                            </button>
                        </div>
                    </div>
            </Popover.Panel>
        </Popover>
    );
}

export default Filter;
