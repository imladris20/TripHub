import { useState } from "react";
import { useMutation } from "react-query";
import useStore from "../../store/store";
import { nativeSignUp, setDocNewUser } from "../../utils/firebaseSDK";

const SignUp = ({ inputRef }) => {
  const [insertName, setInsertName] = useState("");
  const [insertEmail, setInsertEmail] = useState("");
  const [insertPassword, setInsertPassword] = useState("");
  const { database, setUsername } = useStore();

  const signUpMutation = useMutation(({ name, email, password }) =>
    nativeSignUp(name, email, password),
  );

  const setDocMutation = useMutation(({ name, email, uid, db }) => {
    setDocNewUser(name, email, uid, db);
  });

  const handleSignUpClicked = async (
    insertName,
    insertEmail,
    insertPassword,
  ) => {
    const user = await signUpMutation.mutateAsync({
      name: insertName,
      email: insertEmail,
      password: insertPassword,
    });

    await setDocMutation.mutateAsync({
      name: insertName,
      email: insertEmail,
      uid: user.uid,
      db: database,
    });

    localStorage.setItem("uid", user.uid);
    localStorage.setItem("username", user.displayName);

    setUsername(user.displayName);

    setInsertName("");
    setInsertEmail("");
    setInsertPassword("");
  };

  return (
    <div className="swap-on w-full">
      <form className="card-body w-[300px] px-0">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
          註冊
        </h1>
        <div className="form-control">
          <label className="label">
            <span className="label-text">姓名</span>
          </label>
          <input
            type="text"
            placeholder="請輸入完整姓名"
            value={insertName}
            onChange={(e) => setInsertName(e.target.value)}
            className="input input-bordered"
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">信箱</span>
          </label>
          <input
            type="email"
            placeholder="請輸入能確實收信的Email"
            value={insertEmail}
            className="input input-bordered"
            onChange={(e) => setInsertEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">密碼</span>
          </label>
          <input
            type="password"
            placeholder="最少須8個字"
            className="input input-bordered"
            value={insertPassword}
            onChange={(e) => setInsertPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-control mt-3 items-end">
          <button
            onClick={() =>
              handleSignUpClicked(insertName, insertEmail, insertPassword)
            }
            className={`btn w-full ${
              signUpMutation.isLoading ? "bg-red-200" : "bg-green-200"
            }`}
            disabled={signUpMutation.isLoading}
          >
            <h3 className="text-sm font-bold ">
              {signUpMutation.isLoading ? "註冊中..." : "送出"}
            </h3>
          </button>
          <label className="label mt-1">
            <h1
              className="link label-text-alt mt-3"
              onClick={() =>
                (inputRef.current.checked = !inputRef.current.checked)
              }
            >
              已經有帳號了嗎？點我登入
            </h1>
          </label>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
