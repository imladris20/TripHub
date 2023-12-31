import { filter, sumBy } from "lodash";
import { numberToChinese } from "../../utils/timeUtil";
import TimeCard from "./TimeCard";

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
  const matchDayAttraction = filter(trip.attractions, {
    daySequence: daySequence + 1,
  });
  const sum = sumBy(matchDayAttraction, (item) => parseInt(item.expense) || 0);

  return (
    <>
      <div className="divider-gray divider"></div>
      <div className="collapse collapse-arrow bg-base-200">
        <input type="checkbox" className="peer" defaultChecked={true} />
        <div className="collapse-title flex flex-row items-center gap-10 bg-primary text-white peer-checked:bg-secondary peer-checked:text-secondary-content">
          <h1 className="text-xl font-bold">{`第${numberToChinese(
            daySequence + 1,
          )}天：${addDaysToDate(trip.startDate, daySequence)}`}</h1>
          <h1 className="text-xl">當日預計總花費：{sum}元</h1>
        </div>
        <div className="collapse-content bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content">
          <ul className="timeline timeline-vertical timeline-snap-icon max-md:timeline-compact">
            {matchDayAttraction.map((item, index, arr) => {
              if (item.inDayOrder !== 0) {
                return (
                  <TimeCard
                    key={index}
                    trip={trip}
                    attraction={item}
                    cardOrder={item.inDayOrder}
                    isLastOne={arr.length === index + 1}
                    dayStartTime={trip.startTime[daySequence].value}
                    wholeDay={arr}
                  />
                );
              }
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Day;
