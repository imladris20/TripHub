import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { nativeSignUp } from "../../utils/firebaseSDK";

const SignUp = () => {
  const [insertEmail, setInsertEmail] = useState("");
  const [insertPassword, setInsertPassword] = useState("");

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (data) => nativeSignUp(data.email, data.password),
    {
      onSuccess: () => {
        // 在成功時，刷新你的用戶資料查詢（如果有的話）
        queryClient.invalidateQueries("user");
      },
    },
  );

  const handleSignUpClicked = async () => {
    const user = await mutation.mutateAsync({
      email: insertEmail,
      password: insertPassword,
    });
    console.log(user);
    setInsertEmail("");
    setInsertPassword("");
  };

  return (
    <div className="flex h-full w-[400px] flex-col items-center justify-between">
      {/* <h1 className="text-2xl font-bold ">註冊</h1> */}
      <h1 className="text-2xl font-bold ">註冊</h1>
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
        onClick={() => handleSignUpClicked(insertEmail, insertPassword)}
        className={`h-10 w-auto px-4 py-2 ${
          mutation.isLoading ? "bg-red-200" : "bg-green-200"
        }`}
        disabled={mutation.isLoading}
      >
        <h3 className="text-sm font-bold ">
          {mutation.isLoading ? "註冊中..." : "送出"}
        </h3>
      </button>
    </div>
  );
};

export default SignUp;