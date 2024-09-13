"use client"

import { Card, CardBody, Avatar, Chip } from "@nextui-org/react";
import { Racer, RacerProfile } from '../types';
import { FaBriefcase, FaGraduationCap } from "react-icons/fa6";
import { FaBirthdayCake } from "react-icons/fa";
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
    <Card className="w-full p-3 cursor-pointer bg-cardbg" isPressable onPress={handleClick}>
      <CardBody className="p-0">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-3 lg:space-y-0 lg:space-x-3">
          <div className="flex items-center space-x-3 lg:flex-grow">
            <Avatar showFallback src={profile.profilePicture || undefined} size="sm" />
            <div className="min-w-0">
              <h2 className="text-sm lg:text-base font-semibold truncate text-cardfg">{racer.name}</h2>
              {racer.handle && (
                <Chip
                  className="px-2"
                  startContent={<FaXTwitter className="text-cardfg" size={12} />}
                  variant="light"
                  size="sm"
                >
                  <span className="text-xs lg:text-sm text-cardfg ml-1">{racer.handle}</span>
                </Chip>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-1 justify-start lg:justify-end w-full lg:w-auto">
            {profile.age && (
              <Chip size="sm" variant="flat" className="px-2" startContent={<FaBirthdayCake className="text-cardfg" size={12} />}>
                <span className="text-xs lg:text-sm ml-1 text-cardfg">{profile.age}</span>
              </Chip>
            )}
            {profile.company && (
              <Chip size="sm" variant="flat" className="px-2" startContent={<FaBriefcase className="text-cardfg" size={12} />}>
                <span className="text-xs lg:text-sm ml-1 text-cardfg">{profile.company}</span>
              </Chip>
            )}
            {profile.university && (
              <Chip size="sm" variant="flat" className="px-2" startContent={<FaGraduationCap className="text-cardfg" size={12} />}>
                <span className="text-xs lg:text-sm ml-1 text-cardfg">{profile.university}</span>
              </Chip>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default RacerCard;
