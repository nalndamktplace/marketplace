import { Card, Empty, Table } from "antd";
import { useMemo, useState } from "react";
import { BsFillHandbagFill } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";
// import { BsFillHandbagFill } from "react-icons/bs";

function BookOffers({
  bookOffersData = [],
  cryptoPurchaseHandler,
  isListed,
  isOwner,
}: any) {
  const [isHide, setIsHide] = useState(false);

  const columns = [
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text: any) => <a>{text}</a>,
    },
    {
      title: "Decay Score",
      dataIndex: "decay",
      key: "decay",
    },
    {
      title: "Seller",
      dataIndex: "seller",
      key: "seller",
      render: (text: any) => (
        <span className="font-semibold text-primary">
          {text
            ? text?.substring(0, 8) +
              "..." +
              text?.substring(text.length - 4, text.length)
            : "-"}
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (data: any) => (
        <button
          disabled={isListed}
          onClick={data}
          className={`flex items-center justify-center gap-1 ${
            isListed && "opacity-40"
          } p-1 transition-all rounded-md cursor-pointer hover:text-white text-primary hover:bg-primary`}
        >
          <BsFillHandbagFill />
          <span>Buy</span>
        </button>
      ),
    },
  ];

  const data = useMemo(
    () =>
      bookOffersData?.map((item: any, index: number) => {
        return {
          key: index + 1,
          price: item?.price + " USDC",
          decay: Number(item?.da_score)?.toFixed(2),
          seller: item?.previous_owner,
          action: async () => {
            await cryptoPurchaseHandler(Number(item?.price));
          },
        };
      }),
    [bookOffersData]
  );

  return (
    <Card
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        background: "#fdfdfd",
        cursor: "pointer",
        border: "1.5px solid #e5e7eb",
      }}
    >
      <div
        onClick={() => {
          setIsHide(!isHide);
        }}
        className="flex items-center justify-between"
      >
        <h3 className="text-lg font-bold text-primary">Book Offers</h3>
        <IoIosArrowDown
          size={22}
          className={`text-primary ${isHide && "rotate-180"}`}
        />
      </div>

      {!isHide &&
        (data.length > 0 && !isOwner ? (
          <div className="mt-3">
            <Table pagination={false} columns={columns} dataSource={data} />
          </div>
        ) : (
          <div className="flex-col items-center justify-center mt-3 text-center ">
            <div className="flex justify-center col-span-3">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  isOwner
                    ? "You'r the owner. You can't buy it."
                    : "No listings yet"
                }
              />
            </div>
          </div>
        ))}
    </Card>
  );
}

export default BookOffers;
