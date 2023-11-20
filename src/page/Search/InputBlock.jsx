import { Loader } from "@googlemaps/js-api-loader";
import { useAutocomplete } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";
import useStore from "../../store/store";

const options = {
  bounds: {
    east: 121.53237060857701 + 0.001,
    west: 121.53237060857701 - 0.001,
    south: 25.0384859846332 - 0.001,
    north: 25.0384859846332 + 0.001,
  },
  strictBounds: false,
};

const InputBlock = () => {
  const inputRef = useRef(null);
  const [searchValue, setSearchValue] = useState("");
  const { currentPosition, apiKey } = useStore();
  let { map } = useStore();

  const loader = new Loader({
    apiKey,
    version: "weekly",
  });

  let markerLibraryRef = useRef();

  useEffect(() => {
    async function loadMarkerLibrary() {
      markerLibraryRef = await loader.importLibrary("marker");
    }
    loadMarkerLibrary();
  }, []);

  const onPlaceChanged = (place) => {
    if (place) {
      setSearchValue(place.formatted_address || place.name);
      const pos = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };

      const { Marker } = markerLibraryRef;
      const marker = new Marker({
        map,
        position: pos,
      });

      // Keep focus on input element
      inputRef.current && inputRef.current.focus();
    }
  };

  useAutocomplete({
    inputField: inputRef && inputRef.current,
    options,
    onPlaceChanged,
  });

  return (
    <>
      <input
        value={searchValue}
        type="text"
        className="h-8 w-full rounded border border-solid border-gray-300 px-2 focus:outline-none focus:ring-1 focus:ring-sky-500"
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="想找什麼景點呢？"
        ref={inputRef}
      />
    </>
  );
};

export default InputBlock;
