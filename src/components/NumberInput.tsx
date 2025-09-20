import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
const NumberInput = ({
  value = 0,
  setValue = () => {},
  unit = "",
  min = 0,
  max = 100,
  step = 1,
  offset = 0,
}: any) => {
  const decreaseValue = () => {
    setValue(Math.max(min, value - step));
  };

  const increaseValue = () => {
    setValue(Math.min(max, value + step));
  };

  return (
    <div className="flex items-center gap-4 my-3">
      <div
        className="text-gray-500 cursor-pointer hover:text-primary"
        onClick={decreaseValue}
      >
        <CiCircleMinus size={34} stroke="currentColor" />
      </div>
      <div className="number-input__value">
        {value - offset}
        {unit}
      </div>
      <div
        className="text-gray-500 cursor-pointer hover:text-primary"
        onClick={increaseValue}
      >
        <CiCirclePlus size={34} stroke="currentColor" />
      </div>
    </div>
  );
};

export default NumberInput;
