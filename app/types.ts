export type Racer = {
  id: string;
  name: string;
  handle: string | null;
};

export type RaceResult = {
  racerId: string;
  position: number;
};

export type Race = {
  raceId: string;
  date: string;
  results: RaceResult[];
};

export type RaceLedger = Race[];

export type RacerProfile = {
  profilePicture: string | null;
  company: string | null;
  university: string | null;
  age: number | null;
  linkedInURL: string | null;
}

export type RaceData = {
  raceId: string;
  imageURL: string | null;
}