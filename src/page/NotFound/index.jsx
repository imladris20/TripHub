import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="relative flex h-[calc(100vh-64px)] w-full flex-col items-center justify-center gap-8 bg-[url('/welcome.jpg')] bg-cover bg-no-repeat">
      <div className="flex h-full w-full flex-row items-center justify-center bg-gradient-to-b from-white to-transparent">
        <div className="flex flex-col items-center justify-start gap-7">
          <h1 className="text-center text-4xl font-bold">
            您似乎到了不存在的網址唷！
          </h1>

          <Link to="/">
            <button className="btn btn-primary h-16 w-auto rounded-lg border-none bg-green-200 p-4 text-xl text-slate-800">
              點我回首頁
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
