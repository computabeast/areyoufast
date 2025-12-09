import {FaGithub} from "react-icons/fa";
import {FaXTwitter} from "react-icons/fa6";
import Image from "next/image";

export default function Header() {
  return (
    <div className="flex flex-row items-center justify-between p-4 md:p-8 lg:p-10 bg-background gap-4">
      <a href="/">
        <Image 
          src="/images/sgtrio3.png" 
          alt="The Silicon Games" 
          width={100} 
          height={50}
          style={{ imageRendering: "pixelated" }}
        />
      </a>

      <div className="flex flex-col items-end sm:flex-row gap-1 sm:gap-4 sm:items-center text-xs sm:text-sm">
        <a href="https://x.com/thesilicongames" target="_blank" className="flex items-center space-x-1 hover:underline">
          <FaXTwitter />
          <span>@thesilicongames</span>
        </a>
        <span className="hidden sm:inline">|</span>
        <a href="/algorithm" className="hover:underline">How scoring works</a>
        <span className="hidden sm:inline">|</span>
        <a href="https://github.com/computabeast/areyoufast" target="_blank" className="flex items-center space-x-1 hover:underline">
          <FaGithub />
          <span>Contribute</span>
        </a>
      </div>
    </div>
  );
}
