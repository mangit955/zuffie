"use client";

import { useState } from "react";
import Loggedin_Navbar from "@/components/loggedin_Navbar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, Star, AlertTriangle } from "lucide-react";
import { createSupabaseClient } from "@/lib/supabaseClient";
import Lottie from "lottie-react";
import loader from "@/public/lottie/loader.json";
import { Vet } from "@/domain/vets/types";
import { useProtectRoute } from "@/hooks/useProtectRoute";

const VetsPage = () => {
  const supabase = createSupabaseClient();

  const [city, setCity] = useState("");
  const [vets, setVets] = useState<Vet[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Protect route
  useProtectRoute();

  const fetchVetsByCity = async () => {
    if (!city.trim()) return;

    setLoading(true);
    setSearched(true);

    const { data, error } = await supabase
      .from("vets")
      .select("*")
      .eq("city", city.trim())
      .eq("is_active", true)
      .order("rating", { ascending: false })
      .limit(6);

    if (error) {
      console.error(error);
      setVets([]);
    } else {
      setVets(data || []);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Loggedin_Navbar />

      <section className="py-12 px-6 md:px-12 lg:px-24">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">Trusted Vets & Clinics</h1>
          <p className="text-muted-foreground">
            Curated veterinary clinics in your city — no location access
            required.
          </p>
        </div>

        {/* City Search */}
        <div className="flex gap-3 justify-center mb-10">
          <Input
            placeholder="Enter city (e.g. Amravati)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="max-w-xs bg-card shadow-sm text-muted-foreground"
          />
          <Button
            onClick={fetchVetsByCity}
            disabled={loading}
            className="cursor-pointer shadow-md"
          >
            {loading ? "Searching..." : "Find vets"}
          </Button>
        </div>

        {/* States */}
        {loading && (
          <div className="flex items-center justify-center">
            <Lottie animationData={loader} loop className="h-64 w-64" />
          </div>
        )}

        {!loading && searched && vets.length === 0 && (
          <p className="text-center text-muted-foreground">
            No vetted clinics found for this city yet.
          </p>
        )}

        {/* Vet Cards */}
        <div className="grid gap-4 md:grid-cols-2 max-w-5xl mx-auto">
          {vets.map((vet) => (
            <Card key={vet.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{vet.name}</span>

                  {typeof vet.rating === "number" && (
                    <span className="flex items-center gap-1 text-sm text-yellow-500">
                      <Star className="h-4 w-4" />
                      {vet.rating.toFixed(1)}
                      {vet.total_reviews ? ` (${vet.total_reviews})` : ""}
                    </span>
                  )}
                </CardTitle>

                <CardDescription>
                  {vet.area ? `${vet.area}, ` : ""}
                  {vet.city}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                {vet.address && (
                  <p className="text-sm text-muted-foreground">{vet.address}</p>
                )}

                {vet.emergency_available && (
                  <div className="flex items-center gap-2 text-sm text-red-600 font-medium">
                    <AlertTriangle className="h-4 w-4" />
                    Emergency services available
                  </div>
                )}

                <div className="flex justify-between items-center pt-2">
                  {vet.phone ? (
                    <a href={`tel:${vet.phone}`}>
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-2" />
                        Call clinic
                      </Button>
                    </a>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Phone not available
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default VetsPage;
