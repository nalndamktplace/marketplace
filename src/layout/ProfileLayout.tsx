import { NavLink, Outlet } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { IoLibraryOutline } from "react-icons/io5";
import { Dialog, Transition } from "@headlessui/react";
import { useState, Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { RxHamburgerMenu } from "react-icons/rx";

function ProfileLayout() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  return (
    <div>
      <Transition.Root show={mobileFiltersOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40 lg:hidden"
          onClose={setMobileFiltersOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="relative flex flex-col w-full h-full max-w-xs py-4 pb-12 ml-auto overflow-y-auto bg-white shadow-xl">
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    Settings
                  </h2>
                  <button
                    type="button"
                    className="flex items-center justify-center w-10 h-10 p-2 -mr-2 text-gray-400 bg-white rounded-md"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="mx-5 mt-5">
                  {[
                    {
                      icon: <CgProfile size={26} />,
                      label: "User Profile",
                      link: "/user/profile",
                    },
                    {
                      icon: <IoLibraryOutline size={26} />,
                      label: "Library",
                      link: "/user/library",
                    },
                  ].map((item, index) => (
                    <NavLink
                      key={index}
                      to={item?.link}
                      className={({ isActive }) =>
                        isActive
                          ? "text-primary bg-gray-100"
                          : " hover:text-primary text-gray-500"
                      }
                    >
                      <div className="flex p-4 mb-5 font-medium transition-all hover:bg-gray-100 rounded-xl gap-x-4 ">
                        {item?.icon}
                        <p>{item?.label}</p>
                      </div>
                    </NavLink>
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
      <div className="container ">
        <button
          type="button"
          className="p-2 pt-10 text-gray-400 hover:text-gray-500 lg:hidden"
          onClick={() => setMobileFiltersOpen(true)}
        >
          <span className="sr-only">Filters</span>
          <RxHamburgerMenu className="w-5 h-5" aria-hidden="true" />
        </button>
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
          <div className="hidden py-10 border-r border-gray-100 lg:block">
            <h3 className="flex font-semibold text-gray-700">Settings</h3>
            <div className="mt-5 mr-5">
              {[
                {
                  icon: <CgProfile size={26} />,
                  label: "User Profile",
                  link: "/user/profile",
                },
                {
                  icon: <IoLibraryOutline size={26} />,
                  label: "Library",
                  link: "/user/library",
                },
              ].map((item, index) => (
                <NavLink
                  key={index}
                  to={item?.link}
                  className={({ isActive }) =>
                    isActive
                      ? "text-primary bg-gray-100"
                      : "hover:text-primary text-gray-500"
                  }
                >
                  <div className="flex p-4 mb-5 font-medium transition-all hover:bg-gray-100 rounded-xl gap-x-4 ">
                    {item?.icon}
                    <p>{item?.label}</p>
                  </div>
                </NavLink>
              ))}
            </div>
          </div>
          <div className="grid gap-3 lg:mt-10 sm:grid-cols-2 md:grid-cols-3 lg:col-span-3 ">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileLayout;
