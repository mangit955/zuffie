"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";

interface PetCardProps {
  id: string;
  name: string;
  breed: string;
  age: string;
  gender: string;
  emoji?: string;
  image?: string;
}

const PetCard = ({
  id,
  name,
  breed,
  age,
  gender,
  image,
  emoji,
}: PetCardProps) => {
  //console.log("PetCard image src for", name, ":", image);
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  const [user, setUser] = useState<User | null>(null);
  const [liked, setLiked] = useState(false);
  const [loading, setloading] = useState(false);
  const [animating, setAnimating] = useState(false);

  //Load current user + whether this pet is already favorited
  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (!user) return;

      const { data, error } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("pet_id", id)
        .maybeSingle();

      if (!error && data) {
        setLiked(true);
      }
    };

    load();
  }, [supabase, id]);

  const handleHeartClick = async () => {
    if (!user) {
      //heart is disabled when not logged on (we'll also disable the button below)
      return;
    }
    setloading(true);

    try {
      if (!liked) {
        //Add to favorites
        const { error } = await supabase.from("favorites").insert({
          user_id: user.id,
          pet_id: id,
        });

        if (error) {
          console.error("Error adding favorite:", {
            message: error?.message,
            details: error?.details,
            hint: error?.hint,
            code: error?.code,
          });
          toast({
            title: "Could not add to favorites",
            description: error.message,
            variant: "destructive",
          });
        } else {
          setLiked(true);
          setAnimating(true);
          setTimeout(() => setAnimating(false), 150);

          toast({
            title: "Added to favourite",
            description: `${name} has been added to your favorites.`,
          });
        }
      } else {
        //Remove from favorites
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("pet_id", id);

        if (error) {
          console.error("Error removing favorite", error);
          toast({
            title: "Could not remove favourite",
            description: error.message,
            variant: "destructive",
          });
        } else {
          setLiked(false);
          toast({
            title: "Remove from favorites",
            description: `${name} has been removed from your favorites.`,
          });
        }
      }
    } finally {
      setloading(false);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-card">
      <div className="relative h-48 bg-linear-to-br from-secondary/30 to-primary/20 flex items-center justify-center">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <span className="text-8xl">{emoji}</span>
        )}
        <Button
          size="icon"
          variant="ghost"
          onClick={handleHeartClick}
          disabled={!user || loading}
          className="absolute top-3 right-3 bg-card/60 hover:bg-card"
          aria-pressed={liked}
          title={
            !user
              ? "Log in to add favorites"
              : liked
              ? "Remove favourite"
              : "Add to favourite"
          }
        >
          <Heart
            className={`h-5 w-5 transition-transform ${
              animating ? "scale-125" : "scale-100"
            }`}
            color={liked ? "#ef4444" : "currentColor"}
            fill={liked ? "#ef4444" : "none"} // filled red when liked
          />
        </Button>
      </div>
      <CardContent className="p-4">
        <h3 className="text-xl font-bold text-foreground mb-2">{name}</h3>
        <p className="text-muted-foreground text-sm mb-3">{breed}</p>
        <div className="flex gap-2">
          <Badge variant="secondary">{age}</Badge>
          <Badge variant="secondary">{gender}</Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Link href={`/pets/${id}`} className="flex-1">
          <Button className="w-full bg-primary hover:bg-primary/90">
            Adopt Me
          </Button>
        </Link>
        <Button variant="outline" size="icon" className="border-2">
          <MessageCircle className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PetCard;
