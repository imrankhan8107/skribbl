import React from "react";
import ReactDOM from "react-dom";

const App = () => {
  console.log("App started");
  return <h1>React App</h1>;
};

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);
