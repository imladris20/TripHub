import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/logo.png";
import useStore from "../../store/store";
import Profile from "./Profile";

const Header = () => {
  const { isLogin } = useStore();
  const currentPath = useLocation().pathname;
  let initialActiveTag;
  switch (currentPath) {
    case "/search": {
      initialActiveTag = 1;
      break;
    }
    case "/pois": {
      initialActiveTag = 2;
      break;
    }
    case "/schedule": {
      initialActiveTag = 3;
      break;
    }
    default: {
      initialActiveTag = null;
    }
  }
  const [activePageTag, setActivePageTag] = useState(initialActiveTag);

  return (
    <header className="relative z-50 flex h-16 w-full flex-row items-center gap-4 border-b-2 border-solid border-gray-200 bg-white px-4">
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
        <button className="w-20 rounded bg-white px-2 py-1 text-xs text-white">
          練習頁面
        </button>
      </Link>
      {isLogin && <Profile />}
    </header>
  );
};

export default Header;
