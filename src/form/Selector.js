import { useState } from "react";

export default function Selector(props) {
  const allData = props.data;

  const [data, setData] = useState([]);

  const toggleData = function (datum) {
    let newData;
    if (data.includes(datum)) {
      newData = data.filter((d, _) => d !== datum);
    } else {
      newData = [...data, datum];
    }
    setData(newData);
    props.setFilter(newData);
  };

  return (
    <ul id={props.id}>
      {allData.map((d) => (
        <li
          key={d}
          className={`${data.includes(d) ? "active" : ""}`}
          onClick={() => toggleData(d)}
        >
          <img src={`https://store-f4fje68lyd.mybigcommerce.com/content/shapes/${d.toLowerCase().replace(" ", "-")}.jpg`}></img>
          <span>{d}</span>
        </li>
      ))}
    </ul>
  );
}
