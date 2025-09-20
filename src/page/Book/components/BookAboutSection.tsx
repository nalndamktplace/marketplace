import { BsPeople } from "react-icons/bs";
import { HiTranslate } from "react-icons/hi";
import { IoMdBook } from "react-icons/io";
import { MdOutlineTimer } from "react-icons/md";

const BookAboutSection = ({
  synopsis,
  genres,
  ageGroup,
  readerReadCount,
  readerReadTime,
  totalReaderCount,
  language,
}: any) => {
  return (
    <>
      <div className="flex flex-col ">
        <div className="mt-5">
          <h3 className="text-2xl font-bold text-primary">Description</h3>
          <p className="mt-3 text-gray-500">{synopsis}</p>
        </div>

        <div className="mt-5">
          <h3 className="text-2xl font-bold text-primary">
            Preferred Age Group
          </h3>
          <p className="flex mt-3 text-gray-500 gap-x-3">
            {ageGroup?.map((item: any, index: number) => (
              <p
                key={index}
                className="p-1 px-5 text-sm font-semibold text-gray-400 bg-gray-100 rounded-full"
              >
                {item}
              </p>
            ))}
          </p>
        </div>
        <div className="mt-5">
          <h3 className="text-2xl font-bold text-primary">Genres</h3>
          <p className="flex flex-wrap gap-3 mt-3 text-gray-500">
            {genres?.map((item: any, index: number) => (
              <p
                key={index}
                className="p-1 px-5 text-sm font-semibold text-gray-400 bg-gray-100 rounded-full"
              >
                {item}
              </p>
            ))}
          </p>
        </div>
        <div className="mt-5">
          <h3 className="text-2xl font-bold text-primary">Properties</h3>
          <p className="flex flex-wrap gap-3 mt-3 text-gray-500">
            {[
              { label: language, icon: <HiTranslate size={22} /> },
              {
                label: `${totalReaderCount} Readers`,
                icon: <BsPeople size={22} />,
              },
              {
                label: `${readerReadCount} People reading`,
                icon: <IoMdBook size={22} />,
              },
              {
                label: `${Math.ceil(readerReadTime / 60)} minutes`,
                icon: <MdOutlineTimer size={22} />,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-4 w-full sm:max-w-[200px] px-10 text-gray-400 bg-gray-100 rounded-md"
              >
                {item.icon}
                <p className="mt-1 text-sm font-semibold">{item.label}</p>
              </div>
            ))}
          </p>
        </div>
      </div>
    </>
  );
};
export default BookAboutSection;
