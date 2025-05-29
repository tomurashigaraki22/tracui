import React from "react";

interface HowItWorksProps {
  imageUrl: string;
  heading: string;
  description: string;
}

const HowItWorks: React.FC<HowItWorksProps> = ({
  imageUrl,
  heading,
  description,
}) => {
  return (
    <div className="relative w-full h-96 border border-white rounded-xl overflow-hidden text-white flex flex-col ">
      {/* Gradient overlay */}
      {/* <div className="absolute inset-0 #343434 bg-gradient-to-t from-black/70 via-black/40 to-transparent" /> */}

      {/* Content at bottom */}
      <div
        className="h-full border"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="h-20" />
      <div className="absolute bottom-0 p-4 z-10 bg-[#343434] w-full h-[45%] lg:h-2/5 px-6 lg:px-10 py-2">
        <h3 className="text-lg lg:text-xl font-bold mt-2">{heading}</h3>
        <p className="text-xs lg:text-sm mt-1">{description}</p>
      </div>
    </div>
  );
};

export default HowItWorks;
