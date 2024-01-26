"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import clsx from "clsx";
import { SignedIn, SignOutButton } from "@clerk/nextjs";

import { sidebarLinks } from "@/constants";

const Leftbar = () => {
  const { push } = useRouter();
  const pathname = usePathname();

  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex flex-1 w-full flex-col gap-6 px-6">
        {sidebarLinks.map(({ label, imgURL, route }) => {
          const isActiveLink =
            (pathname.includes(route) && route.length > 1) ||
            pathname === route;

          return (
            <Link
              key={label}
              href={route}
              className={clsx(
                "leftsidebar_link",
                isActiveLink ? "bg-primary-500" : ""
              )}
            >
              <Image src={imgURL} alt={label} width={24} height={24} />
              <p className="text-light-1 max-lg:hidden">{label}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 px-6">
        <SignedIn>
          <SignOutButton signOutCallback={() => push("/sign-in")}>
            <div className="flex cursor-pointer gap-4 p-4">
              <Image
                src="/assets/logout.svg"
                alt="logout"
                width={24}
                height={24}
              />
              <p className="text-light-1 max-lg:hidden">Logout</p>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>
  );
};

export default Leftbar;
