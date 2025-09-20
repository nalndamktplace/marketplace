import { Fragment, useEffect } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon, FunnelIcon } from "@heroicons/react/20/solid";
import BooksCard from "../components/BooksCard";
import { Empty } from "antd";
// import { GENRES } from "../config/geners";
// import { AGE_GROUPS } from "../config/ages";
import { useLocation } from "react-router-dom";
import { COLLECTION } from "../api/collection/collection";

const sortOptions = [
  { name: "Most Popular", href: "#", current: true },
  { name: "Best Rating", href: "#", current: false },
  { name: "Newest", href: "#", current: false },
  { name: "Price: Low to High", href: "#", current: false },
  { name: "Price: High to Low", href: "#", current: false },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

// const filters = [
//   {
//     id: "genres",
//     name: "Genres",
//     options: GENRES.map((genre) => {
//       return { value: genre, label: genre, checked: false };
//     }),
//   },
//   {
//     id: "age-groups",
//     name: "Age Groups",
//     options: AGE_GROUPS.map((ageGrp) => {
//       return { value: ageGrp, label: ageGrp, checked: false };
//     }),
//   },
// ];

export default function CollectionPage() {
  const { state } = useLocation();

  const { specifCollectionData, specifCollectionRefetch } =
    COLLECTION.getSpecificCollectionQuery(state?.id);
  // const [Filters, setFilters] = useState(filters);
  // const { booksData } = BOOK.getAllBooksQuery();

  useEffect(() => {
    specifCollectionRefetch();
  }, [state?.id]);
  // useEffect(() => {
  //   const applyFilters = () => {
  //     let filteredNfts: any = [...booksData]; // Use booksData directly
  //     Filters.forEach((filter) => {
  //       switch (filter.id) {
  //         case "genres":
  //           const selectedGenres = filter.options
  //             ?.filter((option) => option.checked)
  //             ?.map((option) => option.value);

  //           if (selectedGenres && selectedGenres.length > 0) {
  //             filteredNfts = filteredNfts?.filter((nft: any) => {
  //               const nftGenres = JSON.parse(nft.genres);
  //               return nftGenres.some((genre: any) =>
  //                 selectedGenres.includes(genre)
  //               );
  //             });
  //           }
  //           break;

  //         case "age-groups":
  //           const selectedAgeGroups = filter.options
  //             ?.filter((option) => option.checked)
  //             ?.map((option) => option.value);

  //           if (selectedAgeGroups && selectedAgeGroups.length > 0) {
  //             filteredNfts = filteredNfts.filter((nft: any) => {
  //               const nftAgeGroup = JSON.parse(nft.age_group)[0];
  //               return selectedAgeGroups.includes(nftAgeGroup);
  //             });
  //           }
  //           break;
  //         default:
  //           break;
  //       }
  //     });
  //     return filteredNfts;
  //   };

  //   if (booksData && isUsable(booksData)) {
  //     const filteredNfts = applyFilters();
  //     console.log(filteredNfts);
  //     // setNfts(filteredNfts);
  //   }
  // }, [booksData, Filters]);

  // const handleCheckboxChange = (sectionId: any, optionValue: any) => {
  //   setFilters((prevFilters) => {
  //     return prevFilters.map((section) => {
  //       if (section.id === sectionId) {
  //         return {
  //           ...section,
  //           options: section.options.map((option) => {
  //             if (option.value === optionValue) {
  //               return { ...option, checked: !option.checked };
  //             } else {
  //               return option;
  //             }
  //           }),
  //         };
  //       } else {
  //         return section;
  //       }
  //     });
  //   });
  // };

  return (
    <div className="bg-white">
      <div>
        {/* Mobile filter dialog */}

        <main className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between pt-24 pb-6 border-b border-gray-200">
            <h1 className="text-4xl font-bold tracking-tight capitalize text-primary">
              {state?.name}
            </h1>

            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div className="px-5 py-1 border border-gray-300 rounded-md drop-shadow-md">
                  <Menu.Button className="inline-flex justify-center text-sm font-medium text-gray-700 group hover:text-gray-900">
                    Sort
                    <ChevronDownIcon
                      className="flex-shrink-0 w-5 h-5 ml-1 -mr-1 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 w-40 mt-2 origin-top-right bg-white rounded-md shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1 ">
                      {sortOptions.map((option) => (
                        <Menu.Item key={option.name}>
                          {({ active }) => (
                            <a
                              href={option.href}
                              className={classNames(
                                option.current
                                  ? "font-medium text-gray-900"
                                  : "text-gray-500",
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm"
                              )}
                            >
                              {option.name}
                            </a>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

              <button
                type="button"
                className="p-2 ml-4 -m-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                // onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading">
            <div className="flex justify-center pt-6">
              {/* <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4"> */}
              {/* <FilterForm
                  filters={Filters}
                  handleCheckboxChange={handleCheckboxChange}
                /> */}
              {!specifCollectionData?.length ? (
                <div className="flex justify-center col-span-3">
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 lg:col-span-4">
                  {specifCollectionData?.map((item: any, index: any) => (
                    <BooksCard
                      id={item?.id}
                      img={item?.cover_public_url}
                      title={item?.title}
                      rating={item?.rating}
                      price={item?.price}
                      author={item?.author}
                      key={index}
                    />
                  ))}
                </div>
              )}
              {/* Product grid */}
              {/* </div> */}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

// const MobileFilter = ({
//   mobileFiltersOpen,
//   setMobileFiltersOpen,
//   filters,
//   handleCheckboxChange,
// }: any) => {
//   return (
//     <Transition.Root show={mobileFiltersOpen} as={Fragment}>
//       <Dialog
//         as="div"
//         className="relative z-40 lg:hidden"
//         onClose={setMobileFiltersOpen}
//       >
//         <Transition.Child
//           as={Fragment}
//           enter="transition-opacity ease-linear duration-300"
//           enterFrom="opacity-0"
//           enterTo="opacity-100"
//           leave="transition-opacity ease-linear duration-300"
//           leaveFrom="opacity-100"
//           leaveTo="opacity-0"
//         >
//           <div className="fixed inset-0 bg-black bg-opacity-25" />
//         </Transition.Child>

//         <div className="fixed inset-0 z-40 flex">
//           <Transition.Child
//             as={Fragment}
//             enter="transition ease-in-out duration-300 transform"
//             enterFrom="translate-x-full"
//             enterTo="translate-x-0"
//             leave="transition ease-in-out duration-300 transform"
//             leaveFrom="translate-x-0"
//             leaveTo="translate-x-full"
//           >
//             <Dialog.Panel className="relative flex flex-col w-full h-full max-w-xs py-4 pb-12 ml-auto overflow-y-auto bg-white shadow-xl">
//               <div className="flex items-center justify-between px-4">
//                 <h2 className="text-lg font-medium text-gray-900">Filters</h2>
//                 <button
//                   type="button"
//                   className="flex items-center justify-center w-10 h-10 p-2 -mr-2 text-gray-400 bg-white rounded-md"
//                   onClick={() => setMobileFiltersOpen(false)}
//                 >
//                   <span className="sr-only">Close menu</span>
//                   <XMarkIcon className="w-6 h-6" aria-hidden="true" />
//                 </button>
//               </div>

//               {/* Filters */}
//               <form className="mt-4 border-t border-gray-200">
//                 {filters?.map((section: any) => (
//                   <Disclosure
//                     as="div"
//                     key={section.id}
//                     className="px-4 py-6 border-t border-gray-200"
//                   >
//                     {({ open }) => (
//                       <>
//                         <h3 className="flow-root -mx-2 -my-3">
//                           <Disclosure.Button className="flex items-center justify-between w-full px-2 py-3 text-gray-400 bg-white hover:text-gray-500">
//                             <span className="font-medium text-gray-900">
//                               {section.name}
//                             </span>
//                             <span className="flex items-center ml-6">
//                               {open ? (
//                                 <MinusIcon
//                                   className="w-5 h-5"
//                                   aria-hidden="true"
//                                 />
//                               ) : (
//                                 <PlusIcon
//                                   className="w-5 h-5"
//                                   aria-hidden="true"
//                                 />
//                               )}
//                             </span>
//                           </Disclosure.Button>
//                         </h3>
//                         <Disclosure.Panel className="pt-6">
//                           <div className="space-y-6">
//                             {section.options.map(
//                               (option: any, optionIdx: number) => (
//                                 <div
//                                   key={option.value}
//                                   className="flex items-center"
//                                 >
//                                   <Checkbox
//                                     id={`filter-mobile-${section.id}-${optionIdx}`}
//                                     name={`${section.id}[]`}
//                                     value={option.value}
//                                     type="checkbox"
//                                     defaultChecked={option.checked}
//                                     onChange={() =>
//                                       handleCheckboxChange(
//                                         section.id,
//                                         option.value
//                                       )
//                                     }
//                                   />

//                                   <label
//                                     htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
//                                     className="flex-1 min-w-0 ml-3 text-gray-500"
//                                   >
//                                     {option.label}
//                                   </label>
//                                 </div>
//                               )
//                             )}
//                           </div>
//                         </Disclosure.Panel>
//                       </>
//                     )}
//                   </Disclosure>
//                 ))}
//               </form>
//             </Dialog.Panel>
//           </Transition.Child>
//         </div>
//       </Dialog>
//     </Transition.Root>
//   );
// };

// const FilterForm = ({ filters = [], handleCheckboxChange }: any) => {
//   return (
//     <form className="hidden pr-3 border-r border-gray-100 lg:block">
//       {filters?.map((section: any) => (
//         <Disclosure
//           as="div"
//           key={section?.id}
//           className="py-6 border-b border-gray-200"
//         >
//           {({ open }) => (
//             <>
//               <h3 className="flow-root -my-3">
//                 <Disclosure.Button className="flex items-center justify-between w-full py-3 text-sm text-gray-400 bg-white hover:text-gray-500">
//                   <span className="font-medium text-gray-900">
//                     {section.name}
//                   </span>
//                   <span className="flex items-center ml-6">
//                     {open ? (
//                       <MinusIcon className="w-5 h-5" aria-hidden="true" />
//                     ) : (
//                       <PlusIcon className="w-5 h-5" aria-hidden="true" />
//                     )}
//                   </span>
//                 </Disclosure.Button>
//               </h3>
//               <Disclosure.Panel className="pt-6">
//                 <div className="space-y-4 h-[500px] overflow-y-scroll">
//                   {section.options.map((option: any, optionIdx: number) => (
//                     <div key={option.value} className="flex items-center">
//                       <Checkbox
//                         id={`filter-${section.id}-${optionIdx}`}
//                         name={`${section.id}[]`}
//                         value={option.value}
//                         defaultChecked={option.checked}
//                         onChange={() =>
//                           handleCheckboxChange(section.id, option.value)
//                         }
//                       />

//                       <label
//                         htmlFor={`filter-${section.id}-${optionIdx}`}
//                         className="ml-3 text-sm text-gray-600"
//                       >
//                         {option.label}
//                       </label>
//                     </div>
//                   ))}
//                 </div>
//               </Disclosure.Panel>
//             </>
//           )}
//         </Disclosure>
//       ))}
//     </form>
//   );
// };
