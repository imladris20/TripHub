import { Loader } from "@googlemaps/js-api-loader";
import { useState } from "react";
import useStore from "../../store/store";
import { CurrentLocationBtnIcon } from "../../utils/icons";
import homeicon from "./home-button.png";

const CurrentPosition = () => {
  const { setCurrentPosition, apiKey } = useStore();
  const [isCurrentPositionShow, setIsCurrentPositionShow] = useState(false);

  let { map } = useStore();

  const loader = new Loader({
    apiKey,
    version: "weekly",
  });

  const handleCurrentLocationBtnClicked = () => {
    if (!map) return;

    navigator.geolocation.getCurrentPosition(async (position) => {
      const newPos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      await setCurrentPosition(newPos);
      await map.setCenter(newPos);
      await map.setZoom(17);

      if (!isCurrentPositionShow) {
        const homeImg = document.createElement("img");
        homeImg.src = homeicon;
        const { AdvancedMarkerElement } = await loader.importLibrary("marker");
        const marker = new AdvancedMarkerElement({
          map,
          position: newPos,
          title: "currentPosition",
          content: homeImg,
        });
        setIsCurrentPositionShow(true);
      }
    });
  };

  return (
    <button
      className="fixed bottom-[115px] right-[10px] ml-auto h-8 w-8 cursor-pointer rounded-md bg-gray-200 p-1"
      onClick={() => handleCurrentLocationBtnClicked()}
    >
      <CurrentLocationBtnIcon />
    </button>
  );
};

export default CurrentPosition;
