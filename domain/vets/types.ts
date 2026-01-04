export type Vet = {
  id: string;
  name: string;
  city: string;
  area: string | null;
  address: string | null;
  phone: string | null;
  services: string[];
  emergency_available: boolean;
  rating: number | null;
  total_reviews: number | null;
};
