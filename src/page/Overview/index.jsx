import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Logo from "../../assets/logo.png";
import globalStore, { overViewStore } from "../../store/store";
import { db } from "../../utils/tripHubDb";
import Day from "./Day";
import Maininfo from "./Maininfo";

const Overview = () => {
  const { tripId } = useParams();
  const { database } = globalStore();
  const [trip, setTrip] = useState();
  const { uid, setUid } = overViewStore();

  useEffect(() => {
    const getTripData = async () => {
      const querySnapshot = await db.getDocsAccrossCollections("allTrips");
      querySnapshot.forEach((doc) => {
        const findTarget = doc.id === tripId;
        const targetTripAuthorUid = doc.ref?._key?.path?.segments[6];
        const targetTrip = doc.data();

        if (findTarget) {
          setUid(targetTripAuthorUid);
          setTrip(targetTrip);
        }
      });
    };
    if (database) {
      getTripData();
    }
  }, [database]);

  return (
    <div className="h-screen w-screen pt-3">
      <div className="flex w-full flex-row items-center justify-center gap-2">
        <img src={Logo} alt="logo" className="h-11 w-11"></img>
        <h1 className="mr-2 text-2xl font-bold text-primary">TripHub</h1>
      </div>
      <div className="divider divider-primary mt-3 text-2xl font-bold text-primary">
        <h1>行程總覽</h1>
      </div>
      {trip && uid ? (
        <div className="flex w-full flex-col items-center justify-start gap-2 px-16 py-6">
          <Maininfo trip={trip} tripId={tripId} />
          {[...Array(trip.dayCount)].map((_, index) => {
            return <Day trip={trip} key={index} daySequence={index} />;
          })}
        </div>
      ) : (
        <div className="flex h-[calc(100%-88px)] w-full flex-row items-center justify-center">
          <span className="loading loading-spinner w-20 text-primary"></span>
        </div>
      )}
    </div>
  );
};

export default Overview;
