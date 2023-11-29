import { Map, useApiIsLoaded, useMap } from "@vis.gl/react-google-maps";
import { Navigate } from "react-router-dom";
import useStore, { poisStore } from "../../store/store";
// import InputBlock from "./InputBlock";
import Detail from "./Detail";
import List from "./List";

const Pois = () => {
  const { mapId } = useStore();
  const { currentCenter, currentZoom, poisItemDetailInfo } = poisStore();
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

  if (!apiIsLoaded) {
    return <h1>Api is Loading...</h1>;
  }

  return (
    <div className="relative flex h-[calc(100vh-64px)] flex-row items-center">
      {!uid && <Navigate to="/" replace={true} />}
      {map && (
        <div className="flex h-full w-1/4 flex-col items-center justify-start bg-yellow-100">
          <List />
        </div>
      )}
      <Map id={"poisMap"} options={initialMapOptions} />
      {poisItemDetailInfo && <Detail />}
    </div>
  );
};

export default Pois;
