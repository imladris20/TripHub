import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/logo.png";
import ScheduleHeader from "../../page/Schedule/Header";
import useStore, { scheduleStore } from "../../store/store";
import Profile from "./Profile";

const Header = () => {
  const { isLogin } = useStore();
  const { currentLoadingTripData } = scheduleStore();
  const currentPath = useLocation().pathname;
  useEffect(() => {
    switch (location.pathname) {
      case "/search":
        setActivePageTag(1);
        break;
      case "/pois":
        setActivePageTag(2);
        break;
      case "/schedule":
        setActivePageTag(3);
        break;
      default:
        setActivePageTag(null);
    }
  }, [currentPath]);
  const [activePageTag, setActivePageTag] = useState(null);

  return (
    <header className="relative z-50 flex h-16 w-full flex-row items-center gap-4 border-b-2 border-solid border-gray-200 bg-white px-4">
      <Link to="/" className="m-0 h-11 w-11 cursor-pointer p-0">
        <button onClick={() => setActivePageTag(null)}>
          <img src={Logo} alt="logo" className="h-11 w-11"></img>
        </button>
      </Link>
      {isLogin && (
        <>
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
          {location.pathname === "/schedule" && currentLoadingTripData && (
            <ScheduleHeader />
          )}
        </>
      )}

      {/* <Link to="/practicing">
        <button className="w-20 rounded bg-white px-2 py-1 text-xs text-white">
          練習頁面
        </button>
      </Link> */}
      {isLogin && <Profile />}
    </header>
  );
};

export default Header;
