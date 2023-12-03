import { useState } from "react";
import { useMutation } from "react-query";
import useStore from "../../store/store";
import { nativeSignUp, setDocNewUser } from "../../utils/firebaseSDK";

const SignUp = () => {
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
    <div className="flex h-full w-[400px] flex-col items-center justify-between">
      <h1 className="text-2xl font-bold ">註冊</h1>
      <div className="justify-betwee flex h-10 w-full flex-row items-center gap-4">
        <h2 className="whitespace-nowrap">姓名</h2>
        <input
          type="text"
          className="w-full border border-solid border-gray-500 pl-2"
          value={insertName}
          onChange={(e) => setInsertName(e.target.value)}
        />
      </div>
      <div className="justify-betwee flex h-10 w-full flex-row items-center gap-4">
        <h2 className="whitespace-nowrap">信箱</h2>
        <input
          type="email"
          className="w-full border border-solid border-gray-500 pl-2"
          value={insertEmail}
          onChange={(e) => setInsertEmail(e.target.value)}
        />
      </div>
      <div className="justify-betwee flex h-10 w-full flex-row items-center gap-4">
        <h2 className="whitespace-nowrap">密碼</h2>
        <input
          type="password"
          className="w-full border border-solid border-gray-500 pl-2"
          value={insertPassword}
          onChange={(e) => setInsertPassword(e.target.value)}
        />
      </div>

      <button
        onClick={() =>
          handleSignUpClicked(insertName, insertEmail, insertPassword)
        }
        className={`h-10 w-auto px-4 py-2 ${
          signUpMutation.isLoading ? "bg-red-200" : "bg-green-200"
        }`}
        disabled={signUpMutation.isLoading}
      >
        <h3 className="text-sm font-bold ">
          {signUpMutation.isLoading ? "註冊中..." : "送出"}
        </h3>
      </button>
    </div>
  );
};

export default SignUp;
