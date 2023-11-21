import {
  useAutocomplete,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { useRef, useState } from "react";
import useStore from "../../store/store";
import { SearchIcon } from "../../utils/icons";

const InputBlock = () => {
  const inputRef = useRef(null);
  const map = useMap("searchMap");
  const markerLib = useMapsLibrary("marker");
  const { Marker } = markerLib;
  const marker = new Marker({ map });

  const [searchValue, setSearchValue] = useState("");
  const { currentCenter, setCurrentZoom, setCurrentCenter } = useStore();

  const autoCompleteOptions = {
    region: "tw",
    componentRestrictions: { country: "tw" },
    bounds: {
      east: currentCenter.lng + 0.1,
      west: currentCenter.lng - 0.1,
      south: currentCenter.lat - 0.1,
      north: currentCenter.lat + 0.1,
    },
    strictBounds: true,
  };

  const onPlaceChanged = (place) => {
    if (place) {
      setSearchValue(place.formatted_address || place.name);

      const info = {
        location: place.geometry.location,
        placeId: place.place_id,
        name: place.name,
        address: place.formatted_address,
        rating: place.rating,
        phoneNumber: place.formatted_phone_number || "not provided",
        priceLevel: place.price_level || "not provided",
      };

      marker.setPosition(info.location);

      setCurrentZoom(14);
      setCurrentCenter(info.location);

      // Keep focus on input element
      inputRef.current && inputRef.current.focus();
    }
  };

  useAutocomplete({
    inputField: inputRef && inputRef.current,
    autoCompleteOptions,
    onPlaceChanged,
  });

  return (
    <div className="flex h-8 w-full flex-row p-0">
      <input
        value={searchValue}
        type="text"
        className="h-8 w-full rounded border border-solid border-gray-300 px-2 focus:outline-none focus:ring-1 focus:ring-sky-500"
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="想找什麼景點呢？"
        ref={inputRef}
      />
      <button className="row-flex flex h-8 w-8 items-center justify-center bg-sky-300">
        <SearchIcon />
      </button>
    </div>
  );
};

export default InputBlock;
