import { APIProvider } from "@vis.gl/react-google-maps";
import { onAuthStateChanged } from "firebase/auth";
import { find } from "lodash";
import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Home from "./page/Home";
import NotFound from "./page/NotFound";
import Overview from "./page/Overview";
import Pois from "./page/Pois";
import Schedule from "./page/Schedule";
import Search from "./page/Search";
import globalStore from "./store/store";
import { db, initFirebase } from "./utils/tripHubDb";

function App() {
  const {
    typeOptions,
    setTypeOptions,
    prepareColor,
    apiKey,
    setDatabase,
    setIsLogin,
    setPlaceResult,
    uid,
    setUid,
  } = globalStore();
  const [isFbInited, setIsFbInited] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isOverviewPath = pathname.startsWith("/overview");

  useEffect(() => {
    if (!isFbInited) {
      const { db, auth } = initFirebase();
      setDatabase(db);
      setIsFbInited(true);
      onAuthStateChanged(auth, (user) => {
        if (user !== null) {
          setIsLogin(true);
          setUid(user.uid);
        } else {
          setPlaceResult(null);
          setIsLogin(false);
          if (!isOverviewPath) {
            navigate("/");
          }
        }
      });
    }
  }, []);

  useEffect(() => {
    const syncCategory = async () => {
      const userInfo = await db.getDoc("userInfo");
      if (userInfo?.categories) {
        userInfo.categories.map((item, index) => {
          const userDefinitedOption = {
            name: item,
            bg: `${prepareColor[index].bg}`,
            shouldTextDark: prepareColor[index].shouldTextDark,
          };
          if (!find(typeOptions, { name: item })) {
            setTypeOptions(userDefinitedOption);
          }
        });
      }
    };
    if (uid) {
      syncCategory();
    }
  }, [uid]);

  return (
    <APIProvider
      apiKey={apiKey}
      region="TW"
      language="zh-TW"
      libraries={["places", "maps", "routes", "marker"]}
    >
      {!isOverviewPath && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/pois" element={<Pois />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/overview/:tripId" element={<Overview />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </APIProvider>
  );
}

export default App;
