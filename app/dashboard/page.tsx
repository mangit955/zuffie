"use client";

import Navbar from "@/components/Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, FileText, MessageCircle } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loggedin_Navbar from "@/components/loggedin_Navbar";
import FavoritesTab from "@/components/FavouritesTab";
import Lottie from "lottie-react";
import loader from "@/public/lottie/loader.json";
import { createSupabaseClient } from "@/lib/supabaseClient";
import Image from "next/image";

type AdoptionApplication = {
  id: string;
  user_id: string | null;
  pet_uuid: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  housing_type: string;
  has_yard: boolean;
  has_other_pets: boolean;
  experience: string | null;
  why_adopt: string;
  status: string;
  created_at: string;
};

type AdoptionApplicationWithPet = {
  id: string;
  user_id: string | null;
  pet_uuid: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  housing_type: string;
  has_yard: boolean;
  has_other_pets: boolean;
  experience: string | null;
  why_adopt: string;
  status: string;
  created_at: string;
  pets: {
    id: string;
    name: string;
    breed: string;
    age: string;
    gender: string;
    image_url: string;
  } | null;
};

type FavouriteWithPet = {
  id: string;
  user_id: string | null;
  pet_uuid: string;
  created_at: string;
  pets: {
    id: string;
    name: string;
    breed: string;
    age: string;
    gender: string;
    image_url: string;
  } | null;
};
const supabase = createSupabaseClient();

