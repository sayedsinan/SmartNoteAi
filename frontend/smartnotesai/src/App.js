import { useState } from "react";
import axios from "axios";
import "./App.css";
import HomePage from "./pages/home";

function App() {
  return (
    <div className="app-layout">
      <HomePage />
    </div>
  );
}

export default App;