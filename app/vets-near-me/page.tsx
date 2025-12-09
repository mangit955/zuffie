"use client";

import { useEffect, useState } from "react";
import Loggedin_Navbar from "@/components/loggedin_Navbar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Star, RefreshCcw } from "lucide-react";

type Vet = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating?: number;
  userRatingsTotal?: number;
  openNow: boolean | null;
};

const VetsNearMePage = () => {
  const [vets, setVets] = useState<Vet[]>([]);
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const fetchVets = () => {
    setLocationError(null);
    setLoading(true);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          const res = await fetch(`/api/nearby-vets?lat=${lat}&lng=${lng}`);
          const data = await res.json();

          if (!res.ok) {
            setLocationError(data.error || "Failed to load nearby vets.");
            setVets([]);
          } else {
            setVets(data.vets || []);
          }
        } catch (err) {
          console.error("Error fetching vets:", err);
          setLocationError("Something went wrong while fetching vets.");
          setVets([]);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError(
            "Location permission denied. Please enable it in your browser and try again."
          );
        } else {
          setLocationError("Could not get your location.");
        }
        setLoading(false);
      }
    );
  };

  // Auto-load on first visit
  useEffect(() => {
    fetchVets();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Loggedin_Navbar />

      <section className="py-12 px-8 md:px-16 lg:px-24">
        <div className="max-w-4xl mx-auto mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Vets Near You</h1>
          <p className="text-muted-foreground">
            Find veterinary clinics close to your current location.
          </p>

          <div className="mt-4 flex justify-center gap-3">
            <Button onClick={fetchVets} disabled={loading}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              {loading ? "Finding vets..." : "Refresh near me"}
            </Button>
          </div>

          {locationError && (
            <p className="mt-3 text-sm text-red-500">{locationError}</p>
          )}
        </div>

        {/* Results */}
        {loading && (
          <p className="text-center text-muted-foreground">
            Searching for nearby vets...
          </p>
        )}

        {!loading && vets.length === 0 && !locationError && (
          <p className="text-center text-muted-foreground">
            No vets found nearby. Try again in a different area.
          </p>
        )}

        <div className="grid gap-4 md:grid-cols-2 max-w-5xl mx-auto">
          {vets.map((vet) => (
            <Card key={vet.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2">
                  <span>{vet.name}</span>
                  {typeof vet.rating === "number" && (
                    <span className="flex items-center gap-1 text-sm text-yellow-500">
                      <Star className="h-4 w-4" />
                      {vet.rating.toFixed(1)}
                      {vet.userRatingsTotal ? ` (${vet.userRatingsTotal})` : ""}
                    </span>
                  )}
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{vet.address}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {vet.openNow === true && (
                    <span className="text-green-600 font-medium">Open now</span>
                  )}
                  {vet.openNow === false && (
                    <span className="text-red-500 font-medium">Closed now</span>
                  )}
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    vet.name + " " + vet.address
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm">
                    Open in Maps
                  </Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default VetsNearMePage;
