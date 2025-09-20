import moment from "moment";
import { FaMedium } from "react-icons/fa";
import { Link } from "react-router-dom";

function BlogCard({ img, title, pubDate, categories, link }: any) {
  return (
    <div className="bg-gray-100 transition-all cursor-pointer  shadow-xl hover:shadow-primary/50  hover:-translate-y-2 min-w-[200px] w-full max-w-[300px] p-2 rounded-2xl">
      <div className="relative ">
        <Link to={link} target="_blank">
          <img
            className=" min-h-[300px] object-center object-cover rounded-xl"
            src={img[0]}
            defaultValue="https://blog.walls.io/wp-content/uploads/2023/03/Featured-Image-embed-Medium-Blog.jpg"
          />
        </Link>
        <div className="bg-white p-0.5 absolute bottom-2 right-2 drop rounded-full">
          <div className="p-2 bg-black rounded-full ">
            <FaMedium size={20} />
          </div>
        </div>
      </div>
      <div className="mt-3 text-black">
        <div className="mb-3">
          <p className="font-semibold">{title} </p>
          <p className="mt-2 text-xs text-gray-400">
            {moment(pubDate).format("DD MMM, YYYY")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories?.map((category: string, index: number) => (
            <p
              key={index}
              className="p-1 px-3 text-xs font-semibold text-gray-500 capitalize bg-gray-300 rounded-full"
            >
              {category}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BlogCard;
