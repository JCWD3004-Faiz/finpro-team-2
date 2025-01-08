import { useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { hideSuccess, showSuccess } from "@/redux/slices/successSlice";
import { hideError, showError } from "@/redux/slices/errorSlice";

const GoogleCallback: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const { accessToken, refreshToken } = router.query;

        // Validate if tokens exist in the query
        if (accessToken && refreshToken) {
          // Set tokens in cookies
          Cookies.set("access_token", accessToken as string, { expires: 1 }); // expires in 1 day
          Cookies.set("refreshToken", refreshToken as string, { expires: 7 }); // expires in 7 days

          // Show success message
          dispatch(showSuccess("Google login successful!"));

          // Redirect to the home page
          setTimeout(() => {
            router.push("/");
          }, 2000);
        } else {
          // Handle missing tokens
          dispatch(showError("Google login failed. Missing tokens."));
        }
      } catch (error) {
        dispatch(showError("An error occurred while handling Google login."));
      }
    };

    handleGoogleCallback();
  }, [router.query, dispatch]);

  return (
    <div className="w-screen h-screen bg-white">
      <div className="container mx-auto text-center mt-10 ">
        <h1 className="text-2xl font-bold text-gray-800">
          Processing Google Login...
        </h1>
        <p className="text-gray-500">Please wait while we log you in...</p>
      </div>
    </div>
  );
};

export default GoogleCallback;
