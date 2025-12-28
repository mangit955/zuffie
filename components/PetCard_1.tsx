"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createSupabaseClient } from "@/lib/supabaseClient";

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
  const supabase = createSupabaseClient();

  const [user, setUser] = useState<User | null>(null);
  const [liked, setLiked] = useState(false);

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
        .eq("pet_uuid", id)
        .maybeSingle();

      if (!error && data) {
        setLiked(true);
      }
    };

    load();
  }, [supabase, id]);

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl bg-card hover:scale-[1.02] transition-transform">
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
        <Link href={`/pets`} className="flex-1">
          <Button className="w-full bg-primary hover:bg-primary/90 cursor-pointer">
            Adopt Me
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PetCard;
