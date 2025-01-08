"use client";
import Cookies from "js-cookie";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { MailCheck, Loader2 } from "lucide-react";
import axios, { AxiosError } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { hideSuccess, showSuccess } from "@/redux/slices/successSlice";
import { hideError, showError } from "@/redux/slices/errorSlice";

const access_token = Cookies.get("access_token");

interface EmailVerificationProps {
  email: string;
}

export function EmailVerificationCard({ email }: EmailVerificationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { username } = useSelector((state: RootState) => state.userProfile);
  const { isSuccessOpen, successMessage } = useSelector(
    (state: RootState) => state.success
  );
  const { isErrorOpen, errorMessage } = useSelector(
    (state: RootState) => state.error
  );

  const handleVerification = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `/api/auth/verify-email`,
        {
          username: username,
          email: email,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      dispatch(showSuccess("An email has been sent for verification"));
      setIsVerified(true);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const errorMessage =
          typeof error.response.data?.detail === "string"
            ? error.response.data.detail
            : "An error occurred.";
        dispatch(showError(errorMessage));
      } else {
        dispatch(showError("Failed send email. Please try again."));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4">
          <MailCheck className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold text-center">
          Verify Your Email
        </h2>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground mb-4">
          Please verify your email address:
          <span className="block font-medium text-foreground mt-1">
            {email}
          </span>
        </p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          className="w-full"
          onClick={handleVerification}
          disabled={isLoading || isVerified}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : isVerified ? (
            <>
              <MailCheck className="mr-2 h-4 w-4" />
              Verified
            </>
          ) : (
            "Verify Email"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
