"use client"

import { Avatar } from "@nextui-org/react";
import { Racer, RacerProfile } from '../types';
import { FaXTwitter } from "react-icons/fa6";

interface RacerCardProps {
  racer: Racer;
  profile: RacerProfile;
}

export const RacerCard: React.FC<RacerCardProps> = ({ racer, profile }) => {
  const handleClick = () => {
    if (profile.linkedInURL) {
      window.open(profile.linkedInURL, '_blank');
    }
  };

  return (
    <div 
      className="w-full p-2 rounded-md cursor-pointer hover:bg-stone-100 transition-colors"
      onClick={handleClick}
    >
      <div className="flex items-center space-x-3">
        <Avatar showFallback src={profile.profilePicture || undefined} size="sm" radius="sm" />
        <div className="min-w-0">
          <h2 className="text-sm lg:text-base font-semibold truncate">{racer.name}</h2>
          {racer.handle && (
            <span className="flex items-center text-stone-500 text-xs">
              <FaXTwitter size={10} className="mr-1" />
              {racer.handle}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RacerCard;
