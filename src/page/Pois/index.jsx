import { Map, useApiIsLoaded, useMap } from "@vis.gl/react-google-maps";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import globalStore, { poisStore } from "../../store/store";
import Detail from "./Detail";
import List from "./List";

const Pois = () => {
  const { mapId } = globalStore();
  const {
    currentCenter,
    currentZoom,
    poisItemDetailInfo,
    setCurrentCenter,
    setCurrentZoom,
  } = poisStore();
  const apiIsLoaded = useApiIsLoaded();
  const map = useMap("poisMap");

  const uid = localStorage.getItem("uid");

  const initialMapOptions = {
    mapId,
    center: currentCenter,
    zoom: currentZoom,
    mapTypeControl: false,
    streetViewControl: false,
  };

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
    <div className="relative flex h-[calc(100vh-64px)] flex-row items-center">
      {!uid && <Navigate to="/" replace={true} />}
      {map && (
        <div className="flex h-full w-1/4 shrink-0 flex-col items-center justify-start bg-white">
          <List />
        </div>
      )}
      <Map id={"poisMap"} options={initialMapOptions} />
      {poisItemDetailInfo && <Detail />}
    </div>
  );
};

export default Pois;
