"use client"
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <section
        id="Hero"
        className="py-20 lg:py-40 px[5%] lg:px-[10%] border text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/LandingHero.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="text-center">
          <h1 className="font-bold text-8xl">Track, Verify Trust</h1>
          <p className="font-semibold text-lg mt-8">
            Tracui lets you track any product&apos;s journey with just a tap or scan
            — from origin to delivery.
          </p>
          <div className="mt-8 ">
            <Link
              href="/scan"
              className="w-fit bg-[#00FFD1] rounded px-3 py-1 inset-0"
            >
              Scan A Product
            </Link>
          </div>

          <p className="text-lg font-semibold mt-5">
            Track, Pay, Verify. All in One Tap.
          </p>
        </div>
      </section>

      {/* How Tacui works */}
      <section className="px-[5%] lg:px-[10%] py-20 lg:py-32">
        <div className="2xl:container mx-auto">
          <div className=" text-center">
            <h1 className="text-7xl font-bold">
              How <span className="text-[#00FFD1]">Tracui</span> Works
            </h1>
            <p className="text-lg font-semibold w-1/2 mx-auto mt-5">
              Transparency, traceability, and trust. All in one seamless
              process.
            </p>
          </div>

          <div></div>
        </div>
      </section>
    </>
  );
}
