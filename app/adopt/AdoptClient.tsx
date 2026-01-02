"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useProtectRoute } from "@/hooks/useProtectRoute";
import { createSupabaseClient } from "@/lib/supabaseClient";
import Lottie from "lottie-react";
import loaderAnimation from "@/public/lottie/loader.json";
import Loggedin_Navbar from "@/components/loggedin_Navbar";

const Adopt = () => {
  const { loading } = useProtectRoute();
  const [submitting, setSubmitting] = useState(false);
  const [loadingUserData, setLoadingUserData] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    housingType: "",
    hasYard: false,
    hasOtherPets: false,
    experience: "",
    whyAdopt: "",
  });
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const petSlug = searchParams.get("petId");

  // Auto-fill form with user's previous application data or email
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const supabase = createSupabaseClient();

        //Get authenticated user
        const {
          data: { user },
          error: useError,
        } = await supabase.auth.getUser();

        if (useError || !user) {
          console.error("Error loading user:", useError);
          setLoadingUserData(false);
          return;
        }

        //Set email from auth (always available)
        setFormData((prev) => ({
          ...prev,
          email: user.email || "",
        }));

        //Try to get user's most recent application
        const { data: recentApplication, error: appError } = await supabase
          .from("adoption_applications")
          .select("full_name, email, phone, address")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!appError && recentApplication) {
          //Pre-fill form with data from most recent application
          setFormData((prev) => ({
            ...prev,
            fullName: recentApplication.full_name || prev.fullName,
            email: recentApplication.email || user.email || prev.email,
            phone: recentApplication.phone || prev.phone,
            address: recentApplication.address || prev.address,
          }));
        }
      } catch (err) {
        console.error("Error loading user data:", err);
      } finally {
        setLoadingUserData(false);
      }
    };
    loadUserData();
  }, []); //Run once when component mount

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const supabase = createSupabaseClient();

      // Validate if pet slug is provided
      if (!petSlug) {
        toast({
          title: "Missing Pet Information",
          description: "Please select a pet to adopt",
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }

      // optional: get loggedin user id from supabase
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error(userError);
        toast({
          title: "Authentication error",
          description: "Please log in again before applying.",
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }

      // Verify the pet exists before inserting
      // Log the petSlug to help debug
      console.log("Verifying pet with id:", petSlug);

      const { data: petData, error: petError } = await supabase
        .from("pets")
        .select("id")
        .eq("id", petSlug)
        .maybeSingle();

      // Enhanced error logging
      if (petError) {
        console.error("Error verifying pet:", petError);
        console.error("Error object keys:", Object.keys(petError));
        console.error("Error stringified:", JSON.stringify(petError, null, 2));

        // If it's an RLS error (empty object), we'll still try to insert
        // The insert will fail with a proper error if the pet doesn't exist
        const isRLSError = Object.keys(petError).length === 0;

        if (!isRLSError) {
          toast({
            title: "Error",
            description: "Could not verify pet information. Please try again.",
            variant: "destructive",
          });
          setSubmitting(false);
          return;
        }
        // If RLS error, continue - the insert will validate the pet exists
        console.warn(
          "Pet verification failed (possibly RLS), proceeding with insert..."
        );
      }

      if (!petData) {
        toast({
          title: "Pet Not Found",
          description: "The selected pet could not be found.",
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }

      // Prepare insert data
      const insertData = {
        user_id: user?.id ?? null,
        pet_uuid: petData.id,
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        housing_type: formData.housingType,
        has_yard: formData.hasYard,
        has_other_pets: formData.hasOtherPets,
        experience: formData.experience || null,
        why_adopt: formData.whyAdopt,
        status: "pending",
      };

      console.log("Inserting adoption application with data:", insertData);

      const { data: insertedData, error } = await supabase
        .from("adoption_applications")
        .insert(insertData)
        .select();

      if (error) {
        console.error("Supabase insert error:", error);
        console.error("Error object keys:", Object.keys(error));
        console.error("Error stringified:", JSON.stringify(error, null, 2));
        console.error("Error details:", {
          message: error.message || "No message",
          details: error.details || "No details",
          hint: error.hint || "No hint",
          code: error.code || "No code",
        });
        console.error("Insert data that failed:", insertData);

        // Provide more helpful error messages
        let errorMessage = "Please try again in a moment.";
        if (error.message) {
          errorMessage = error.message;
        } else if (error.details) {
          errorMessage = error.details;
        } else if (error.hint) {
          errorMessage = error.hint;
        } else if (error.code) {
          // Common error codes
          if (error.code === "23503") {
            errorMessage =
              "The selected pet could not be found. Please try selecting a different pet.";
          } else if (error.code === "23505") {
            errorMessage =
              "You have already submitted an application for this pet.";
          } else {
            errorMessage = `Database error (${error.code}). Please contact support.`;
          }
        }

        toast({
          title: "Could not submit application",
          description: errorMessage,
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }

      console.log("Successfully inserted adoption application:", insertedData);

      toast({
        title: "Application Submitted!",
        description: "We'll review your application and get back to you soon.",
      });

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      toast({
        title: "Unexpected error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Lottie animationData={loaderAnimation} loop className="w-32 h-32" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Loggedin_Navbar />

      <section className="py-12 px-8 md:px-16 lg:px-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-foreground mb-4">
              Adoption Application
            </h1>
            <p className="text-muted-foreground text-lg">
              Fill out this form to start your adoption journey
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
              <CardDescription>
                Tell us about yourself and your home
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      required
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="housingType">
                      Housing Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.housingType}
                      onValueChange={(value) =>
                        setFormData({ ...formData, housingType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select housing type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="condo">Condo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">
                    Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="address"
                    required
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasYard"
                      checked={formData.hasYard}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          hasYard: checked as boolean,
                        })
                      }
                    />
                    <Label htmlFor="hasYard" className="cursor-pointer">
                      I have a yard
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasOtherPets"
                      checked={formData.hasOtherPets}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          hasOtherPets: checked as boolean,
                        })
                      }
                    />
                    <Label htmlFor="hasOtherPets" className="cursor-pointer">
                      I have other pets
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Pet Care Experience</Label>
                  <Textarea
                    id="experience"
                    placeholder="Tell us about your experience with pets..."
                    value={formData.experience}
                    onChange={(e) =>
                      setFormData({ ...formData, experience: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whyAdopt">
                    Why do you want to adopt?{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="whyAdopt"
                    required
                    placeholder="Tell us why you want to adopt a pet..."
                    value={formData.whyAdopt}
                    onChange={(e) =>
                      setFormData({ ...formData, whyAdopt: e.target.value })
                    }
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full cursor-pointer shadow-md"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Adopt;
