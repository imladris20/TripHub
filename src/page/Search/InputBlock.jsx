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
  const marker = new Marker({ map });
  const service = new PlacesService(map);

  const [searchValue, setSearchValue] = useState("");
  const { currentCenter, setCurrentZoom, setCurrentCenter, setPlaceResult } =
    useStore();

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
            "photos",
            "place_id",
            "types",
            "opening_hours",
            "price_level",
            "rating",
            "user_ratings_total",
          ],
        };

        let markerLabel = labels[labelIndex++ % labels.length];

        return new Promise((resolve) => {
          service.getDetails(request, (place, status) => {
            if (status === "OK") {
              const marker = new Marker({
                map,
                position: place.geometry.location,
                label: markerLabel,
              });

              const tryContent = `
                <div class='flex flex-col h-auto w-auto gap-1 justify-start items-start'>
                  <h1 class='text-base font-bold'>${place.name}</h1>
                  <h2 className="text-xs">
                    ${place.rating} ⭐ (${place.user_ratings_total}則)
                  </h2>
                  <h2 className="text-xs">${place.formatted_address}</h2>
                </div>
              `;

              const infowindow = new google.maps.InfoWindow({
                ariaLabel: place.name,
                content: tryContent,
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

  const handleSearchButtonClicked = () => {
    if (!searchValue) return;

    const textSearchRequest = {
      location: currentCenter,
      radius: "5000",
      query: searchValue,
      rankBy: "DISTANCE",
    };

    if (markerRef.current.length) {
      markerRef.current.forEach((marker) => {
        marker.setVisible(false);
      });
      markerRef.current = [];
    }

    const textSearchCallback = (results, status) => {
      if (status === "OK") {
        setCurrentZoom(13.8);
        setCurrentCenter(results[0].geometry.location);

        fetchPlaceDetails(markerRef.current, results).then((place) => {
          console.log("after fetch", place);
          setPlaceResult(place);
        });
        // results.map((placeResult) => {
        //   const placeId = placeResult.place_id;
        //   const request = {
        //     placeId,
        //     fields: [
        //       "name",
        //       "geometry",
        //       "formatted_address",
        //       "photos",
        //       "place_id",
        //       "types",
        //       "opening_hours",
        //       "price_level",
        //       "rating",
        //       "user_ratings_total",
        //     ],
        //   };
        //   service.getDetails(request, (place, status) => {
        //     if (status === "OK") {
        //       // getDetailsArr.push(place);
        //       const marker = new Marker({
        //         map,
        //         position: place.geometry.location,
        //       });
        //       markerRef.current.push(marker);
        //     }
        //   });
        // });
      }
    };

    service.textSearch(textSearchRequest, textSearchCallback);
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
      />
      <button
        className="row-flex mt-[2px] flex h-[30px] w-[30px] items-center justify-center bg-gray-400"
        onClick={() => handleSearchButtonClicked()}
      >
        <SearchIcon />
      </button>
    </div>
  );
};

export default InputBlock;
