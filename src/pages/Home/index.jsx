import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { accountActions } from "../../redux/slices/accountSlice";

function Home() {
  const dispatch = useDispatch();
  const showLogoutNoti = () => toast.info("Đã đăng xuất!");

  return (
    <div className="container flex flex-col sm:flex-row h-full w-full items-center justify-center sm:space-x-11 space-y-5 sm:space-y-0">
      <div className="space-y-3 text-gray-600">
        <p className="text-center text-4xl font-extrabold text-green-600">
          QUẢN LÝ
        </p>
        <p className="text-center text-3xl font-bold text-green-600">
          CỬA HÀNG CÂY XANH
        </p>
        <p className="text-xl font-bold">
          Nếu cần hỗ trợ kỹ thuật, vui lòng thực hiện một trong ba cách sau:{" "}
        </p>
        <p className="text-lg ">
          1. Truy cập{" "}
          <a
            href="https://forum.uit.edu.vn/"
            className="underline hover:text-blue-600"
          >
            https://forum.uit.edu.vn/
          </a>{" "}
          và gửi yêu cầu hỗ trợ.
        </p>
        <p className="text-lg">
          2. Gửi email cho phòng kỹ thuật:{" "}
          <span className="underline">19522009@gm.uit.edu.vn</span>
          {"."}
        </p>
        <p className="text-lg ">
          3. Gọi HOTLINE hỗ trợ khách hàng:{" "}
          <span className="underline">0987654321</span>
          {", "}
          <span className="underline">0123456789</span>
          {"."}
        </p>
        <button
          className="btn btn-md btn-blue"
          onClick={() => {
            dispatch(accountActions.logout());
            showLogoutNoti();
          }}
        >
          <span className="pr-1">
            <i className="fa-solid fa-right-from-bracket"></i>
          </span>
          <span>Đăng xuất</span>
        </button>
      </div>
      <img className="w-full sm:w-[40vw] " src="/home-img.jpg" />
    </div>
  );
}

export default Home;
