"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";
import { createSupabaseClient } from "@/lib/supabaseClient";

interface PetCardProps {
  id: string;
  slug: string;
  name: string;
  breed: string;
  age: string;
  gender: string;
  emoji?: string;
  image?: string;
  user: User | null; // ✅ new
  initialLiked: boolean; // ✅ new
}

// ✅ Supabase client once per file
const supabase = createSupabaseClient();

const PetCardComponent = ({
  id,
  slug,
  name,
  breed,
  age,
  gender,
  image,
  emoji,
  user,
  initialLiked,
}: PetCardProps) => {
  const { toast } = useToast();

  const [liked, setLiked] = useState(initialLiked);
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState(false);

  // ✅ keep in sync if parent favorites change
  useEffect(() => {
    setLiked(initialLiked);
  }, [initialLiked]);

  const handleHeartClick = useCallback(async () => {
    if (!user) return; // same behavior: disabled if not logged in
    if (loading) return;

    setLoading(true);

    const nextLiked = !liked;

    // ✅ optimistic UI – feel instant
    setLiked(nextLiked);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 150);

    try {
      if (nextLiked) {
        // Add to favorites
        const { error } = await supabase.from("favorites").insert({
          user_id: user.id,
          pet_uuid: id,
        });

        if (error) {
          console.error("Error adding favorite:", error);
          setLiked(!nextLiked); // revert
          toast({
            title: "Could not add to favorites",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Added to favourite",
            description: `${name} has been added to your favorites.`,
          });
        }
      } else {
        // Remove from favorites
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("pet_uuid", id);

        if (error) {
          console.error("Error removing favorite:", error);
          setLiked(!nextLiked); // revert
          toast({
            title: "Could not remove favourite",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Removed from favorites",
            description: `${name} has been removed from your favorites.`,
          });
        }
      }
    } finally {
      setLoading(false);
    }
  }, [user, liked, id, name, toast, loading]);

  return (
    <Card className="overflow-hidden bg-card shadow-lg transition-transform hover:scale-[1.02] hover:shadow-xl">
      <div className="relative flex h-48 items-center justify-center bg-linear-to-br from-secondary/30 to-primary/20">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            loading="lazy"
            sizes="(min-width: 1024px) 25vw, 50vw"
          />
        ) : (
          <span className="text-8xl">{emoji}</span>
        )}

        <Button
          size="icon"
          variant="ghost"
          onClick={handleHeartClick}
          disabled={!user || loading}
          className="absolute right-3 top-3 rounded-full cursor-pointer backdrop-blur-md
    bg-white/30
    border border-white/20
    shadow-lg
    hover:bg-white/40
    transition"
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
            fill={liked ? "#ef4444" : "none"}
          />
        </Button>
      </div>

      <CardContent className="p-4">
        <h3 className="mb-2 text-xl font-bold text-foreground">{name}</h3>
        <p className="mb-3 text-sm text-muted-foreground">{breed}</p>
        <div className="flex gap-2">
          <Badge variant="secondary">{age}</Badge>
          <Badge variant="secondary">{gender}</Badge>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 p-4 pt-0">
        <Link href={`/pets/${slug}`} className="flex-1">
          <Button className="w-full bg-primary shadow-sm hover:bg-primary/90 cursor-pointer">
            Adopt Me
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

const PetCard = memo(PetCardComponent);
export default PetCard;
