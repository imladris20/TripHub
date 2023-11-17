import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./page/home";
import Practicing from "./page/practicing";
import Search from "./page/search";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/practicing" element={<Practicing />} />
      </Routes>
    </>
  );
}

export default App;
