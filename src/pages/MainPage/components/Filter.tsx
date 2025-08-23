import BtcLogo from "@/assets/images/btc-logo.svg?react";
import BtoLogo from "@/assets/images/bto-logo.svg?react";
import BmcLogo from "@/assets/images/bmc-logo.svg?react";
import BiscoLogo from "@/assets/images/bisco-logo.svg?react";
import BecoLogo from "@/assets/images/beco-logo.svg?react";

const Filter = () => {
  return (
    <div className="flex flex-col space-y-[50px]">
      <ul className="grid grid-cols-3 gap-6 lg:grid-cols-6">
        <li>
          <button className="grid h-25 w-full place-content-center rounded-[10px] bg-linear-330 from-[#0072D6] to-[#00A7C9]">
            <span className="text-xl font-bold text-white">전체</span>
          </button>
        </li>
        <li>
          <button className="grid h-25 w-full place-content-center rounded-[10px] border-1 border-gray-200 px-[10px] transition-all duration-200 hover:bg-gray-50">
            <BtcLogo className="w-full" />
          </button>
        </li>
        <li>
          <button className="grid h-25 w-full place-content-center rounded-[10px] border-1 border-gray-200 px-[10px] transition-all duration-200 hover:bg-gray-50">
            <BtoLogo className="w-full" />
          </button>
        </li>
        <li>
          <button className="grid h-25 w-full place-content-center rounded-[10px] border-1 border-gray-200 px-[10px] transition-all duration-200 hover:bg-gray-50">
            <BmcLogo className="w-full" />
          </button>
        </li>
        <li>
          <button className="grid h-25 w-full place-content-center rounded-[10px] border-1 border-gray-200 px-[10px] transition-all duration-200 hover:bg-gray-50">
            <BiscoLogo className="w-full" />
          </button>
        </li>
        <li>
          <button className="grid h-25 w-full place-content-center rounded-[10px] border-1 border-gray-200 px-[10px] transition-all duration-200 hover:bg-gray-50">
            <BecoLogo className="w-full" />
          </button>
        </li>
      </ul>
      <div className="h-25 rounded-[10px] bg-blue-100 p-5">필터링</div>
    </div>
  );
};

export default Filter;
