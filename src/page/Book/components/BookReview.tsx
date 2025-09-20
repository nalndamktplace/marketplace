import { Button, Empty, Input, message, Modal, Rate } from "antd";
import { Form, Formik } from "formik";
import moment from "moment";
import { useEffect, useState } from "react";
import { isNotEmpty } from "../../../utils/getUrls";
import { useAccount } from "wagmi";
import { BOOK } from "../../../api/book/book";

type Props = {
  owner: boolean;
  nft: any;
  address: any;
};
function BookReview({ owner, nft, address }: Props) {
  const { bookReviewsData, bookReviewsRefetch } = BOOK.getBookReviewsQuery({
    bookAddress: nft?.book_address,
  });

  useEffect(() => {
    bookReviewsRefetch();
  }, [nft]);

  return (
    <div>
      {owner &&
      !bookReviewsData?.reviews?.filter(
        (review: any) => review?.owner_address == address
      )?.length ? (
        <ReviewModal
          bookAddress={nft?.book_address}
          ownerAddress={address}
          bookReviewsRefetch={bookReviewsRefetch}
        />
      ) : null}

      {bookReviewsData?.reviews?.map((reviews: any, index: any) => (
        <div className="p-4 my-4 bg-gray-100 rounded-md" key={index}>
          <div className="flex justify-end">
            <Rate disabled={true} value={reviews?.rating} />
          </div>
          <h4 className="font-semibold capitalize text-md">{reviews?.title}</h4>
          <p>{`${reviews?.body}`}</p>
          <div className="flex justify-between text-xs text-gray-900 text-end">
            <span> {moment(reviews?.reviewed_at).format("LL")}</span>
            <span className="text-xs font-semibold text-primary">
              By&nbsp;
              <span className="">
                {reviews?.owner_address?.slice(0, 4) +
                  "..." +
                  reviews?.owner_address?.slice(-4)}
              </span>
            </span>
          </div>
        </div>
      ))}
      {!bookReviewsData?.reviews.length && (
        <div className="flex justify-center col-span-3">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No Reviews Available"
          />
        </div>
      )}
    </div>
  );
}

const ReviewModal = ({
  bookAddress,
  ownerAddress,
  bookReviewsRefetch,
}: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isConnected } = useAccount();
  const { bookReviewMutateAsync, bookReviewLoading } =
    BOOK.bookReviewMutation();

  return (
    <>
      <div className="flex justify-end">
        <button
          onClick={() => {
            setIsModalOpen(true);
          }}
          className="bg-primary hover:bg-orange-600 transition-all px-10 text-white py-2.5 hover:drop-shadow-md font-semibold rounded-md"
        >
          Write review
        </button>
      </div>
      <Modal
        footer={null}
        title="Write Review"
        open={isModalOpen}
        onOk={() => {
          setIsModalOpen(false);
        }}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <Formik
          initialValues={{ rate: 1, review: "", title: "" }}
          onSubmit={async (value) => {
            if (isConnected) {
              if (isNotEmpty(value?.review) && isNotEmpty(value?.title)) {
                bookReviewMutateAsync({
                  review: {
                    rating: value?.rate,
                    title: value?.title,
                    body: value?.review,
                  },
                  bookAddress: bookAddress,
                  ownerAddress: ownerAddress,
                })
                  .then(async () => {
                    await bookReviewsRefetch();
                    setIsModalOpen(false);
                  })
                  .catch(() => {
                    message.error("Something went wrong");
                  });
              } else {
                message.warning("Please fill the review");
              }
            } else {
              message.warning("Please login first");
            }
          }}
        >
          {({ setFieldValue, values }) => (
            <Form>
              <div className="flex flex-col gap-4">
                <Rate
                  value={values.rate}
                  onChange={(e) => setFieldValue("rate", e)}
                  allowHalf
                  defaultValue={0}
                />
                <Input
                  onChange={(e) => setFieldValue("title", e.target.value)}
                  placeholder="Enter Title "
                />
                <Input.TextArea
                  onChange={(e) => setFieldValue("review", e.target.value)}
                  placeholder="Write your review here "
                />
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  loading={bookReviewLoading}
                  disabled={bookReviewLoading}
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
export default BookReview;
