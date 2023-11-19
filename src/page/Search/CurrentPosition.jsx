import { useMap } from "@vis.gl/react-google-maps";
import { useEffect } from "react";
import useStore from "../../store/store";

const CurrentPosition = () => {
  const map = useMap("searchMap");
  const { currentPosition, setCurrentPosition, isCurrentPositionSetted } =
    useStore();

  useEffect(() => {
    if (!map) return;

    navigator.geolocation.getCurrentPosition(async (position) => {
      await setCurrentPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      await map.setCenter(currentPosition);
      await map.setZoom(17);
    });
  }, [isCurrentPositionSetted]);
};

export default CurrentPosition;
