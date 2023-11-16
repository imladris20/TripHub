// import { Route, Routes } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useStore from "./store/store";

function App() {
  const { bears, increasePopulation, removeAllBears } = useStore();

  const wait = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };

  const { data, isLoading, status } = useQuery({
    queryKey: ["getPost"],
    queryFn: async () => {
      await wait(3000);
      const { data } = await axios.get(
        "https://jsonplaceholder.typicode.com/posts/1",
      );
      return data;
    },
  });

  return (
    <>
      {/* <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes> */}
      <p className="cursor-pointer font-mono text-2xl text-gray-500">
        {"Why don't you start your project?"}
      </p>
      <div className="mt-5 border border-solid border-gray-300 p-2">
        {`isLoading: ${isLoading}`}
      </div>
      <div className="mt-5 border border-solid border-gray-300 p-2">
        {`status: ${status}`}
      </div>
      <div className="mt-5 border border-solid border-gray-300 p-2">
        {isLoading ? "還在載入喔" : JSON.stringify(data.body)}
      </div>
      <div className="mt-5 border border-solid border-gray-300 p-2">
        <h2 className="my-3">Bears: {bears}</h2>
        <button
          className="mr-4 h-8 w-16 cursor-pointer bg-green-200 p-1"
          onClick={increasePopulation}
        >
          +1熊
        </button>
        <button
          className="mr-4 h-8 w-16 cursor-pointer bg-gray-200 p-1"
          onClick={removeAllBears}
        >
          歸零
        </button>
      </div>
    </>
  );
}

export default App;
