import { Button, Empty, Input, message, Modal } from "antd";
import { isNotEmpty } from "../../../utils/getUrls";
import { Form, Formik } from "formik";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { BOOK } from "../../../api/book/book";
import moment from "moment";

type Props = {
  published: boolean;
  owner: boolean;
  address: `0x${string}` | undefined;
  NFT: any;
};
function BookQuote({ published, owner, address, NFT }: Props) {
  const { bookQuotesData, bookQuotesRefetch } = BOOK.getBookQuotesQuery({
    bookAddress: NFT?.book_address,
  });

  useEffect(() => {
    bookQuotesRefetch();
  }, [NFT]);

  return (
    <div>
      <>
        {published || owner ? (
          <QuoteModal
            bookAddress={NFT?.book_address}
            ownerAddress={address}
            bookQuotesRefetch={bookQuotesRefetch}
          />
        ) : null}

        {bookQuotesData?.map((quote: any, index: number) => (
          <div className="p-4 my-4 bg-gray-100 rounded-md" key={index}>
            <p>{`"${quote?.body}"`}</p>
            <div className="text-xs text-gray-900 text-end">
              -{moment().format("LL")}
            </div>
          </div>
        ))}
        {!bookQuotesData?.length && (
          <div className="flex justify-center col-span-3">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No Quotes Available"
            />
          </div>
        )}
      </>
    </div>
  );
}

const QuoteModal = ({ bookAddress, ownerAddress, bookQuotesRefetch }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { bookQuotesMutateAsync, bookQuotesLoading } = BOOK.bookQuoteMutation();
  const { isConnected } = useAccount();
  return (
    <>
      <div className="flex justify-end">
        <button
          onClick={() => {
            setIsModalOpen(true);
          }}
          className="bg-primary hover:bg-orange-600 transition-all px-10 text-white py-2.5 hover:drop-shadow-md font-semibold rounded-md"
        >
          Write Quote
        </button>
      </div>
      <Modal
        footer={null}
        title="Write Quote"
        open={isModalOpen}
        onOk={() => {
          setIsModalOpen(false);
        }}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <Formik
          initialValues={{ quote: "" }}
          onSubmit={async (value) => {
            if (isConnected) {
              if (isNotEmpty(value?.quote)) {
                bookQuotesMutateAsync({
                  quote: { body: value.quote },
                  bookAddress: bookAddress,
                  ownerAddress: ownerAddress,
                  cfi_range: "",
                })
                  .then(async () => {
                    await bookQuotesRefetch();
                    setIsModalOpen(false);
                  })
                  .catch(() => {
                    message.error("Something went wrong");
                  });
              } else {
                message.warning("Please enter the quote");
              }
            } else {
              message.warning("Please login first");
            }
          }}
        >
          {({ setFieldValue }) => (
            <Form>
              <Input.TextArea
                onChange={(e) => setFieldValue("quote", e.target.value)}
                placeholder="Write your quote here "
              />

              <div className="flex justify-end mt-4">
                <Button
                  loading={bookQuotesLoading}
                  disabled={bookQuotesLoading}
                  htmlType="submit"
                  type="primary"
                >
                  Submit
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
};

export default BookQuote;
