import { Map, useApiIsLoaded, useMap } from "@vis.gl/react-google-maps";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import useStore, { scheduleStore } from "../../store/store";

const Schedule = () => {
  const modalRef = useRef();
  const apiIsLoaded = useApiIsLoaded();
  const { mapId, database } = useStore();
  const { currentCenter, currentZoom, isTripSelected, setIsTripSelected } =
    scheduleStore();
  const map = useMap("tripMap");
  const [tripsOption, setTripsOption] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState("disabled");
  const uid = localStorage.getItem("uid");

  const handleTripSelected = (e) => {
    setSelectedTrip(e.target.value);
  };

  const initialMapOptions = {
    mapId,
    center: currentCenter,
    zoom: currentZoom,
    mapTypeControl: false,
    streetViewControl: false,
  };

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  }, [apiIsLoaded]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.keyCode === 27) {
        event.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (database) {
      const colRef = collection(database, "users", uid, "trips");
      const unsubscribe = onSnapshot(colRef, (querySnapshot) => {
        const currentTrips = [];
        querySnapshot.forEach((doc) => {
          currentTrips.push({ id: doc.id, data: doc.data() });
        });
        setTripsOption(currentTrips);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [database]);

  if (!apiIsLoaded) {
    return <h1>Api is Loading...</h1>;
  }

  return (
    <>
      {!isTripSelected && (
        <>
          <dialog ref={modalRef} className="modal">
            <div className="modal-box flex flex-col items-center justify-start gap-4">
              <h3 className="text-xl font-bold">請選擇行程</h3>
              <select
                className="select select-primary w-full shrink-0"
                value={selectedTrip}
                onChange={(e) => handleTripSelected(e)}
              >
                <option disabled value="disabled">
                  選擇行程
                </option>
                {tripsOption.map((trip, index) => {
                  return (
                    <option key={index} value={trip.data.name}>
                      {trip.data.name}
                    </option>
                  );
                })}
              </select>
              <form method="dialog">
                <button
                  className="btn btn-primary"
                  onClick={() => setIsTripSelected(true)}
                >
                  確認選擇
                </button>
              </form>
            </div>
          </dialog>
        </>
      )}
      <div className="relative flex h-[calc(100vh-64px)] flex-row items-center">
        {!uid && <Navigate to="/" replace={true} />}
        {map && (
          <div className="flex h-full w-1/4 flex-col items-center justify-start bg-yellow-100">
            {/* <List /> */}
          </div>
        )}
        <Map id={"tripMap"} options={initialMapOptions} />
        {/* {poisItemDetailInfo && <Detail />} */}
      </div>
    </>
  );
};

export default Schedule;
