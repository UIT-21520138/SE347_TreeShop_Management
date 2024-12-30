import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

function ProductTypeInput({ ...props }) {
  const [productTypes, setProductTypes] = useState([]);
  const selectElem = useRef(null);

  useEffect(() => {
    fetch("http://localhost:302/api/product-type")
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.success) {
          setProductTypes(resJson.productTypes);
        } else {
          setProductTypes([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <select {...props} ref={selectElem}>
      <option value="" disabled>
        -- Chọn loại sản phẩm --
      </option>
      {productTypes.map((productType) => (
        <option key={productType._id} value={productType._id}>
          {productType.name}
        </option>
      ))}
    </select>
  );
}
export default ProductTypeInput;
