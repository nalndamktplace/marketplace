import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import BooksCard from "../components/BooksCard";
import {
  IoIosArrowForward,
  IoMdHeart,
  IoMdPricetag,
  IoMdStar,
} from "react-icons/io";
import { useCallback, useEffect, useRef, useState } from "react";
import BlogCard from "../components/BlogCard";
// import blobsvg from "../assets/blobSvg.svg";
import { COLLECTION } from "../api/collection/collection";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css";
import { getImgUrlFromStrings } from "../utils/getUrls";
import { Link } from "react-router-dom";
import { IMAGES } from "../assets/img";
import CustomButton from "../components/Button";
import { FaFacebook, FaStar, FaTwitter } from "react-icons/fa";
import { MdArrowOutward } from "react-icons/md";
import { Typography } from "antd";
import { LuShoppingCart } from "react-icons/lu";
import { USER } from "../api/user/user";
import { useAppSelector } from "../store/hooks";

export const bookData = [
  {
    img: "https://cozycritiques.com/wp-content/uploads/2022/04/May-2022-Releases-1024x1024.png",
    title: "The Adventures of Tom Sawyer",
    author: "	Mark Twain",
    rating: 4,
    price: 32.1,
  },
  {
    img: "https://m.media-amazon.com/images/I/71WP8mD2QmL._AC_UF1000,1000_QL80_.jpg",
    title: "	A Christmas Carol",
    author: "	John Bunyan",
    rating: 4.2,
    price: 62,
  },
  {
    img: "https://i.ebayimg.com/images/g/jNIAAOSwYxhjVT3A/s-l960.jpg",
    title: "	Charles DickensDavid Copperfield",
    author: "	",
    rating: 2.2,
    price: 62.12,
  },
  {
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvMOm8FOQhUd55uKwKa-Ni8Tgx3JU2Feebki8pPUpPiA&s",
    title: "	The Pilgrim's Progress",
    author: "	Charles Dickens",
    rating: 4.2,
    price: 62.13,
  },
  {
    img: "https://149349728.v2.pressablecdn.com/wp-content/uploads/2020/01/img_5e3332aa27a5c.jpg",
    title: "	Gulliver's Travels",
    author: "John Bunyan",
    rating: 3.2,
    price: 42.23,
  },
  {
    img: "https://images.penguinrandomhouse.com/cover/9780593565308",
    title: "Jane Brontë",
    author: "	Charles Dickens",
    rating: 4.2,
    price: 2.2,
  },
  {
    img: "https://www.realsimple.com/thmb/KrGb42aamhHKaMzWt1Om7U42QsY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/great-books-for-anytime-2000-4ff4221eb1e54b659689fef7d5e265d5.jpg",
    title: "Moby Dick",
    author: "Nathaniel Hawthorne",
    rating: 1.2,
    price: 2.13,
  },
  {
    img: "https://i.insider.com/60a3ca0a1b5cea0019c45744?width=1136&format=jpeg",
    title: "	Jane Eyre",
    author: "Emily Brontë",
    rating: 2.2,
    price: 22.1,
  },
  {
    img: "https://hips.hearstapps.com/hmg-prod/images/books-for-runners-2022-1642693050.jpg?crop=0.5xw:1xh;center,top&resize=1200:*",
    title: "Treasure Island",
    author: "Robert Louis Stevenson	",
    rating: 2.5,
    price: 21.1,
  },
];
function HomePage() {
  const [collections, setCollections] = useState([]);
  const [bookOfWeek, setBookOfWeek] = useState([]);
  const { collectionData } = COLLECTION.getCollectionQuery();

  const { specifCollectionMutateAsync } =
    COLLECTION.getSpecificCollectionMutation();
  const collectionsNeed = ["under $5", "highest rated", "best selling"];

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const promises = collectionData
          ?.filter((r: any) => collectionsNeed?.includes(r.name))
          ?.map(async (r: any) => {
            const data = await specifCollectionMutateAsync({
              collectionId: r.id,
            });

            return { ...r, books: data }; // Or return data if needed
          });

        const data = await specifCollectionMutateAsync({
          collectionId: "73cf72b3-ec16-4964-8625-e951ead58ef5",
        });

        setBookOfWeek(data?.[0]);
        const results = await Promise.all(promises);
        setCollections(results as any);
      } catch (error) {
        //console.error("Error processing collections:", error);
      }
    };

    fetchCollections();
  }, [collectionData]);

  // const { mediumBlogsData } = BOOK.getMediumBlogsQuery();
  return (
    <div>
      <div className="container">
        <Swiper
          // style={{
          //   "--swiper-pagination-color": "#f1bf42",
          //   "--swiper-pagination-bullet-inactive-color": "#ffffff",
          //   "--swiper-pagination-bullet-inactive-opacity": "1",
          //   "--swiper-pagination-bullet-size": "10px",
          //   "--swiper-pagination-bullet-horizontal-gap": "8px",
          // }}
          autoplay={{
            delay: 5000,
          }}
          loop
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
        >
          <SwiperSlide>
            <img
              className="h-[500px] drop-shadow-2xl rounded-xl mt-5 w-full object-cover"
              src={IMAGES.BANNER_1}
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              className="h-[500px] drop-shadow-2xl rounded-xl mt-5 w-full object-cover"
              src={IMAGES.BANNER_2}
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              className="h-[500px] drop-shadow-2xl rounded-xl mt-5 w-full object-cover"
              src={IMAGES.BANNER_3}
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              className="h-[500px] drop-shadow-2xl rounded-xl mt-5 w-full object-cover"
              src={IMAGES.BANNER_4}
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              className="h-[500px] drop-shadow-2xl rounded-xl mt-5 w-full object-cover"
              src={IMAGES.BANNER_5}
            />
          </SwiperSlide>
        </Swiper>
      </div>
      <div className="container flex flex-col mt-5 md:flex-row gap-y-5 md:gap-x-12 ">
        <GenreContainer />
      </div>

      {/* // Books  */}
      <div className="relative mt-[80px] px-5">
        {collections?.reverse()?.map((collection: any, index: number) => {
          return (
            <>
              <BooksListComponent
                title={collection?.name}
                data={collection?.books}
                key={index}
              />
              {bookOfWeek && index == 0 ? (
                <BookOfDay book={bookOfWeek} />
              ) : null}
            </>
          );
        })}

        {/* <BlogsListComponent
          data={mediumBlogsData?.items}
          title="Stories By Nalanda on medium "
        /> */}
      </div>
      <ExternalLinks />
    </div>
  );
}

