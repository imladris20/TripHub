import { Map, useApiIsLoaded, useMap } from "@vis.gl/react-google-maps";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import useStore, { scheduleStore } from "../../store/store";
import Detail from "./Detail";
import List from "./List";

const Schedule = () => {
  const modalRef = useRef();
  const apiIsLoaded = useApiIsLoaded();
  const { mapId, database } = useStore();
  const {
    currentCenter,
    currentZoom,
    currentLoadingTrip,
    setCurrentLoadingTrip,
    setTripSelectModal,
    attractionItemDetail,
    setAttractionItemDetail,
  } = scheduleStore();
  const map = useMap("tripMap");
  const [tripsOption, setTripsOption] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState("disabled");
  const [tripIdToLoad, setTripIdToLoad] = useState("");
  const [newTripToAdd, setNewTripToAdd] = useState("");
  const uid = localStorage.getItem("uid");

  const handleTripSelected = (e) => {
    setSelectedTrip(e.target.value);
    const correctOption = tripsOption.find(
      (option) => option.data.name === e.target.value,
    );
    if (correctOption) {
      setTripIdToLoad(correctOption.id);
    }
  };

  const handleNewTripInput = (e) => {
    setNewTripToAdd(e.target.value);
  };

  const handleAddNewBlankTrip = async () => {
    const colRef = collection(database, "users", uid, "trips");
    await addDoc(colRef, {
      name: newTripToAdd,
    });
    setNewTripToAdd("");
  };

  const initialMapOptions = {
    mapId,
    center: currentCenter,
    zoom: currentZoom,
    mapTypeControl: false,
    streetViewControl: false,
  };

  //  open modal first while page loaded
  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.showModal();
      setTripSelectModal(modalRef);
    }
  }, [apiIsLoaded]);

  //  prevent default of pressing "esc" key
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

  //  Load trip options on firestore into selections
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
      {!uid && <Navigate to="/" replace={true} />}
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
          <div className="flex w-full flex-row items-center justify-start gap-2">
            <form method="dialog">
              <button
                className="btn btn-primary w-36 whitespace-nowrap"
                onClick={() => {
                  setCurrentLoadingTrip(tripIdToLoad);
                }}
              >
                確認選擇
              </button>
            </form>
            <h1 className="whitespace-nowrap text-base">或新增行程：</h1>
            <input
              type="text"
              placeholder=""
              className="input input-bordered input-xs w-full max-w-xs"
              value={newTripToAdd}
              onInput={(e) => handleNewTripInput(e)}
            />
            <button
              className="btn btn-circle btn-xs border-green-500 bg-white"
              onClick={handleAddNewBlankTrip}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="stroke-green-500"
              >
                <path
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="32"
                  d="M256 112v288M400 256H112"
                />
              </svg>
            </button>
          </div>
        </div>
      </dialog>
      <div className="relative flex h-[calc(100vh-64px)] flex-row items-center">
        {map && currentLoadingTrip && (
          <div className="flex h-full w-1/4 flex-col items-center justify-start overflow-y-auto bg-yellow-100">
            <List />
          </div>
        )}
        <Map id={"tripMap"} options={initialMapOptions} />
        {attractionItemDetail && <Detail />}
      </div>
    </>
  );
};

export default Schedule;
