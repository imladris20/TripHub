import { useMap } from "@vis.gl/react-google-maps";
import { doc, onSnapshot } from "firebase/firestore";
import { findIndex } from "lodash";
import { useEffect, useState } from "react";
import useStore, { scheduleStore } from "../../store/store";
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
    currentLoadingTripId,
  } = scheduleStore();

  const { database } = useStore();
  const uid = localStorage.getItem("uid");
  const map = useMap("tripMap");

  const { name, note, expense, inDayOrder, daySequence, poisId } =
    currentAttraction;

  const [targetIndex, setTargetIndex] = useState(
    findIndex(currentLoadingTripData.attractions, {
      name: name,
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
    if (database && currentLoadingTripId) {
      const unsubscribe = onSnapshot(
        doc(database, "users", uid, "trips", currentLoadingTripId),
        (doc) => {
          setTargetIndex(
            findIndex(currentLoadingTripData.attractions, {
              name: name,
            }),
          );
          setRoutesParter(
            findIndex(currentLoadingTripData.attractions, {
              daySequence: daySequence,
              inDayOrder: inDayOrder + 1,
            }),
          );
        },
      );
      return () => {
        unsubscribe();
      };
    }
  }, [database, currentLoadingTripData]);

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
          <span className="h-full w-[83px] whitespace-nowrap border-r border-solid border-gray-500 p-2 text-center text-xs">
            -
          </span>
        )}

        {/* name(button) */}
        <button
          className="h-full w-[187px] shrink-0 grow cursor-pointer p-2 text-center text-xs"
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
