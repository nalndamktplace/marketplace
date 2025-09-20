import { ConfigProvider, Empty, Tabs, TabsProps } from "antd";
import BooksCard from "../../components/BooksCard";

import { BOOK } from "../../api/book/book";
import { useAppSelector } from "../../store/hooks";
import { useAccount } from "wagmi";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

function LibraryPage() {
  const { user, tokens } = useAppSelector((state) => state.userManage);
  const { address } = useAccount();
  const { publishedBookData, publishedBookDataRefetch } =
    BOOK.getPublishedBookQuery({
      walletAddress: address,
      acsTkn: tokens?.acsTkn?.tkn,
      uid: user?.uid,
    });

  const { listingBookData, listingBookDataRefetch } = BOOK.getListingBookQuery({
    walletAddress: address,
    acsTkn: tokens?.acsTkn?.tkn,
    uid: user?.uid,
  });

  const { ownedBookData, ownedBookDataRefetch } = BOOK.getOwnedBookQuery({
    walletAddress: address,
    acsTkn: tokens?.acsTkn?.tkn,
    uid: user?.uid,
  });

  useEffect(() => {
    publishedBookDataRefetch();
    ownedBookDataRefetch();
    listingBookDataRefetch();
  }, [user, address, tokens]);

  return (
    <div className="col-span-3">
      <TabsSection
        publishedBookData={publishedBookData}
        ownedBookData={ownedBookData}
        listingBookData={listingBookData}
      />
    </div>
  );
}

const TabsSection = ({
  publishedBookData,
  ownedBookData,
  listingBookData,
}: any) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab");
  const items: TabsProps["items"] = [
    {
      key: "library",
      label: "Library",
      children: (
        <>
          {!ownedBookData?.length ? (
            <div className="flex justify-center col-span-3">
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:col-span-3">
              {ownedBookData?.map((item: any, index: number) => (
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
        </>
      ),
    },
    {
      key: "published",
      label: "Published",
      children: (
        <>
          {!publishedBookData?.length ? (
            <div className="flex justify-center col-span-3">
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:col-span-3">
              {publishedBookData?.map((item: any, index: number) => (
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
        </>
      ),
    },
    {
      key: "listing",
      label: "Listing",
      children: (
        <>
          {!listingBookData?.length ? (
            <div className="flex justify-center col-span-3">
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:col-span-3">
              {listingBookData?.map((item: any, index: number) => (
                <BooksCard
                  id={item?.bookId}
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
        </>
      ),
    },
  ];
  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Tabs: {
              colorPrimary: "#fe6845",
              itemHoverColor: "#fe6845",
              fontSize: 16,
            },
          },
        }}
      >
        <Tabs
          defaultActiveKey={activeTab || "library"}
          onChange={(e) => setSearchParams({ tab: e })}
          items={items}
          color="#fe6845"
          tabBarStyle={{
            color: "#fe6845",
          }}
        />
      </ConfigProvider>
    </>
  );
};

export default LibraryPage;
