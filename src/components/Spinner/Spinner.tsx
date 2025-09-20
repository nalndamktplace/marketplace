import Lottie from "lottie-react";
import spinner from "./spinner.json";
import { useAppSelector } from "../../store/hooks";
function Spinner() {
  const { loading } = useAppSelector((state) => state.spinnerManage);
  if (!loading) {
    return null;
  }
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-10 flex items-center justify-center w-screen h-screen bg-black bg-opacity-50 ">
      <Lottie
        animationData={spinner}
        className=" min-w-[150px] w-full max-w-[200px]"
        loop={true}
      />
    </div>
  );
}

export default Spinner;
