import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useState } from "react";
import useStore from "../../store/store";
import { CurrentLocationBtnIcon } from "../../utils/icons";
import homeIcon from "./home-button.png";

const CurrentPositionBtn = () => {
  const { setCurrentCenter, setCurrentZoom } = useStore();
  const [isCurrentPositionShow, setIsCurrentPositionShow] = useState(false);
  const map = useMap("searchMap");
  const markerLib = useMapsLibrary("marker");
  const { AdvancedMarkerElement } = markerLib;

  const handleCurrentLocationBtnClicked = () => {
    if (!map) return;
    navigator.geolocation.getCurrentPosition((position) => {
      const newPos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      map.panTo(newPos);
      setCurrentCenter(newPos);
      setCurrentZoom(17);

      if (!isCurrentPositionShow) {
        const homeImg = document.createElement("img");
        homeImg.src = homeIcon;

        new AdvancedMarkerElement({
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
      className="fixed bottom-[115px] right-[10px] ml-auto flex h-10 w-10 cursor-pointer flex-row items-center justify-center rounded-sm bg-white p-1"
      onClick={() => handleCurrentLocationBtnClicked()}
    >
      <CurrentLocationBtnIcon />
    </button>
  );
};

export default CurrentPositionBtn;
