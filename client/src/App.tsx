import { Route, Routes } from "react-router-dom";
import Layout from "./Components/Layout/Layout";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/list-post" element={<Layout></Layout>}></Route>
      </Routes>
    </div>
  );
}
