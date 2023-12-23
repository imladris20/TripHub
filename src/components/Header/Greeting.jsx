import useStore from "../../store/store";

const Greeting = () => {
  const { username } = useStore();

  return (
    <h1 className="max-w-[130px] overflow-hidden whitespace-nowrap p-1 text-[13px] leading-4 text-slate-500">
      <span className="inline-block max-w-full overflow-hidden text-ellipsis">
        哈囉！{username}，
      </span>
      <br />
      <span>想去哪裡玩呢</span>
    </h1>
  );
};

export default Greeting;
