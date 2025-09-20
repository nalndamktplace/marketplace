import { FaFacebook, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";

function BookSocialInfo({ nft }: any) {
  return (
    <div className="flex items-center gap-3 mt-5 font-semibold">
      <span>Share:</span>
      <div className="flex gap-5 text-xl">
        <Link
          to={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            window.location.href
          )}`}
          target="_blank"
        >
          <FaFacebook className="transition-all cursor-pointer hover:text-primary" />
        </Link>
        <Link
          to={`http://www.twitter.com/share?url=${
            window.location.href
          }&text=${encodeURIComponent(
            `Just finished reading ${nft?.title} by ${nft?.author} and I highly recommend it! 📚 Check it out here: `
          )}`}
          target="_blank"
        >
          <FaTwitter className="transition-all cursor-pointer hover:text-primary" />
        </Link>
      </div>
    </div>
  );
}

export default BookSocialInfo;
