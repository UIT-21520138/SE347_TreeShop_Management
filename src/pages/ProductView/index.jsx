import { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Listbox, Popover } from "@headlessui/react";
import clsx from "clsx";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { accountSelector } from "../../redux/selectors";
function removeVietnameseTones(stra) {
  var str = stra;
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str.replace(/ + /g, " ");
  str = str.trim();
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    " "
  );
  return str;
}
function ProductsView() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const navigate = useNavigate();
  const [img, setImg] = useState();
  const account = useSelector(accountSelector);
  function isHiddenItem(functionName) {
    if (!account) {
      return true;
    }
    if (!functionName) {
      return false;
    }
    const findResult = account?.functions?.find(
      (_func) => _func?.name === functionName
    );
    if (findResult) {
      return false;
    }
    return true;
  }
  useEffect(() => {
    //cleanup
    return () => {
      img && URL.revokeObjectURL(img.preview);
    };
  }, [img]);

  const [selectedProductTypes, setSelectedProductTypes] = useState([]);
  useEffect(() => {
    callApi();
    callApiProductTypes();
  }, []);

  function callApi() {
    fetch("http://localhost:302/api/product")
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.success) {
          setProducts(resJson.products);
        } else {
          setProducts([]);
        }
      });
  }
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

  function linkToDetail(id) {
    navigate("/product/detail/" + id);
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8">
      <div className="flex flex-col sm:flex-row space-x-0 sm:space-x-4">
        {/* title + reload btn */}
        <div className="flex items-center space-x-2">
          <label className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">
            Danh sách cây
          </label>
          <button
            type="button"
            className="ml-3 text-gray-800 hover:underline"
            onClick={() => callApi()}
          >
            <span className="font-sm pr-1">
              <i className="fa fa-refresh" aria-hidden="true"></i>
            </span>
            <span className="">Tải lại</span>
          </button>
        </div>

        {/* Action group */}
        <div className="flex flex-grow mt-2 sm:mt-0">
          {/* Search */}
          <div className="mr-2 flex flex-grow">
            <input
              type="text"
              className="text-input flex-grow"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              placeholder="Tìm kiếm sản phẩm"
            />
          </div>

          <Popover className="relative mr-2">
            <Popover.Button className="btn btn-md h-full !min-w-0 bg-slate-200 !px-3 sm:!px-4 md:!px-5 text-slate-600 outline-none hover:bg-slate-300">
              <i className="fas fa-filter"></i>
            </Popover.Button>

            <Popover.Panel
              as="div"
              className="absolute right-0 z-10 min-w-[280px] sm:min-w-[320px] md:min-w-[360px] rounded border bg-white px-4 py-3 shadow"
            >
              <h2 className="mb-2 text-lg sm:text-xl md:text-2xl font-semibold">
                Lọc sản phẩm
              </h2>

              <hr />
              <div className="mt-3 space-x-2 sm:space-x-3 md:space-x-4">
                <div>
                  <Listbox
                    value={selectedProductTypes}
                    onChange={setSelectedProductTypes}
                    multiple
                  >
                    <Listbox.Button
                      as="div"
                      className="text-input flex min-h-[36px] sm:min-h-[40px] md:min-h-[44px] cursor-pointer items-center"
                    >
                      <div className="mr-2 flex-1">{`Loại cây (${selectedProductTypes.length})`}</div>
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
              </div>
            </Popover.Panel>
          </Popover>

          <Link
            to="/product/"
            className="btn btn-md sm:btn-lg md:btn-xl btn-green"
          >
            <span className="pr-1">
              <i className="fa fa-share"></i>
            </span>
            <span>Chuyển sang dạng danh sách</span>
          </Link>
          <Link
            to="/product/add"
            className={clsx("btn btn-md sm:btn-lg md:btn-xl btn-green", {
              hidden: isHiddenItem("product/create"),
            })}
          >
            <span className="pr-1">
              <i className="fa-solid fa-circle-plus"></i>
            </span>
            <span>Thêm cây mới</span>
          </Link>
        </div>
        <div className="flex h-[85vh] flex-col overflow-scroll">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {products
              .filter((product) => {
                if (search === "") {
                  return product;
                } else {
                  if (
                    removeVietnameseTones(product.name.toLowerCase()).includes(
                      removeVietnameseTones(search.toLowerCase())
                    ) ||
                    removeVietnameseTones(
                      product?.type.name.toLowerCase()
                    ).includes(removeVietnameseTones(search.toLowerCase()))
                  ) {
                    var id = product.id.toString();
                    return product.id.toString().includes(id);
                  }
                }
              })

              .map((product) => (
                <div
                  key={product.id}
                  className="cursor-pointer select-none rounded border"
                >
                  <img
                    className="w-full sm:w-[150px] md:w-[300px] py-2 text-center"
                    src={product.image}
                  />
                  <h1 className="py-2 text-center">
                    {product.type?.name || "-"}
                  </h1>
                  <h1
                    className={clsx("h-[64px] py-2 text-center", {
                      "line-through": product.quantity === 0,
                    })}
                  >
                    {product.name}
                  </h1>
                  <h1 className="py-2 text-center">
                    {product.price
                      .toFixed(0)
                      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                  </h1>
                  <div className="flex justify-center">
                    <button
                      className={clsx(
                        "btn btn-sm sm:btn-md md:btn-lg btn-blue",
                        {
                          hidden: isHiddenItem("product/update"),
                        }
                      )}
                    >
                      <span className="pr-1">
                        <i className="fa-solid fa-pen-to-square"></i>
                      </span>
                      <span>Sửa</span>
                    </button>
                    <button
                      className={clsx(
                        "btn btn-sm sm:btn-md md:btn-lg btn-red",
                        {
                          hidden: isHiddenItem("product/delete"),
                        }
                      )}
                    >
                      <span className="pr-1">
                        <i className="fa-solid fa-circle-xmark"></i>
                      </span>
                      <span>Xoá</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductsView;
