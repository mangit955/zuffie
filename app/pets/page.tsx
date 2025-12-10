"use client";

import { useEffect, useState } from "react";
import PetCard from "@/components/PetCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import Loggedin_Navbar from "@/components/loggedin_Navbar";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import catLoader from "@/public/lottie/catLoader.json";
import type { User } from "@supabase/supabase-js";

type DbPet = {
  id: string;
  name: string;
  breed: string;
  age: string;
  gender: string;
  image_url: string;
  type: string; //"dog" | "cat"
};

const Pets = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterGender, setFilterGender] = useState("all");
  const [pets, setPets] = useState<DbPet[]>([]);
  const [loadingPets, setLoadingPets] = useState(true);

  // 🔹 new: user + favorite IDs
  const [user, setUser] = useState<User | null>(null);
  const [favoritePetIds, setFavoritePetIds] = useState<Set<string>>(new Set());

  const supabase = createClientComponentClient();
  const router = useRouter();

  // 1) Protect route: require session
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
  }, [supabase, router]);

  // 2) Load user + all favorites once
  useEffect(() => {
    const loadUserAndFavorites = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (!user) {
        setFavoritePetIds(new Set());
        return;
      }

      const { data, error } = await supabase
        .from("favorites")
        .select("pet_id")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error loading favorites:", error);
        setFavoritePetIds(new Set());
      } else {
        const ids = new Set<string>(data?.map((f) => f.pet_id) ?? []);
        setFavoritePetIds(ids);
      }
    };

    loadUserAndFavorites();
  }, [supabase]);

  // 3) Load pets from Supabase
  useEffect(() => {
    const loadPets = async () => {
      setLoadingPets(true);

      const minLoadTime = new Promise((resolve) => setTimeout(resolve, 2000));

      const { data, error } = await supabase
        .from("pets")
        .select("id, name, breed, age, gender, image_url, type")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading pets:", error);
        setPets([]);
      } else {
        setPets(data || []);
      }

      await minLoadTime;
      setLoadingPets(false);
    };

    loadPets();
  }, [supabase]);

  // 4) Apply search + filters in memory
  const filteredPets = pets.filter((pet) => {
    const matchesSearch =
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || pet.type === filterType;
    const matchesGender =
      filterGender === "all" || pet.gender.toLowerCase() === filterGender;
    return matchesSearch && matchesType && matchesGender;
  });

  return (
    <div className="min-h-screen bg-background">
      <Loggedin_Navbar />

      <section className="py-12 px-8 md:px-16 lg:px-24">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-5xl font-bold text-foreground">
            Find Your Perfect Pet
          </h1>
          <p className="text-lg text-muted-foreground">
            Browse our available pets and find your new best friend
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mx-auto mb-12 max-w-4xl space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform text-muted-foreground" />
            <Input
              placeholder="Search by name or breed..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card shadow-sm"
            />
          </div>

          <div className="flex  flex-wrap gap-4">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px] bg-card ">
                <SelectValue placeholder="Pet Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="dog">Dogs</SelectItem>
                <SelectItem value="cat">Cats</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterGender} onValueChange={setFilterGender}>
              <SelectTrigger className="w-[180px] bg-card  ">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Pet Grid / Loader */}
        {loadingPets ? (
          <div className="flex justify-center py-24">
            <Lottie
              animationData={catLoader}
              loop={true}
              className="h-64 w-64"
            />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {filteredPets.map((pet) => (
                <PetCard
                  key={pet.id}
                  id={pet.id}
                  name={pet.name}
                  breed={pet.breed}
                  age={pet.age}
                  gender={pet.gender}
                  image={pet.image_url || "/placeholder.jpg"}
                  // 🔹 new props for heart performance
                  user={user}
                  initialLiked={favoritePetIds.has(pet.id)}
                />
              ))}
            </div>

            {filteredPets.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-lg text-muted-foreground">
                  No pets found matching your criteria
                </p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Pets;
