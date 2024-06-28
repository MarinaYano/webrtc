import { cn } from "@/lib/utils";
import Image from "next/image";

type HomeCardProps = {
  className?: string;
  img: string;
  title: string;
  des: string;
  handleClick?: () => void;

}

const HomeCard = ({ className, img, title, des, handleClick }: HomeCardProps) => {
  return (
    <section
      className={cn(
        'bg-orange-1 px-4 py-6 flex flex-col justify-between w-full xl:max-w-[270px] min-h-[260px] rounded-[14px] cursor-pointer', className
      )}
      onClick={handleClick}
    >
      <div className="flex-center glassmorphism size-12 rounded-[10px]">
        <Image
          src={img}
          alt={title}
          width={200}
          height={200}
        />
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-lg font-normal">{des}</p>
      </div>
    </section>
  )
}

export default HomeCard