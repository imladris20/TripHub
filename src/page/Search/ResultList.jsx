import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
// import useStore from "../../store/store";
import { AddToPoisIcon } from "../../utils/icons";

const ResultList = () => {
  // const { placeResult } = useStore();
  const map = useMap("searchMap");
  const { PlacesService } = useMapsLibrary("places");
  const { Marker } = useMapsLibrary("marker");
  const service = new PlacesService(map);

  /*   const details = await Promise.all(
      placeResult.map((place) => {
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

        return new Promise((resolve) => {
          service.getDetails(request, (place, status) => {
            console.log(place);
            if (status === "OK") {
              new Marker({ map, position: place.geometry.location });
              resolve(place);
            } else {
              resolve(null);
            }
          });
        });
      }),
  ) */

  // console.log("console.log in ResultList: ", placeResult);

  // console.log("placeDetails in ResultList: ", placeDetails);

  return (
    <div className="justify-start-start flex h-auto w-full flex-col">
      <div className="relative flex w-full flex-col items-start gap-[6px] border-b-2 border-solid border-gray-200 bg-white p-2">
        <button>
          <h1 className="mb-0 text-lg font-bold">全家便利商店 建鑫店</h1>
        </button>
        <h2 className="text-xs">3.1 ⭐ (105則)</h2>
        <h2 className="text-xs">台北市信義區松壽路24號</h2>
        <div className="flex h-auto w-full flex-row items-center justify-start gap-3">
          <h2 className="text-xs text-green-800">營業中</h2>
          <h2 className="text-xs">|</h2>
          <h2 className="text-xs">03 358 8900</h2>
        </div>
        <h2 className="text-xs">💰 200元以下 / 人</h2>
        <button className="absolute bottom-2 right-2 h-8 w-8">
          <AddToPoisIcon />
        </button>
      </div>
    </div>
  );
};

export default ResultList;
