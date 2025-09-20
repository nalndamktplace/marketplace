import { Upload } from "antd";
import TextInput from "../../components/TextInput";
import { FaTwitter, FaWallet } from "react-icons/fa";
import ConnectWallet from "../../components/ConnectWallet";
import { Form, Formik } from "formik";
import { useAccount } from "wagmi";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { USER } from "../../api/user/user";
import { setUser } from "../../store/slice/userManageReducer";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import {
  hideSpinner,
  showSpinner,
} from "../../store/slice/spinnerManageReducer";
function ProfilePage() {
  const { address } = useAccount();
  const [userImage, setUserImage] = useState<string | undefined>();
  const { userProfilePictureMutationAsync, userProfilePictureLoading } =
    USER.userProfilePictureEditMutation();
  const { user, tokens } = useAppSelector((state) => state.userManage);

  const dispatch = useAppDispatch();
  const { userLoginMutationAsync, userEditLoginLoading } =
    USER.userProfileEditMutation();
  const { userWalletConnectMutationAsync, userWalletConnectLoading } =
    USER.userWalletConnectMutation();
  const { userProfileDataFetch, userProfileLoading, userProfileData } =
    USER.getUserProfileQuery({
      userId: user?.uid,
      acsTkn: tokens?.acsTkn?.tkn,
    });

  useEffect(() => {
    if (
      userProfileLoading ||
      userEditLoginLoading ||
      userWalletConnectLoading ||
      userProfilePictureLoading
    )
      dispatch(showSpinner());
    else dispatch(hideSpinner());
  }, [
    userEditLoginLoading,
    userProfilePictureLoading,
    userProfileLoading,
    userWalletConnectLoading,
    dispatch,
  ]);

  useEffect(() => {
    if (address) {
      userWalletConnectMutationAsync({
        uid: user?.uid,
        walletAddress: address,
        acsTkn: tokens?.acsTkn?.tkn,
      }).then(() => {
        // console.log(data, "data");
      });
    }
  }, [address]);
  useEffect(() => {
    userProfileDataFetch().then((data) => {
      setUserImage(data?.data?.social_pic);
    });
  }, [user, tokens]);

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:col-span-3">
      <Formik
        initialValues={{
          firstName: userProfileData?.first_name,
          lastName: userProfileData?.last_name,
          bio: userProfileData?.bio,
        }}
        enableReinitialize
        validationSchema={Yup.object().shape({
          firstName: Yup.string().required("First Name is required"),
          lastName: Yup.string().required("Last Name is required"),
          bio: Yup.string().required("Bio is required"),
        })}
        onSubmit={(values) => {
          userLoginMutationAsync({
            uid: user?.uid,
            acsTkn: tokens?.acsTkn?.tkn,
            firstName: values?.firstName,
            lastName: values?.lastName,
            bio: values?.bio,
          }).then((data) => {
            userProfileDataFetch();
            dispatch(
              setUser({
                data: {
                  ...data,
                  tokens: {
                    acsTkn: tokens?.acsTkn?.tkn,
                    rfsTkn: tokens?.rfsTkn?.tkn,
                  },
                },
              })
            );
          });
        }}
      >
        {() => (
          <Form className="px-10 lg:col-span-3">
            <>
              <div className="flex justify-between">
                <h3 className="text-4xl font-semibold text-primary ">
                  Profile details
                </h3>
              </div>
              <div className="flex gap-5 mt-5">
                <div className="flex-1">
                  <div className="mt-5">
                    <label className="block text-xl font-bold text-gray-700">
                      Wallet Address
                    </label>
                    <p className="block text-sm font-medium text-gray-500">
                      Address: &nbsp;
                      <span className="font-semibold">
                        {/* {user?.wallet ?? "No address"} */}
                        {address ?? "No address"}
                      </span>
                    </p>
                  </div>
                  <div className="mt-5 ">
                    <TextInput
                      placeholder="Enter your first name"
                      name="firstName"
                      label="First Name"
                      htmlType="text"
                    />
                    <TextInput
                      placeholder="Enter your full name"
                      name="lastName"
                      label="Last Name"
                      htmlType="text"
                    />
                    <TextInput
                      placeholder="Tell the world your story!"
                      name="bio"
                      label="Bio"
                      htmlType="textarea"
                    />
                  </div>
                  <div className="mt-5">
                    <label className="block text-xl font-bold text-gray-700">
                      Social Connections
                    </label>
                    <p className="block text-sm font-medium text-gray-500">
                      Help collectors verify your account by connecting social
                      accounts
                    </p>
                    <div>
                      <div className="flex items-center justify-between p-4 my-4 border border-gray-300 rounded-xl">
                        <div className="flex items-center gap-3">
                          <FaWallet size={24} className="text-gray-700" />
                          <h4 className="text-xl font-bold text-gray-700 ">
                            Wallet Connect
                          </h4>
                        </div>
                        <ConnectWallet />
                      </div>
                      <div className="flex items-center justify-between p-4 my-4 border border-gray-300 rounded-xl">
                        <div className="flex items-center gap-3">
                          <FaTwitter size={24} className="text-gray-700" />
                          <h4 className="text-xl font-bold text-gray-700 ">
                            Twitter
                          </h4>
                        </div>
                        <button className="bg-primary hover:bg-yellow-500 transition-all px-5 py-1.5 hover:drop-shadow-md font-semibold rounded-md">
                          Connect
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Profile Picture
                  </label>
                  <Upload
                    name="avatar"
                    listType="picture-circle"
                    showUploadList={false}
                    beforeUpload={async (file) => {
                      const formData = new FormData();
                      setUserImage(URL.createObjectURL(file));
                      formData.append("displayPic", file);
                      await userProfilePictureMutationAsync({
                        uid: user?.uid,
                        acsTkn: tokens.acsTkn.tkn,
                        formData: formData,
                      });
                    }}
                  >
                    <img
                      src={userImage}
                      alt="avatar"
                      className="object-cover w-full h-full p-1 overflow-hidden rounded-full"
                    />
                  </Upload>
                </div>
              </div>
              <div className="flex">
                <button
                  type="submit"
                  className="bg-primary hover:bg-yellow-500 transition-all px-5 py-1.5 hover:drop-shadow-md font-semibold rounded-md"
                >
                  Save
                </button>
              </div>
            </>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default ProfilePage;
