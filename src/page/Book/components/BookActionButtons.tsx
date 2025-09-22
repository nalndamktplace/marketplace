import Swal from "sweetalert2";
import CustomButton from "../../../components/Button";
import { Divider, Modal, Typography } from "antd";
import { DateInputField } from "../../PublishPage";
import moment from "moment";
import { IoMdInformationCircle } from "react-icons/io";
import TextInput from "../../../components/TextInput";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import ConnectWallet from "../../../components/ConnectWallet";
import { useState } from "react";
function BookActionButtons({
  isAuthenticated,
  isConnected,
  listed,
  published,
  owner,
  loading,
  bookOwnerLoading,
  unListLoading,
  unListBookToMarketplaceLoading,
  sellLoading,
  listBookToMarketplaceLoading,
  bookReaderReadTimeData,
  userBookData,
  userBookReadTimeData,
  NFT,
  onListHandler,
  readHandler,
  cryptoPurchaseHandler,
  bookCryptoOrderLoading,
  writeAsyncTokenApproveLoading,
  safeMintWriteAsyncLoading,
  buyLoading,
  unlistHandler,
}: any) {
  return (
    <div className="flex items-center gap-10 mt-5 ">
      {bookOwnerLoading ? (
        <CustomButton loading disabled title="" />
      ) : (
        <>
          {!isAuthenticated ? (
            <>
              <span className="text-3xl font-extrabold ">₹{NFT?.price}</span>{" "}
              <CustomButton
                onClick={() => {
                  Swal.fire("Warning", "Login and register first", "warning");
                }}
                title="Buy Book"
              />
            </>
          ) : !isConnected ? (
            <ConnectWallet />
          ) : listed ? (
            <CustomButton
              disabled={unListLoading || unListBookToMarketplaceLoading}
              loading={unListLoading || unListBookToMarketplaceLoading}
              onClick={unlistHandler}
              title="Remove Listing"
            />
          ) : published ? (
            <>
              {!isConnected ? (
                <ConnectWallet />
              ) : (
                <CustomButton
                  disabled={loading}
                  onClick={readHandler}
                  title="Read Book"
                />
              )}
            </>
          ) : owner ? (
            <>
              <CustomButton
                onClick={readHandler}
                disabled={loading}
                title="Read Book"
              />

              <SellListModal
                disabled={sellLoading || listBookToMarketplaceLoading}
                loading={sellLoading || listBookToMarketplaceLoading}
                bookData={userBookData}
                nftDetails={NFT}
                userBookReadTimeData={userBookReadTimeData}
                onListHandler={onListHandler}
                readTime={Math.ceil(
                  bookReaderReadTimeData?.total_read_time / 60,
                )}
              />
            </>
          ) : (
            <>
              <span className="text-3xl font-extrabold ">₹{NFT?.price}</span>{" "}
              <CustomButton
                onClick={() => cryptoPurchaseHandler()}
                loading={
                  bookCryptoOrderLoading ||
                  buyLoading ||
                  writeAsyncTokenApproveLoading ||
                  safeMintWriteAsyncLoading
                }
                disabled={
                  bookCryptoOrderLoading ||
                  buyLoading ||
                  writeAsyncTokenApproveLoading ||
                  safeMintWriteAsyncLoading
                }
                title=" Buy Book"
              />
              {/* <CustomButton onClick={readHandler} title="Read Book" /> */}
              {/* <CustomButton
                        onClick={previewHandler}
                        title="Preview Book"
                      /> */}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default BookActionButtons;

const SellListModal = ({
  disabled,
  loading,
  onListHandler,
  bookData,
  userBookReadTimeData,
  nftDetails,
  readTime,
}: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [price, setPrice] = useState("");
  const upperBand = Math.min(
    Number(bookData?.purchase_price),
    userBookReadTimeData?.upperBand * Number(bookData?.purchase_price),
  );

  const lowerBand =
    userBookReadTimeData?.lowerBand * Number(bookData?.purchase_price);
  console.log(upperBand, lowerBand);
  // const suggestedPrice = median([upperBand, lowerBand]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <CustomButton
        disabled={disabled}
        loading={loading}
        onClick={() => {
          showModal();
        }}
        title="Sell"
      />
      <Modal
        closable={false}
        title={null}
        open={isModalOpen}
        onOk={handleOk}
        footer={null}
        onCancel={handleCancel}
      >
        <Formik
          validationSchema={Yup.object({
            price: Yup.number()
              .required("Price is required")
              .positive("Price must be positive"),
            listingDate: Yup.date(),
          })}
          initialValues={{
            price: 12,
            listingDate: "",
          }}
          onSubmit={(values) => {
            if ((values?.price as any) > 0) {
              showModal();
              onListHandler({ price: values?.price });
              handleCancel();
            } else {
              Swal.fire("Warning", "Please enter a price", "warning");
            }
          }}
        >
          {({ setFieldValue, handleSubmit, values }) => {
            const serviceFee = (values?.price * 1.99) / 100;
            const authorsCommission = values?.price * 0.05;
            const receivePrice = values?.price - serviceFee - authorsCommission;
            return (
              <Form>
                <div className="flex bg-white border rounded-md">
                  <img
                    className="h-[200px] rounded-md w-[150px]"
                    src={nftDetails?.cover_public_url}
                  />
                  <div className="flex flex-col flex-1 p-5 my-2 gap-y-3">
                    <Typography
                      style={{ marginBottom: 10, fontWeight: "bold" }}
                    >
                      <span className="">{nftDetails?.title}</span>
                    </Typography>
                    <Typography
                      style={{
                        marginBottom: 2,
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>Total Read time by you </span>
                      <span className="font-semibold ">{readTime} min</span>
                    </Typography>
                    <Typography
                      style={{
                        marginBottom: 2,
                        fontWeight: "bold",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>Books Decav score</span>
                      <span className="font-semibold ">
                        {Number(userBookReadTimeData?.da_score).toFixed(2)}
                      </span>
                    </Typography>
                    <Typography
                      style={{
                        marginBottom: 2,
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>Total Count of previous owner</span>
                      <span className="font-semibold ">
                        {nftDetails?.copies}
                      </span>
                    </Typography>
                  </div>
                </div>

                <Typography
                  style={{
                    marginTop: 12,
                    marginBottom: 12,
                    fontWeight: "semibold",
                  }}
                >
                  <span className="font-semibold text-gray-500 ">
                    Listing Details
                  </span>
                </Typography>
                <div className="mb-3">
                  <TextInput
                    placeholder="Amount"
                    name="price"
                    label="Price"
                    htmlType="number"
                  />

                  <div className="flex items-center gap-1 mt-2">
                    <IoMdInformationCircle className="text-yellow-500" />
                    <Typography
                      color="gray"
                      style={{ marginBottom: 2, fontStyle: "italic" }}
                    >
                      Suggested Price based on the Decay Score
                    </Typography>
                  </div>
                </div>
                <div>
                  <DateInputField
                    disabled
                    label="Listing Expire date"
                    placeholder="Enter when book was published"
                    name="listingDate"
                    value={moment().add(30, "days")}
                    setFieldValue={setFieldValue}
                  />
                </div>
                <Divider />

                <div>
                  <Typography
                    style={{
                      marginBottom: 2,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>Service Fee(1.99%)</span>
                    <span className="font-semibold ">
                      ₹{serviceFee.toFixed(2)}
                    </span>
                  </Typography>
                  <Typography
                    style={{
                      marginBottom: 2,
                      fontWeight: "bold",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>Authors Commission(5%)</span>
                    <span className="font-semibold ">
                      ₹{authorsCommission.toFixed(2)}
                    </span>
                  </Typography>
                  <Typography
                    style={{
                      marginBottom: 2,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>You will receive</span>
                    <span className="font-semibold ">
                      ₹{receivePrice?.toFixed(2)}
                    </span>
                  </Typography>
                </div>
                {/* <div>
         <Typography
           style={{
             marginBottom: 2,
             display: "flex",
             justifyContent: "space-between",
           }}
         >
           <span>Old Users</span>
           <span className="font-semibold ">{bookData?.hands}</span>
         </Typography>
         <Typography
           style={{
             marginBottom: 2,
             display: "flex",
             justifyContent: "space-between",
           }}
         >
           <span>Da Score</span>
           <span className="font-semibold ">
             {Number(userBookReadTimeData?.da_score).toFixed(2)}
           </span>
         </Typography>
         <Typography
           style={{
             marginBottom: 2,
             display: "flex",
             justifyContent: "space-between",
           }}
         >
           <span>To Platform</span>
           <span className="font-semibold ">5%</span>
         </Typography>
         <Typography
           style={{
             marginBottom: 2,
             display: "flex",
             justifyContent: "space-between",
           }}
         >
           <span>Authors Commission</span>
           <span className="font-semibold ">2%</span>
         </Typography>
       </div> */}
                {/* <Typography
         style={{
           marginBottom: 2,
           display: "flex",
           justifyContent: "space-between",
         }}
       >
         <span>Suggested Price based on the Decay Score</span>
         <span className="font-semibold ">
           ${suggestedPrice ? suggestedPrice : 0}
         </span>
       </Typography> */}
                <div className="flex justify-end mt-4 text-white">
                  <CustomButton
                    isWidth
                    disabled={disabled}
                    loading={loading}
                    onClick={handleSubmit}
                    title="Post Listing"
                  />
                </div>
              </Form>
            );
          }}
        </Formik>
      </Modal>
    </>
  );
};
