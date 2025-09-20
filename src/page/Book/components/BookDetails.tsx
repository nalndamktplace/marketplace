import { Typography } from "antd";
import { useState } from "react";
import { MdArrowOutward } from "react-icons/md";
import { Link } from "react-router-dom";

function BookDetails({ nft, provider }: any) {
  const [rows, __] = useState(2);
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      {" "}
      <div className="flex items-center justify-between ">
        <h3 className="mb-3 text-5xl font-bold text-white ">{nft?.title}</h3>
      </div>
      <div className="flex ">
        <p className="flex items-center gap-2 ml-2 text-sm font-semibold text-gray-500">
          By <div className="bg-[#ffffff9f] rounded-md p-2">{nft?.author}</div>{" "}
        </p>
      </div>
      <Typography.Paragraph
        style={{
          marginBottom: 0,
          color: "white",
          fontWeight: "normal",
          fontSize: 16,
          paddingTop: 5,
        }}
        ellipsis={{
          rows,
          expanded,
        }}
      >
        We all just want to be celebrated; not only for the things we do, but
        more importantly, for who we are and how we show up in the world. Don’t
        forget to give out flowers while you can. To others, and to yourself. c.
        Sean Wiliams, 2024
      </Typography.Paragraph>
      <div className="flex justify-end">
        <p
          className="flex justify-end p-1 px-2 mt-1 text-xs font-semibold bg-white rounded-md cursor-pointer text-primary w-fit"
          onClick={() => setExpanded(!expanded)}
        >
          {!expanded ? "Read More" : "Collapse"}
        </p>
      </div>
      <div className="flex items-center gap-3 mt-5 font-semibold">
        <span className="transition-all ">
          Contract Address:&nbsp;
          {nft?.book_address?.slice(0, 8) +
            "..." +
            nft?.book_address?.slice(-8)}
        </span>
        <Link
          to={`${provider?.chain?.blockExplorers?.default?.url}/address/${nft?.book_address}`}
          target="_blank"
        >
          <MdArrowOutward className="text-xl cursor-pointer animate-pulse" />
        </Link>
      </div>
    </>
  );
}

export default BookDetails;
