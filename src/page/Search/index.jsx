import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef } from "react";
import useStore from "../../store/store";
import CurrentPosition from "./CurrentPosition";
import InputBlock from "./InputBlock";

const Search = () => {
  const { apiKey, mapId, currentPosition, setMap, map } = useStore();
  const mapRef = useRef();

  const loader = new Loader({
    apiKey,
    version: "weekly",
  });

  const mapOptions = {
    mapId,
    center: currentPosition,
    zoom: 7.8,
    mapTypeControl: false,
    streetViewControl: false,
  };

  useEffect(() => {
    const initMap = async () => {
      try {
        const { Map } = await loader.importLibrary("maps");
        setMap(new Map(mapRef.current, mapOptions));
      } catch (e) {
        console.error("載入地圖出錯了： ", e);
      }
    };
    initMap();
  }, []);

  return (
    <div className="flex h-[calc(100vh-64px)] flex-row items-center">
      <div className="flex h-full w-2/5 flex-col items-center justify-start bg-yellow-100">
        {map && <InputBlock />}
      </div>
      <div className="h-full w-full" ref={mapRef}></div>
      {map && <CurrentPosition />}
    </div>
  );
};

export default Search;
