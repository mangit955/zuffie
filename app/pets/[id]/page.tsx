"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share2, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Loggedin_Navbar from "@/components/loggedin_Navbar";
import { useEffect, useState } from "react";
import Image from "next/image";
import { createSupabaseClient } from "@/lib/supabaseClient";

type Pet = {
  id: string;
  name: string;
  breed: string;
  age: number;
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
};

const supabase = createSupabaseClient();
const PetDetail = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const petId = params.id; //comes form /pets/[id]

  const { toast } = useToast();

  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  //check session
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
      }
    };
    checkSession();
  }, [router]);

  //2) fetch pet by id from supabase
  useEffect(() => {
    const loadPet = async () => {
      if (!petId) return;
      setLoading(true);

      const { data, error } = await supabase
        .from("pets")
        .select("*")
        .eq("id", petId)
        .maybeSingle();

      if (!data) {
        toast({
          title: "Pet not Found",
          description: "The Pet you have been looking for does not exist.",
          variant: "destructive",
        });
        router.push("/");
        return;
      }

      if (error) {
        console.error("Error fetching the pet", error);
        toast({
          title: "Error fetching pet:",
          description: error.message,
          variant: "destructive",
        });
        router.push("/");
        return;
      }

      setPet(data as Pet);
      setLoading(false);
    };
    loadPet();
  }, [petId, toast, router]);

  const handleAdopt = () => {
    router.push("/adopt");
    toast({
      title: "Adoption Request",
      description: "Please fill out the adoption form to proceed.",
    });
  };

  if (loading || !pet) {
    return (
      <div className=" min-h-screen bg-background">
        <Loggedin_Navbar />
        <section className="py-12 px-8 md:px-16 lg:px-24">
          <p>Loading pet details...</p>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Loggedin_Navbar />

      <section className="py-12 px-8 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Pet Image */}
            <div className="relative">
              <div className="w-full h-100 rounded-2xl bg-linear-to-br from-secondary/30 to-primary/20 flex items-center justify-center">
                <Image
                  src={pet.image_url || "/placeholder.jpg"}
                  alt={pet.name}
                  width={300}
                  height={300}
                  className="rounded-2xl object-cover"
                />
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full cursor-pointer"
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
                    <p className="text-muted-foreground">
                      {pet.description ?? "Not Specified"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Health Status
                      </p>
                      <p className="font-medium">
                        {pet.health_status ?? "Not Specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Vaccinated
                      </p>
                      <p className="font-medium">
                        {pet.vaccinated ?? "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Neutered</p>
                      <p className="font-medium">
                        {pet.neutered ?? "Not Specified"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Personality</h3>
                    <div className="flex gap-2 flex-wrap">
                      {pet.personality?.map((trait, index) => (
                        <Badge key={index} variant="outline">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="w-full flex justify-center">
                <Button
                  size="lg"
                  className="  hover:scale-[1.02] transition-transform cursor-pointer "
                  onClick={handleAdopt}
                >
                  Adopt {pet.name}
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
