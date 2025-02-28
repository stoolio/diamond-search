import { useState } from "react";
import Nouislider from "nouislider-react";

function doModulo(n, l, m) {
  if (n % l === 0) {
    return 1;
  } else if (n % m === 0) {
    return 2;
  }
  return 0;
}

export default function ValueSlider(props) {
  // const [state, setState] = useState({
  //   from: null,
  //   to: null,
  // });

  const onSlide = function (render, handle, value, un, percent) {
    const rawValues = [value[0] / 100, value[1] / 100];
    if (rawValues[1] === 4) rawValues[1] = 99;
    // setState({
    //   from: rawValues[0].toFixed(2),
    //   to: rawValues[1].toFixed(2),
    // });
    props.setFilter((_) => rawValues);
  };

  return (
    <div id={props.id} style={{ width: "80%", margin: "auto" }}>
      {/* <span>
        {state.from}ct : {state.to}ct
      </span> */}
      <Nouislider
        accessibility
        range={{ min: [props.from, 10], "50%": [200, 10], max: props.to }}
        start={[100, 125]}
        steps={5}
        pips={{
          mode: "steps",
          density: -1,
          filter: (n) => {
            if (n > 200) return doModulo(n, 100, 100);
            return doModulo(n, 50, 25);
          },
          format: {
            to: (s) => {
              let unit = "ct";
              if (s === 400) unit += "+";
              return (s / 100).toFixed(2) + unit;
            },
            from: (s) => s * 100,
          },
        }}
        connect
        onUpdate={onSlide}
      />
    </div>
  );
}
