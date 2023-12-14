import React from "react";
import { BrowserRouter } from "react-router-dom";
import AdminRouter from "./Admin";
import PageRouter from "./Page";
import './App.css';

const App = () => {
  return (
    <BrowserRouter>
      <AdminRouter />
      <PageRouter />
    </BrowserRouter>
  )
}

export default App;