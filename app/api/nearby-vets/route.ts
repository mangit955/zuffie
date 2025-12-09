import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!lat || !lng) {
    return NextResponse.json({ error: "Missing lat/lng" }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server missing GOOGLE_PLACES_API_KEY" },
      { status: 500 }
    );
  }

  // radius in meters
  const radius = 4000; // 4km, tweak if you want

  const url =
    "https://maps.googleapis.com/maps/api/place/nearbysearch/json" +
    `?location=${lat},${lng}` +
    `&radius=${radius}` +
    `&keyword=${encodeURIComponent("veterinary pet hospital animal clinic")}` +
    `&type=veterinary_care` +
    `&key=${apiKey}`;

  const res = await fetch(url, { cache: "no-store" });
  const data = await res.json();

  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    console.error("Google Places error:", data);
    return NextResponse.json(
      { vets: [], error: data.error_message || data.status },
      { status: 500 }
    );
  }

  const vets = (data.results || []).map((place: any) => ({
    id: place.place_id,
    name: place.name,
    address: place.vicinity || place.formatted_address || "No address",
    lat: place.geometry?.location?.lat ?? null,
    lng: place.geometry?.location?.lng ?? null,
    rating: place.rating ?? null,
    userRatingsTotal: place.user_ratings_total ?? null,
    openNow: place.opening_hours?.open_now ?? null,
    // optional extras if you want later:
    placeId: place.place_id,
  }));

  return NextResponse.json({ vets });
}
