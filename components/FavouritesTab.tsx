import { memo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import Image from "next/image";
import Lottie from "lottie-react";
import loader from "@/public/lottie/loader.json";

type FavouriteWithPet = {
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

type FavoritesTabProps = {
  favorite: FavouriteWithPet[];
  loadingFavorite: boolean;
  onViewPet: (id: string) => void;
};

const FavoritesTab = memo(function FavoritesTab({
  favorite,
  loadingFavorite,
  onViewPet,
}: FavoritesTabProps) {
  if (loadingFavorite) {
    return (
      <div className="flex items-center justify-center">
        <Lottie animationData={loader} loop className="h-64 w-64" />
      </div>
    );
  }

  if (favorite.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No favourites yet</CardTitle>
          <CardDescription>
            you haven&apos;t liked any pets yet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* you can pass onFindPetClick as prop if needed */}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {favorite.map((fav) => {
        const pet = fav.pets;
        if (!pet) return null;

        return (
          <Card key={fav.id} className="overflow-hidden">
            <div className="flex gap-4 p-4">
              {/* Pet Image */}
              <div className="relative h-24 w-24 shrink-0">
                <Image
                  src={pet.image_url || "/placeholder-pet.png"}
                  alt={pet.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>

              {/* Pet Info */}
              <div className="flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-lg font-semibold">{pet.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {pet.breed} • {pet.age} • {pet.gender}
                  </p>
                </div>

                <Button
                  size="sm"
                  className="mt-3 w-fit cursor-pointer"
                  onClick={() => onViewPet(pet.slug)}
                >
                  View Details
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
});

export default FavoritesTab;
