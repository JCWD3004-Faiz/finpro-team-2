import React from "react";

type PageBannerProps = {
  title: string; // The text to display in the banner
};

const PageBanner: React.FC<PageBannerProps> = ({ title }) => {
  return (
    <div className="h-[40vh] mt-[11vh] w-full bg-black text-white flex items-end justify-end p-6">
      <h1 className="text-6xl font-bold">{title}</h1>
    </div>
  );
};

export default PageBanner;