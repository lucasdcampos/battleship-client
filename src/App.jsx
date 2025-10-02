import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Pages/Header/Header";
import Page1 from "./components/Pages/Page1/Page1";
import Page2 from "./components/Pages/Page2/Page2";
import Page3 from "./components/Pages/Page3/Page3";

// Navigate("/Page2")

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route exact path="/" element="" />

          <Route path="/Page1" element={<Page1 />} />

          <Route path="/Page2" element={<Page2 />} />

          <Route path="/Page3" element={<Page3 />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
