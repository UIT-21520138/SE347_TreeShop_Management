import { useEffect, useState } from "react";
import { Listbox } from "@headlessui/react";
import clsx from "clsx";
function TypeProduct({ onChange, invalid = false }) {
  const [productTypes, setProductTypes] = useState([]);

  const [selectedProductType, setSelectedProductType] = useState({});
  useEffect(() => {
    callApiProductTypes();
  }, []);

  function callApiProductTypes() {
    fetch("http://localhost:302/api/product-type")
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.success) {
          setProductTypes(resJson.productTypes);
        } else {
          setProductTypes([]);
        }
      });
  }
  useEffect(() => {
    onChange(selectedProductType);
  }, [selectedProductType._id]);
  return (
    <div>
      <Listbox value={selectedProductType} onChange={setSelectedProductType}>
        <Listbox.Button
          as="div"
          className={clsx(
            "text-input flex min-h-[40px] cursor-pointer items-center",
            {
              invalid,
            }
          )}
        >
          <div
            className={clsx("mr-2 flex-1 text-sm sm:text-base md:text-lg", {
              "opacity-50": !selectedProductType.name,
            })}
          >
            {selectedProductType.name || "Vui lòng chọn loại cây"}{" "}
          </div>
          <i className="fa-solid fa-chevron-down"></i>
        </Listbox.Button>
        <Listbox.Options>
          {productTypes.map((type) => (
            <Listbox.Option
              key={type._id}
              value={type}
              className="cursor-pointer hover:text-blue-500"
            >
              {({ selected }) => (
                <div className="flex items-center">
                  <i
                    className={clsx("fa-solid fa-check pr-2", {
                      "opacity-0": !selected,
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
  );
}
export default TypeProduct;
