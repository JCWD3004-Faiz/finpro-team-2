"use client";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MailCheck, Loader2 } from "lucide-react";
import axios from "axios";

type Params = {
  token: string;
};

function VerifyEmail() {
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const params = useParams() as Params;

  const verifyEmail = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "/api/auth/verify-confirm", {}, {
            headers: {
                Authorization: `Bearer ${params.token}`
            }
        }
      )
       setIsVerified(true);
    } catch (error) {
      console.error("Verification failed:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-800 bg-gradient-to-b from-background to-muted/20 p-4">
      <div className="text-center mb-8 max-w-md">
        <h1 className="text-2xl font-bold mb-3">Email Verification</h1>
        <p className="text-muted-foreground mb-2">
          Thank you for registering! Please click the button below to verify
          your email address.
        </p>
        <p className="text-sm text-muted-foreground">
          This helps us ensure the security of your account and keep you updated
          with important notifications.
        </p>
      </div>

      <Button
        size="lg"
        onClick={verifyEmail}
        disabled={isLoading || isVerified}
        className="min-w-[200px]"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying
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

      {isVerified && (
        <p className="text-green-600 dark:text-green-400 mt-4 text-center">
          Your email has been successfully verified! You can now close this
          page.
        </p>
      )}
    </main>
  );
}

export default VerifyEmail;
