"use client";
import React, { useState, ReactNode } from "react";


export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* <!-- ===== Page Wrapper Star ===== --> */}
      <div className="flex h-screen overflow-auto">

          <main className="w-full flex items-center justify-center">
            <div className="mx-auto max-w-screen-lg p-4 md:p-6 2xl:p-10 py-20">
              {children}
            </div>
          </main>
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </>
  );
}
