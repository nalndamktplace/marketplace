import { ErrorMessage, Form, Formik } from "formik";
import { Modal, Radio, Select } from "antd";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { GENRES } from "../config/geners";
import { USER } from "../api/user/user";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import { setUser } from "../store/slice/userManageReducer";

function UserSurveyPage() {
  return (
    <div className="container">
      <UserSueryModal />
    </div>
  );
}

const RadioGrp = ({ label, options, name, setFieldValue, value }: any) => {
  return (
    <div className="mb-3">
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}
      <Radio.Group
        onChange={(e) => {
          setFieldValue(name, e.target.value);
        }}
        value={value}
      >
        {options?.map((item: any, index: number) => (
          <Radio key={index} value={item.value}>
            {item.title}
          </Radio>
        ))}
      </Radio.Group>

      <ErrorMessage
        name={name}
        component="div"
        className="mt-3 text-sm text-red-400 "
      />
    </div>
  );
};
const SelectGrp = ({
  label,
  options,
  name,
  setFieldValue,
  value,
  placeholder,
  mode,
  maxCount,
}: any) => {
  return (
    <div className="mb-3">
      {label && (
        <label className="block mb-2 text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}
      <Select
        style={{ width: "100%" }}
        onChange={(e) => {
          setFieldValue(name, e);
        }}
        mode={mode}
        placeholder={placeholder}
        value={value}
        maxCount={maxCount}
      >
        <Select.Option value={""}>Select The Genres</Select.Option>
        {options?.map((item: any, index: number) => (
          <Select.Option key={index} value={item.value}>
            {item.title}
          </Select.Option>
        ))}
      </Select>

      <ErrorMessage
        name={name}
        component="div"
        className="mt-3 text-sm text-red-400 "
      />
    </div>
  );
};

export default UserSurveyPage;

export const UserSueryModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, tokens } = useAppSelector((state) => state.userManage);
  // const navigate = useNavigate();
  const location = useLocation();
  const { userSurveyFeedbackMutationAsync } = USER.userSurveyFeedbackMutation();
  const dispatch = useAppDispatch();
  const { userProfileDataFetch } = USER.getUserProfileQuery({
    userId: user?.uid,
    acsTkn: tokens?.acsTkn?.tkn,
  });
  // const showModal = () => {
  //   setIsModalOpen(true);
  // };

  useEffect(() => {
    if (user?.isUserSurvey != undefined && !user?.isUserSurvey) {
      setIsModalOpen(true);
    }
  }, [user?.isUserSurvey, location]);

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* <button
        onClick={showModal}
        className="bg-primary mt-5 hover:bg-yellow-500 transition-all px-5 py-1.5 hover:drop-shadow-md font-semibold rounded-md"
      >
        OPEN
      </button> */}
      <Modal
        title="Survey Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Formik
          initialValues={{
            age: "",
            isRead2Earn: false,
            doBookAfterRead: "",
            dailyHours: "",
            genres: "",
            postReview: false,
          }}
          validationSchema={Yup.object().shape({
            age: Yup.number()
              .typeError("Age must be a number")
              .required("Age is required"),
            isRead2Earn: Yup.boolean()
              .typeError("Please select if you want to enter #Read2Earn Game")
              .required("Please select if you want to enter #Read2Earn Game"),
            doBookAfterRead: Yup.string().required(
              "Please select what you will do after reading your NFT book"
            ),
            dailyHours: Yup.string().required(
              "Please select your daily reading hours"
            ),
            genres: Yup.array()
              .min(3, "Please select at least 3 genres")
              .required("Please select your genres"),

            postReview: Yup.boolean()
              .typeError("Please select if you will post a review")
              .required("Please select if you will post a review"),
          })}
          onSubmit={(values) => {
            userSurveyFeedbackMutationAsync({
              bodyData: {
                ...values,
                genres: JSON.stringify(values?.genres),
                userId: user?.uid,
              },
              acsTkn: tokens?.acsTkn?.tkn,
              uid: user?.uid,
            })
              .then(async () => {
                const data = await userProfileDataFetch();
                dispatch(
                  setUser({
                    data: {
                      ...data.data,
                      tokens: {
                        acsTkn: tokens?.acsTkn?.tkn,
                        rfsTkn: tokens?.rfsTkn?.tkn,
                      },
                    },
                  })
                );
                handleCancel();
                Swal.fire("Success", "Form submitted successfully", "success");
                // navigate("/", { replace: true });
              })
              .catch(() => {
                Swal.fire("Warning", "Something went wrong", "warning");
              });
          }}
        >
          {({ setFieldValue, values }) => (
            <Form>
              <div className="container mx-auto mt-5 md">
                <div className="flex flex-col gap-5">
                  <RadioGrp
                    name="age"
                    label="1. Age"
                    setFieldValue={setFieldValue}
                    value={values.age}
                    options={[
                      { value: "1", title: "Age group 1" },
                      { value: "2", title: "Age group 2" },
                      { value: "3", title: "Age group 3" },
                    ]}
                  />
                  <SelectGrp
                    label={"Genres"}
                    name="genres"
                    placeholder="Select genres"
                    setFieldValue={setFieldValue}
                    value={values.genres}
                    options={GENRES?.map((genres) => {
                      return { value: genres, label: genres };
                    })}
                    maxCount={3}
                    mode={"multiple"}
                  />

                  <RadioGrp
                    name="isRead2Earn"
                    setFieldValue={setFieldValue}
                    value={values.isRead2Earn}
                    label="2. Do you want to enter #Read2Earn Game?"
                    options={[
                      { value: true, title: "Yes" },
                      { value: false, title: "No" },
                    ]}
                  />
                  <RadioGrp
                    name="doBookAfterRead"
                    setFieldValue={setFieldValue}
                    value={values.doBookAfterRead}
                    label="3. What will you do after reading your NFT book (Nbook)?"
                    options={[
                      { value: "sell", title: "Sell it" },
                      { value: "rent", title: "Rent it" },
                      { value: "dontCare", title: "I don’t care" },
                    ]}
                  />
                  <RadioGrp
                    name="dailyHours"
                    setFieldValue={setFieldValue}
                    value={values.dailyHours}
                    label="4. How many hours do you read daily?"
                    options={[
                      { value: "20mins", title: "20 mins" },
                      { value: "40mins", title: "40 mins" },
                      { value: "1hour", title: "1 hour" },
                      { value: "moreThan1hour", title: ">1 hour" },
                    ]}
                  />
                  <RadioGrp
                    name="postReview"
                    setFieldValue={setFieldValue}
                    value={values.postReview}
                    label="5. Will you post a review of books if paid?"
                    options={[
                      { value: true, title: "Yes" },
                      { value: false, title: "No" },
                    ]}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-primary  text-white hover:bg-yellow-500 transition-all px-5 py-1.5 hover:drop-shadow-md font-semibold rounded-md"
                >
                  Submit
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
};
