"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
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

const Adopt = () => {
  const { loading } = useProtectRoute();
  const [submitting, setSubmitting] = useState(false);
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
  const petId = searchParams.get("petId");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const supabase = createSupabaseClient();

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

      const { error } = await supabase.from("adoption_applications").insert({
        user_id: user?.id ?? null,
        pet_uuid: petId,
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        housing_type: formData.housingType,
        has_yard: formData.hasYard,
        has_other_pets: formData.hasOtherPets,
        experience: formData.experience,
        why_adopt: formData.whyAdopt,
        status: "pending",
      });

      if (error) {
        console.error("Supabase insert error:", error);
        console.error("Error details:", {
          message: error.message || "No message",
          details: error.details || "No details",
          hint: error.hint || "No hint",
          code: error.code || "No code",
        });

        toast({
          title: "Could not submit application",
          description: error.message || "Please try again in a moment.",
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }

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
      <Navbar />

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
                    <Label htmlFor="fullName">Full Name *</Label>
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
                    <Label htmlFor="email">Email *</Label>
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
                    <Label htmlFor="phone">Phone Number *</Label>
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
                    <Label htmlFor="housingType">Housing Type *</Label>
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
                  <Label htmlFor="address">Address *</Label>
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
                  <Label htmlFor="whyAdopt">Why do you want to adopt? *</Label>
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
