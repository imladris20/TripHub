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
  const { InfoWindow } = useMapsLibrary("maps");
  const { PlacesService } = useMapsLibrary("places");
  const service = new PlacesService(map);

  const [searchValue, setSearchValue] = useState("");
  const {
    currentCenter,
    setCurrentZoom,
    setCurrentCenter,
    setPlaceResult,
    setSearchItemDetailInfo,
  } = useStore();

  const markerRef = useRef([]);

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

  const textSearchCallback = (results, status) => {
    if (status === "OK") {
      const lat = results[0].geometry.location.lat();
      const lng = results[0].geometry.location.lng();
      map.panTo({ lat, lng });
      setCurrentZoom(13.8);
      setCurrentCenter({ lat, lng });
      fetchPlaceDetails(markerRef.current, results).then((place) => {
        setPlaceResult(place);
      });
    }
  };

  const clearMarkerAndSearch = (keyword) => {
    console.log("inside clearMarkerAndSearch", currentCenter);
    const textSearchRequest = {
      location: currentCenter,
      radius: "5000",
      query: keyword,
      rankBy: "DISTANCE",
    };

    if (markerRef.current.length) {
      markerRef.current.forEach((marker) => {
        marker.setVisible(false);
        marker.setMap(null);
      });
      markerRef.current = [];
    }

    service.textSearch(textSearchRequest, textSearchCallback);
  };

  const onPlaceChanged = (place) => {
    if (place) {
      setSearchValue(place.name);
      setSearchItemDetailInfo(null);
      clearMarkerAndSearch(place.name);
      inputRef.current && inputRef.current.focus();
    }
  };

  const fetchPlaceDetails = async (ref, textSearchResult) => {
    const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let labelIndex = 0;

    const details = await Promise.all(
      textSearchResult.map((place) => {
        const placeId = place.place_id;
        const request = {
          placeId,
          fields: [
            "name",
            "geometry",
            "formatted_address",
            "formatted_phone_number",
            "photos",
            "place_id",
            "types",
            `opening_hours.weekday_text`,
            "price_level",
            "rating",
            "user_ratings_total",
            "address_components",
            "url",
          ],
        };

        let markerLabel = labels[labelIndex++ % labels.length];

        return new Promise((resolve) => {
          service.getDetails(request, (place, status) => {
            if (status === "OK") {
              const marker = new Marker({
                map,
                position: place.geometry.location,
                label: {
                  text: markerLabel,
                  color: "white",
                },
                animation: 2,
              });

              const windowContent = `
                <div class='flex flex-col h-auto w-auto gap-1 justify-start items-start'>
                  <h1 class='text-base font-bold'>${place.name}</h1>
                  <h2 className="text-xs">
                    ${place.rating} ⭐ (${place.user_ratings_total}則)
                  </h2>
                  <h2 className="text-xs">${place.formatted_address}</h2>
                </div>
              `;

              const infowindow = new InfoWindow({
                ariaLabel: place.name,
                content: windowContent,
              });

              marker.addListener("mouseover", () => {
                infowindow.open({
                  anchor: marker,
                  map,
                });
              });

              marker.addListener("mouseout", () => {
                infowindow.close();
              });

              ref.push(marker);
              resolve(place);
            } else {
              resolve(null);
            }
          });
        });
      }),
    );
    return details;
  };

  const handleSearchSubmit = () => {
    setSearchItemDetailInfo(null);
    if (!searchValue) return;
    clearMarkerAndSearch(searchValue);
  };

  const handleEnterPress = (e) => {
    if (e.key === "Enter") {
      console.log("activate");
      setSearchItemDetailInfo(null);
      if (!searchValue) return;
      clearMarkerAndSearch(searchValue);
    }
  };

  useAutocomplete({
    inputField: inputRef && inputRef.current,
    autoCompleteOptions,
    onPlaceChanged,
  });

  return (
    <div className="flex h-8 w-full flex-row items-center justify-start border-b-4 border-solid border-gray-200 p-0">
      <input
        value={searchValue}
        type="text"
        className="h-8 w-full px-2 focus:outline-sky-300"
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="想找什麼景點呢？"
        ref={inputRef}
        onKeyDown={(e) => handleEnterPress(e)}
        onClick={() => console.log(currentCenter)}
      />
      <button
        className="row-flex mt-[2px] flex h-[30px] w-[30px] items-center justify-center bg-gray-400"
        onClick={() => handleSearchSubmit()}
      >
        <SearchIcon />
      </button>
    </div>
  );
};

export default InputBlock;
