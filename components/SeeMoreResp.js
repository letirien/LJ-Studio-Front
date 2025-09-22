import Image from "next/image"

export const SeeMore  = ({link}) => {
  return (
  <div className="sm:hidden z-2 rotate-[12deg] absolute -top-2 right-0 w-12 h-10 bg-white rounded-full border-2 border-black flex items-center justify-center">
    <Image src="/images/ICONE_YEUX.svg" alt="See more icon" width={200} height={200} />
  </div>
  )}