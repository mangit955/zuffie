export type AdoptionApplication = {
  id: string;
  user_id: string | null;
  pet_uuid: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  housing_type: string;
  has_yard: boolean;
  has_other_pets: boolean;
  experience: string | null;
  why_adopt: string;
  status: string;
  created_at: string;
};

export type AdoptionApplicationWithPet = {
  id: string;
  user_id: string | null;
  pet_uuid: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  housing_type: string;
  has_yard: boolean;
  has_other_pets: boolean;
  experience: string | null;
  why_adopt: string;
  status: string;
  created_at: string;
  pets: {
    id: string;
    name: string;
    breed: string;
    age: string;
    gender: string;
    image_url: string;
  } | null;
};

export type FavouriteWithPet = {
  id: string;
  user_id: string | null;
  pet_uuid: string;
  created_at: string;
  pets: {
    id: string;
    name: string;
    breed: string;
    age: string;
    gender: string;
    image_url: string;
    slug: string;
  } | null;
};
