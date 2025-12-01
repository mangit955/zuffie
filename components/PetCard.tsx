import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface PetCardProps {
  name: string;
  breed: string;
  age: string;
  gender: string;
  emoji?: string;
  image?: string;
}

const PetCard = ({ name, breed, age, gender, image, emoji }: PetCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-card">
      <div className="relative h-48 bg-linear-to-br from-secondary/30 to-primary/20 flex items-center justify-center">
        {image ? (
          <Image src={image} alt={name} fill className="object-cover" />
        ) : (
          <span className="text-8xl">{emoji}</span>
        )}
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-3 right-3 bg-card/80 hover:bg-card"
        >
          <Heart className="h-5 w-5" />
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
        <Link href="/pets/1" className="flex-1">
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
