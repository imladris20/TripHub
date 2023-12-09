import { useParams } from "react-router-dom";

const Overview = () => {
  const { tripId } = useParams();

  // console.log(tripId);

  return <h1>here is overview of trip {tripId}</h1>;
};

export default Overview;
