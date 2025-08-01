import { useState } from "react";
import { useMutation } from "react-query";
import globalStore from "../../store/store";
import { nativeSignIn } from "../../utils/tripHubDb";
import { optimizeClassName } from "../../utils/util";

const SignIn = ({ inputRef }) => {
  const [insertEmail, setInsertEmail] = useState("demo@gmail.com");
  const [insertPassword, setInsertPassword] = useState("trytrysee");
  const { setUsername } = globalStore();

  const signInMutation = useMutation(nativeSignIn);

  const handleSignInClicked = async () => {
    const user = await signInMutation.mutateAsync({
      email: insertEmail,
      password: insertPassword,
    });

    localStorage.setItem("uid", user.uid);
    localStorage.setItem("username", user.displayName);
    setUsername(user.displayName);
    setInsertEmail("");
    setInsertPassword("");
  };

  const handleEmailInput = (e) => {
    setInsertEmail(e.target.value);
    signInMutation.reset();
  };

  const handlePasswordInput = (e) => {
    setInsertPassword(e.target.value);
    signInMutation.reset();
  };

  const swapSignInCard = () => {
    inputRef.current.checked = !inputRef.current.checked;
  };

  const signInBtnStyle = optimizeClassName([
    "btn",
    "w-full",
    {
      "bg-red-200": signInMutation.isLoading,
      "bg-green-200": !signInMutation.isLoading,
    },
  ]);

  return (
    <div className="swap-off w-full">
      <form className="card-body flex w-full px-0">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900">
          歡迎回來！
        </h1>
        {signInMutation.isError && (
          <h4 className="text-xs text-rose-900">帳號密碼似乎有錯喔</h4>
        )}
        <div className="form-control mt-10">
          <label className="label">
            <span className="label-text">信箱</span>
          </label>
          <input
            type="email"
            placeholder="email"
            value={insertEmail}
            className="input input-bordered"
            onChange={handleEmailInput}
            required
          />
        </div>
        <div className="form-control mt-4">
          <label className="label">
            <span className="label-text">密碼</span>
          </label>
          <input
            type="password"
            placeholder="password"
            className="input input-bordered"
            value={insertPassword}
            onChange={handlePasswordInput}
            required
          />
        </div>
        <div className="form-control mt-6 items-end">
          <button
            onClick={() => handleSignInClicked(insertEmail, insertPassword)}
            className={signInBtnStyle}
            disabled={signInMutation.isLoading}
          >
            <h3 className="text-sm font-bold ">
              {signInMutation.isLoading ? "登入中..." : "送出"}
            </h3>
          </button>
          <label className="label">
            <h1 className="link label-text-alt mt-3" onClick={swapSignInCard}>
              還沒有帳號嗎？點我註冊！
            </h1>
          </label>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