export default HomePage;

const BooksListComponent = ({ title, data }: { title: string; data: any }) => {
  // swiperBookListRef.current
  const swiperBookListRef = useRef<SwiperRef>(null);

  const handleNextBook = useCallback(() => {
    swiperBookListRef.current?.swiper?.slideNext();
  }, [swiperBookListRef]);
  const handlePreviousBook = useCallback(() => {
    swiperBookListRef.current?.swiper?.slidePrev();
  }, [swiperBookListRef]);
  return (
    <div className="relative">
      {/* <img
        src={blobsvg}
        className="absolute top-0 bottom-0 left-0 right-0 object-cover w-full bg-black bg-repeat opacity-20"
      /> */}
      <div className="container relative z-10 mt-5">
        <div className="flex items-center justify-between">
          <h3 className="my-3 text-3xl font-bold text-black capitalize">
            {title}
          </h3>
          <div className="flex gap-3">
            <div
              onClick={() => handlePreviousBook()}
              className="p-1 rotate-180 rounded-full cursor-pointer bg-primary hover:bg-yellow-400 "
            >
              <IoIosArrowForward size={20} />
            </div>
            <div
              onClick={() => handleNextBook()}
              className="p-1 rounded-full cursor-pointer bg-primary hover:bg-yellow-400 "
            >
              <IoIosArrowForward size={20} />
            </div>
          </div>
        </div>

        <Swiper
          ref={swiperBookListRef}
          className="py-3"
          style={{
            background: "transparent",
          }}
          breakpoints={{
            "320": {
              slidesPerView: 1.5,
              spaceBetween: 10,
            },
            "480": {
              slidesPerView: 2,
              spaceBetween: 10,
            },

            "768": {
              slidesPerView: 2.5,
              spaceBetween: 10,
            },
            "1024": {
              slidesPerView: 5,
              spaceBetween: 10,
            },
          }}
          loop
          modules={[]}
          slidesPerView={5}
          spaceBetween={10}
        >
          {data?.map((book: any, index: number) => (
            <SwiperSlide key={index}>
              <div className="w-[250px]">
                <BooksCard
                  id={book?.id}
                  img={book.cover_public_url}
                  title={book.title}
                  rating={book.rating}
                  price={book.price}
                  author={book.author}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export const BlogsListComponent = ({
  title,
  data,
}: {
  title: string;
  data: any;
}) => {
  // swiperBookListRef.current
  const swiperBlogListRef = useRef<SwiperRef>(null);

  const handleNextBook = useCallback(() => {
    swiperBlogListRef.current?.swiper?.slideNext();
  }, [swiperBlogListRef]);
  const handlePreviousBook = useCallback(() => {
    swiperBlogListRef.current?.swiper?.slidePrev();
  }, [swiperBlogListRef]);
  return (
    <>
      <div className="container mt-5">
        <div className="flex items-center justify-between">
          <h3 className="my-3 text-3xl font-bold text-black">{title}</h3>
          <div className="flex gap-3">
            <div
              onClick={() => handlePreviousBook()}
              className="p-1 rotate-180 rounded-full cursor-pointer bg-primary hover:bg-yellow-400 "
            >
              <IoIosArrowForward size={20} />
            </div>
            <div
              onClick={() => handleNextBook()}
              className="p-1 rounded-full cursor-pointer bg-primary hover:bg-yellow-400 "
            >
              <IoIosArrowForward size={20} />
            </div>
          </div>
        </div>

        <Swiper
          ref={swiperBlogListRef}
          className="py-3"
          style={{
            background: "transparent",
          }}
          loop
          modules={[]}
          slidesPerView={4}
          breakpoints={{
            "320": {
              slidesPerView: 1.5,
              spaceBetween: 10,
            },
            "480": {
              slidesPerView: 2,
              spaceBetween: 20,
            },

            "768": {
              slidesPerView: 2.5,
              spaceBetween: 20,
            },
            "1024": {
              slidesPerView: 4,
              spaceBetween: 20,
            },
          }}
          spaceBetween={20}
        >
          {data?.map((blog: any, index: number) => (
            <SwiperSlide key={index}>
              <BlogCard
                img={getImgUrlFromStrings(blog?.description)}
                title={blog?.title}
                categories={blog?.categories}
                pubDate={blog?.pubDate}
                link={blog?.link}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

const GenreContainer = () => {
  const { tokens, user } = useAppSelector((state) => state.userManage);
  const { userBooksGenresData, userBooksGenresDataFetch } =
    USER.getUserBooksGenres({
      userId: user?.uid,
      acsTkn: tokens?.acsTkn?.tkn,
    });

  useEffect(() => {
    userBooksGenresDataFetch();
  }, [user]);
  return (
    <div className="grid w-full grid-cols-3 gap-3 mt-5 ">
      {userBooksGenresData?.map((item: any, key: number) => (
        <div className="flex-col justify-between rounded-md bg-gradient-to-b from-primary via-orange-300 to-white-100">
          <div key={key} className="h-full gap-2 p-5 rounded-md ">
            <div className="grid w-full grid-cols-2 gap-5">
              {item?.books?.slice(0, 4)?.map((book: any) => (
                <Link
                  to={`/item/${book?.id}`}
                  className="flex flex-col items-center justify-center p-3 rounded-md bg-gray-50"
                >
                  <img
                    src={book?.cover_public_url}
                    className="justify-center w-20"
                  />
                  <div className="mt-1 font-medium text-gray-600">
                    {book?.title}
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="pb-4 text-xl font-semibold text-center text-black border-b border-gray-200 ">
            {item?.name}
          </div>
        </div>
      ))}
    </div>
  );
};

const BookOfDay = ({ book }: any) => {
  const [rows, __] = useState(2);
  const [expanded, setExpanded] = useState(false);
  return (
    <Link to={`/item/${book?.id}`} className="container">
      <h3 className="mb-10 mt-[50px] text-4xl font-bold text-black ">
        Book of the week
      </h3>
      <div
        className="container relative flex flex-row px-5 py-5 overflow-hidden bg-no-repeat bg-cover md:flex-col rounded-2xl"
        // style={{ backgroundImage: `url(${NFT?.cover_public_url})` }}
      >
        <img
          src={book?.cover_public_url}
          className="absolute top-0 bottom-0 left-0 right-0 w-full h-full overflow-hidden blur-xl -z-1"
        />
        <div className="container z-10 flex max-h-full md:min-h-[350px] flex-col gap-10  md:flex-row">
          <div className="flex justify-center flex-1 ">
            <div className="bg-gray-100  transition-all cursor-pointer hover:drop-shadow-xl hover:-translate-y-2 min-w-[300px] w-full max-w-[350px]  rounded-2xl">
              <div className="relative h-full ">
                <img
                  className="object-cover object-top w-full h-full p-2 rounded-2xl"
                  src={book?.cover_public_url}
                />
                <div className="bg-white p-0.5 absolute bottom-2 right-2 drop rounded-full">
                  <div className="p-2 rounded-full bg-primary ">
                    <LuShoppingCart size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="z-10 flex flex-col justify-center flex-1 md:mx-10 ">
            <div className="flex items-center justify-between ">
              <h3 className="mb-3 text-5xl font-bold text-white ">
                {book?.title}
              </h3>
            </div>
            <div className="flex ">
              <p className="flex items-center gap-2 ml-2 text-sm font-semibold text-gray-500">
                By{" "}
                <div className="bg-[#ffffff5f] rounded-md p-2">
                  {book?.author}
                </div>{" "}
                and
                <div className="flex items-center text-sm font-bold gap-x-2">
                  <FaStar className="text-primary" />
                  <span>{Number(book?.rating).toFixed(1)}</span>
                </div>
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
              {book?.synopsis}
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
                {book?.book_address?.slice(0, 8) +
                  "..." +
                  book?.book_address?.slice(-8)}
              </span>
              <Link
                to={`https://testnet.bscscan.com/address/${book?.book_address}`}
                target="_blank"
              >
                <MdArrowOutward className="text-xl cursor-pointer animate-pulse" />
              </Link>
            </div>

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
                    `Just finished reading ${book?.title} by ${book?.author} and I highly recommend it! 📚 Check it out here: `
                  )}`}
                  target="_blank"
                >
                  <FaTwitter className="transition-all cursor-pointer hover:text-primary" />
                </Link>
              </div>
            </div>

            <div className="p-4 mt-4 rounded-md ">
              <div className="flex flex-wrap justify-between gap-3">
                {[
                  {
                    icon: <IoMdHeart />,
                    label: "like",
                    value: book?.likes,
                  },
                  {
                    icon: <IoMdStar />,
                    label: "Reviews",
                    value: book?.rating,
                  },
                  {
                    icon: <IoMdPricetag />,
                    label: "Sold",
                    value: book?.copies,
                  },
                  // {
                  //   icon: <IoMdDocument />,
                  //   label: "Pages",
                  //   value: book?.print,
                  // },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center text-2xl transition-all cursor-pointer md:mr-16 hover:text-red-400 "
                  >
                    <p className="mb-2 text-xs font-semibold capitalize">
                      {item?.label}
                    </p>
                    {item?.icon}
                    <p className="mt-2 text-sm">{item?.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-10 mt-5 ">
              <span className="text-3xl font-extrabold ">${book?.price}</span>{" "}
              <Link to={`/item/${book?.id}`}>
                <CustomButton title="Buy Book" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const ExternalLinks = () => {
  return (
    <div className="container relative z-10 my-4">
      <h3 className="mb-5 mt-[60px] text-4xl font-bold text-black ">
        For the love of community
      </h3>
      <div className="grid grid-cols-5 gap-3 ">
        {[
          {
            title: "NightOwls",
            link: "https://www.nightowls.nalnda.com",
            img: "https://cdn.dribbble.com/users/604891/screenshots/16581214/media/bb111973c18ec6b36a067efdecc9a8ff.gif",
          },
          {
            title: "Airdrop",
            link: "https://www.nightowls.nalnda.com",
            img: "https://cdn.dribbble.com/userupload/5122811/file/original-44a612ac7df6ffbc25599c651eedf4ab.jpg",
          },
          {
            title: "FunkyReaders",
            link: "https://opensea.io/collection/funkyreaders",
            img: "https://cdn.dribbble.com/userupload/9019812/file/original-680eb3a88bae80aac4ad016d29901e9e.png",
          },
          {
            title: "Publish Book",
            link: "https://nalndamktplace.medium.com/how-to-sell-nft-based-ebooks-on-nalnda-bb3b2491320a",
            img: "https://cdn.dribbble.com/users/896264/screenshots/4962367/media/f76e95af2eff8e25f8c89523737aa6bf.jpg",
          },
          {
            title: "#Read2Earn",
            link: "https://nalndamktplace.medium.com/nbook-dont-just-read-your-book-own-it-c7075f2523bd",
            img: "https://cdn.dribbble.com/userupload/4261994/file/original-5274a63135d74e3203e6b4d1ce8a5929.png",
          },
        ].map((item, index) => (
          <a
            href={item?.link}
            key={index}
            target="_blank"
            className="p-2 font-medium text-center transition-all border rounded-md cursor-pointer bg-gray-150 hover:shadow-2xl hover:shadow-primary/50"
          >
            <img
              src={item?.img}
              className="object-cover h-full rounded-md shadow-md"
            />
            <div className="mt-3 font-semibold text-black">{item.title}</div>
          </a>
        ))}
      </div>
    </div>
  );
};
