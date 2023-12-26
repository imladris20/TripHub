import { useRef } from "react";
import { Link } from "react-router-dom";
import globalStore from "../../store/store";
import SignWindow from "./SignWindow";

const Home = () => {
  const { isLogin } = globalStore();

  const signRef = useRef();

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
            <>
              <button
                className="btn btn-primary h-16 w-auto rounded-lg border-none bg-green-200 p-4 text-xl text-slate-800"
                onClick={() => {
                  signRef.current.showModal();
                }}
              >
                登入以開始規劃
              </button>
              <dialog ref={signRef} className="modal">
                <SignWindow />
              </dialog>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
