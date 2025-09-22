import { LuShoppingCart } from "react-icons/lu";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Transition } from "@headlessui/react";

function BooksCard({
  id,
  img,
  title,
  rating,
  price,
  author,
}: {
  id?: string;
  img: string;
  title: string;
  rating: number;
  price: number;
  author: string;
}) {
  const [isHovering, setIsHovering] = useState(false);

  function handleMouseOver() {
    setIsHovering(true);
  }
  function handleMouseOut() {
    setIsHovering(false);
  }
  return (
    <div
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      className="bg-gray-100 transition-all cursor-pointer hover:shadow-xl hover:shadow-primary/50 hover:-translate-y-2 h-fit min-w-[200px] w-full max-w-[350px]  p-2 rounded-2xl"
    >
      <Link to={`/item/${id}`}>
        <div className="relative ">
          <img
            className="h-[320px] w-full object-cover   object-top rounded-xl"
            src={img}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src =
                "https://jkfenner.com/wp-content/uploads/2019/11/default.jpg";
            }}
          />
          <Transition
            show={isHovering}
            enter="transition-opacity  duration-75"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="bg-white  p-0.5 absolute bottom-2 right-2 drop rounded-full">
              <div className="p-2 rounded-full bg-primary ">
                <LuShoppingCart size={20} />
              </div>
            </div>
          </Transition>
        </div>
        <div className="p-1 mt-3 text-black">
          <div className="mb-3">
            <div className="flex items-center justify-between">
              <p className="font-semibold">
                {title?.length > 25 ? title?.slice(0, 20) + "..." : title}{" "}
              </p>
              <div className="flex items-center text-xs font-bold gap-x-2">
                <FaStar className="text-primary" />
                <span>{rating}</span>
              </div>
            </div>

            <p className="text-xs text-gray-400">
              {author?.length > 25 ? author?.slice(0, 25) : author}{" "}
            </p>
          </div>
          <div>
            <p className="font-bold">₹{Number(price)?.toFixed(2)} </p>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default BooksCard;
