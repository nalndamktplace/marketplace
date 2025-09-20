import { useEffect } from "react";
import { useRef } from "react";
import { isUsable } from "../utils/getUrls";

const RangeSlider = ({
  className = "",
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
}: any) => {
  const rangeSliderRef: any = useRef();

  useEffect(() => {
    if (!isUsable(rangeSliderRef.current)) return;
    const progress = value / (max - min);
    rangeSliderRef.current.style.setProperty("--progress", progress);
  }, [value, min, max, rangeSliderRef]);

  return (
    <div ref={rangeSliderRef} className={"range-slider " + className}>
      <input
        type="range"
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        className="w-full h-1 p-0 m-0 bg-blue-500"
      />
    </div>
  );
};

export default RangeSlider;
