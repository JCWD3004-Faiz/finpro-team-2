"use client";
import React, { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

type Params = {
    token: string;
};

function verifyPassword() {
    const params = useParams() as Params;
  
  useEffect(() => {
    if(params?.token){
        console.log("Verification Token: ", params.token);
    }
  }, [params])
  

  return <div>verifyPassword</div>;
}

export default verifyPassword;
