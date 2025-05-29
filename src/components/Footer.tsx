import React from "react";
import Link from "next/link";
import Image from "next/image";

interface Route {
  name: string;
  link: string;
}

interface LinkSection {
  heading: string;
  routes: Route[];
}

const Footer: React.FC = () => {
  const links: LinkSection[] = [
    {
      heading: "Navigation",
      routes: [
        { name: "Home", link: "/" },
        { name: "Scan", link: "/scan" },
        { name: "Mint", link: "/mint" },
      ],
    },
    {
      heading: "About",
      routes: [
        { name: "Our Mission", link: "/about" },
        { name: "Team", link: "/team" },
      ],
    },
    {
      heading: "Support",
      routes: [
        { name: "FAQs", link: "/faq" },
        { name: "Contact", link: "/contact" },
      ],
    },
    {
      heading: "Legal",
      routes: [
        { name: "Privacy Policy", link: "/privacy" },
        { name: "Terms of Service", link: "/terms" },
      ],
    },
  ];

  return (
    <footer className="bg-black py-20 lg:py-32 px-[5%] lg:px-[10%] text-white">
      <div className="2xl:container mx-auto">
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          <div>
            <Image src="/FooterLogo.png" alt="Logo" width={200} height={200} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-3/5">
            {links.map((section, index) => (
              <div key={index}>
                <h4 className="text-lg font-semibold mb-3">
                  {section.heading}
                </h4>
                <ul className="space-y-2">
                  {section.routes.map((route, idx) => (
                    <li key={idx}>
                      <Link
                        href={route.link}
                        className="text-sm text-gray-300 hover:text-white"
                      >
                        {route.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
