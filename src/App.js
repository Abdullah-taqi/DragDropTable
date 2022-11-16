import React, { useEffect, useState } from "react";
import Axios from "axios";
import DragDrop from "./DragDrop";
import Navbar from "./components/Navbar";

import "./App.css";

function App() {
  const [listLength, setListLenght] = useState([]);
  const [resetValue, setResetValue] = useState(0);
  const [data, setData] = useState([]);

  const setLength = (length) => {
    setListLenght(length);
  };
  const setReset = (length) => {
    setResetValue(length);
  };

  const handleReset = () =>{
    Axios.get("https://random-data-api.com/api/users/random_user?size=100")
      .then((response) => {
        setData(response.data);

      })
      .catch((error) => {
        console.log("Error getting data: " + error);
      });
  }

  const setFiData = (data) => {
    setData(data)
  }
  
  useEffect(() => {
    Axios.get("https://random-data-api.com/api/users/random_user?size=100")
      .then((response) => {
        setData(response.data);

      })
      .catch((error) => {
        console.log("Error getting data: " + error);
      });
  }, []);
  
  return (
    <div className="App">
      <Navbar />
      <form onReset={handleReset}>
      <div className="search-reset">
        <p>Users ({listLength})</p>
        <div className="search-reset-btn">
          <button type="reset" id="reset-btn">Reset</button>
        </div>
      </div>
      <div className="main-container">
        <DragDrop data={data} setData={setFiData} setLength={setLength} resetVal ={resetValue} setReset={setReset} />
      </div>
      </form>

    </div>
  );
}

export default App;
