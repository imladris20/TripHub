import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo.png";

const Header = () => {
  const [activePageTag, setActivePageTag] = useState();

  return (
    <header className="flex h-16 w-full flex-row items-center gap-4 bg-gray-200 px-4">
      <Link to="/" className="cursor-pointer">
        <button onClick={() => setActivePageTag(null)}>
          <img src={Logo} alt="logo" className="h-11 w-11"></img>
        </button>
      </Link>
      <Link to="/search">
        <button
          className={`w-20 rounded px-2 py-1 text-xs text-[#001a23] ${
            activePageTag === 1 ? "bg-emerald-400" : "bg-green-100"
          }`}
          onClick={() => setActivePageTag(1)}
        >
          搜尋景點
        </button>
      </Link>
      <Link to="/pois">
        <button
          className={`w-20 rounded px-2 py-1 text-xs text-[#001a23] ${
            activePageTag === 2 ? "bg-emerald-400" : "bg-green-100"
          }`}
          onClick={() => setActivePageTag(2)}
        >
          口袋名單
        </button>
      </Link>
      <Link to="/schedule">
        <button
          className={`w-20 rounded px-2 py-1 text-xs text-[#001a23] ${
            activePageTag === 3 ? "bg-emerald-400" : "bg-green-100"
          }`}
          onClick={() => setActivePageTag(3)}
        >
          行程規劃
        </button>
      </Link>
      <Link to="/practicing">
        <button className="w-20 rounded bg-gray-200 px-2 py-1 text-xs text-gray-200">
          練習頁面
        </button>
      </Link>
    </header>
  );
};

export default Header;
