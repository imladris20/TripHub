import { Map, useApiIsLoaded, useMap } from "@vis.gl/react-google-maps";
import { Navigate } from "react-router-dom";
import CurrentPositionBtn from "../../components/CurrentPositionBtn/CurrentPositionBtn";
import useStore from "../../store/store";
import InputBlock from "./InputBlock";
import ResultList from "./ResultList";

const Search = () => {
  const { mapId, currentCenter, currentZoom, placeResult } = useStore();
  const apiIsLoaded = useApiIsLoaded();
  const map = useMap("searchMap");

  const uid = localStorage.getItem("uid");

  const initialMapOptions = {
    mapId,
    center: currentCenter,
    zoom: currentZoom,
    mapTypeControl: false,
    streetViewControl: false,
  };

  return (
    <div className="flex h-[calc(100vh-64px)] flex-row items-center">
      {!uid && <Navigate to="/" replace={true} />}
      <div className="flex h-full w-1/4 flex-col items-center justify-start bg-white">
        {map && <InputBlock />}
        {placeResult ? (
          <ResultList />
        ) : (
          <h1 className="m-auto text-slate-500">快來搜尋景點吧~~</h1>
        )}
      </div>
      <Map id={"searchMap"} options={initialMapOptions} />
      {apiIsLoaded && <CurrentPositionBtn />}
    </div>
  );
};

export default Search;
