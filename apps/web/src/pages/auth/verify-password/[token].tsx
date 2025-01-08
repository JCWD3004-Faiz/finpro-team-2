"use client";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon, KeyIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import LoadingVignette from "@/components/LoadingVignette";
import SuccessModal from "@/components/modal-success";
import ErrorModal from "@/components/modal-error";
import { hideSuccess, showSuccess } from "@/redux/slices/successSlice";
import { hideError, showError } from "@/redux/slices/errorSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import axios, { AxiosError } from "axios";

const passwordSchema = z.object({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must be at most 20 characters"),
});

type Params = {
  token: string;
};

function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams() as Params;
  const dispatch = useDispatch<AppDispatch>();
  const { isSuccessOpen, successMessage } = useSelector(
    (state: RootState) => state.success
  );
  const { isErrorOpen, errorMessage } = useSelector(
    (state: RootState) => state.error
  );

  const form = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof passwordSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "/api/auth/reset-confirm", // Endpoint URL
        { password: values.password }, // Pass the password as the payload
        {
          headers: {
            Authorization: `Bearer ${params.token}`
          },
        }
      );
      dispatch(showSuccess("Password reset successfull"));
    } catch (error) {
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

  return (
    <div className="min-h-screen bg-white text-gray-800 bg-background flex items-center justify-center p-4">
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
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-4">
              <KeyIcon className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Reset Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Please enter your new password below
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <FormControl>
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        className="pr-10"
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default ResetPassword;
