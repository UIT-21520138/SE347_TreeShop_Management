import { Popover, Select, Button, InputNumber } from "antd";
import { useEffect, useState } from "react";
import clsx from "clsx";
import PriceInput from "../../components/PriceInput";

function Filter({ onChange, hasFilters = false }) {
  const [visible, setVisible] = useState(false); // Điều khiển trạng thái popup
  const [productTypes, setProductTypes] = useState([]);
  const [filters, setfilters] = useState({});
  const [selectedProductTypes, setSelectedProductTypes] = useState([]);
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [quantityFrom, setQuantityFrom] = useState("");
  const [quantityTo, setQuantityTo] = useState("");

  useEffect(() => {
    fetch("http://localhost:302/api/product-type")
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.success) {
          setProductTypes(resJson.productTypes);
        } else {
          setProductTypes([]);
        }
      });
  }, []);

  useEffect(() => {
    if (selectedProductTypes.length === 0) {
      delete filters["type.id"];
      return;
    }
    setfilters({
      ...filters,
      "type.id": {
        $in: selectedProductTypes.map((type) => type.id),
      },
    });
  }, [selectedProductTypes]);

  useEffect(() => {
    if (priceFrom) {
      setfilters({
        ...filters,
        price: { ...filters.price, $gte: Number(priceFrom) },
      });
      return;
    }
    if (filters?.price?.$lte) {
      delete filters?.price?.$gte;
      return;
    }
    delete filters.price;
  }, [priceFrom]);

  useEffect(() => {
    if (priceTo) {
      setfilters({
        ...filters,
        price: { ...filters.price, $lte: Number(priceTo) },
      });
      return;
    }
    if (filters?.price?.$gte) {
      delete filters?.price?.$lte;
      return;
    }
    delete filters.price;
  }, [priceTo]);

  useEffect(() => {
    if (quantityFrom) {
      setfilters({
        ...filters,
        quantity: { ...filters.quantity, $gte: Number(quantityFrom) },
      });
      return;
    }
    if (filters?.quantity?.$lte) {
      delete filters?.quantity?.$gte;
      return;
    }
    delete filters.quantity;
  }, [quantityFrom]);

  useEffect(() => {
    if (quantityTo) {
      setfilters({
        ...filters,
        quantity: { ...filters.quantity, $lte: Number(quantityTo) },
      });
      return;
    }
    if (filters?.quantity?.$gte) {
      delete filters?.quantity?.$lte;
      return;
    }
    delete filters.quantity;
  }, [quantityTo]);

  function handleClearFilters() {
    setPriceFrom("");
    setPriceTo("");
    setQuantityFrom("");
    setQuantityTo("");
    setSelectedProductTypes([]);
  }

  function handleFilter() {
    onChange(filters);
    setVisible(false); // Đóng popup sau khi bấm "Lọc"
  }

  const content = (
    <div className="min-w-[280px] sm:min-w-[320px] md:min-w-[360px]">
      <h2 className="mb-2 text-lg sm:text-xl md:text-2xl font-semibold">
        Lọc sản phẩm
      </h2>
      <hr />
      <div className="my-3 space-y-3 sm:space-y-4 md:space-y-5">
        <div>
          <div className="mb-1 font-semibold">Loại sản phẩm</div>
          <Select
            mode="multiple"
            placeholder="Chọn loại sản phẩm"
            style={{ width: "100%" }}
            value={selectedProductTypes}
            onChange={(values) => setSelectedProductTypes(values)}
          >
            {productTypes.map((type) => (
              <Select.Option key={type._id} value={type.id}>
                {type.name}
              </Select.Option>
            ))}
          </Select>
        </div>

        <div>
          <div className="mb-1 font-semibold">Theo giá</div>
          <div className="flex flex-col sm:flex-row items-center">
            <div className="flex flex-1 flex-col">
              <PriceInput
                id="filterPriceFrom"
                value={priceFrom}
                onChange={(e) => setPriceFrom(e.target.value)}
                placeholder="Từ"
              />
            </div>
            <div className="px-1 sm:px-2 md:px-3">-</div>
            <div className="flex flex-1 flex-col">
              <PriceInput
                id="filterPriceTo"
                value={priceTo}
                onChange={(e) => setPriceTo(e.target.value)}
                placeholder="Đến"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="mb-1 font-semibold">Theo số lượng</div>
          <div className="flex flex-col sm:flex-row items-center">
            <div className="flex flex-1 flex-col">
              <InputNumber
                placeholder="Từ"
                value={quantityFrom}
                onChange={(value) => setQuantityFrom(value)}
                className="w-full"
                min={0}
              />
            </div>
            <div className="px-1 sm:px-2 md:px-3">-</div>
            <div className="flex flex-1 flex-col">
              <InputNumber
                placeholder="Đến"
                value={quantityTo}
                onChange={(value) => setQuantityTo(value)}
                className="w-full"
                min={0}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 sm:mt-5 md:mt-6 flex justify-end border-t pt-3 sm:pt-4 md:pt-5">
          <Button onClick={handleClearFilters} style={{ marginRight: 8 }}>
            Xóa lọc
          </Button>
          <Button type="primary" onClick={handleFilter}>
            Lọc
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <Popover
      content={content}
      trigger="click"
      placement="bottomRight"
      visible={visible} // Kiểm soát hiển thị
      onVisibleChange={(v) => setVisible(v)} // Cập nhật trạng thái hiển thị
    >
      <Button
        className={clsx(
          "btn btn-md h-full !min-w-0 bg-slate-200 !px-3 sm:!px-4 md:!px-5 text-slate-600 outline-none hover:bg-slate-300",
          {
            "!bg-blue-500 !text-white hover:!bg-blue-600": hasFilters,
          }
        )}
        icon={<i className="fas fa-filter"></i>}
      />
    </Popover>
  );
}

export default Filter;
