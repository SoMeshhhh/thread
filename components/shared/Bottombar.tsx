"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import { sidebarLinks } from "@/constants";

const Bottombar = () => {
  const pathname = usePathname();
  return (
    <section className="bottombar">
      <div className="bottombar_container">
        {sidebarLinks.map(({ label, imgURL, route }) => {
          const isActiveLink =
            (pathname.includes(route) && route.length > 1) ||
            pathname === route;

          return (
            <Link
              key={label}
              href={route}
              className={clsx(
                "bottombar_link",
                isActiveLink ? "bg-primary-500" : ""
              )}
            >
              <Image src={imgURL} alt={label} width={24} height={24} />
              <p className="text-light-1 text-subtle-medium max-sm:hidden">
                {label.split(/\s+/)[0]}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Bottombar;
