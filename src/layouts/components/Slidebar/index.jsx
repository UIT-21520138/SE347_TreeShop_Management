import GroupMenu from './GroupMenu';
import { useDispatch, useSelector } from 'react-redux';
import { accountActions } from '../../../redux/slices/accountSlice';
import { accountSelector } from '../../../redux/selectors';
import { toast } from 'react-toastify';
import { useMediaQuery } from 'react-responsive';
import { useState } from 'react';

const groupMenus = [
    {
        main: {
            iconClassname: 'fa-solid fa-house',
            text: 'Tổng quan',
            link: '/',
        },
    },
    {
        main: {
            iconClassname: 'fa-solid fa-clipboard',
            text: 'Hoá đơn',
            link: '/order',
        },
        children: [
            {
                iconClassname: 'fa-solid fa-list',
                text: 'Danh sách',
                link: '/',
                functionName: 'order/read',
            },
            {
                iconClassname: 'fa-solid fa-circle-plus',
                text: 'Thêm',
                link: '/add',
                functionName: 'order/create',
            },
            {
                iconClassname: 'fa-solid fa-table',
                text: 'Thống kê',
                link: '/statistic',
                functionName: 'order/statistc',
            },
        ],
    },
    {
        main: {
            iconClassname: 'fa-solid fa-box-open',
            text: 'Sản phẩm',
            link: '/product',
        },
        children: [
            {
                iconClassname: 'fa-solid fa-list',
                text: 'Danh sách',
                link: '/',
                functionName: 'product/read',
            },
            {
                iconClassname: 'fa-solid fa-circle-plus',
                text: 'Thêm',
                link: '/add',
                functionName: 'product/create',
            },
        ],
    },

    {
        main: {
            iconClassname: 'fa-solid fa-boxes-stacked',
            text: 'Loại sản phẩm',
            link: '/product-type',
        },
        children: [
            {
                iconClassname: 'fa-solid fa-list',
                text: 'Danh sách',
                link: '/',
                functionName: 'product-type/read',
            },
            {
                iconClassname: 'fa-solid fa-circle-plus',
                text: 'Thêm',
                link: '/add',
                functionName: 'product-type/create',
            },
        ],
    },
    {
        main: {
            iconClassname: 'fa-solid fa-users',
            text: 'Khách hàng',
            link: '/customer',
        },
        children: [
            {
                iconClassname: 'fa-solid fa-list',
                text: 'Danh sách',
                link: '/',
                functionName: 'customer/read',
            },
            {
                iconClassname: 'fa-solid fa-circle-plus',
                text: 'Thêm',
                link: '/add',
                functionName: 'customer/create',
            },
        ],
    },

    {
        main: {
            iconClassname: ' fa-solid fa-user',
            text: 'Tài khoản',
            link: '/account',
        },
        children: [
            {
                iconClassname: 'fa-solid fa-list',
                text: 'Danh sách',
                link: '/',
                functionName: 'account/read',
            },
            {
                iconClassname: 'fa-solid fa-circle-plus',
                text: 'Thêm',
                link: '/add',
                functionName: 'account/create',
            },
        ],
    },

    {
        main: {
            iconClassname: 'fa-solid fa-clipboard',
            text: 'Chức vụ',
            link: '/role',
        },
        children: [
            {
                iconClassname: 'fa-solid fa-list',
                text: 'Danh sách',
                link: '/',
                functionName: 'role/read',
            },
            {
                iconClassname: 'fa-solid fa-circle-plus',
                text: 'Thêm',
                link: '/add',
                functionName: 'role/create',
            },
        ],
    },
];

function Sidebar() {
    const dispatch = useDispatch();
    const account = useSelector(accountSelector);
    const showLogoutNoti = () => toast.info('Đã đăng xuất!');
    const isSmallScreen = useMediaQuery({ query: '(max-width: 640px)' });

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return isSmallScreen ? (
        <>
        <header className="flex h-16 w-screen items-center justify-between px-2" style={{backgroundColor: '#005745'}}>
            <div className="text-lg font-extrabold text-white">THE GREEN</div>
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                className="h-6 w-6 text-white cursor-pointer mr-4" 
                onClick={() => setIsSidebarOpen(true)}
            >
                <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 6h16M4 12h16M4 18h16" 
                />
            </svg>
        </header>
        {isSidebarOpen && (
            <div className="sidebar fixed top-0 left-0 w-screen h-full" style={{backgroundColor: '#054004'}}>
                <div className="sm:w-16 md:w-64 flex flex-col" style={{backgroundColor: '#406442'}}>
                <header className="mb-8 flex h-16 w-full select-none items-center justify-center text-white bg-white">
                    <div className="bg-white rounded-full p-6 border border-gray-300">
                        <img src="./../Logo.png" alt="Logo" className="h-24 w-auto" />
                    </div>
                </header>

                    <ul className="flex flex-1 select-none flex-col space-y-0.5 p-2 " style={{ overflowY: 'overlay', backgroundColor: '#84bb54' }}>
                    {groupMenus.map((groupMenu, index) => (
                        <GroupMenu key={index} groupMenu={groupMenu} setIsSidebarOpen={setIsSidebarOpen} />
                    ))}
                    </ul>

                    <div className="w-full border-t border-white p-3 text-white">
                        <div className="mb-2">
                            <p className="font-bold">{account?.name}</p>
                            <p className="text-sm">{account?.role?.name}</p>
                        </div>
                        <button
                            className="btn btn-md w-full border border-white"
                            onClick={() => {
                                dispatch(accountActions.logout());
                                showLogoutNoti();
                            }}
                        >
                            Đăng xuất
                        </button>
                    </div>
                    <button
                        className="absolute top-0 right-0 m-4 btn btn-sm hover:bg-green-400"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-black">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        )}
        
        </>
    ) : (
        <div className="md:min-w-16 lg:min-w-[240px] flex flex-col" style={{backgroundColor: '#007e64 '}}>
            <header className="mb-8 flex h-16 w-full select-none items-center justify-center text-white bg-white">
                <div className="bg-white rounded-full p-6 border border-gray-300">
                    <img src="./../Logo.png" alt="Logo" className="h-24 w-auto" />
                </div>
            </header>

            <ul className="flex flex-1 select-none flex-col space-y-0.5 p-2 " style={{ overflowY: 'overlay'}}>
                {groupMenus.map((groupMenu, index) => (
                    <GroupMenu key={index} groupMenu={groupMenu} />
                ))}
            </ul>

            <div className="w-full border-t border-white p-3 text-white">
                <div className="mb-2">
                    <p className="font-bold">{account?.name}</p>
                    <p className="text-sm">{account?.role?.name}</p>
                </div>
                <button
                    className="btn btn-md w-full border border-white hover:bg-green-400"
                    onClick={() => {
                        dispatch(accountActions.logout());
                        showLogoutNoti();
                    }}
                >
                    Đăng xuất
                </button>
            </div>
        </div>
    );
}

export default Sidebar;
