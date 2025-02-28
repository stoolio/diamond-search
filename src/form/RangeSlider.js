import { useRef, useEffect } from "react";
import Nouislider from "nouislider-react";

function clickLogic(values, i, sld) {
  const low = parseInt(values[0], 10);
  const high = parseInt(values[1], 10);
  const isCloserToLow = Math.abs(low - i) - Math.abs(high - i - 1) < 0;
  if (high === i + 1 || low > i) {
    sld.set([i, values[1]]);
  } else if (low === i) {
    sld.set([values[0], i + 1]);
  } else if (isCloserToLow) {
    sld.set([i, values[1]]);
  } else {
    sld.set([values[0], i + 1]);
  }
}

const formatter = (map) => {
  return {
    to(i) {
      return map[parseInt(i, 10)];
    },
    from(l) {
      return map.lastIndexOf(l);
    },
  };
};

function isInt(n) {
  return n === parseInt(n, 10);
}

export default function Rangeslider({ data, setFilter, id }) {
  const length = data.length;

  const noClickEvents = useRef(true);

  const ref = useRef(null);

  const handleClick = (evt) => {
    const slider = ref.current.noUiSlider;
    clickLogic(slider.get(), data.lastIndexOf(evt.target.textContent), slider);
  };

  const onSlide = (render, handle, value, un, percent) => {
    const newFilter = data.slice(value[0], value[1]);
    setFilter((_) => newFilter);
  };

  useEffect(() => {
    if (ref.current && ref.current.noUiSlider && noClickEvents.current)
      noClickEvents.current = false;
    else return;
    document.querySelectorAll(`#${id} .noUi-value`).forEach((val, i) => {
      val.addEventListener("click", handleClick);
    });
    return () => {
      // we probably don't have to worry about cleanup as this is more a widget than an app?
      // document.querySelectorAll(`#${id} .noUi-value`).forEach((val, i) => {
      //   val.removeEventListener("click", handleClick);
      // });
    };
  }, []);

  return (
    <div id={id} className="range-slider">
      <Nouislider
        instanceRef={(instance) => {
          if (instance && !ref.current) {
            ref.current = instance;
          }
        }}
        behaviour={"none"}
        onUpdate={onSlide}
        start={[0, length]}
        step={1}
        margin={1}
        connect
        range={{
          min: 0,
          max: length,
        }}
        pips={{
          mode: "count",
          values: length * 2 + 1,
          density: -1,
          filter: (i) => (isInt(i) ? 0 : 1),
          format: formatter(data),
        }}
      />
    </div>
  );
}
