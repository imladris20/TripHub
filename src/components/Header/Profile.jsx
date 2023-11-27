import { nativeSignOut } from "../../utils/firebaseSDK";
import { ProfileIcon, SignOutIcon } from "../../utils/icons";

const Profile = () => {
  return (
    <div className="ml-auto flex h-6 w-auto flex-row items-center gap-4">
      <button>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="h-8 w-8 fill-sky-400"
        >
          <ProfileIcon />
        </svg>
      </button>
      <button
        onClick={() => {
          nativeSignOut();
          localStorage.removeItem("uid");
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
