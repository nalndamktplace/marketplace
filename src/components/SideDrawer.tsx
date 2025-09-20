import { Drawer } from "antd";

function SideDrawer({
  show,
  setShow = () => {},
  position = "right",
  title = "",
  children,
}: any) {
  return (
    <Drawer
      title={title}
      placement={position}
      onClose={() => setShow(false)}
      open={show}
    >
      {children}
    </Drawer>
  );
}

export default SideDrawer;
