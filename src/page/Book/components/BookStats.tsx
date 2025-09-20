import { message } from "antd";
import { IoMdHeart, IoMdStar, IoMdPricetag } from "react-icons/io";
import { BOOK } from "../../../api/book/book";

const BookStats = ({
  nft,
  bookLikedStatusData,
  isConnected,
  address,
  bookRefetch,
}: any) => {
  const { bookLikeMutationAsync } = BOOK.bookLikeMutation();
  const handleLikeClick = async () => {
    if (!isConnected) {
      message.warning("Please login first");
      return;
    }

    await bookLikeMutationAsync({
      bodyData: {
        bookAddress: nft.book_address,
        ownerAddress: address,
        likedState: !bookLikedStatusData?.liked,
      },
    }).then(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await bookRefetch();
    });
  };

  const stats = [
    {
      icon: (
        <IoMdHeart
          className={`text-2xl ${
            bookLikedStatusData?.liked ? "text-red-400" : "text-white"
          } hover:text-red-400`}
          onClick={handleLikeClick}
        />
      ),
      label: "like",
      value: nft?.likes,
    },
    {
      icon: <IoMdStar className="text-2xl" />,
      label: "Reviews",
      value: nft?.rating,
    },
    {
      icon: <IoMdPricetag className="text-2xl" />,
      label: "Sold",
      value: nft?.copies,
    },
  ];

  return (
    <div className="p-4 mt-4 rounded-md">
      <div className="flex flex-wrap justify-between gap-3">
        {stats.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-2xl transition-all cursor-pointer md:mr-16 hover:text-red-400"
          >
            <p className="mb-2 text-xs font-semibold capitalize">
              {item.label}
            </p>
            {item.icon}
            <p className="mt-2 text-sm">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookStats;
