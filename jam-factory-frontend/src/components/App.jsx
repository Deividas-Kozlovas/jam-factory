import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [jams, setJams] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/v1/jams")
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "Success") {
          setJams(data.data.jams);
        } else {
          console.error("Failed to fetch jams: Status not 'Success'");
        }
      })
      .catch((error) => console.error("Error fetching jams:", error));
  }, []);

  return (
    <div>
      <h2>Jam List</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Jam name</th>
            <th>Ingrediance</th>
            <th>Batch Size</th>
            <th>Sugar Amount</th>
            <th>Porduction date</th>
            <th>Expiration date</th>
          </tr>
        </thead>
        <tbody>
          {jams.map((jam) => (
            <tr key={jam._id}>
              <td>{jam.name}</td> {/* Updated to 'name' */}
              <td>{jam.fruitType}</td>
              <td>{jam.batchSize}</td>
              <td>{jam.sugarAmount}</td>
              <td>{jam.productionDate}</td>
              <td>{jam.expirationDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
