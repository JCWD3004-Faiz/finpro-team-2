import Head from "next/head";
import React from "react";

interface HeaderProps {
    children: React.ReactNode;
}

function Header({ children }: HeaderProps) {
  return (
  <Head>
    {children}
  </Head>
  );
}

export default Header;