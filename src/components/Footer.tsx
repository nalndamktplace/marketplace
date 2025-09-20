import { Link, NavLink } from "react-router-dom";
// import { FaMedium, FaTelegramPlane, FaTwitter } from "react-icons/fa";
import { useState } from "react";
import { Button, Input, Modal } from "antd";
import LOGO from "./../assets/logo.svg";
function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <div className="container p-10 mt-10 bg-primary rounded-2xl">
        <div className="flex items-center my-10 ">
          <div className="flex-1 text-4xl">
            <h2 className="mb-3 font-bold ">Stay in the loop</h2>
            <h2 className="font-bold text-gray">Get the latest insights</h2>
          </div>
          <div className="flex-1">
            <div className="flex gap-2 mb-3">
              <div className="bg-[#ffffff2a] rounded-xl flex w-full ">
                <input
                  type="email"
                  placeholder="Enter Email Address"
                  className="flex-1 w-full p-3 bg-transparent border-none placeholder:text-white focus:outline-none"
                />
              </div>
              <button className="bg-white hover:bg-orange-600 transition-all px-10 py-2.5 hover:drop-shadow-md font-semibold text-primary text-xs lg:text-sm rounded-md">
                Submit
              </button>
            </div>
            <div>
              By clicking send you'll receive occasional emails. You always have
              the choice to unsubscribe within every email you receive.
            </div>
          </div>
        </div>
      </div>
      <footer className="m-4 mt-10 bg-white border-gray-500 rounded-lg shadow">
        <div className="w-full max-w-screen-xl p-4 py-6 mx-auto lg:py-8">
          <div className="items-start md:flex md:justify-between">
            <div className="mb-6 md:mb-0">
              <Link
                to="/"
                className="flex items-center mb-4 space-x-3 sm:mb-0 rtl:space-x-reverse"
              >
                <img src={LOGO} className="h-28" alt="Nalnda" />
                <span className="self-center text-sm text-black text-medium whitespace-wrap">
                  World's first decentralized ecosystem
                  <br /> for readable content. Experience <br /> books beyong
                  reading
                </span>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
              <div>
                <h2 className="mb-6 text-sm font-extrabold uppercase text-primary ">
                  Nalnda
                </h2>
                <ul className="font-medium text-white">
                  {[
                    {
                      label: "Discover",
                      link: "/explore",
                    },
                    {
                      label: "Create Wallet",
                      link: "/explore",
                    },
                    {
                      label: "Nightowals",
                      link: "https://nightowls.nalnda.com/",
                    },
                  ].map((item, index) => (
                    <NavLink
                      key={index}
                      to={item?.link}
                      className={({ isActive }) =>
                        isActive ? "text-black" : ""
                      }
                    >
                      <li className="mb-4 text-sm font-semibold text-black transition-all cursor-pointer hover:text-black hover:translate-x-2 hover:underline me-4 md:me-6">
                        {item?.label}
                      </li>
                    </NavLink>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="mb-6 text-sm font-extrabold uppercase text-primary ">
                  Info
                </h2>

                <ul className="font-medium text-white">
                  {[
                    {
                      label: "Privacy Policy",
                      link: window.location.origin + "/policy/privacy",
                    },
                    {
                      label: "Terms and Conditions",
                      link: window.location.origin + "/policy/terms",
                    },
                    {
                      label: "Whitepaper",
                      link: "https://docs.nalnda.com/",
                    },
                    {
                      label: "About",
                      link: "https://about.nalnda.com/",
                    },
                  ].map((item, index) => (
                    <NavLink
                      key={index}
                      to={item?.link}
                      target="_blank"
                      className={({ isActive }) =>
                        isActive ? "text-black" : ""
                      }
                    >
                      <li className="mb-4 text-sm font-semibold text-black transition-all cursor-pointer hover:text-black hover:translate-x-2 hover:underline me-4 md:me-6">
                        {item?.label}
                      </li>
                    </NavLink>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="mb-6 text-sm font-extrabold uppercase text-primary ">
                  Join Newsletter
                </h2>

                <Modal
                  width={400}
                  footer={null}
                  title="Newsletter"
                  open={isModalOpen}
                  onCancel={() => setIsModalOpen(false)}
                >
                  <Input placeholder="Enter your email " />
                  <div className="flex justify-end mt-4">
                    <Button type="primary">Submit</Button>
                  </div>
                </Modal>
                <ul className="font-medium text-white">
                  <li
                    onClick={() => setIsModalOpen(true)}
                    className="mb-4 text-sm font-semibold text-black transition-all cursor-pointer hover:text-black hover:translate-x-2 hover:underline me-4 md:me-6"
                  >
                    Subscribe to our newsletter
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />
          <div className="sm:flex sm:items-center sm:justify-between">
            <span className="block text-sm text-gray-500 sm:text-center ">
              © {new Date().getFullYear()}&nbsp;
              <Link to={"/"} className="hover:underline">
                Nalnda™
              </Link>
              . All Rights Reserved.
            </span>
            <div className="flex mt-4 text-2xl gap-x-8 sm:justify-center sm:mt-0">
              {/* {[<FaTwitter />, <FaTelegramPlane />, <FaMedium />].map(
                (item, index) => (
                  <span
                    key={index}
                    className="cursor-pointer hover:text-black text-primary"
                  >
                    {item}
                  </span>
                )
              )} */}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
