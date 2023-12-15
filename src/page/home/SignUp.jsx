import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as yup from "yup";
import useStore from "../../store/store";
import { nativeSignUp, setDocNewUser } from "../../utils/firebaseSDK";

const SignUp = ({ inputRef }) => {
  const { database, setUsername } = useStore();

  const signUpMutation = useMutation(({ name, email, password }) =>
    nativeSignUp(name, email, password),
  );

  const setDocMutation = useMutation(({ name, email, uid, db }) => {
    setDocNewUser(name, email, uid, db);
  });

  const validation = yup.object({
    fullName: yup.string().max(5, "長度不得超過5").required("欄位不得為空"),
    email: yup.string().email("email 格式有誤").required("欄位不得為空"),
    password: yup.string().min(8, "密碼不得少於8個字").required("欄位不得為空"),
  });

  const handleSignUpClicked = async (values) => {
    const { fullName, email, password } = values;
    const user = await signUpMutation.mutateAsync({
      name: fullName,
      email,
      password,
    });
    await setDocMutation.mutateAsync({
      name: fullName,
      email,
      uid: user.uid,
      db: database,
    });

    localStorage.setItem("uid", user.uid);
    localStorage.setItem("username", user.displayName);

    setUsername(user.displayName);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validation),
  });

  return (
    <div className="swap-on w-full">
      <form
        className="card-body w-[300px] px-0"
        onSubmit={handleSubmit(handleSignUpClicked)}
      >
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
            className="input input-bordered"
            required
            {...register("fullName")}
          />
          {errors?.fullName && (
            <h4 className="mt-2 text-right text-xs text-rose-900">
              {errors.fullName.message}
            </h4>
          )}
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">信箱</span>
          </label>
          <input
            type="text"
            placeholder="請輸入能確實收信的Email"
            className="input input-bordered"
            required
            {...register("email")}
            onChange={() => signUpMutation.reset()}
          />
          {errors?.email && (
            <h4 className="mt-2 text-right text-xs text-rose-900">
              {errors.email.message}
            </h4>
          )}
          {signUpMutation.isError && (
            <h4 className="mt-2 text-right text-xs text-rose-900">
              此信箱已經有人註冊
            </h4>
          )}
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">密碼</span>
          </label>
          <input
            type="password"
            placeholder="最少須8個字"
            className="input input-bordered"
            required
            {...register("password")}
          />
          {errors?.password && (
            <h4 className="mt-2 text-right text-xs text-rose-900">
              {errors.password.message}
            </h4>
          )}
        </div>
        <div className="form-control mt-3 items-end">
          <button
            type="submit"
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
