"use client";

import Loggedin_Navbar from "@/components/loggedin_Navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useProtectRoute } from "@/hooks/useProtectRoute";

const PetHealthcareEssentialsPage = () => {
  const router = useRouter();

  useProtectRoute();

  return (
    <div className="min-h-screen bg-background">
      <Loggedin_Navbar />

      <main className="max-w-4xl mx-auto px-4 md:px-6 lg:px-0 py-10">
        {/* Back link */}
        <button
          onClick={() => router.push("/resources")}
          className="text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          ← Back to resources
        </button>

        {/* Hero */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Badge variant="secondary">Health</Badge>
            <span className="text-xs text-muted-foreground">
              ~8–10 min read
            </span>
          </div>

          <h1 className="text-4xl font-bold mb-3">Pet Healthcare Essentials</h1>
          <p className="text-muted-foreground text-lg">
            Learn the basics of keeping your pet healthy — vaccines, vet visits,
            parasite prevention, first-aid, and early warning signs you should
            never ignore.
          </p>
        </section>

        <Separator className="my-6" />

        {/* Key Takeaways */}
        <section className="mb-10">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Key Takeaways</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Regular vet check-ups are just as important as vaccinations.
                </li>
                <li>
                  Parasite prevention (ticks, fleas, worms) protects both pets
                  and humans.
                </li>
                <li>
                  Small changes in appetite, behavior, or bathroom habits can be
                  early signs of illness.
                </li>
                <li>
                  Having a basic pet first-aid kit at home saves time in
                  emergencies.
                </li>
                <li>
                  When in doubt, it&apos;s safer to call a vet than to wait and
                  hope it gets better.
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Content */}
        <section className="space-y-10 text-sm md:text-base leading-relaxed">
          {/* Section 1 */}
          <div>
            <h2 className="text-2xl font-semibold mb-3">
              1. Routine Vet Check-Ups
            </h2>
            <p className="text-muted-foreground mb-3">
              Vet visits aren&apos;t just for when your pet is sick. Regular
              check-ups help catch problems early, when they&apos;re easier and
              cheaper to treat.
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                <span className="font-medium">Puppies / Kittens:</span> several
                visits during the first few months for vaccines and growth
                checks.
              </li>
              <li>
                <span className="font-medium">Healthy adults:</span> usually 1
                routine check-up per year.
              </li>
              <li>
                <span className="font-medium">Seniors:</span> often every 6
                months, or as your vet advises.
              </li>
              <li>
                During a check-up, vets usually examine teeth, eyes, ears,
                heart, weight, skin, and overall behavior.
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-2xl font-semibold mb-3">
              2. Vaccinations &amp; Preventive Care
            </h2>
            <p className="text-muted-foreground mb-3">
              Vaccines protect your pet from serious and sometimes deadly
              diseases. Your vet will recommend a schedule based on your
              pet&apos;s age, species, and lifestyle.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Core Vaccines</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                    <li>
                      Recommended for most pets regardless of lifestyle (for
                      example: rabies in many countries).
                    </li>
                    <li>Protect against common, severe diseases.</li>
                    <li>
                      Usually given as a series when young, then boosters over
                      time.
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Non-Core Vaccines</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                    <li>
                      Given depending on risk (outdoor pets, boarding, travel).
                    </li>
                    <li>
                      Your vet may suggest them if your pet meets other animals
                      often.
                    </li>
                    <li>
                      Examples often include diseases spread in groups or
                      specific regions.
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-2xl font-semibold mb-3">
              3. Parasite Prevention (Fleas, Ticks, Worms)
            </h2>
            <p className="text-muted-foreground mb-3">
              Parasites are more than just annoying — they can cause infections,
              skin problems, and even serious illness for pets and humans.
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                <span className="font-medium">Fleas &amp; ticks:</span> can
                cause itching, allergies, blood loss, and transmit diseases.
                Prevention options include spot-on treatments, tablets, and
                collars.
              </li>
              <li>
                <span className="font-medium">Worms (internal parasites):</span>{" "}
                can affect the intestines, heart, or lungs. Regular deworming,
                especially for outdoor pets, is important.
              </li>
              <li>
                <span className="font-medium">Environment:</span> washing
                bedding, vacuuming, and checking your pet after walks helps
                reduce risk.
              </li>
            </ul>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-2xl font-semibold mb-3">
              4. Signs Your Pet May Be Unwell
            </h2>
            <p className="text-muted-foreground mb-3">
              Pets can&apos;t say &quot;I don&apos;t feel good&quot;, so you
              need to watch for small changes in their body and behavior.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Common Warning Signs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                    <li>Not eating or drinking normally</li>
                    <li>Vomiting or diarrhea that lasts more than a day</li>
                    <li>Sudden weight loss or gain</li>
                    <li>Unusual tiredness or hiding more than usual</li>
                    <li>Coughing, sneezing, or breathing difficulties</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    More Urgent Symptoms
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                    <li>Difficulty breathing or very fast breathing</li>
                    <li>Collapse, seizures, or inability to stand</li>
                    <li>Blood in vomit, stool, or urine</li>
                    <li>Bloated, hard belly with restlessness or pain</li>
                    <li>Serious injury from accidents or fights</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            <p className="text-muted-foreground mt-3">
              If you&apos;re ever unsure, it&apos;s always okay to call a vet
              clinic and explain the symptoms. They can tell you how urgent it
              is.
            </p>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="text-2xl font-semibold mb-3">
              5. Basic Pet First-Aid &amp; Emergency Prep
            </h2>
            <p className="text-muted-foreground mb-3">
              First-aid is not a replacement for a vet, but it can help you keep
              your pet stable while you get professional help.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    First-Aid Kit Basics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                    <li>Gauze, bandages, and tape</li>
                    <li>Clean cloth or towel</li>
                    <li>Digital thermometer (for pets)</li>
                    <li>Saline solution for rinsing</li>
                    <li>
                      Contact details of your vet and nearest emergency clinic
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">In an Emergency</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                    <li>Stay calm and keep your pet as quiet as possible.</li>
                    <li>
                      Avoid giving human medicine unless a vet specifically
                      tells you to.
                    </li>
                    <li>
                      Transport your pet safely, supporting injured areas if
                      needed.
                    </li>
                    <li>
                      Call the clinic so they can prepare before you arrive.
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Section 6 */}
          <div>
            <h2 className="text-2xl font-semibold mb-3">
              6. Daily Habits That Keep Your Pet Healthy
            </h2>
            <p className="text-muted-foreground mb-3">
              Healthcare isn&apos;t just about medicine — it&apos;s about
              everyday routines that support your pet&apos;s body and mind.
            </p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>
                Feed a balanced diet that suits your pet&apos;s age and activity
                level.
              </li>
              <li>
                Provide regular exercise and playtime to prevent obesity and
                boredom.
              </li>
              <li>
                Keep teeth clean with chews, toys, or brushing if your pet
                allows it.
              </li>
              <li>
                Maintain grooming (bathing, brushing, nail trimming) based on
                your pet&apos;s coat and breed.
              </li>
              <li>
                Check eyes, ears, skin, and paws regularly for redness,
                swelling, or bad smells.
              </li>
            </ol>
          </div>

          {/* Section 7 */}
          <div>
            <h2 className="text-2xl font-semibold mb-3">
              7. Building a Good Relationship with Your Vet
            </h2>
            <p className="text-muted-foreground mb-3">
              A trusted vet is one of the most important people in your
              pet&apos;s life. Good communication makes everything easier.
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                Keep a simple record of vaccines, medications, and past
                illnesses.
              </li>
              <li>
                Be honest about your pet&apos;s diet, lifestyle, and anything
                you&apos;re noticing at home.
              </li>
              <li>
                Ask questions if you don&apos;t understand a diagnosis or
                treatment.
              </li>
              <li>
                Don&apos;t wait until things are very bad — earlier visits are
                often less stressful and more effective.
              </li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                Want to Stay Ahead of Health Problems?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">
                Combine regular vet visits, preventive care, and good daily
                habits — and your pet has the best chance at a long, healthy,
                happy life.
              </p>
              <button
                onClick={() => router.push("/resources")}
                className="text-sm font-medium text-primary hover:underline"
              >
                Explore more pet care guides →
              </button>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default PetHealthcareEssentialsPage;
