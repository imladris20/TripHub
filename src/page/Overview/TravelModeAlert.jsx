import {
  BicycleIcon,
  CarIcon,
  MotorcycleIcon,
  TrainIcon,
  WalkingIcon,
} from "../../utils/icons";

const TravelModeAlert = ({ mode, duration }) => {
  const switchTravelModeIcon = (mode) => {
    switch (mode) {
      case "WALKING": {
        return <WalkingIcon />;
      }
      case "BICYCLING": {
        return <BicycleIcon />;
      }
      case "TRANSIT": {
        return <TrainIcon />;
      }
      case "TWO_WHEELER": {
        return <MotorcycleIcon />;
      }
      default: {
        return <CarIcon />;
      }
    }
  };

  const switchTravelModeText = (mode) => {
    switch (mode) {
      case "WALKING": {
        return <span>走路</span>;
      }
      case "BICYCLING": {
        return <span>騎自行車</span>;
      }
      case "TRANSIT": {
        return <span>大眾運輸</span>;
      }
      case "TWO_WHEELER": {
        return <span>騎機車</span>;
      }
      default: {
        return <span>開車</span>;
      }
    }
  };

  const calculateDurationText = (duration) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    return (
      <h1>
        {hours}小時{minutes}分鐘
      </h1>
    );
  };

  return (
    <div className="timeline-middle">
      <div
        role="alert"
        className="alert flex w-60 flex-row items-center justify-center border-none bg-[#FEE19F] text-slate-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 512 512"
        >
          {switchTravelModeIcon(mode)}
        </svg>
        {switchTravelModeText(mode)}
        {calculateDurationText(duration)}
      </div>
    </div>
  );
};

export default TravelModeAlert;
