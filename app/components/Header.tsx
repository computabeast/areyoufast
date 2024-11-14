import {FaGithub} from "react-icons/fa";

export default function Header() {
  return (
    <div className="flex flex-col p-6 bg-background border-b border-gray-800 sticky top-0 z-[999]">
      <div className="flex flex-col gap-2 lg:flex-row lg:justify-between">
        <div className="flex flex-col">
          <a href="/"><h1 className="text-3xl text-left">Are you fast?</h1></a>
          <p className="lg:hidden text-xs">{"There's"} more than just rankings, scroll all the way down.</p>
        </div>

        <div className="flex flex-row gap-6 items-center">
          <div className="flex flex-row gap-4">
            <a href="/rankings" className="hover:underline">Rankings</a>
            <span>|</span>  
            <a href="/algorithm" className="hover:underline">How scoring works</a>
            <span>|</span>
            <a href="https://github.com/computabeast/areyoufast" target="_blank" className="flex items-center space-x-1">
              <FaGithub  />
              <span>Contribute</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
