import type React from "react"
import Image from "next/image"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden w-1/2 bg-primary lg:block relative">
        <Image
          src="/images/auth.png"
          alt="Auth background"
          layout="fill"
          objectFit="cover"
          className="opacity-70"
        />
      </div>
      <div className="flex w-full items-center justify-center bg-primary/5 lg:w-1/2">
        <div className="w-full max-w-md px-4 sm:px-6 lg:px-8">{children}</div>
      </div>
    </div>
  )
}

