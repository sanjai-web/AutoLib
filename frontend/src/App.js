import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from "./pages/navigation.js"
import Home from "./pages/home.js"
import Admin from "./pages/admin.js"
import Dash from "./pages/adashbord.js"

function App() {
  return (
    <BrowserRouter>
      <div>
        <Nav />
        <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/dash" element={<Dash />} />
        
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
