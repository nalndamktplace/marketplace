import { Alert, Dropdown, Select } from "antd";
import { Link, NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { LiaUserCircleSolid } from "react-icons/lia";
import type { MenuProps } from "antd";
import { TbBookUpload, TbLogout } from "react-icons/tb";
import { BOOK } from "../api/book/book";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { unsetUser } from "../store/slice/userManageReducer";
import LOGO from "./../assets/logo.svg";
import Swal from "sweetalert2";
import { useAccount, useDisconnect } from "wagmi";
import { FaUser } from "react-icons/fa";
import ConnectWallet from "./ConnectWallet";

function Header() {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const { isConnected } = useAccount();
  const [searchOptions, setSearchOptions] = useState([]);
  const { disconnectAsync } = useDisconnect();
  const dispatch = useDispatch();
  const { bookSearchMutationAsync, bookSearchData } = BOOK.bookSearchMutation();

  useEffect(() => {
    if (Array.isArray(bookSearchData) && bookSearchData.length > 0) {
      const updatedOptions: any = bookSearchData.map((d) => ({
        value: (
          <Link to={`/item/${d?.id}`} className="flex items-center gap-2">
            <img
              src={d?.cover_public_url}
              className="w-10 h-10 bg-cover rounded-md"
            />
            <span>{d?.title}</span>
          </Link>
        ),
        label: (
          <Link to={`/item/${d?.id}`} className="flex items-center gap-2">
            <img
              src={d?.cover_public_url}
              className="w-10 h-10 bg-cover rounded-md"
            />
            <span>{d?.title}</span>
          </Link>
        ),
      }));
      setSearchOptions(updatedOptions);
    } else {
      setSearchOptions([]); // Reset options if bookSearchData is empty
    }
  }, [bookSearchData]); // Watch for changes in bookSearchData

  const loginHandler = async () => await loginWithRedirect();
  const logoutWithRedirect = () =>
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    }).then(() => {
      dispatch(unsetUser());
      disconnectAsync();
    });

  const items: MenuProps["items"] = [
    {
      key: "profile",
      label: <Link to="/user/profile">My Profile</Link>,
      icon: <FaUser size={22} />,
    },
    {
      key: "publish",
      // label: <Link to="/publish">Publish Book</Link>,
      label: (
        <span
          onClick={() => {
            Swal.fire("Warning", "Publish Book coming soon.", "warning");
          }}
        >
          Publish Book
        </span>
      ),
      icon: <TbBookUpload size={22} />,
    },
    {
      key: "logout",
      label: (
        <span className="w-[100]" onClick={logoutWithRedirect}>
          Logout
        </span>
      ),
      onClick: () => logoutWithRedirect(),
      danger: true,
      icon: <TbLogout size={22} />,
    },
  ];
  return (
    <>
      {isAuthenticated && !isConnected && (
        <Alert
          message={
            <div className="text-center ">
              Please connect wallet to access platform
            </div>
          }
          showIcon={false}
          banner
          action={<ConnectWallet />}
        />
      )}
      <div className="py-3 bg-white drop-shadow-md ">
        <div className="container">
          <div className="flex items-center justify-between">
            <div className="text-black">
              <Link to="/">
                <img src={LOGO} className="w-[100px] h-[50px] object-contain" />
              </Link>
            </div>
            <div className="flex gap-x-5 ">
              <Select
                showSearch
                style={{ width: 300 }}
                placeholder={"Search..."}
                defaultActiveFirstOption={false}
                suffixIcon={null}
                filterOption={false}
                onSearch={async (e) => {
                  await bookSearchMutationAsync({
                    search: e,
                  });
                }}
                // onChange={setSearchValue}
                // notFoundContent={null}
                options={searchOptions}
              />
              '
            </div>
            <ul className="hidden font-semibold text-black md:flex gap-x-12">
              {[
                // {
                //   label: "Home",
                //   link: "/",
                // },
                {
                  label: "Explore",
                  link: "/explore",
                },

                {
                  label: "Library",
                  link: "/user/library?tab=library",
                },
              ].map((item, index) => (
                <NavLink
                  key={index}
                  to={item?.link}
                  className={({ isActive }) => (isActive ? "text-primary" : "")}
                >
                  <li className="cursor-pointer hover:text-primary">
                    {item?.label}
                  </li>
                </NavLink>
              ))}
            </ul>
            <div>
              {isAuthenticated ? (
                <>
                  <Dropdown menu={{ items }}>
                    <LiaUserCircleSolid
                      onClick={(e) => e.preventDefault()}
                      className="text-primary"
                      size={38}
                    />
                  </Dropdown>
                  {/* <button
                  onClick={logoutWithRedirect}
                  className="bg-primary hover:bg-yellow-500 transition-all px-5 py-1.5 hover:drop-shadow-md font-semibold rounded-md"
                >
                  Logout
                </button> */}
                </>
              ) : (
                <button
                  onClick={() => {
                    loginHandler();
                  }}
                  className="bg-primary hover:bg-yellow-500 transition-all px-5 py-1.5 hover:drop-shadow-md font-semibold rounded-md"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
