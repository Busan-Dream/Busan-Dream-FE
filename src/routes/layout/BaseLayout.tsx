import Header from "@/components/Header";
import { Outlet } from "react-router-dom";

const BaseLayout = () => {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="mx-auto min-h-screen max-w-[1440px]">
        <Outlet />
      </div>
    </main>
  );
};

export default BaseLayout;
