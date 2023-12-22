import { useRef } from "react";
import { Link } from "react-router-dom";
import ScheduleHeader from "../../page/Schedule/Header";
import { scheduleStore } from "../../store/store";
import Button from "../Button";
import Profile from "./Profile";
import TripSelectModal from "./TripSelectModal";

const pageButtons = [
  { to: "/search", text: "搜尋景點", pageTag: 1 },
  { to: "/pois", text: "口袋清單", pageTag: 2 },
  { to: "/schedule", text: "行程規劃", pageTag: 3 },
];

const UserHeader = ({ activePageTag, setActivePageTag }) => {
  const tripModalRef = useRef();
  const { currentLoadingTripData } = scheduleStore();

  const renderButtonLinks = () => {
    return pageButtons.map(({ to, text, pageTag }) => (
      <Link key={to} to={to}>
        <Button
          variant={activePageTag === pageTag ? "active" : "default"}
          size="default"
          type="button"
          onClick={() => setActivePageTag(pageTag)}
        >
          {text}
        </Button>
      </Link>
    ));
  };

  return (
    <>
      {renderButtonLinks()}
      {location.pathname === "/schedule" && (
        <>
          <TripSelectModal ref={tripModalRef} />
          {currentLoadingTripData && <ScheduleHeader ref={tripModalRef} />}
        </>
      )}
      <Profile />
    </>
  );
};

export default UserHeader;