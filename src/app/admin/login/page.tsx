import React from "react";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Signin from "@/components/Auth/Signin";
import PageLayout from "@/components/Layouts/PageLayout";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "",
};

const SignIn: React.FC = () => {
  return (
    <PageLayout>

      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="flex flex-wrap items-center">
          <div className="w-full xl:w-1/2">
            <div className="w-full p-4 sm:p-12.5 xl:p-15">
              <Signin />
            </div>
          </div>

          <div className="hidden w-full p-7.5 xl:block xl:w-1/2">
            <div className="bg-green-light overflow-hidden rounded-2xl px-12.5 pt-12.5 dark:!bg-dark-2 dark:bg-none">
              <Link className="mb-5 inline-block" href="/">
                <Image
                  className="hidden dark:block"
                  src={"/images/logo/logo-circle.png"}
                  alt="Logo"
                  width={90}
                  height={90}
                />
                <Image
                  className="dark:hidden"
                  src={"/images/logo/logo-circle.png"}
                  alt="Logo"
                  width={90}
                  height={90}
                />
              </Link>
              <p className="mb-3 text-xl font-medium text-white dark:text-white">
                Authorized Personnel Only
              </p>

              <h1 className="mb-4 text-2xl font-bold text-white dark:text-white sm:text-heading-3">
                CCAMS V1.0
              </h1>

              <p className="w-full max-w-[375px] font-medium text-gray dark:text-dark-6">
              This system is restricted to authorized users. Access is strictly monitored and controlled. Unauthorized attempts to access, use, or modify this system and its data may result in criminal prosecution or civil penalties.
              </p>

              <div className="">
                <Image
                  src={"/images/grids/grid-02.svg"}
                  alt="Logo"
                  width={405}
                  height={0}
                  className="mx-auto dark:opacity-30"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

    </PageLayout>
  );
};

export default SignIn;
