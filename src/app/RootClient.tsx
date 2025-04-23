"use client";

import { useState, useEffect } from "react";
import { ThreeDots } from "react-loading-icons";
import Image from "next/image";
import myImage from "@/images/hca-transparent.png"; // Replace with your PNG image path
import { loadingMessages } from "@/options/loadingMessages";

export default function RootClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const randomMessage =
      loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
    setLoadingMessage(randomMessage);

    setLoaded(true);
    setTimeout(() => setIsPageLoading(false), 2000);
  }, []);

  if (!loaded) {
    return <div className="h-[100dvh] w-[100dvw] bg-white"></div>;
  }

  return (
    <>
      {isPageLoading ||
        (false && (
          <div className="h-[100dvh] w-[100dvw] absolute top-0 left-0 flex flex-col items-center justify-center bg-white z-50">
            {/* PNG Image with Stroke Animation */}
            <div className="relative mt-6 flex flex-col items-center">
              <Image
                src={myImage}
                alt="Image with stroke animation"
                height={130}
                width={130}
                className="relative z-10"
              />
              <div className="threedots-loading mt-3">
                <ThreeDots fill="black" height="2rem" width="4rem" />
              </div>
              <p className="mt-3 text-lg font-semibold text-gray-700">
                {loadingMessage}
              </p>
            </div>
          </div>
        ))}
      {children}
    </>
  );
}
