import { Map, useApiIsLoaded, useMap } from "@vis.gl/react-google-maps";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import globalStore, { scheduleStore } from "../../store/store";
import Detail from "./Detail";
import List from "./List";

const Schedule = () => {
  const apiIsLoaded = useApiIsLoaded();
  const { mapId } = globalStore();
  const {
    currentCenter,
    currentZoom,
    currentLoadingTripId,
    attractionItemDetail,
    setCurrentCenter,
    setCurrentZoom,
  } = scheduleStore();
  const map = useMap("tripMap");
  const uid = localStorage.getItem("uid");

  const initialMapOptions = {
    mapId,
    center: currentCenter,
    zoom: currentZoom,
    mapTypeControl: false,
    streetViewControl: false,
  };

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

  useEffect(() => {
    if (map) {
      map.addListener("dragend", () => {
        const newCenter = {
          lat: map.getCenter().lat(),
          lng: map.getCenter().lng(),
        };
        setCurrentCenter(newCenter);
      });

      map.addListener("zoom_changed", () => {
        setCurrentZoom(map.getZoom());
      });
    }
  }, [map]);

  if (!apiIsLoaded) {
    return (
      <div className="relative flex h-[calc(100vh-64px)] flex-row items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      {!uid && <Navigate to="/" replace={true} />}
      <div className="relative flex h-[calc(100vh-64px)] flex-row items-center">
        {map && currentLoadingTripId && (
          <div className="flex h-full w-auto min-w-[350px] shrink-0 flex-col items-center justify-start overflow-y-scroll bg-white">
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
