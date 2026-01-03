export type DbPet = {
  id: string;
  name: string;
  breed: string;
  color: string;
  age: string;
  gender: string;
  image_url: string;
  type: string; //"dog" | "cat"
  slug: string;
};

export type Pet = {
  id: string;
  slug: string;
  name: string;
  breed: string;
  age: string;
  gender: string;
  weight: string | null;
  color: string | null;
  location: string | null;
  description: string | null;
  health_status: string | null;
  vaccinated: string | null;
  neutered: string | null;
  personality: string[] | null;
  image_url: string | null;
  owner_id: string | null;
};
