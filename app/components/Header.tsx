import {FaGithub} from "react-icons/fa";

export default function Header() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-2 lg:flex-row lg:justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-left">Are you fast?</h1>
          <p className="lg:hidden text-xs">{"There's"} more than just rankings, scroll all the way down.</p>
        </div>
        <a href="https://github.com/computabeast/areyoufast" target="_blank" className="text-gray-500 flex items-center space-x-2 mt-2">
          <FaGithub className="text-gray-500" />
          <span>Contribute</span>
        </a>
      </div>

      <div className="flex flex-row gap-2 mt-8">
        <a href="/" className="hover:underline">Rankings</a>
        <span>|</span>  
        <a href="/algorithm" className="hover:underline">How scoring works</a>
      </div>
    </div>
  );
}
