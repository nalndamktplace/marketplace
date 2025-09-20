import { FaFacebook, FaGoogle } from "react-icons/fa";

function LoginPage() {
  return (
    <div>
      <div className="flex h-screen">
        {/* Left Pane */}
        <div className="flex items-center justify-center w-full bg-white lg:w-1/2">
          <div className="w-full max-w-md p-6">
            <h1 className="mb-6 text-3xl font-semibold text-center text-primary">
              Sign Up
            </h1>
            <h1 className="mb-6 text-sm font-semibold text-center text-gray-500">
              Join to Our Ebook Project and get coins
            </h1>
            <div className="flex flex-col items-center justify-between gap-3 mt-4 lg:flex-row">
              <div className="w-full mb-2 lg:w-1/2 lg:mb-0">
                <button
                  type="button"
                  className="flex items-center justify-center w-full gap-2 p-2 text-sm text-gray-600 transition-colors duration-300 bg-white border border-gray-200 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
                >
                  <FaGoogle />
                  Sign Up with Google{" "}
                </button>
              </div>
              <div className="w-full mb-2 lg:w-1/2 lg:mb-0">
                <button
                  type="button"
                  className="flex items-center justify-center w-full gap-2 p-2 text-sm text-gray-600 transition-colors duration-300 bg-white border border-gray-200 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
                >
                  <FaFacebook />
                  Sign Up with Facebook{" "}
                </button>
              </div>
            </div>
            <div className="mt-4 text-sm text-center text-gray-600">
              <p>or with email</p>
            </div>
            <form action="#" method="POST" className="space-y-4">
              {/* Your form elements go here */}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  className="w-full p-2 mt-1 text-black transition-colors duration-300 bg-white border rounded-md focus:ring-primary focus:outline-none focus:ring-2 focus:ring-offset-2"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="w-full p-2 mt-1 text-black transition-colors duration-300 bg-white border rounded-md focus:ring-primary focus:outline-none focus:ring-2 focus:ring-offset-2"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full p-2 text-white transition-colors duration-300 rounded-md bg-primary hover:bg-primary focus:outline-none focus:bg-primary focus:ring-2 focus:ring-offset-2 focus:primary"
                >
                  Sign Up
                </button>
              </div>
            </form>
            <div className="mt-4 text-sm text-center text-gray-600">
              <p>
                Already have an account?{" "}
                <a href="#" className="text-blue-400 hover:underline">
                  Login here
                </a>
              </p>
            </div>
          </div>
        </div>
        {/* Right Pane */}

        <div className="items-center justify-center flex-1 hidden text-black bg-white lg:flex">
          <img
            src="https://cdn.dribbble.com/userupload/8274713/file/original-e6604739f68948f480f4dce5d52eb494.png"
            className="object-cover h-full"
          />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
