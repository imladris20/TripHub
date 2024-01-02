import { useMap } from "@vis.gl/react-google-maps";
import { findIndex } from "lodash";
import { useEffect, useState } from "react";
import globalStore, { scheduleStore } from "../../store/store";
import DaySequenceDropDown from "./DaySequenceDropdown";
import InDayOrderDropdown from "./InDayOrderDropdown";
import RouteRow from "./RouteRow";
import TimeSettingModal from "./TimeSettingModal";

const AttractionRow = ({
  currentAttraction,
  daySequenceIndex,
  dayBlockRef,
}) => {
  const {
    attractionsData: allAttractions,
    setAttractionItemDetail,
    setCurrentCenter,
    setCurrentZoom,
    currentLoadingTripData,
  } = scheduleStore();

  const map = useMap("tripMap");

  const { name, note, expense, inDayOrder, daySequence, poisId } =
    currentAttraction;

  const [targetIndex, setTargetIndex] = useState(
    findIndex(currentLoadingTripData.attractions, {
      poisId: poisId,
    }),
  );

  const [routesPartnerIndex, setRoutesParter] = useState(
    findIndex(currentLoadingTripData.attractions, {
      daySequence: daySequence,
      inDayOrder: inDayOrder + 1,
    }),
  );

  const handleAttractionNameClicked = (
    currentAttractionName,
    note,
    expense,
  ) => {
    const targetData = allAttractions.find(
      (data) => data.name === currentAttractionName,
    );
    if (targetData) {
      setAttractionItemDetail({ ...targetData, note, expense });
      map.panTo(targetData.location);
      setCurrentCenter(targetData.location);
      setCurrentZoom(18);
    }
  };

  useEffect(() => {
    setTargetIndex(
      findIndex(currentLoadingTripData.attractions, {
        poisId: poisId,
      }),
    );
    setRoutesParter(
      findIndex(currentLoadingTripData.attractions, {
        daySequence: daySequence,
        inDayOrder: inDayOrder + 1,
      }),
    );
  }, [currentLoadingTripData]);

  return (
    <>
      <div className="flex w-[350px] shrink-0 flex-row items-center justify-start border-b border-solid border-gray-500 bg-white">
        <DaySequenceDropDown currentAttractionIndex={targetIndex} name={name} />
        <InDayOrderDropdown
          name={name}
          inDayOrder={inDayOrder}
          daySequenceIndex={daySequenceIndex}
          currentAttractionIndex={targetIndex}
        />

        {daySequenceIndex !== 0 ? (
          <TimeSettingModal
            name={name}
            currentAttractionIndex={targetIndex}
            dayBlockRef={dayBlockRef}
            daySequenceIndex={daySequenceIndex}
          />
        ) : (
          <span className="h-full w-[90px] whitespace-nowrap border-r border-solid border-gray-500 p-2 text-center text-xs">
            -
          </span>
        )}
        <button
          className="h-full w-[180px] shrink-0 grow cursor-pointer truncate p-2 text-center text-xs"
          onClick={() => handleAttractionNameClicked(name, note, expense)}
        >
          {name}
        </button>
      </div>
      {inDayOrder !== 0 && routesPartnerIndex !== -1 && (
        <RouteRow
          poisId={poisId}
          routesPartnerIndex={routesPartnerIndex}
          currentAttractionIndex={targetIndex}
          daySequenceIndex={daySequenceIndex}
        />
      )}
    </>
  );
};

export default AttractionRow;
