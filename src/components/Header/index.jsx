import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/logo.png";
import useStore from "../../store/store";
import UserHeader from "./UserHeader";

const Header = () => {
  const { isLogin } = useStore();
  const currentPath = useLocation().pathname;
  const [activePageTag, setActivePageTag] = useState(null);

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

  return (
    <header className="relative z-50 flex h-16 w-full flex-row items-center gap-4 border-b-2 border-solid border-gray-200 bg-white px-4">
      <Link to="/" className="m-0 h-11 w-11 cursor-pointer p-0">
        <div onClick={() => setActivePageTag(null)}>
          <img src={Logo} alt="logo" className="h-11 w-11"></img>
        </div>
      </Link>
      {isLogin && (
        <UserHeader
          activePageTag={activePageTag}
          setActivePageTag={setActivePageTag}
        />
      )}
    </header>
  );
};

export default Header;
