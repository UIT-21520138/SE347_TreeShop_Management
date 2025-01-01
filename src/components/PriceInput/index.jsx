import clsx from "clsx";
import { InputNumber } from "antd";

function PriceInput({
  id,
  placeholder,
  className,
  value,
  name,
  onChange,
  onBlur,
  size = "middle", 
  ...props
}) {
  return (
    <div className={clsx("flex items-center", className)}>
      {/* InputNumber từ Ant Design */}
      <InputNumber
        id={id}
        value={value}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        {...props}
        className="w-full" 
        size={size} 
        min={0}
      />
      {/* Hiển thị VNĐ */}
      <span className="ml-1 text-gray-500 text-sm sm:text-base">VNĐ</span>
    </div>
  );
}

export default PriceInput;
