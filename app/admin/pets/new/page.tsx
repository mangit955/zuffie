"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loggedin_Navbar from "@/components/loggedin_Navbar";
import { useToast } from "@/hooks/use-toast";
import { useProtectRoute } from "@/hooks/useProtectRoute"; // if you have this
import { Upload } from "lucide-react";
import Image from "next/image";
import Lottie from "lottie-react";
import loader from "@/public/lottie/loader.json";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { z } from "zod";
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
import { createSupabaseClient } from "@/lib/supabaseClient";

const petSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["cat", "dog"], {
    message: "Pet type is required",
  }),
  breed: z.string().min(1, "Breed is required"),
  age: z
    .preprocess(
      (val) => Number(val),
      z
        .number({ error: "Age is required" })
        .int("Age must be a natural number")
        .positive("Age must be  greater than 0")
        .max(50, "Age seems unrealistic")
    )
    .transform((age) => `${age} years`),
  gender: z.enum(["Male", "Female"], {
    message: "Gender is required",
  }),
  weight: z
    .preprocess(
      (val) => (val === "" || val === undefined ? undefined : Number(val)),
      z
        .number({ error: "Weight must be a number" })
        .positive("Weight must be greater than 0")
        .max(150, "Weight seems unrealistic")
        .optional()
    )
    .transform((weight) => (weight !== undefined ? `${weight} kg` : undefined)),
  color: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  health_status: z.string().optional(),
  vaccinated: z.string().optional(),
  neutered: z.string().optional(),
  personality: z
    .string()
    .optional()
    .transform((val) =>
      val
        ? val
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : []
    ),
});

const NewPetPage = () => {
  const supabase = createSupabaseClient();
  const router = useRouter();
  const { toast } = useToast();
  const { loading: authLoading } = useProtectRoute();
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    slug: "",
    name: "",
    breed: "",
    age: "",
    gender: "",
    type: "",
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

  // Clean up object URL
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Loggedin_Navbar />
        <section className="py-12 px-8 md:px-16 lg:px-24">
          <div className=" flex items-center justify-center">
            <Lottie animationData={loader} loop className="h-64 w-64" />
          </div>
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
        formData.slug.trim() ||
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

      const parsed = petSchema.safeParse(formData);

      if (!parsed.success) {
        const firstError = Object.values(
          parsed.error.flatten().fieldErrors
        )[0]?.[0];

        toast({
          title: "Invalid form data",
          description: firstError || "Please check your inputs.",
          variant: "destructive",
        });

        setSubmitting(false);
        return;
      }

      //1) REQUIRE an image file (you can make this optional if you want)
      if (!imageFile) {
        setImageError("Pet image is required");
        toast({
          title: "Missing pet image",
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

      // Get current user to set owner_id
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast({
          title: "Authentication error",
          description: "Please log in again before creating a pet.",
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }

      //using parsed data
      const validatedData = parsed.data;

      const { error } = await supabase.from("pets").insert({
        slug: generatedId,
        ...validatedData,
        image_url: publicUrl,
        owner_id: user.id,
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
        title: "Pet Added",
        description: "View your pet in the adopt section. ",
      });

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
                    <Label htmlFor="name">
                      Pet name <span className="text-red-500">*</span>
                    </Label>
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
                  <div className="space-y-2">
                    <Label>
                      Pet type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cat">Cat</SelectItem>
                        <SelectItem value="dog">Dog</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Breed + Age */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="breed">
                      Breed <span className="text-red-500">*</span>
                    </Label>
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
                    <Label htmlFor="age">
                      Age <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      min={1}
                      step={1}
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
                    <Label>
                      Gender <span className="text-red-500">*</span>
                    </Label>
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
                      type="number"
                      min={1}
                      step={1}
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
                    <Select
                      value={formData.color}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, color: value }))
                      }
                    >
                      <SelectTrigger>
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
                    <Select
                      value={formData.health_status}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          health_status: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Overall health condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="needs care">Needs care</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vaccinated">Vaccinated</Label>
                    <Select
                      value={formData.vaccinated}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, vaccinated: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Vaccination status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="partial">Partial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="neutered">Neutered</Label>
                    <Select
                      value={formData.neutered}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, neutered: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Neuter status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
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
                  <Label htmlFor="image_url">
                    Pet Image <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="image_url"
                    type="file"
                    className="cursor-pointer hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setImageFile(file);
                      setImageError(null);

                      if (file) {
                        const previewUrl = URL.createObjectURL(file);
                        setImagePreview(previewUrl);
                      } else {
                        setImagePreview(null);
                      }
                    }}
                  />

                  {/* Upload box */}
                  <label
                    htmlFor="image_url"
                    className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-muted-foreground/40 px-6 py-8 text-center cursor-pointer hover:border-primary hover:bg-muted/30 transition "
                  >
                    <Upload className="h-6 w-6 text-muted-foreground" />

                    <div className="text-sm">
                      <span className="font-medium text-foreground">
                        Click to upload
                      </span>{" "}
                      <span className="text-muted-foreground">
                        or drag and drop
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, JPEG (max 5MB)
                    </p>
                  </label>
                  {imageError && (
                    <p className="text-sm text-red-500 mt-2"> {imageError}</p>
                  )}

                  {imagePreview && (
                    <div className="relative mt-4 w-32 h-32">
                      <Image
                        src={imagePreview}
                        alt="Selected pet preview"
                        fill
                        className="object-cover rounded-md border"
                      />

                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                          setImageError("Pet image is required");
                        }}
                        className="absolute -top-2 -right-2 bg-background border rounded-full p-1 shadow hover:bg-muted transition"
                        aria-label="Remove image"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {imageFile && (
                    <p className="text-sm text-muted-foreground">
                      Selected:{" "}
                      <span className="font-medium">{imageFile.name}</span>
                    </p>
                  )}

                  <p className="text-xs text-muted-foreground">
                    Upload an image for this pet
                  </p>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full cursor-pointer"
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
