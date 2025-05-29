"use client";
import Carousel from "@/components/landingPageComponents/Carousel";
import HowItWorks from "@/components/landingPageComponents/HowItWorks";
import Image from "next/image";
import Link from "next/link";

interface HowItWorksItem {
  image: string;
  heading: string;
  description: string;
}

interface WhoCanUse {
  image: string;
  heading: string;
  description: string;
}

interface Reasons {
  heading: string;
  description: string;
}

export default function Home() {
  const HowItWorksItems: HowItWorksItem[] = [
    {
      image: "/LandingScanImage.png",
      heading: "Scan the smart tag",
      description:
        "Each product comes with a unique QR code or NFC tag. Simply scan it using your smartphone to instantly unlock the item's digital record.",
    },
    {
      image: "/LandingTrackDeliveryImage.png",
      heading: "Track the Delivery in Real Time",
      description:
        "Once scanned, you can follow the product's journey from origin to destination complete with real-time location, environmental conditions like temperature, and any stops made.",
    },
  ];

  const WhoCanUseItems: WhoCanUse[] = [
    {
      image: "/LandingConsumers.png",
      heading: "Consumers",
      description:
        "Scan to verify. Pay securely. See the story behind every item you buy.",
    },
    {
      image: "/LandingVendors.png",
      heading: "Vendors",
      description:
        "Register products, track them live, and prove origin effortlessly.",
    },
    {
      image: "/LandingAdmins.png",
      heading: "Admins",
      description:
        "Monitor the network, detect irregularities, and ensure system-wide accountability.",
    },
    {
      image: "/LandingLogisticsAgent.png",
      heading: "Logistics Agents",
      description:
        "Log handovers, update shipping states, and maintain integrity on the go.",
    },
  ];

  const ReasonsItems: Reasons[] = [
    {
      heading: "Secure Protocols",
      description:
        "Scan to verify. Pay securely. See the story behind every item you buy.",
    },
    {
      heading: "Transparent Deliveries",
      description: "Track every move your package makes — in real-time",
    },
    {
      heading: "Dispute Resolution",
      description:
        "Our responsive support system is built to resolve conflicts quickly and fairly.",
    },
    {
      heading: "Verified Vendors",
      description:
        "Every seller on Tracui goes through a strict verification process. You only deal with real, vetted people.",
    },
  ];

  return (
    <div className="bg-[#0E0E0E] bg-gradient-to-b via-white/10 from-[#0E0E0E] to-white/10">
      <section
        id="Hero"
        className="py-32 lg:py-44 px-[5%] lg:px-[10%] border-b text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/LandingHero.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="text-center">
          <h1 className="font-bold text-5xl lg:text-8xl text-[#00FFD1]">
            Track, Verify Trust
          </h1>
          <p className="font-semibold text-base lg:text-lg mt-8">
            Tracui lets you track any product&apos;s journey with just a tap or
            scan — from origin to delivery.
          </p>
          <div className="mt-8 ">
            <Link
              href="/scan"
              className="w-fit text-white bg-[rgba(0,255,209,0.2)] font-semibold backdrop-blur-md rounded px-4 py-2"
            >
              Scan A Product
            </Link>
          </div>

          <p className="text-lg font-semibold mt-6">
            Track, Pay, Verify. All in One Tap.
          </p>
        </div>
      </section>

      {/* How Tacui works */}
      <section className="px-[5%] lg:px-[10%] py-20 lg:py-32 bg-[#0E0E0E] bg-gradient-to-b via-white/10 from-[#0E0E0E] to-white/10  text-white">
        <div className="2xl:container mx-auto">
          <div className=" text-center">
            <h1 className="text-5xl lg:text-7xl font-bold">
              How <span className="text-[#00FFD1]">Tracui</span> Works
            </h1>
            <p className="lg:text-lg font-semibold lg:w-1/2 mx-auto mt-7">
              Transparency, traceability, and trust. All in one seamless
              process.
            </p>
          </div>

          <div className=" grid grid-cols-1 lg:grid-cols-2 mt-10 lg:mt-20 gap-5 px-[10%]">
            {HowItWorksItems.map((item, index) => (
              <HowItWorks
                key={index}
                imageUrl={item.image}
                heading={item.heading}
                description={item.description}
              />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 mt-10 gap-5 px-[10%]">
            <HowItWorks
              imageUrl="/LandingVerifyImage.png"
              heading="Verify, Then Pay Securely"
              description="Once the product arrives, Tracui automatically confirms if the delivery met all the set conditions. If everything checks out, you can go ahead and complete the payment securely through our blockchain-verified system."
            />
            <div className="bg-[#343434] p-7 lg:p-10 rounded-xl grid place-content-center border border-white">
              <h2 className="text-lg lg:text-2xl font-bold text-white">
                Stay Informed Every Step
              </h2>
              <p className="text-sm lg:text-base mt-5 text-white">
                Once the product arrives, Tracui automatically confirms if the
                delivery met all the set conditions. If everything checks out,
                you can go ahead and complete the payment securely through our
                blockchain-verified system.
              </p>
              <div className="mt-5">
                <Link
                  href="/learnmore"
                  className="bg-[#00FFD1] text-sm lg:text-base rounded px-4 py-2 font-semibold text-black"
                >
                  Learn More{" "}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-[5%] lg:px-[10%] py-20 lg:py-32 ">
        <div className="2xl:container mx-auto">
          <div className="text-center text-white">
            <h1 className="text-4xl lg:text-7xl font-bold text-center text-white">
              Why Choose <span className="text-[#00FFD1]">Tracui?</span>
            </h1>
            <p className="text-base lg:text-xl mt-8">
              Transparency, traceability, and trust. All in one seamless
              process.
            </p>
          </div>
          <div className="px-[5%] lg:px-[25%] mt-20">
            <Carousel>
              {[
                <HowItWorks
                  key="1"
                  imageUrl="/LandingFullTransparency.png"
                  heading="Full Transparency"
                  description="Track every product’s origin, journey, and condition — all the way to your hands. Real-time logs. Verified locations. Immutable proof."
                />,
                <HowItWorks
                  key="2"
                  imageUrl="/LandingTrust.png"
                  heading="Trust Build on Blockchain"
                  description="Every scan, update, and payment is recorded on the Sui blockchain — meaning no tampering, no shady edits, just pure, verifiable data."
                />,
                <HowItWorks
                  key="3"
                  imageUrl="/LandingSmarterPayments.png"
                  heading="Smarter Payments"
                  description="Pay only when you’ve verified the product. Whether it's QR or NFC, transactions are seamless, secure, and tied directly to product authentication."
                />,
                <HowItWorks
                  key="4"
                  imageUrl="/LandingEcoConscious.png"
                  heading="Eco-Conscious Tracking"
                  description="Monitor temperature, humidity, shocks, and more — because the how matters just as much as the what."
                />,
                <HowItWorks
                  key="5"
                  imageUrl="/LandingRealHumans.png"
                  heading="Built for Real Humans"
                  description="Whether you’re a vendor, delivery agent, or everyday shopper — Tracui’s sleek interface and tap-to-track design makes logistics less stressful."
                />,
              ]}
            </Carousel>
          </div>
        </div>
      </section>

      <section className="px-[5%] lg:px-[10%] py-20 lg:py-32  ">
        <div className="2xl:container mx-auto">
          <div className="text-white text-center">
            <h1 className="text-4xl lg:text-7xl font-bold ">
              Built for Everyone in the <br />
              <span className="text-[#00FFD1]">Supply Chain</span>
            </h1>
            <p className="text-sm lg:text-xl mt-8 lg:w-1/2 mx-auto">
              Whether you're buying, selling, shipping, or securing. Tracui
              adapts to you. Built with flexibility, designed for transparency.
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 px-[10%] lg:px-[15%] gap-8">
            {WhoCanUseItems.map((WCU, index) => (
              <HowItWorks
                key={index}
                imageUrl={WCU.image}
                heading={WCU.heading}
                description={WCU.description}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="px-[5%] lg:px-[10%] py-20 lg:py-32">
        <div className="2xl:container mx-auto">
          <div className="text-white text-center">
            <h1 className="text-4xl lg:text-7xl font-bold">
              Built on{" "}
              <span className="text-[#00FFD1]">
                Integrity, <br />
              </span>{" "}
              Backed by <span className="text-[#00FFD1]">Trust.</span>
            </h1>
            <p className="text-sm lg:text-xl mt-8 lg:w-1/2 mx-auto">
              From encrypted transactions to verified vendor partnerships,
              Tracui is designed for absolute confidence at every step.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 px-[10%] lg:px-[20%] mt-10 lg:mt-20">
            {ReasonsItems.map((item, index) => (
              <div className="p-8 lg:p-10 rounded-lg bg-[#343434] border border-white">
                <h2 className="text-2xl text-white font-bold">
                  {item.heading}
                </h2>
                <p className="text-sm text-white mt-2">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className=" bg-[#343434] px-[5%] lg:px-[10%] py-20 lg:py-32">
        <div>
          <h1 className="text-5xl lg:text-8xl text-white font-bold text-center">
            Start Using <br />
            <span className="text-[#00FFD1]">Tracui Today!</span>
          </h1>
          <p className="text-white text-center lg:text-lg mt-5">
            Track smarter, verify with ease, and pay only when you’re sure.
          </p>
        </div>
        <div className="flex gap-5 bg-[#343434] justify-center mt-10 font-semibold">
          <Link
            href="/scan"
            className="rounded-lg px-5 py-2 bg-[#00FFD1] text-black"
          >
            Scan a product
          </Link>
          <Link
            href="/joinwaitlist"
            className="border border-white rounded-lg px-5 py-2 text-white"
          >
            Join Waitlist
          </Link>
        </div>
      </section>
    </div>
  );
}
