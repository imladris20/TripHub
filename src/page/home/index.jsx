import { Link } from "react-router-dom";
import useStore from "../../store/store";
import SignWindow from "./SignWindow";

const Home = () => {
  const { isLogin, isSignWindowOpen, setIsSignWindowOpen } = useStore();

  return (
    <div className="relative flex h-[calc(100vh-64px)] w-full flex-col items-center justify-center gap-8 bg-[url('/welcome.jpg')] bg-cover bg-no-repeat">
      <div className="flex h-full w-full flex-row items-center justify-center bg-gradient-to-b from-white to-transparent">
        <div className="flex flex-col items-center justify-start gap-7">
          <h1 className="text-center text-4xl font-bold">
            TripHub 讓你規劃行程從未如此輕鬆！
          </h1>
          {isLogin ? (
            <Link to="/search">
              <button className="btn btn-primary h-16 w-auto rounded-lg border-none bg-green-200 p-4 text-xl text-slate-800">
                點我開始規劃
              </button>
            </Link>
          ) : (
            <button
              className="btn btn-primary h-16 w-auto rounded-lg border-none bg-green-200 p-4 text-xl text-slate-800"
              onClick={() => {
                setIsSignWindowOpen(true);
              }}
            >
              點我登入或註冊以開始規劃
            </button>
          )}
        </div>
      </div>
      {isSignWindowOpen && <SignWindow />}
    </div>
  );
};

export default Home;
