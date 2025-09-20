import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
function CustomButton({
  onClick,
  title,
  loading,
  disabled,
  isWidth,
}: {
  onClick?: any;
  title: string;
  isWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type="button"
      className={`bg-primary hover:bg-orange-600 ${
        isWidth && "w-full"
      } transition-all px-10 py-2.5 text-white hover:drop-shadow-md font-semibold text-xs lg:text-sm rounded-md`}
    >
      {loading ? (
        <Spin
          size="small"
          indicator={
            <LoadingOutlined style={{ fontSize: 18, color: "white" }} spin />
          }
        />
      ) : (
        title
      )}
    </button>
  );
}

export default CustomButton;
