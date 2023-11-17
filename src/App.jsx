import { Route, Routes } from "react-router-dom";
import Home from "./page/home";
import Practicing from "./page/practicing";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/practicing" element={<Practicing />} />
      </Routes>
    </>
  );
}

export default App;
