import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import globalStore from "../../store/store";
import { db, nativeSignUp } from "../../utils/tripHubDb";
import { signUpValidation } from "../../utils/yupValidations";

const SignUp = ({ inputRef }) => {
  const { setUsername } = globalStore();

  const signUpMutation = useMutation(nativeSignUp);
  const setDocMutation = useMutation(({ name, uid, email }) => {
    db.setNewDocByAssignedId("newUser", uid, { name, email });
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
    resolver: yupResolver(signUpValidation),
  });

  const swapSignUpCard = () => {
    inputRef.current.checked = !inputRef.current.checked;
  };

  return (
    <div className="swap-on w-full">
      <form
        className="card-body w-[300px] px-0"
        onSubmit={handleSubmit(handleSignUpClicked)}
      >
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
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
            <h1 className="link label-text-alt mt-3" onClick={swapSignUpCard}>
              已經有帳號了嗎？點我登入
            </h1>
          </label>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
