import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Outlet } from "react-router-dom";

const BaseLayout = () => {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="mx-auto min-h-screen max-w-[1440px]">
        <Outlet />
      </div>
      <Footer />
    </main>
  );
};

export default BaseLayout;
