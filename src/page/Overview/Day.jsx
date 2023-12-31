import { filter, sumBy } from "lodash";
import { addDaysToDate, numberToChinese } from "../../utils/timeUtil";
import TimeCard from "./TimeCard";

const Day = ({ trip, daySequence }) => {
  const matchDayAttraction = filter(trip.attractions, {
    daySequence: daySequence + 1,
  });
  const sum = sumBy(matchDayAttraction, (item) => parseInt(item.expense) || 0);

  const displayDaySequence = numberToChinese(daySequence + 1);
  const correctDate = addDaysToDate(trip.startDate, daySequence);
  const displayDateTitle = `第${displayDaySequence}天：${correctDate}`;

  return (
    <>
      <div className="divider-gray divider"></div>
      <div className="collapse collapse-arrow bg-base-200">
        <input type="checkbox" className="peer" defaultChecked={true} />
        <div className="collapse-title flex flex-row items-center gap-10 bg-primary text-white peer-checked:bg-secondary peer-checked:text-secondary-content">
          <h1 className="text-xl font-bold">{displayDateTitle}</h1>
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
