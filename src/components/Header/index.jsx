import { Link } from "react-router-dom";
import Logo from "../../assets/logo.png";

const Header = () => {
  return (
    <header className="mb-3 flex h-16 w-full flex-row items-center gap-4 bg-gray-200 px-4">
      <Link to="/" className="cursor-pointer">
        <img src={Logo} alt="logo" className="h-12 w-12"></img>
      </Link>
      <Link to="/search">
        <button className="w-20 rounded bg-emerald-400 px-2 py-1 text-xs text-[#001a23]">
          搜尋景點
        </button>
      </Link>
      <Link to="/pois">
        <button className="w-20 rounded bg-green-100 px-2 py-1 text-xs text-[#001a23]">
          口袋名單
        </button>
      </Link>
      <Link to="/schedule">
        <button className="w-20 rounded bg-green-100 px-2 py-1 text-xs text-[#001a23]">
          行程規劃
        </button>
      </Link>
      <Link to="/practice">
        <button className="w-20 rounded bg-green-100 px-2 py-1 text-xs text-[#001a23]">
          練習頁面
        </button>
      </Link>
    </header>
  );
};

export default Header;
