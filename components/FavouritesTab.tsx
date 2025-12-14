import { memo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";

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
    return <p className="text-muted-foreground">Loading your favorite Pets</p>;
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
          <Card key={fav.id}>
            <CardHeader>
              <CardTitle>{pet.name}</CardTitle>
              <CardDescription>{pet.breed}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">Age: {pet.age}</p>
              <p className="text-sm text-muted-foreground">
                Gender: {pet.gender}
              </p>
              <Button
                className="w-full cursor-pointer"
                onClick={() => onViewPet(pet.id)}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
});

export default FavoritesTab;
