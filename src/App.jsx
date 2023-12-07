import { APIProvider } from "@vis.gl/react-google-maps";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Pois from "./page/Pois";
import Schedule from "./page/Schedule";
import Home from "./page/home";
import Search from "./page/search";
import useStore from "./store/store";
import { initFirebase } from "./utils/firebaseSDK";

function App() {
  const {
    apiKey,
    setDatabase,
    setIsLogin,
    setIsSignWindowOpen,
    setPlaceResult,
  } = useStore();
  const [isFbInited, setIsFbInited] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isFbInited) {
      const { db, auth } = initFirebase();
      setDatabase(db);
      setIsFbInited(true);
      onAuthStateChanged(auth, (user) => {
        if (user !== null) {
          setIsLogin(true);
          setIsSignWindowOpen(false);
        } else {
          setPlaceResult(null);
          setIsLogin(false);
          navigate("/");
        }
      });
    }
  }, []);

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
        {/* <Route path="/practicing" element={<Practicing />} /> */}
      </Routes>
    </APIProvider>
  );
}

export default App;
