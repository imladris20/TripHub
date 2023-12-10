import { sumBy } from "lodash";
import { QRCodeSVG } from "qrcode.react";

const convertDateString = (dateStr) => {
  const newStr = new Date(dateStr);
  const year = newStr.getFullYear();
  const month = String(newStr.getMonth() + 1).padStart(2, "0");
  const date = String(newStr.getDate()).padStart(2, "0");
  const dayOfWeekIndex = newStr.getDay();
  const daysOfWeek = ["日", "一", "二", "三", "四", "五", "六"];
  const day = daysOfWeek[dayOfWeekIndex];

  return `${year}/${month}/${date} (${day})`;
};

const Maininfo = ({ trip, tripId }) => {
  const totalExpense = sumBy(
    trip.attractions,
    (item) => parseInt(item.expense) || 0,
  );

  return (
    <>
      <div className="stats stats-vertical w-full shadow shadow-primary lg:stats-horizontal">
        <div className="stat">
          <div className="stat-title">行程名稱</div>
          <div className="stat-value">{trip.name}</div>
        </div>

        <div className="stat">
          <div className="stat-title">日期</div>
          <div className="stat-value">{`${convertDateString(
            trip.startDate,
          )} ~ ${convertDateString(trip.endDate)}`}</div>
        </div>

        <div className="stat">
          <div className="stat-title">總預估花費</div>
          <div className="stat-value">{totalExpense}元</div>
        </div>

        <div className="stat">
          <div className="stat-title">行程連結</div>
          <div className="stat-value mt-2">
            <a
              className="whitespace-nowrap text-xl font-bold "
              // href={`https://triphub-polien-sprint4.web.app/overview/${tripId}`}
              href={`http://localhost:5173/overview/${tripId}`}
              target="_blank"
            >
              <QRCodeSVG
                value={`http://localhost:5173/overview/${tripId}`}
                className="h-16 w-16"
              />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Maininfo;
