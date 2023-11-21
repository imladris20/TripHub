import {
  useAutocomplete,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { useRef, useState } from "react";
import useStore from "../../store/store";
import { SearchIcon } from "../../utils/icons";

const InputBlock = () => {
  const inputRef = useRef();
  const map = useMap("searchMap");
  const { Marker } = useMapsLibrary("marker");
  const { PlacesService, RankBy } = useMapsLibrary("places");
  const marker = new Marker({ map });
  const service = new PlacesService(map);

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
      setSearchValue(place.name);

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

  const handleSearchButtonClicked = () => {
    console.log(currentCenter);
    console.log(searchValue);

    const request = {
      location: currentCenter,
      radius: "5000",
      keyword: searchValue,
    };

    const callback = (results, status) => {
      console.log("nearbySearch results: ", results);
      console.log("nearbySearch status: ", status);
      console.log("type of nearbySearch status: ", typeof status);
      // if (status == PlacesServiceStatus.OK) {
      //   for (var i = 0; i < results.length; i++) {
      //     var place = results[i];
      //     createMarker(results[i]);
      //   }
      // }
    };

    service.nearbySearch(request, callback);
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
      <button
        className="row-flex flex h-8 w-8 items-center justify-center bg-sky-300"
        onClick={() => handleSearchButtonClicked()}
      >
        <SearchIcon />
      </button>
    </div>
  );
};

export default InputBlock;
