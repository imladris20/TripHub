import { APIProvider } from "@vis.gl/react-google-maps";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Pois from "./page/Pois";
import Schedule from "./page/Schedule";
import Home from "./page/home";
import Practicing from "./page/practicing";
import Search from "./page/search";
import useStore from "./store/store";

function App() {
  const { apiKey } = useStore();

  return (
    <APIProvider
      apiKey={apiKey}
      region="TW"
      language="zh-TW"
      libraries={["places", "maps", "routes", "marker"]}
    >
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/pois" element={<Pois />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/practicing" element={<Practicing />} />
      </Routes>
    </APIProvider>
  );
}

export default App;
