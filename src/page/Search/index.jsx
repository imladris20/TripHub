import { Map, useApiIsLoaded, useMap } from "@vis.gl/react-google-maps";
import { Navigate } from "react-router-dom";
import useStore from "../../store/store";
import CurrentPositionBtn from "./CurrentPositionBtn";
import InputBlock from "./InputBlock";
import ResultList from "./ResultList";

const Search = () => {
  const { mapId, currentCenter, currentZoom, placeResult, isLogin } =
    useStore();
  const apiIsLoaded = useApiIsLoaded();
  const map = useMap("searchMap");

  const initialMapOptions = {
    mapId,
    center: currentCenter,
    zoom: currentZoom,
    mapTypeControl: false,
    streetViewControl: false,
  };

  return (
    <div className="flex h-[calc(100vh-64px)] flex-row items-center">
      {!isLogin && <Navigate to="/" replace={true} />}
      <div className="flex h-full w-2/5 flex-col items-center justify-start bg-yellow-100">
        {map && <InputBlock />}
        {placeResult ? (
          <ResultList />
        ) : (
          <h1 className="m-auto">Currently ResultList is empty.</h1>
        )}
      </div>
      <Map id={"searchMap"} options={initialMapOptions} />
      {apiIsLoaded && <CurrentPositionBtn />}
    </div>
  );
};

export default Search;
