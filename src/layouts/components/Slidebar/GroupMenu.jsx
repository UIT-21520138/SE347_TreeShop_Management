import { useState } from "react";
import { Link, NavLink, useLocation, useMatch } from "react-router-dom";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { accountSelector } from "../../../redux/selectors";

function GroupMenu({ groupMenu, setIsSidebarOpen }) {
  const [isOpen, setIsOpen] = useState(false);
  let MainComp = groupMenu.children ? 'div' : Link;
  const account = useSelector(accountSelector);
  const isHiddenItem = (functionName) => {
    if (!account) {
      return true;
    }

    if(account.role === 'Admin' || account.role === 'Chủ'){
      return false;
    }

    if (account?.role === "Staff") {
      const menuText = groupMenu.main?.text;
      if (menuText === "Tài khoản" || menuText === "Chức vụ") {
        return true;
      }
      return false;
    }

    if (!functionName) {
      return false;
    }
    
    const findResult = account?.functions?.find(
      (_func) => _func?.name === functionName
    );
    return !findResult;
  };

  const isHiddenParent = () => {
    if (!groupMenu.children) {
      return isHiddenItem(groupMenu.main?.functionName);
    } else {
      const filterResult = groupMenu.children?.filter((item) => !isHiddenItem(item.functionName));
      if (filterResult.length === 0) {
        return true;
      }
    }
    return false;
  };

  // Kiểm tra xem menu có bị ẩn không trước khi trả về JSX
  if (isHiddenParent()) {
    return null; // Trả về null nếu menu bị ẩn
  }
  const location = useLocation();
  const pathFirst = location.pathname.split('/')[1];
  const mainPath = groupMenu.main.link.split('/')[1];
  
  return (
    <li
      className={clsx({
        '!hidden': isHiddenParent(),
      })}
    >
      <MainComp
        className={clsx(
          'flex cursor-pointer select-none items-center justify-between rounded-md px-4 py-3 text-white hover:bg-green-400',
          {
            'hover:bg-green-400': pathFirst !== mainPath,
            'bg-green-400': pathFirst === mainPath,
          }
        )}
        onClick={() => {
          if (groupMenu.children) {
            setIsOpen(!isOpen);
          } else if (setIsSidebarOpen) {
            setIsSidebarOpen(false);
          }
        }}
        to={!groupMenu.children ? groupMenu.main?.link : undefined}
      >
        <div className="flex items-center">
          <span className="pr-2">
            <i className={groupMenu.main.iconClassname}></i>
          </span>
          <span className="select-none font-medium">{groupMenu.main.text}</span>
        </div>
        {groupMenu.children && (
          <span className={clsx('transition', { 'rotate-90': isOpen })}>
            <i className="fa-solid fa-chevron-right"></i>
          </span>
        )}
      </MainComp>
      {groupMenu.children && isOpen && (
        <div className="space-y-2">
          {groupMenu.children.map((item, index) => (
            <NavLink
              key={index}
              className={({ isActive }) =>
                clsx('flex cursor-pointer items-center pl-10 pr-3 text-white hover:underline', {
                  'font-semibold underline': isActive,
                  '!hidden': isHiddenItem(item?.functionName),
                })
              }
              to={groupMenu.main.link + item.link}
              onClick={() => setIsSidebarOpen(false)}
            >
              <span className="pr-2">
                <i className={item.iconClassname}></i>
              </span>
              <span>{item.text}</span>
            </NavLink>
          ))}
        </div>
      )}
    </li>
  );
  
}

export default GroupMenu;