const Dashboard = () => {
  const { toast } = useToast();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [adoptionRequests, setAdoptionRequests] = useState<
    AdoptionApplicationWithPet[]
  >([]);
  const [applications, setApplications] = useState<AdoptionApplication[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [favorite, setFavorite] = useState<FavouriteWithPet[]>([]);
  const [loadingFavorite, setLoadingFavorite] = useState(true);
  const [appPage, setAppPage] = useState(1);
  const appPageSize = 2; //depending on how many cards you want per page
  const [processingRequest, setProcessingRequest] = useState<string | null>(
    null
  );

  // 1) Load current user
  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Auth error:", error);
        toast({
          title: "Authentication error",
          description: "Please log in to view your dashboard",
          variant: "destructive",
        });
        router.push("/login");
        return;
      }
      setUser(user);
      setAuthLoading(false);
    };

    loadUser();
  }, [router, toast]);

  // 2) Once we know the user, load their applications
  useEffect(() => {
    if (!user) return;

    const loadApplications = async () => {
      setLoadingApplications(true);

      const { data, error } = await supabase
        .from("adoption_applications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching applications:", error);
        toast({
          title: "Error loading applications",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setApplications(data || []);
        setAppPage(1);
      }
      setLoadingApplications(false);
    };
    loadApplications();
  }, [user, toast]);

  //3) load their favourite pets
  useEffect(() => {
    if (!user) return;

    const loadFavoritePets = async () => {
      setLoadingFavorite(true);

      const { data, error } = await supabase
        .from("favorites")
        .select(
          `
          id,
          user_id,
          pet_uuid,
          created_at,
          pets (
            id,
            name,
            breed,
            age,
            gender,
            image_url
          )
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching favorite pets:", error);
        toast({
          title: "Error loading favorite pets",
          description: error.message,
          variant: "destructive",
        });
      } else {
        const normalizedFavorites: FavouriteWithPet[] = (data || []).map(
          (fav: any) => ({
            ...fav,
            // Supabase returns joined rows as arrays; grab first or null
            pets: Array.isArray(fav.pets) ? fav.pets[0] ?? null : fav.pets,
          })
        );

        setFavorite(normalizedFavorites);
      }

      setLoadingFavorite(false);
    };

    loadFavoritePets();
  }, [user, toast]);

  //4) to fetch the requests for your pets
  useEffect(() => {
    if (!user) return;

    const loadAdoptionRequests = async () => {
      setLoadingRequests(true);

      //get pets owned by current user
      const { data: pets, error: petsError } = await supabase
        .from("pets")
        .select("id")
        .eq("owner_id", user.id);

      if (petsError) {
        console.error(petsError);
        toast({
          title: "Error loading pets",
          description: petsError.message,
          variant: "destructive",
        });
        setLoadingRequests(false);
        return;
      }

      if (!pets || pets.length === 0) {
        setAdoptionRequests([]);
        setLoadingRequests(false);
        return;
      }

      const petIds = pets.map((p) => p.id);

      //get adoptation applications for those pets
      // Try nested query first, fallback to manual join if foreign key isn't configured
      let data: AdoptionApplicationWithPet[] | null = null;
      let error: { message?: string; details?: string } | null = null;

      // First, try with nested query
      const { data: nestedData, error: nestedError } = await supabase
        .from("adoption_applications")
        .select(
          `
           id,
        user_id,
        pet_uuid,
        full_name,
        email,
        phone,
        address,
        housing_type,
        has_yard,
        has_other_pets,
        experience,
        why_adopt,
        status,
        created_at,
        pets (
          id,
          name,
          breed,
          age,
          gender,
          image_url
        )
        `
        )
        .in("pet_uuid", petIds)
        .order("created_at", { ascending: false });

      // If nested query fails (likely due to missing foreign key), do manual join
      if (nestedError) {
        console.warn("Nested query failed, using manual join:", nestedError);

        // Fetch applications without nested query
        const { data: appsData, error: appsError } = await supabase
          .from("adoption_applications")
          .select("*")
          .in("pet_uuid", petIds)
          .order("created_at", { ascending: false });

        if (appsError) {
          error = appsError;
        } else if (appsData && appsData.length > 0) {
          // Get unique pet UUIDs from applications
          const petUuids = [
            ...new Set(
              appsData.map((app: AdoptionApplication) => app.pet_uuid)
            ),
          ];

          // Fetch pets separately
          const { data: petsData, error: petsError } = await supabase
            .from("pets")
            .select("id, name, breed, age, gender, image_url")
            .in("id", petUuids);

          if (petsError) {
            error = petsError;
          } else {
            // Create a map of pet data by id
            const petsMap = new Map(
              (petsData || []).map(
                (pet: {
                  id: string;
                  name: string;
                  breed: string;
                  age: string;
                  gender: string;
                  image_url: string;
                }) => [pet.id, pet]
              )
            );

            // Combine applications with pet data
            data = appsData.map((app: AdoptionApplication) => ({
              ...app,
              pets: petsMap.get(app.pet_uuid) || null,
            }));
          }
        } else {
          data = [];
        }
      } else {
        // Nested query succeeded - normalize the data
        if (nestedData) {
          data = nestedData.map(
            (
              req: {
                pets?:
                  | {
                      id: string;
                      name: string;
                      breed: string;
                      age: string;
                      gender: string;
                      image_url: string;
                    }[]
                  | {
                      id: string;
                      name: string;
                      breed: string;
                      age: string;
                      gender: string;
                      image_url: string;
                    }
                  | null;
              } & AdoptionApplication
            ): AdoptionApplicationWithPet => {
              const pets = Array.isArray(req.pets)
                ? req.pets[0] ?? null
                : req.pets ?? null;
              return {
                ...req,
                pets: pets as {
                  id: string;
                  name: string;
                  breed: string;
                  age: string;
                  gender: string;
                  image_url: string;
                } | null,
              };
            }
          );
        } else {
          data = [];
        }
      }

      if (error) {
        console.error("Error loading adoption requests:", error);
        const errorMessage =
          error.message || error.details || JSON.stringify(error);
        toast({
          title: "Error loading adoption requests",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        setAdoptionRequests(data || []);
      }
      setLoadingRequests(false);
    };
    loadAdoptionRequests();
  }, [user, toast]);

  const totalAppPages = Math.max(
    1,
    Math.ceil(applications.length / appPageSize)
  );
  const currentAppPage = Math.min(appPage, totalAppPages);
  const appStartIndex = (currentAppPage - 1) * appPageSize;
  const paginatedApplications = applications.slice(
    appStartIndex,
    appStartIndex + appPageSize
  );

  // Handle reject request
  const handleRejectRequest = async (requestId: string) => {
    if (!user) return;

    setProcessingRequest(requestId);
    try {
      // Update status to rejected
      const { error } = await supabase
        .from("adoption_applications")
        .update({ status: "rejected" })
        .eq("id", requestId);

      if (error) {
        throw error;
      }

      // Remove from the list (or update status in the list)
      setAdoptionRequests((prev) => prev.filter((req) => req.id !== requestId));

      toast({
        title: "Request rejected",
        description: "The adoption request has been rejected and removed.",
      });
    } catch (error: any) {
      console.error("Error rejecting request:", error);
      toast({
        title: "Error rejecting request",
        description: error.message || "Failed to reject the request.",
        variant: "destructive",
      });
    } finally {
      setProcessingRequest(null);
    }
  };

  // Handle accept request
  const handleAcceptRequest = async (request: AdoptionApplicationWithPet) => {
    if (!user || !request.pets) return;

    setProcessingRequest(request.id);
    try {
      // Start a transaction-like operation
      // 1. Update adoption application status to approved
      const { error: updateError } = await supabase
        .from("adoption_applications")
        .update({ status: "approved" })
        .eq("id", request.id);

      if (updateError) {
        throw updateError;
      }

      // 2. Mark the pet as adopted by updating is_adopted field
      // Note: You'll need to add 'is_adopted' (boolean) and 'adopted_by' (uuid) columns to your pets table in Supabase
      const { error: petUpdateError } = await supabase
        .from("pets")
        .update({
          is_adopted: true,
          adopted_by: request.user_id,
        })
        .eq("id", request.pet_uuid);

      if (petUpdateError) {
        // If is_adopted column doesn't exist yet, log a warning
        // The adoption application status is still updated, but the pet won't be filtered
        console.warn(
          "Could not update pet adoption status. Please add 'is_adopted' (boolean) and 'adopted_by' (uuid) columns to your pets table:",
          petUpdateError
        );
        toast({
          title: "Warning",
          description:
            "Pet adoption status updated, but you may need to add 'is_adopted' column to pets table to filter adopted pets.",
          variant: "default",
        });
      }

      // 3. Reject all other pending requests for this pet
      const { error: rejectOthersError } = await supabase
        .from("adoption_applications")
        .update({ status: "rejected" })
        .eq("pet_uuid", request.pet_uuid)
        .neq("id", request.id)
        .eq("status", "pending");

      if (rejectOthersError) {
        console.warn("Could not reject other requests:", rejectOthersError);
        // Non-critical error, continue
      }

      // Remove the accepted request from the list
      setAdoptionRequests((prev) =>
        prev.filter((req) => req.id !== request.id)
      );

      toast({
        title: "Request accepted!",
        description: `The adoption request for ${request.pets.name} has been accepted. The pet will be removed from listings.`,
      });
    } catch (error: any) {
      console.error("Error accepting request:", error);
      toast({
        title: "Error accepting request",
        description: error.message || "Failed to accept the request.",
        variant: "destructive",
      });
    } finally {
      setProcessingRequest(null);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Lottie animationData={loader} loop className="h-64 w-64" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar based on auth */}
      {user ? <Loggedin_Navbar /> : <Navbar />}

      <section className="py-12 px-8 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              My Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your adoption journey
            </p>
          </div>

          <Tabs defaultValue="favorites" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="favorites">
                <Heart className="mr-2 h-4 w-4" />
                Favorites
              </TabsTrigger>
              <TabsTrigger value="applications">
                <FileText className="mr-2 h-4 w-4" />
                Applications
              </TabsTrigger>

              <TabsTrigger value="My Requests">
                <MessageCircle className="mr-2 h-4 w-4" />
                My Requests
              </TabsTrigger>
            </TabsList>

            <TabsContent value="favorites" className="space-y-4">
              <FavoritesTab
                favorite={favorite}
                loadingFavorite={loadingFavorite}
                onViewPet={(id) => router.push(`/pets/${id}`)}
              />
            </TabsContent>

            <TabsContent value="applications" className="space-y-4">
              {loadingApplications ? (
                <p className="text-muted-foreground">
                  Loading your applications...
                </p>
              ) : applications.length === 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>No application yet</CardTitle>
                    <CardDescription>
                      You haven&apos;t submitted any adoptation applications
                      yet.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => router.push("/pets")}>
                      Start an application
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                paginatedApplications.map((app) => (
                  <Card key={app.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="mb-2">
                            Adoption Application
                          </CardTitle>
                          <CardDescription>
                            Submitted on{" "}
                            {new Date(app.created_at).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge
                          variant={
                            app.status.toLowerCase() === "approved"
                              ? "default"
                              : app.status.toLowerCase() === "rejected"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {app.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p>
                        <span className="font-medium">Name:</span>{" "}
                        {app.full_name}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span> {app.email}
                      </p>
                      <p>
                        <span className="font-medium">Phone:</span> {app.phone}
                      </p>
                      <p>
                        <span className="font-medium">Address:</span>{" "}
                        {app.address}
                      </p>
                      <p>
                        <span className="font-medium">Housing Type:</span>{" "}
                        {app.housing_type}
                        {app.has_yard ? "(Has yard)" : " "}
                      </p>
                      <p>
                        <span className="font-medium">Other Pets:</span>{" "}
                        {app.has_other_pets ? "Yes" : "No"}
                      </p>
                      {app.experience && (
                        <p>
                          <span className="font-medium">Experience:</span>{" "}
                          {app.experience}
                        </p>
                      )}
                      <p>
                        <span className="font-medium">Why adopt:</span>{" "}
                        {app.why_adopt}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
              {applications.length > 0 && (
                <div className="mt-4 flex items-center justify-center gap-4">
                  <button
                    className="rounded-md border-gray-300 cursor-pointer bg-card shadow-sm border px-3 py-1 text-sm disabled:opacity-50"
                    onClick={() => setAppPage((p) => Math.max(1, p - 1))}
                    disabled={currentAppPage === 1}
                  >
                    Previous
                  </button>

                  <span className="text-sm text-muted-foreground">
                    Page {currentAppPage} of {totalAppPages}
                  </span>

                  <button
                    className="rounded-md border border-gray-300 cursor-pointer bg-card shadow-sm px-3 py-1 text-sm disabled:opacity-50"
                    onClick={() =>
                      setAppPage((p) => Math.min(totalAppPages, p + 1))
                    }
                    disabled={currentAppPage === totalAppPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="My Requests" className="space-y-4">
              {loadingRequests ? (
                <p className="text-muted-foreground">
                  Loading adoption requests...
                </p>
              ) : adoptionRequests.length === 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>No requests yet</CardTitle>
                    <CardDescription>
                      You haven&apost received any adoption requests for your
                      pets.
                    </CardDescription>
                  </CardHeader>
                </Card>
              ) : (
                adoptionRequests.map((req) => (
                  <Card key={req.id}>
                    <CardHeader className="flex flex-row gap-4">
                      {req.pets?.image_url && (
                        <Image
                          src={req.pets.image_url}
                          alt={req.pets.name}
                          width={80}
                          height={80}
                          className="h-20 w-20 rounded-md object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <CardTitle>
                          Request for {req.pets?.name ?? "Unknown Pet"}
                        </CardTitle>
                        <CardDescription>
                          Submitted on{" "}
                          {new Date(req.created_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge
                        className="h-7 px-3 py-1"
                        variant={
                          req.status === "approved"
                            ? "default"
                            : req.status === "rejected"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {" "}
                        {req.status}
                      </Badge>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="space-y-1 text-sm">
                        <p>
                          <strong>Name:</strong> {req.full_name}
                        </p>
                        <p>
                          <strong>Email:</strong> {req.email}
                        </p>
                        <p>
                          <strong>Phone:</strong> {req.phone}
                        </p>
                        <p>
                          <strong>Housing:</strong> {req.housing_type}
                        </p>
                        <p>
                          <strong>Has yard:</strong>{" "}
                          {req.has_yard ? "Yes" : "No"}
                        </p>
                        <p>
                          <strong>Other pets:</strong>{" "}
                          {req.has_other_pets ? "Yes" : "No"}
                        </p>
                        {req.experience && (
                          <p>
                            <strong>Experience:</strong> {req.experience}
                          </p>
                        )}
                        <p>
                          <strong>Why adopt:</strong> {req.why_adopt}
                        </p>
                      </div>

                      {/* Action buttons - only show for pending requests */}
                      {req.status === "pending" && (
                        <div className="flex gap-3 pt-4 border-t">
                          <Button
                            onClick={() => handleAcceptRequest(req)}
                            disabled={processingRequest === req.id}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            {processingRequest === req.id
                              ? "Processing..."
                              : "Accept"}
                          </Button>
                          <Button
                            onClick={() => handleRejectRequest(req.id)}
                            disabled={processingRequest === req.id}
                            variant="destructive"
                            className="flex-1"
                          >
                            {processingRequest === req.id
                              ? "Processing..."
                              : "Reject"}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
