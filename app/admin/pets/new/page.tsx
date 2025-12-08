"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import Loggedin_Navbar from "@/components/loggedin_Navbar";
import { useToast } from "@/hooks/use-toast";
import { useProtectRoute } from "@/hooks/useProtectRoute"; // if you have this

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const NewPetPage = () => {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const { toast } = useToast();
  const { loading: authLoading } = useProtectRoute(); // optional, if you use this elsewhere

  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    breed: "",
    age: "",
    gender: "",
    weight: "",
    color: "",
    location: "",
    description: "",
    health_status: "",
    vaccinated: "",
    neutered: "",
    personality: "", // comma-separated string (we'll split this)
    image_url: "",
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Loggedin_Navbar />
        <section className="py-12 px-8 md:px-16 lg:px-24">
          <p>Checking authentication...</p>
        </section>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // If id is empty, generate a simple slug from the name
      const generatedId =
        formData.id.trim() ||
        formData.name
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9\-]/g, ""); // keep it simple

      if (!generatedId) {
        toast({
          title: "Missing ID or Name",
          description: "Please provide at least a pet name.",
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }

      //1) REQUIRE an image file (you can make this optional if you want)
      if (!imageFile) {
        toast({
          title: "No image selected",
          description: "Please upload an image for this pet.",
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }

      // 2) Upload image to Supabase Storage
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${generatedId}-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from("pet-images")
        .upload(filePath, imageFile);

      if (uploadError) {
        console.error("Error uploading image:", uploadError);
        toast({
          title: "Image Upload Failed",
          description: uploadError.message,
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }

      //3) Get public URL of uploaded image
      const {
        data: { publicUrl },
      } = supabase.storage.from("pet-images").getPublicUrl(filePath);

      // Convert comma-separated personality string → array
      const personalityArray =
        formData.personality
          .split(",")
          .map((trait) => trait.trim())
          .filter(Boolean) || [];

      const { error } = await supabase.from("pets").insert({
        id: generatedId,
        name: formData.name,
        breed: formData.breed,
        age: formData.age,
        gender: formData.gender,
        weight: formData.weight || null,
        color: formData.color || null,
        location: formData.location || null,
        description: formData.description || null,
        health_status: formData.health_status || null,
        vaccinated: formData.vaccinated || null,
        neutered: formData.neutered || null,
        personality: personalityArray,
        image_url: publicUrl,
      });

      if (error) {
        console.error("Error inserting pet:", error);
        toast({
          title: "Could not create pet",
          description: error.message,
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }

      toast({
        title: "Pet created",
        description: `${formData.name} has been added to the database.`,
      });

      // Optional: go to pet detail page or dashboard
      router.push(`/pets/${generatedId}`);
    } catch (err) {
      console.error("Unexpected error creating pet:", err);
      toast({
        title: "Unexpected error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Loggedin_Navbar />

      <section className="py-12 px-8 md:px-16 lg:px-24">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Add New Pet</CardTitle>
              <CardDescription>
                Create a new pet entry that will appear in listings and can be
                favourited or adopted.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* ID + Name */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="id">
                      Pet ID (optional – leave empty to auto-generate from name)
                    </Label>
                    <Input
                      id="id"
                      value={formData.id}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, id: e.target.value }))
                      }
                      placeholder="max, luna, charlie..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                {/* Breed + Age */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="breed">Breed *</Label>
                    <Input
                      id="breed"
                      required
                      value={formData.breed}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          breed: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      required
                      placeholder="e.g. 2 years"
                      value={formData.age}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          age: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                {/* Gender + Weight */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Gender *</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, gender: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight</Label>
                    <Input
                      id="weight"
                      placeholder="e.g. 30 kg"
                      value={formData.weight}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          weight: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                {/* Color + Location */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      value={formData.color}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          color: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="Shelter name, city"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    placeholder="Short description about the pet..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>

                {/* Health info */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="health_status">Health Status</Label>
                    <Input
                      id="health_status"
                      placeholder="Excellent / Good / Needs care"
                      value={formData.health_status}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          health_status: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vaccinated">Vaccinated</Label>
                    <Input
                      id="vaccinated"
                      placeholder="Yes / No / Partial"
                      value={formData.vaccinated}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          vaccinated: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="neutered">Neutered</Label>
                    <Input
                      id="neutered"
                      placeholder="Yes / No"
                      value={formData.neutered}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          neutered: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                {/* Personality */}
                <div className="space-y-2">
                  <Label htmlFor="personality">
                    Personality (comma-separated)
                  </Label>
                  <Input
                    id="personality"
                    placeholder="Friendly, Energetic, Good with kids"
                    value={formData.personality}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        personality: e.target.value,
                      }))
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    We will store this as an array in the database.
                  </p>
                </div>

                {/* Pet Image */}
                <div className="space-y-2">
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setImageFile(file);
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload an image for this pet
                  </p>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : "Create Pet"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default NewPetPage;
