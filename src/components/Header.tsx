import { useLocation, useNavigate } from "react-router-dom";
import logoHeader from "@/assets/images/logo-header.svg";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClickLogo = () => {
    if (location.pathname === "/") {
      window.location.reload();
    } else {
      navigate("/");
    }
  };

  return (
    <header className="sticky top-0 z-999 border-b-1 border-solid border-gray-200 bg-white">
      <div className="max-w-[1440px] mx-auto h-[60px] flex items-center justify-center lg:justify-between px-5 2xl:px-0">
        <button onClick={handleClickLogo}>
          <img src={logoHeader} alt="로고" className="h-[30px] w-auto" />
        </button>
      </div>
    </header>
  );
};

export default Header;
