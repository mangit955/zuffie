"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Share2, MapPin, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Loggedin_Navbar from "@/components/loggedin_Navbar";
import { useEffect, useState } from "react";
import Image from "next/image";
import { createSupabaseClient } from "@/lib/supabaseClient";
import Lottie from "lottie-react";
import loader from "@/public/lottie/loader.json";
import { Pet } from "@/domain/pets/types";

const supabase = createSupabaseClient();
const PetDetail = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const petId = params.id; //comes form /pets/[id]
  const { toast } = useToast();
  const [authChecked, setAuthChecked] = useState(false);
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  //check session
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setCurrentUserId(session.user.id);
      }
      setAuthChecked(true);
    };
    checkSession();
  }, []);

  //2) fetch pet by id from supabase
  useEffect(() => {
    if (!authChecked || !petId) return;

    const loadPet = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("pets")
        .select("*")
        .eq("slug", petId.toLowerCase())
        .maybeSingle();

      // 1 Handle real errors first
      if (error) {
        console.error("Error fetching the pet", error);
        toast({
          title: "Error fetching pet:",
          description: "Something went wrong while loading this pet.",
          variant: "destructive",
        });
        router.push("/pets");
        return;
      }
      // 2️ Now safely handle "not found"
      if (!data) {
        toast({
          title: "Pet not Found",
          description: "Detail page could not load the pet.",
          variant: "destructive",
        });
        router.push("/pets");
        return;
      }

      // 3️ Valid data
      setPet(data as Pet);
      setLoading(false);
    };
    loadPet();
  }, [petId, toast, router, authChecked]);

  const isOwner = currentUserId && pet && pet.owner_id === currentUserId;

  const handleAdopt = () => {
    if (!pet) return;

    router.push(`/adopt?petId=${pet.id}`);
  };

  if (loading) {
    return (
      <div className=" min-h-screen bg-background">
        <Loggedin_Navbar />
        <section className="flex item-center justify-center py-12 px-8 md:px-16 lg:px-24">
          <Lottie animationData={loader} loop className="h-64 w-64" />
        </section>
      </div>
    );
  }
  if (!pet) {
    return null;
  }

  const handleShare = async () => {
    if (!pet) return;

    const shareUrl = `${window.location.origin}/pets/${pet.slug}`;

    //Native share (mobile-first)
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Adopt ${pet.name}`,
          url: shareUrl,
        });
        return;
      } catch {
        return;
      }
    }

    // fallback: copy to clipboard
    await navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copied",
      description: " You can now share this pet with others",
    });
  };

  const handleCopyLink = async () => {
    if (!pet) return;

    const shareUrl = `${window.location.origin}/pets/${pet.slug}`;
    await navigator.clipboard.writeText(shareUrl);

    setCopied(true);

    //reset after 3 sec
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const showCopied = copied;

  return (
    <div className="min-h-screen bg-background">
      <Loggedin_Navbar />

      <section className="py-12 px-8 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Pet Image */}
            <div className="relative">
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-linear-to-br from-secondary/30 to-primary/20">
                <Image
                  src={pet.image_url || "/placeholder.jpg"}
                  alt={pet.name}
                  fill
                  className="rounded-2xl object-cover"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  size="icon"
                  className="rounded-full cursor-pointer backdrop-blur-md
    bg-white/30
    border border-white/20
    shadow-lg
    hover:bg-white/40
    transition"
                  onClick={handleShare}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button
                  onClick={handleCopyLink}
                  className={`
    h-10
    ${showCopied ? "min-w-[88px] px-4" : "w-10 px-0"}
    rounded-full cursor-pointer
    backdrop-blur-md bg-white/30 hover:bg-white/40
    border border-white/20 shadow-lg
    transition-[width,padding] duration-400
    ease-[cubic-bezier(0.16,1,0.3,1)]
    relative flex items-center justify-center overflow-hidden
  `}
                >
                  <span
                    className={`
    absolute whitespace-nowrap
    text-sm font-medium
     transition-transform
    duration-200
    ease-[cubic-bezier(0.16,1,0.3,1)]
    ${
      copied
        ? "opacity-100 translate-y-0 scale-100 delay-75"
        : "opacity-0 translate-y-0.5 scale-95"
    }
  `}
                  >
                    Copied !
                  </span>

                  <span
                    className={`
     transition-transform
    duration-200
    ease-[cubic-bezier(0.16,1,0.3,1)]
    ${
      copied
        ? "opacity-0 translate-y-[-0.5px] scale-95"
        : "opacity-100 translate-y-0 scale-100 delay-75"
    }
  `}
                  >
                    <Copy className="h-5 w-5" />
                  </span>
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
                {!isOwner && (
                  <Button
                    size="lg"
                    className="hover:scale-[1.02] transition-transform cursor-pointer "
                    onClick={handleAdopt}
                  >
                    Adopt {pet.name}
                  </Button>
                )}
                {isOwner && (
                  <p className="text-muted-foreground text-center">
                    This is your pet listing. You cannot adopt your own pet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PetDetail;
