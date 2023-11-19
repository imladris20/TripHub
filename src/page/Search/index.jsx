import { APIProvider, AdvancedMarker, Map } from "@vis.gl/react-google-maps";
import useStore from "../../store/store";
import CurrentPosition from "./CurrentPosition";
import InputBlock from "./InputBlock";

const Search = () => {
  const { apiKey, mapId, defaultPosition, currentPosition } = useStore();

  return (
    <div className="flex h-[calc(100vh-64px)] flex-row items-center">
      <APIProvider apiKey={apiKey} libraries={["places"]}>
        <div className="flex h-full w-2/5 flex-col items-center justify-start bg-yellow-100">
          <InputBlock />
          <p>search list space</p>
        </div>
        <div className="h-full w-full">
          <Map
            id={"searchMap"}
            zoom={8}
            center={defaultPosition}
            mapId={mapId}
            mapTypeControl={false}
            streetViewControl={false}
          >
            <AdvancedMarker position={currentPosition}>
              <div className="h-4 w-4 rounded-full border-4 border-solid border-white bg-sky-500 outline outline-sky-500"></div>
            </AdvancedMarker>
          </Map>
        </div>
        <CurrentPosition />
      </APIProvider>
    </div>
  );
};

export default Search;
