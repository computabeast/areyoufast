import {FaGithub} from "react-icons/fa";

export default function Header() {
  return (
    <div className="flex flex-col p-6 bg-background border-b border-gray-800 sticky top-0 z-[999]">
      <div className="flex flex-col gap-2 lg:flex-row lg:justify-between">
        <div className="flex flex-col">
          <a href="/"><h1 className="text-3xl text-left">Are you fast?</h1></a>
        </div>

        <div className="flex flex-row gap-6 items-center">
          <div className="flex flex-row gap-4 items-center">
            <a href="/rankings" className="text-xs sm:text-base hover:underline">Rankings</a>
            <span>|</span>  
            <a href="/algorithm" className="text-xs sm:text-base hover:underline">How scoring works</a>
            <span>|</span>
            <a href="https://github.com/computabeast/areyoufast" target="_blank" className="flex items-center space-x-1">
              <FaGithub  />
              <span className="text-xs sm:text-base">Contribute</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
