import {
  APIProvider,
  AdvancedMarker,
  InfoWindow,
  Map,
  Pin,
} from "@vis.gl/react-google-maps";

import useStore from "../../store/store";

console.log(APIProvider, Map, AdvancedMarker, Pin, InfoWindow);
const feilisu = { lat: 25.037042786024042, lng: 121.53209613797584 };

const Search = () => {
  const { apiKey, mapId, initialPosition, open, setOpen } = useStore();

  return (
    <div className="flex h-[calc(100vh-64px)] flex-row items-center">
      <div className="flex h-full w-2/5 flex-row items-center justify-center bg-yellow-100">
        search list space
      </div>
      <APIProvider apiKey={apiKey}>
        <div className="h-full w-full">
          <Map zoom={18} center={initialPosition} mapId={mapId}>
            <AdvancedMarker position={initialPosition}></AdvancedMarker>
            <AdvancedMarker position={feilisu} onClick={() => setOpen(true)}>
              <Pin
                background={"green"}
                borderColor={"grey"}
                glyphColor={"purple"}
              />
            </AdvancedMarker>
            {open && (
              <InfoWindow
                position={feilisu}
                onCloseClick={() => setOpen(false)}
              >
                菲立斯很好吃
              </InfoWindow>
            )}
          </Map>
        </div>
      </APIProvider>
    </div>
  );
};

export default Search;
