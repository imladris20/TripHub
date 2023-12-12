import { useRef } from "react";
import SignUp from "./SignUp";
import SignIn from "./SingIn";

const SingWindow = () => {
  const inputRef = useRef();
  return (
    <div className="card modal-box flex w-full max-w-sm shrink-0 flex-row justify-center bg-base-100 shadow-2xl">
      <form method="dialog">
        <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
          ✕
        </button>
      </form>
      <label className="swap swap-flip w-full cursor-default text-9xl">
        <input
          type="checkbox"
          className="w-full cursor-default"
          ref={inputRef}
        />
        <SignIn inputRef={inputRef} />
        <SignUp inputRef={inputRef} />
      </label>
    </div>
  );
};

export default SingWindow;
