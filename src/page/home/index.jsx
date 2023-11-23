import { useState } from "react";
import useStore from "../../store/store";
import { initFirebase } from "../../utils/firebaseSDK";

const Home = () => {
  const { isLogin } = useStore();
  const [isFbInited, setIsFbInited] = useState(false);

  console.log(initFirebase);

  // useEffect(() => {
  //   if (!isFbInited) {
  //     const { app, analytics } = initFirebase();
  //     setIsFbInited(true);
  //     console.log(app, analytics);
  //   }
  // }, []);

  return (
    <div className="flex h-[calc(100vh-64px)] w-full flex-col items-center justify-center gap-8 bg-[url('./welcome.jpg')] bg-cover bg-no-repeat">
      <div className="flex h-full w-full flex-row items-center justify-center bg-gradient-to-b from-white to-transparent">
        <div className="flex flex-col items-center justify-start gap-7">
          <h1 className="text-center text-4xl font-bold">
            TribHub 讓你規劃行程從未如此輕鬆！
          </h1>
          <button className="h-16 w-auto rounded-lg bg-green-200 p-4 text-xl text-slate-800">
            {isLogin ? "點我開始規劃" : "登入或註冊以開始規劃"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
