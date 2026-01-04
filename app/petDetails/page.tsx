"use client";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share2, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PetDetail = () => {
  const router = useRouter();
  const { toast } = useToast();

  //  Mock pet data
  const pet = {
    name: "Max",
    breed: "Golden Retriever",
    age: "2 years",
    gender: "Male",
    emoji: "🐕",
    weight: "30 kg",
    color: "Golden",
    location: "Happy Paws Shelter, New York",
    description:
      "Max is a friendly and energetic Golden Retriever who loves to play fetch and go on long walks. He's great with children and other pets. Max is fully vaccinated and neutered.",
    healthStatus: "Excellent",
    vaccinated: "Yes",
    neutered: "Yes",
    personality: ["Friendly", "Energetic", "Playful", "Good with kids"],
  };

  const handleAdopt = () => {
    router.push("/adopt");
    toast({
      title: "Adoption Request",
      description: "Please fill out the adoption form to proceed.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="py-12 px-8 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Pet Image */}
            <div className="relative">
              <div className="w-full h-96 rounded-2xl bg-linear-to-br from-secondary/30 to-primary/20 flex items-center justify-center">
                <span className="text-[200px]">{pet.emoji}</span>
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full"
                >
                  <Heart className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Pet Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  {pet.name}
                </h1>
                <p className="text-xl text-muted-foreground mb-4">
                  {pet.breed}
                </p>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{pet.location}</span>
                </div>
              </div>

              <div className="flex gap-3 flex-wrap">
                <Badge variant="secondary" className="text-base py-1 px-3">
                  {pet.age}
                </Badge>
                <Badge variant="secondary" className="text-base py-1 px-3">
                  {pet.gender}
                </Badge>
                <Badge variant="secondary" className="text-base py-1 px-3">
                  {pet.weight}
                </Badge>
                <Badge variant="secondary" className="text-base py-1 px-3">
                  {pet.color}
                </Badge>
              </div>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">About {pet.name}</h3>
                    <p className="text-muted-foreground">{pet.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Health Status
                      </p>
                      <p className="font-medium">{pet.healthStatus}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Vaccinated
                      </p>
                      <p className="font-medium">{pet.vaccinated}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Neutered</p>
                      <p className="font-medium">{pet.neutered}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Personality</h3>
                    <div className="flex gap-2 flex-wrap">
                      {pet.personality.map((trait, index) => (
                        <Badge key={index} variant="outline">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button size="lg" className="flex-1" onClick={handleAdopt}>
                  Adopt {pet.name}
                </Button>
                <Button size="lg" variant="outline">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Contact Shelter
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PetDetail;
