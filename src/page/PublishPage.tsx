import { Button, message, Upload } from "antd";
import BooksCard from "../components/BooksCard";
import TextInput from "../components/TextInput";
import { ErrorMessage, Form, Formik, useFormikContext } from "formik";
import * as Yup from "yup";
import { MdOutlineFileUpload } from "react-icons/md";
import { GENRES } from "../config/geners";
import { LANGUAGES } from "../config/languages";
import { AGE_GROUPS } from "../config/ages";
import { BOOK } from "../api/book/book";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useAccount, usePublicClient } from "wagmi";
import { useEffect, useState } from "react";
import { hideSpinner, showSpinner } from "../store/slice/spinnerManageReducer";
import moment from "moment";
import { MARKET_CONTRACT_ADDRESS } from "../constant/constant";
import {
  useContractWriteWithWaitForTransaction,
  useUSDCContractRead,
} from "../hooks/useContract";
import { MARKET_CONTRACT_ABI } from "../constant/abi/Marketplace";
import { Abi, parseUnits } from "viem";
import { isUsable } from "../utils/getUrls";
import MyDatePicker from "../components/DatePicker";
import { useNavigate } from "react-router-dom";
import ConnectWallet from "../components/ConnectWallet";
import SelectInputField from "../components/SelectInputField";
function PublishPage() {
  const { bookSubmarineMutationAsync } = BOOK.bookSubmarineMutation();
  const { isConnected } = useAccount();
  const { bookPublishDataMutationAsync } = BOOK.bookPublishMutation();
  const dispatch = useAppDispatch();
  const { address } = useAccount();
  const { tokens, user } = useAppSelector((state) => state.userManage);
  const { waitForTransactionReceipt } = usePublicClient();
  const [Loading, setLoading] = useState(false);
  const data = useUSDCContractRead();
  const { writeAsync } = useContractWriteWithWaitForTransaction({
    address: MARKET_CONTRACT_ADDRESS,
    abi: MARKET_CONTRACT_ABI as Abi,
    functionName: "createNewBook",
  });

  const navigate = useNavigate();
  const listNFTForSale = (values: any, actions: any) => {
    const {
      name,
      author,
      price,
      printPageCount,
      publication,
      synopsis,
      language,
      publishedDate,
      secondaryDate,
      genres,
      ageGroup,
      cover,
      book,
    }: any = values;

    const formData = new FormData();
    formData.append("book", book);
    formData.append("cover", cover);
    formData.append("bookTitle", name);
    formData.append("synopsis", synopsis);

    setLoading(true);
    bookSubmarineMutationAsync({
      uid: user?.uid,
      walletAddress: address,
      acsTkn: tokens?.acsTkn?.tkn,
      bodyData: formData,
    })
      .then(async (res) => {
        const bookUrl = res.book.url;
        const coverUrl = res.cover.url;
        const genreIDs: any = [];
        genres.forEach((genre: any) =>
          genreIDs.push(GENRES.indexOf(genre).toString())
        );
        const languageId = LANGUAGES.indexOf(language).toString();

        const now: any = moment(new Date());
        const secondaryFromInDays = Math.round(
          moment.duration(secondaryDate - now).asDays()
        );

        try {
          console.log([
            address,
            coverUrl,
            parseUnits(String(price), data),
            secondaryFromInDays,
            100,
            languageId,
            genreIDs,
          ]);
          const { hash } = await writeAsync({
            args: [
              address,
              coverUrl,
              parseUnits(String(price), data),
              // secondaryFromInDays,
              100,
              languageId,
              genreIDs,
            ],
          });
          const res = await waitForTransactionReceipt({
            hash: hash,
          });
          const bookAddress = res.logs[0]?.address;
          const txHash = res.transactionHash;
          const status = res.status;
          if (
            isUsable(bookAddress) &&
            isUsable(status) &&
            status === "success" &&
            isUsable(txHash)
          ) {
            const formData = new FormData();
            formData.append("epub", book);
            formData.append("name", name);
            formData.append("author", author);
            formData.append("cover", coverUrl);
            formData.append("coverFile", cover);
            formData.append("book", bookUrl);
            formData.append(
              "genres",
              JSON.stringify(genres.sort((a: any, b: any) => a > b))
            );
            formData.append(
              "ageGroup",
              JSON.stringify(ageGroup.sort((a: any, b: any) => a > b))
            );
            formData.append("price", price);
            formData.append("pages", printPageCount);
            formData.append("publication", publication);
            formData.append("synopsis", synopsis.replace(/<[^>]+>/g, ""));
            formData.append("language", language);
            formData.append("published", publishedDate);
            formData.append("secondarySalesFrom", secondaryDate);
            formData.append("publisherAddress", String(address));
            formData.append("bookAddress", bookAddress);
            formData.append("txHash", txHash);
            const data = await bookPublishDataMutationAsync({
              bodyData: formData,
            });
            console.log(data);
            actions.resetForm();
            setLoading(false);
            navigate("/user/library?tab=published", { replace: true });
            setLoading(false);
          }
        } catch (err) {
          console.log(err);
          message.error("Something went wrong");
          setLoading(false);
        } finally {
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (Loading) dispatch(showSpinner());
    else dispatch(hideSpinner());
  }, [Loading, dispatch]);

  return (
    <div>
      <div>
        <Formik
          validationSchema={Yup.object({
            price: Yup.number()
              .required("Price is required")
              .positive("Price must be positive"),
            name: Yup.string().required("Book Name is not be empty"),
            author: Yup.string().required("Author Name is required"),
            printPageCount: Yup.number()
              .required("Number of print pages is required")
              .integer("Number of print pages must be an integer"),
            publication: Yup.string().required("Publication is required"),
            synopsis: Yup.string().required("Synopsis is required"),
            language: Yup.string().required("Language is required"),
            publishedDate: Yup.date().required("Published Date is required"),
            secondaryDate: Yup.date().required("Secondary Date is required"),
            // .min(
            //   moment().add(90, "days").toDate(),
            //   "Secondary Date must be at least 90 days from today"
            // )
            // .max(
            //   moment().add(150, "days").toDate(),
            //   "Secondary Date must be within 150 days from today"
            // ),
            genres: Yup.array()
              .min(1, "Select at least one genre")
              .max(5, "Select maximum of 5 genres"),
            ageGroup: Yup.array().min(1, "Select at least one age group"),

            cover: Yup.mixed().required("Cover image is required"),

            book: Yup.mixed().required("Book file is required"),
          })}
          onSubmit={(values, actions) => {
            listNFTForSale(values, actions);
          }}
          initialValues={{
            name: "The Golden Era",
            author: "Ritik Chhipa",
            price: 13.2,
            printPageCount: 13,
            publication: "dasdasdasdas",
            synopsis:
              "The word “synopsis” comes from the Ancient Greek word synopsesthai which means quite literally “a comprehensive view.” A novel synopsis includes a brief summary of your story's main plot, subplots, and the ending, a few character descriptions, and an overview of your major themes",
            language: "",
            publishedDate: "",
            secondaryDate: "",
            cover: null,

            book: null,
            genres: [],
            ageGroup: [],
          }}
        >
          {({ setFieldValue }) => (
            <Form>
              <div className="container mx-auto mt-5 md">
                <div className="flex justify-between mb-5 ">
                  <h3 className="text-4xl font-semibold text-primary ">
                    Publish Book
                  </h3>
                </div>
                <div className="flex flex-col-reverse flex-1 gap-10 md:flex-row">
                  <div className="flex-1">
                    <div className="mt-5 ">
                      <>
                        <h3 className="my-5 text-lg font-bold text-gray-800">
                          Information
                        </h3>
                        <TextInput
                          placeholder="Enter the name of the book"
                          name="name"
                          label="Book Name"
                          htmlType="text"
                        />
                        <TextInput
                          placeholder="Enter the name of the author"
                          name="author"
                          label="Author Name"
                          htmlType="text"
                        />
                        <TextInput
                          placeholder="Enter the price in USDC"
                          name="price"
                          label="Book Price"
                          htmlType="text"
                        />
                      </>
                      <>
                        <h3 className="my-5 text-xl font-bold text-gray-800">
                          Upload Files
                        </h3>

                        <ImageUploader
                          label={
                            "Upload a picture of book cover. File types supported: JPG, PNG, GIF, SVG, WEBP"
                          }
                          // accept="image/*"
                          accept="image/webp, image/jpg, image/jpeg, image/png"
                          name="cover"
                          setFieldValue={setFieldValue}
                        />

                        <ImageUploader
                          label={"Upload a book. File types supported: EPUB"}
                          accept="application/epub+zip"
                          name={"book"}
                          setFieldValue={setFieldValue}
                        />
                      </>
                      <>
                        <h3 className="text-xl font-bold text-gray-800 my-7">
                          Metadata
                        </h3>
                        {/* // genres */}

                        <SelectInputField
                          label={"Genres"}
                          name="genres"
                          placeholder="Select genres of the book. You can select max 5 genres"
                          options={GENRES?.map((genres) => {
                            return { value: genres, label: genres };
                          })}
                          maxCount={5}
                          mode={"multiple"}
                          setFieldValue={setFieldValue}
                        />
                        {/* // Age Group */}

                        <SelectInputField
                          label={"Age Group"}
                          name="ageGroup"
                          placeholder="Select the most appropriate age group for the book."
                          options={AGE_GROUPS?.map((age) => {
                            return { value: age, label: age };
                          })}
                          maxCount={1}
                          mode={"multiple"}
                          setFieldValue={setFieldValue}
                        />
                        {/* // Language */}

                        <SelectInputField
                          label={"Language"}
                          name="language"
                          setFieldValue={setFieldValue}
                          placeholder="Select book language"
                          options={LANGUAGES?.map((age) => {
                            return { value: age, label: age };
                          })}
                        />

                        <TextInput
                          placeholder="Enter the Number of print pages in book"
                          name="printPageCount"
                          label="Number of print pages"
                          htmlType="text"
                        />
                        <TextInput
                          placeholder="Enter the Publishers"
                          name="publication"
                          label="Publication"
                          htmlType="text"
                        />
                        <TextInput
                          placeholder="Write a brief description of the book"
                          htmlType="textarea"
                          name="synopsis"
                          label="Synopsis"
                        />

                        <DateInputField
                          label="Published"
                          placeholder="Enter when book was published"
                          name="publishedDate"
                          setFieldValue={setFieldValue}
                        />
                      </>
                      <>
                        <h3 className="text-xl font-bold text-gray-800 my-7">
                          Secondary Sales Conditions
                        </h3>

                        <DateInputField
                          label="Open On"
                          placeholder="From When you want to secondary sales"
                          name="secondaryDate"
                          setFieldValue={setFieldValue}
                        />
                      </>

                      {isConnected ? (
                        <button
                          type="submit"
                          className="bg-primary mt-5 hover:bg-yellow-500 transition-all px-5 py-1.5 hover:drop-shadow-md font-semibold rounded-md"
                        >
                          Submit
                        </button>
                      ) : (
                        <ConnectWallet />
                      )}
                    </div>
                  </div>
                  <PreviewSection />
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

const PreviewSection = () => {
  const { values }: any = useFormikContext();

  return (
    <>
      <div className="">
        <BooksCard
          id={"nfdsj"}
          img={values?.cover ? URL?.createObjectURL(values?.cover) : ""}
          author={values?.author == "" ? "Author Name" : values?.author}
          rating={5}
          title={values?.name == "" ? "Author Name" : values?.name}
          price={values?.price}
        />
      </div>
    </>
  );
};

export const ImageUploader = ({ label, accept, setFieldValue, name }: any) => {
  return (
    <div className="mb-4">
      <label className="block mb-2 text-sm font-semibold text-gray-700">
        {label}
      </label>
      <Upload
        accept={accept}
        maxCount={1}
        beforeUpload={(e) => {
          setFieldValue(name, e);
        }}
      >
        <Button icon={<MdOutlineFileUpload />}>Click to Upload</Button>
      </Upload>
      <div className="mt-1 text-xs text-red-400">
        <ErrorMessage name={name} />
      </div>
    </div>
  );
};

export const DateInputField = (props: any) => {
  return (
    <>
      <div className="mb-5">
        <label className="block mb-2 text-sm font-semibold text-gray-700">
          {props?.label}
        </label>

        <MyDatePicker
          size="large"
          {...props}
          onChange={(e: any) => {
            props?.setFieldValue(props?.name, e);
          }}
          style={{ width: "100%" }}
          placeholder={props?.placeholder}
        />
        <div className="mt-1 text-xs text-red-400">
          <ErrorMessage name={props?.name} />
        </div>
      </div>
    </>
  );
};

export default PublishPage;
