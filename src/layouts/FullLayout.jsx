import Header from "./components/Header";
import Sidebar from "./components/Slidebar";

function FullLayout({ children }) {
    return (
        <div className="flex-1 p-5 sm:p-8 md:p-10">
            {children}
        </div>
    );
}

export default FullLayout;
