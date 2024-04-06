import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="container flex flex-col w-full min-h-screen p-2 md:p-2">
      <div className="grid gap-4 grid-cols-8  m-4">
        <Skeleton className="h-[40px]  rounded-xl" />
        <Skeleton className="h-[40px]  rounded-xl" />
        <Skeleton className="h-[40px] col-span-5  rounded-xl" />
        <Skeleton className="h-[40px]  rounded-full" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mx-4 my-2">
        <Skeleton className="h-[125px]  rounded-xl" />
        <Skeleton className="h-[125px]  rounded-xl" />
        <Skeleton className="h-[125px]  rounded-xl" />
        <Skeleton className="h-[125px]  rounded-xl" />
      </div>
      <div className="grid gap-4 md:grid-cols-3 m-4">
        <Skeleton className="md:col-span-2 grid gap-8 md:grid-cols-2 p-16 place-content-center justify-items-center ">
          <Skeleton className="rounded-full w-48 h-48 md:w-72 md:h-72" />
          <Skeleton className="rounded-full w-48 h-48 md:w-72 md:h-72" />
        </Skeleton>

        <Skeleton className="flex flex-col gap-4 p-8 items-center">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12  rounded-full" />
            <Skeleton className="h-4 w-52 md:w-60  rounded-xl" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12  rounded-full" />
            <Skeleton className="h-4 w-52 md:w-60  rounded-xl" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12  rounded-full" />
            <Skeleton className="h-4 w-52 md:w-60  rounded-xl" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12  rounded-full" />
            <Skeleton className="h-4 w-52 md:w-60  rounded-xl" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12  rounded-full" />
            <Skeleton className="h-4 w-52 md:w-60  rounded-xl" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12  rounded-full" />
            <Skeleton className="h-4 w-52 md:w-60  rounded-xl" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12  rounded-full" />
            <Skeleton className="h-4 w-52 md:w-60  rounded-xl" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12  rounded-full" />
            <Skeleton className="h-4 w-52 md:w-60  rounded-xl" />
          </div>
        </Skeleton>
        <div></div>
      </div>
    </div>
  );
}
