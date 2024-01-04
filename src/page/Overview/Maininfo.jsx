import { sumBy } from "lodash";
import { QRCodeSVG } from "qrcode.react";
import { formatToTaiwanDate } from "../../utils/timeUtil";

const Maininfo = ({ trip, tripId }) => {
  const totalExpense = sumBy(
    trip.attractions,
    (item) => parseInt(item.expense) || 0,
  );

  const startDate = formatToTaiwanDate(trip.startDate);
  const endDate = formatToTaiwanDate(trip.endDate);

  return (
    <>
      <div className="stats stats-vertical w-full shadow shadow-primary lg:stats-horizontal">
        <div className="stat">
          <div className="stat-title">行程名稱</div>
          <div className="stat-value">{trip.name}</div>
        </div>

        <div className="stat">
          <div className="stat-title">日期</div>
          <div className="stat-value">{`${startDate} ~ ${endDate}`}</div>
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
              href={`https://triphub.web.app/overview/${tripId}`}
              target="_blank"
            >
              <QRCodeSVG
                value={`https://triphub.web.app/overview/${tripId}`}
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
