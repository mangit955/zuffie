"use client";

import Loggedin_Navbar from "@/components/loggedin_Navbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useProtectRoute } from "@/hooks/useProtectRoute";
import { useRouter } from "next/navigation";

const FirstTimePetOwnerPage = () => {
  const router = useRouter();

  useProtectRoute();

  return (
    <div className="min-h-screen bg-background">
      <Loggedin_Navbar />

      <main className="max-w-4xl mx-auto px-4 md:px-6 lg:px-0 py-10">
        {/* Breadcrum/ Back link */}
        <button
          onClick={() => router.push("/resources")}
          className="text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          ← Back to resources
        </button>

        {/* Hero/ Title Section */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Badge variant={"secondary"}>Guide</Badge>
            <span className="text-xs text-muted-foreground">~10 min read</span>
          </div>

          <h1 className="text-4xl font-bold mb-3">
            First-Time Pet Owner&apos;s Guide
          </h1>
          <p className="text-muted-foreground text-lg">
            A practical, no-nonsense guide to help you prepare your home, choose
            the right pet, and make the first weeks safe and smooth for both of
            you.
          </p>
        </section>

        <Separator className="mb-10" />

        {/* TL;DR / Key points */}
        <section className="mb-10">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Key Takeaways</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <ul className="list-disc list-inside space-y-1">
                <li>Choose a pet that matches your lifestyle and time.</li>
                <li>
                  Prepare your home with basic supplies before they arrive.
                </li>
                <li>First vet visit should happen within the first week.</li>
                <li>
                  Set clear routines from day one (feeding, potty, sleep).
                </li>
                <li>
                  Be patient — the first 2–3 weeks are an adjustment period.
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Content sections */}
        <section className="space-y-10 text-sm md:text-base leading-relaxed">
          {/* Section 1 */}
          <div>
            <h2 className="text-2xl font-semibold mb-3">
              1. Choosing the Right Pet for You
            </h2>
            <p className="text-muted-foreground mb-3">
              Before falling in love with a cute face, be brutally honest about
              your lifestyle. Different pets (and breeds) have very different
              needs in terms of time, energy, space, and money.
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>
                <span className="font-medium">Time:</span> How many hours are
                you away from home each day?
              </li>
              <li>
                <span className="font-medium">Space:</span> Do you live in a
                small apartment or a house with a yard?
              </li>
              <li>
                <span className="font-medium">Budget:</span> Can you comfortably
                afford food, grooming, vet bills, and emergencies?
              </li>
              <li>
                <span className="font-medium">Energy level:</span> Active pets
                (like many dogs) need daily exercise and mental stimulation.
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-2xl font-semibold mb-3">
              2. Essential Supplies Before Bringing Your Pet Home
            </h2>
            <p className="text-muted-foreground mb-3">
              Having the basics ready makes the first day calmer for both you
              and your pet.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">For All Pets</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                    <li>Food and water bowls</li>
                    <li>Quality pet food (species/age appropriate)</li>
                    <li>Comfortable bed or resting area</li>
                    <li>Basic grooming tools</li>
                    <li>Collar, ID tag, and leash (if applicable)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Nice to Have</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                    <li>Treats for training and bonding</li>
                    <li>Toys for mental stimulation</li>
                    <li>Crate or carrier for safe travel</li>
                    <li>Pet-safe cleaning supplies</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-2xl font-semibold mb-3">
              3. First Week Checklist
            </h2>
            <p className="text-muted-foreground mb-3">
              The first week sets the tone. Keep things simple, predictable, and
              calm.
            </p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Book a vet appointment within the first 3–7 days.</li>
              <li>Decide and stick to a feeding schedule.</li>
              <li>
                Introduce a bathroom/toilet routine and reward successes
                generously.
              </li>
              <li>
                Limit visitors and loud environments — let your pet settle in.
              </li>
              <li>
                Start basic training early (name recognition, sit, no biting,
                litter box, etc.).
              </li>
            </ol>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-2xl font-semibold mb-3">
              4. Common Mistakes to Avoid
            </h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                <span className="font-medium">Inconsistent rules:</span> If the
                pet is allowed on the bed sometimes and scolded other times,
                they get confused.
              </li>
              <li>
                <span className="font-medium">Skipping training:</span> Cute
                behavior now can become a big problem later.
              </li>
              <li>
                <span className="font-medium">Overfeeding:</span> Extra treats
                add up quickly and can cause health issues.
              </li>
              <li>
                <span className="font-medium">
                  Ignoring early health signs:
                </span>{" "}
                Lethargy, not eating, vomiting, or diarrhea should be taken
                seriously.
              </li>
            </ul>
          </div>
        </section>

        {/* Call to action */}
        <section className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                Still Feeling Overwhelmed?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">
                That&apos;s completely normal for first-time pet owners. You
                don&apos;t have to figure it out alone.
              </p>
              <button
                onClick={() => router.push("/resources")}
                className="text-sm font-medium text-primary hover:underline"
              >
                Explore more guides and tips →
              </button>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default FirstTimePetOwnerPage;
