import { IoMdClose } from "react-icons/io";

const AnnotationContextMenu = ({
  onColorSelect = () => {},
  onClose = () => {},
}: any) => {
  const colors = ["#e6192a", "#0080ff", "#14b84b", "#ffd500", "#aa00ff"];

  return (
    <div className="flex p-4 bg-green-400 shadow-2xl rounded-xl ">
      <div className="flex justify-between gap-4">
        {colors.map((c: any) => (
          <div
            style={{ "--color": c, backgroundColor: c } as React.CSSProperties}
            key={c}
            className="relative flex items-center justify-center w-6 h-6 rounded-full cursor-pointer"
            onClick={() => onColorSelect(c)}
          ></div>
        ))}
      </div>
      <div className="flex items-center justify-center ml-3 rounded-lg cursor-pointer hover:bg-slate-300">
        <span onClick={onClose}>
          <IoMdClose size={22} />
        </span>
      </div>
    </div>
  );
};

export default AnnotationContextMenu;
