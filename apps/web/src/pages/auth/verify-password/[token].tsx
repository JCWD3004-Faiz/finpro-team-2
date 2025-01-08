import { useParams } from "next/navigation";
import React from "react";

type Params = {
  token: string;
};

function ResetPassword() {
  const params = useParams() as Params;
  return <div>{params.token}</div>;
}

export default ResetPassword;
