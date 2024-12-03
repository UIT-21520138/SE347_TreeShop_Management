import Header from "./components/Header";
import Sidebar from "./components/Slidebar";

function DefaultLayout({ heading, children }) {
    return (
        <div className="flex h-screen flex-col sm:flex-row">
            <Sidebar></Sidebar>

            <div className="flex h-screen flex-1 flex-col">
                <Header>{heading}</Header>
                <main className="flex-1 p-5 sm:p-8 md:p-10">{children}</main>
            </div>
        </div>
    );
}

export default DefaultLayout;
