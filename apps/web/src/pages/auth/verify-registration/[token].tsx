"use client";
import React, { useEffect, useState } from "react";
//import axios from "@/utils/interceptor";
import axios, { AxiosError } from "axios";
import LoadingVignette from "@/components/LoadingVignette";
import SuccessModal from "@/components/modal-success";
import ErrorModal from "@/components/modal-error";
import { hideSuccess, showSuccess } from "@/redux/slices/successSlice";
import { hideError, showError } from "@/redux/slices/errorSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useRouter, useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LockKeyhole, Ticket } from "lucide-react";

type Params = {
  token: string;
};

function verifyPassword() {
  const dispatch = useDispatch<AppDispatch>();
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isSuccessOpen, successMessage } = useSelector(
    (state: RootState) => state.success
  );
  const { isErrorOpen, errorMessage } = useSelector(
    (state: RootState) => state.error
  );
  const params = useParams() as Params;

  const validatePassword = (): boolean => {
    if (password.length < 6) {
      dispatch(showError("Password must be at least 6 characters long."));
      return false;
    }
    if (password.length > 20) {
      dispatch(showError("Password must not exceed 20 characters."));
      return false;
    }
    return true;
  };

  const handleVerification = async () => {
    if (!validatePassword()) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(
        "/api/auth/register",
        {
          password_hash: password,
          register_code: referralCode,
        },
        {
          headers: {
            Authorization: `Bearer ${params.token}`,
          },
        }
      );
      dispatch(showSuccess("Successfully registered"));
    } catch (error: any) {
      if (error instanceof AxiosError && error.response) {
        const errorMessage =
          typeof error.response.data?.detail === "string"
            ? error.response.data.detail
            : "An error occurred.";
        dispatch(showError(errorMessage));
      } else {
        dispatch(showError("An unexpected error occurred."));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (params?.token) {
    }
  }, [params]);

  return (
    <div className="min-h-screen bg-white bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      {isLoading && <LoadingVignette />}
      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => {
          dispatch(hideSuccess());
          window.location.href = "/auth/login-page";
        }}
        successMessage={successMessage}
      />
      <ErrorModal
        isOpen={isErrorOpen}
        onClose={() => {
          dispatch(hideError());
        }}
        errorMessage={errorMessage}
      />
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">
            Frugger
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Complete your registration by setting up your password and entering
            your referral code
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password">Set Password</Label>
            <div className="relative">
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
              />
              <LockKeyhole className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="referralCode">Referral Code</Label>
            <div className="relative">
              <Input
                id="referralCode"
                type="text"
                placeholder="Enter referral code"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                className="pl-10"
              />
              <Ticket className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          <Button
            className="w-full"
            onClick={handleVerification}
            disabled={!password || isLoading}
          >
            {isLoading ? "Verifying..." : "Complete Registration"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default verifyPassword;
