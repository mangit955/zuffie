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

type DbPet = {
  id: string;
  name: string;
  breed: string;
  age: string;
  gender: string;
  image_url: string;
  type: string; //"dog | "cat"
};

const Pets = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterGender, setFilterGender] = useState("all");
  const [pets, setPets] = useState<DbPet[]>([]);
  const [loadingPets, setLoadingPets] = useState(true);
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

  // 2) Load pets from Supabase
  useEffect(() => {
    const loadPets = async () => {
      setLoadingPets(true);

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
      setLoadingPets(false);
    };
    loadPets();
  }, [supabase]);

  // 3) Apply search + filters in memory
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
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Find Your Perfect Pet
          </h1>
          <p className="text-muted-foreground text-lg">
            Browse our available pets and find your new best friend
          </p>
        </div>

        {/* Search and Filters */}
        <div className="max-w-4xl mx-auto mb-12 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or breed..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-4 flex-wrap">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Pet Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="dog">Dogs</SelectItem>
                <SelectItem value="cat">Cats</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterGender} onValueChange={setFilterGender}>
              <SelectTrigger className="w-[180px]">
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

        {/* Pet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPets.map((pet) => (
            <PetCard
              key={pet.id}
              id={pet.id}
              name={pet.name}
              breed={pet.breed}
              age={pet.age}
              gender={pet.gender}
              image={pet.image_url || "/placeholder.jpg"}
            />
          ))}
        </div>

        {filteredPets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No pets found matching your criteria
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Pets;
