import { Form, Formik } from "formik";
import * as Yup from "yup";
import TextInput from "../../components/TextInput";
import { ImageUploader } from "../PublishPage";
import SelectInputField from "../../components/SelectInputField";

import { BOOK } from "../../api/book/book";
import { useEffect, useMemo, useState } from "react";
import { COLLECTION } from "../../api/collection/collection";
import Swal from "sweetalert2";
import {
  hideSpinner,
  showSpinner,
} from "../../store/slice/spinnerManageReducer";
import { useDispatch } from "react-redux";
function TrendingFrom() {
  const [search, setSearch] = useState("");
  const { booksData } = BOOK.getAllBooksQuery();
  const dispatch = useDispatch();
  const { trendingBookMutationMutateAsync, trendingBookMutationLoading } =
    COLLECTION.trendingBookMutation();

  useEffect(() => {
    if (trendingBookMutationLoading) dispatch(showSpinner());
    else dispatch(hideSpinner());
  }, [trendingBookMutationLoading, dispatch]);

  const filterData = useMemo(() => {
    return booksData
      ?.filter((book: any) => {
        console.log(book?.title?.toLowerCase(), search?.toLowerCase());
        return book?.title?.toLowerCase().includes(search?.toLowerCase());
      })
      .map((book: any) => {
        return {
          value: book?.id,
          label: (
            <div className="flex gap-2">
              <img
                src={book?.cover_public_url}
                className="object-cover w-10 h-10"
              />
              <div className="text-bold">{book?.title}</div>
            </div>
          ),
        };
      });
  }, [booksData, search]);

  return (
    <div className="container">
      <Formik
        initialValues={{
          title: "",
          paragraph: "",
          image: "",
          books: [],
        }}
        validationSchema={Yup.object().shape({
          title: Yup.string()
            .required("Title is required")
            .min(3, "Title must be at least 3 characters")
            .max(100, "Title cannot exceed 100 characters"),

          paragraph: Yup.string()
            .required("Paragraph is required")
            .min(10, "Paragraph must be at least 10 characters")
            .max(500, "Paragraph cannot exceed 500 characters"),

          image: Yup.mixed().required("Image is required"),
          // .test("fileType", "Unsupported File Format", (value: any) => {
          //   return value && ["image/png"].includes(value.type);
          // }),

          books: Yup.array()
            .of(Yup.string().required("A valid book is required"))
            .min(1, "You must select at least 1 book")
            .max(5, "You can select up to 5 books only"),
        })}
        onSubmit={(values, { resetForm }) => {
          const formData = new FormData();
          formData.append("title", values.title);
          formData.append("author", "Nalnda");
          formData.append("paragraph", values.paragraph);
          formData.append("image", values.image);
          formData.append("books", JSON.stringify(values.books));

          trendingBookMutationMutateAsync({
            bodyData: formData,
          })
            .then(async () => {
              resetForm();
              Swal.fire("Success", "Form submitted successfully", "success");
              // navigate("/", { replace: true });
            })
            .catch(() => {
              Swal.fire("Warning", "Something went wrong", "warning");
            });
        }}
      >
        {({ setFieldValue, values }: any) => (
          <Form>
            <div className="container mx-auto mt-5 md">
              <div className="flex flex-col gap-5">
                <img
                  className="w-40 h-40"
                  src={values?.image && URL?.createObjectURL(values?.image)}
                />
                <ImageUploader
                  label={"Upload Image"}
                  accept="images/png"
                  name={"image"}
                  setFieldValue={setFieldValue}
                />
                <TextInput
                  placeholder="Enter Title"
                  name="title"
                  label="Title"
                  htmlType="text"
                />
                <TextInput
                  placeholder="Paragraph"
                  name="paragraph"
                  label="paragraph"
                  htmlType="textarea"
                />
                <SelectInputField
                  label={"Select Books"}
                  name="books"
                  showSearch
                  onSearch={(e: any) => setSearch(e)}
                  placeholder="Select Books. You can select max 5 books"
                  options={filterData || []}
                  maxCount={5}
                  mode={"multiple"}
                  setFieldValue={setFieldValue}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                disabled={trendingBookMutationLoading}
                type="submit"
                className="bg-primary  text-white hover:bg-yellow-500 transition-all px-5 py-1.5 hover:drop-shadow-md font-semibold rounded-md"
              >
                Submit
              </button>
            </div>
          </Form>
        )}
      </Formik>

      {/* <div>
        {trendingBooksData?.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-3 mb-2 border border-primary rounded-xl"
          >
            <img src={item?.image} className="w-40 h-40 rounded-md " />
            <div className="font-semibold text-black">{item?.title}</div>
          </div>
        ))}
      </div> */}
    </div>
  );
}

export default TrendingFrom;
