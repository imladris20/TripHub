import { useNavigate } from "react-router-dom";
import useStore from "../../store/store";
import { nativeSignOut } from "../../utils/firebaseSDK";
import { ProfileIcon, SignOutIcon } from "../../utils/icons";

const Profile = () => {
  const { username, setUsername } = useStore();
  const navigate = useNavigate();

  return (
    <div className="ml-auto flex h-6 w-auto flex-row items-center gap-4">
      {username && location.pathname !== "/schedule" && (
        <h1 className="max-w-[130px] overflow-hidden whitespace-nowrap p-1 text-[13px] leading-4 text-slate-500">
          <span className="inline-block max-w-full overflow-hidden text-ellipsis">
            哈囉！{username}，
          </span>
          <br />
          <span>想去哪裡玩呢</span>
        </h1>
      )}
      <button>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="h-8 w-8 fill-slate-500"
        >
          <ProfileIcon />
        </svg>
      </button>
      <button
        onClick={() => {
          nativeSignOut();
          localStorage.removeItem("uid");
          localStorage.removeItem("username");
          setUsername(null);
          navigate("/");
        }}
      >
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
