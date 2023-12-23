import { useLocation, useNavigate } from "react-router-dom";
import useStore from "../../store/store";
import { nativeSignOut } from "../../utils/firebaseSDK";
import { SignOutIcon } from "../../utils/icons";
import Greeting from "./Greeting";

const Profile = () => {
  const { setUsername } = useStore();
  const navigate = useNavigate();
  const currentPath = useLocation().pathname;

  const signOut = () => {
    nativeSignOut();
    localStorage.removeItem("uid");
    localStorage.removeItem("username");
    setUsername(null);
    navigate("/");
  };

  return (
    <div className="ml-auto flex h-6 w-auto flex-row items-center gap-4">
      {currentPath !== "/schedule" && <Greeting />}
      <button onClick={signOut}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="h-8 w-8 stroke-slate-500 stroke-[32]"
        >
          <SignOutIcon />
        </svg>
      </button>
    </div>
  );
};

export default Profile;
