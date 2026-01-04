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
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import loader from "@/public/lottie/loader.json";
import catLoader from "@/public/lottie/catLoader.json";
import type { User } from "@supabase/supabase-js";
import { createSupabaseClient } from "@/lib/supabaseClient";
import { DbPet } from "@/domain/pets/types";

const Pets = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterGender, setFilterGender] = useState("all");
  const [filterColor, setFilterColor] = useState("all");
  const [pets, setPets] = useState<DbPet[]>([]);
  const [loadingPets, setLoadingPets] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  //  new: user + favorite IDs
  const [user, setUser] = useState<User | null>(null);
  const [favoritePetIds, setFavoritePetIds] = useState<Set<string>>(new Set());
  const [checkingAuth, setCheckingAuth] = useState(true);

  const supabase = createSupabaseClient();
  const router = useRouter();

  // 1) Protect route: require session
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
      } else {
        setCheckingAuth(false);
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
        .select("pet_uuid")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error loading favorites:", error);
        setFavoritePetIds(new Set());
      } else {
        const ids = new Set<string>(data?.map((f) => f.pet_uuid) ?? []);
        setFavoritePetIds(ids);
      }
    };

    loadUserAndFavorites();
  }, [supabase]);

  // 3) Load pets from Supabase (excluding adopted pets)
  useEffect(() => {
    const loadPets = async () => {
      setLoadingPets(true);

      const minLoadTime = new Promise((resolve) => setTimeout(resolve, 2000));

      // Query pets that are not adopted
      // Filter out pets where is_adopted is true
      const { data, error } = await supabase
        .from("pets")
        .select("id, name, breed, color, age, gender, image_url, type, slug")
        .or("is_adopted.is.null,is_adopted.eq.false")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading pets:", error);
        // If the column doesn't exist, fallback to loading all pets
        const { data: fallbackData, error: fallbackError } = await supabase
          .from("pets")
          .select("id, name, breed, color, age, gender, image_url, type, slug")
          .order("created_at", { ascending: false });

        if (fallbackError) {
          console.error("Fallback query error:", fallbackError);
          setPets([]);
        } else {
          setPets(fallbackData || []);
        }
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
    const matchesColor = filterColor === "all" || pet.color === filterColor;
    return matchesSearch && matchesType && matchesGender && matchesColor;
  });

  const totalPages = Math.max(1, Math.ceil(filteredPets.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedPets = filteredPets.slice(startIndex, startIndex + pageSize);

  // Show loader while checking auth
  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Lottie animationData={loader} loop={true} className="h-64 w-64" />
      </div>
    );
  }

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
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="pl-10 bg-card shadow-sm"
            />
          </div>

          <div className="flex  flex-wrap gap-4">
            <Select
              value={filterType}
              onValueChange={(value) => {
                setFilterType(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[180px] bg-card ">
                <SelectValue placeholder="Pet type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="dog">Dogs</SelectItem>
                <SelectItem value="cat">Cats</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filterGender}
              onValueChange={(value) => {
                setFilterGender(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[180px] bg-card  ">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filterColor}
              onValueChange={(value) => {
                setFilterColor(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[180px] bg-card  ">
                <SelectValue placeholder="Pet colour" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Colors</SelectItem>
                <SelectItem value="white">White</SelectItem>
                <SelectItem value="black">Black</SelectItem>
                <SelectItem value="gray">Gray</SelectItem>
                <SelectItem value="cream">Cream</SelectItem>
                <SelectItem value="golden">Golden</SelectItem>
                <SelectItem value="brown">Brown</SelectItem>
                <SelectItem value="tan">Tan</SelectItem>
                <SelectItem value="beige">Beige</SelectItem>
                <SelectItem value="ginger">Ginger</SelectItem>
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
              {paginatedPets.map((pet) => (
                <PetCard
                  key={pet.id}
                  id={pet.id}
                  slug={pet.slug}
                  name={pet.name}
                  breed={pet.breed}
                  age={pet.age}
                  gender={pet.gender}
                  image={pet.image_url || "/placeholder.jpg"}
                  //  new props for heart performance
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

            {filteredPets.length > 0 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  className="rounded-md border border-gray-300 shadow-sm px-3 py-1 text-sm disabled:opacity-50 bg-card cursor-pointer"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  className="rounded-md border border-gray-300 shadow-sm px-3 py-1 text-sm disabled:opacity-50 bg-card cursor-pointer"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Pets;
