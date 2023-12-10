import { filter, sumBy } from "lodash";

const numberToChinese = (num) => {
  const chineseNumbers = [
    "零",
    "一",
    "二",
    "三",
    "四",
    "五",
    "六",
    "七",
    "八",
    "九",
  ];
  const chineseTenMultiples = [
    "",
    "十",
    "二十",
    "三十",
    "四十",
    "五十",
    "六十",
    "七十",
    "八十",
    "九十",
  ];

  if (num < 10) {
    return chineseNumbers[num];
  } else if (num < 20) {
    return `十${chineseNumbers[num % 10]}`;
  } else {
    return `${chineseTenMultiples[Math.floor(num / 10)]}${
      chineseNumbers[num % 10]
    }`;
  }
};

const addDaysToDate = (dateString, days) => {
  const newStr = new Date(dateString);
  newStr.setDate(newStr.getDate() + days);

  const year = newStr.getFullYear();
  const month = String(newStr.getMonth() + 1).padStart(2, "0");
  const date = String(newStr.getDate()).padStart(2, "0");

  const dayOfWeekIndex = newStr.getDay();

  const daysOfWeek = ["日", "一", "二", "三", "四", "五", "六"];

  const day = daysOfWeek[dayOfWeekIndex];

  return `${year}/${month}/${date} (${day})`;
};

const Day = ({ trip, daySequence }) => {
  // console.log(trip);

  const filterArr = filter(trip.attractions, { daySequence: daySequence });
  const sum = sumBy(filterArr, (item) => parseInt(item.expense) || 0);

  return (
    <>
      <div className="divider-gray divider"></div>
      <div className="collapse collapse-arrow bg-base-200">
        <input type="checkbox" className="peer" defaultChecked={true} />
        <div className="collapse-title flex flex-row items-center gap-10 bg-primary text-white peer-checked:bg-secondary peer-checked:text-secondary-content">
          <h1 className="font-bold">{`第${numberToChinese(
            daySequence + 1,
          )}天：${addDaysToDate(trip.startDate, daySequence)}`}</h1>
          <h1>當日預計花費：{sum}元</h1>
        </div>
        <div className="collapse-content bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content">
          <p>hello</p>
        </div>
      </div>
    </>
  );
};

export default Day;
