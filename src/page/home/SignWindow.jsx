import useStore from "../../store/store";
import { CloseIcon } from "../../utils/icons";
import SignUp from "./SignUp";
import SignIn from "./SingIn";

const SingWindow = () => {
  const { isLogin, isSignWindowOpen, setIsSignWindowOpen } = useStore();
  return (
    <div className="flex-start absolute left-1/2 top-1/2 z-50 flex h-1/2 w-auto -translate-x-1/2 -translate-y-1/2 flex-row items-center gap-10 rounded-2xl border border-dotted border-red-300 bg-white p-10 opacity-95">
      <button
        className="absolute right-2 top-2 h-8 w-8"
        onClick={() => setIsSignWindowOpen(false)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="stroke-slate-600 stroke-2"
        >
          <CloseIcon />
        </svg>
      </button>
      <SignUp />
      <div className="h-full w-[1px] bg-slate-600"></div>
      <SignIn />
    </div>
  );
};

export default SingWindow;
