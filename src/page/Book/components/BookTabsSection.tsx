import BookAboutSection from "./BookAboutSection";
import BookReview from "./BookReview";
import BookQuote from "./BookQuote";
import { ConfigProvider, Tabs, TabsProps } from "antd";
import { useSearchParams } from "react-router-dom";

const BookTabsSection = ({
  synopsis,
  genres,
  ageGroup,
  readerReadCount,
  readerReadTime,
  totalReaderCount,
  language,
  owner,
  nft,
  address,
  published,
}: any) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab");
  const items: TabsProps["items"] = [
    {
      key: "about",
      label: "About",
      children: (
        <BookAboutSection
          readerReadCount={readerReadCount}
          readerReadTime={readerReadTime}
          totalReaderCount={totalReaderCount}
          ageGroup={ageGroup}
          genres={genres}
          synopsis={synopsis}
          language={language}
        />
      ),
    },

    {
      key: "reviews",
      label: "Reviews",
      children: <BookReview owner={owner} nft={nft} address={address} />,
    },

    {
      key: "quotes",
      label: "Quotes",
      children: (
        <BookQuote
          published={published}
          owner={owner}
          NFT={nft}
          address={address}
        />
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
          defaultActiveKey={activeTab || "about"}
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

export default BookTabsSection;
