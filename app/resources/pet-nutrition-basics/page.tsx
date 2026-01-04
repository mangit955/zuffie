"use client";

import Loggedin_Navbar from "@/components/loggedin_Navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useProtectRoute } from "@/hooks/useProtectRoute";

const PetNutritionBasicsPage = () => {
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

          <h1 className="text-4xl font-bold mb-3">Pet Nutrition Basics</h1>
          <p className="text-muted-foreground text-lg">
            Understand what your pet really needs in their bowl — from choosing
            the right food type to portion sizes, treats, and common mistakes to
            avoid.
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
                  Pets at different ages (puppy/kitten, adult, senior) have
                  different nutritional needs.
                </li>
                <li>
                  Good quality food should list a clear animal protein as one of
                  the first ingredients.
                </li>
                <li>
                  Overfeeding is one of the most common causes of health
                  problems in pets.
                </li>
                <li>
                  Treats should usually be &lt; 10% of your pet&apos;s daily
                  calories.
                </li>
                <li>
                  Sudden diet changes can upset your pet&apos;s stomach — switch
                  slowly over 5–7 days.
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
              1. What Does a &quot;Balanced Diet&quot; Mean for Pets?
            </h2>
            <p className="text-muted-foreground mb-3">
              A balanced diet means your pet is getting all the nutrients they
              need in the right proportions — not too little, not too much.
              Unlike humans, most pets eat the same food every day, so the
              quality of that food really matters.
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>
                <span className="font-medium">Protein:</span> Supports muscles,
                organs, immune system — especially important for growing
                puppies/kittens.
              </li>
              <li>
                <span className="font-medium">Fats:</span> Source of energy and
                supports skin, coat, and brain function.
              </li>
              <li>
                <span className="font-medium">Carbohydrates:</span> Provide
                energy and fiber (for digestion), but shouldn&apos;t dominate
                the diet.
              </li>
              <li>
                <span className="font-medium">Vitamins &amp; minerals:</span>{" "}
                Essential in small amounts for bones, nerves, metabolism, and
                more.
              </li>
              <li>
                <span className="font-medium">Water:</span> Often ignored but
                absolutely critical — fresh water should always be available.
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-2xl font-semibold mb-3">
              2. Life Stage Matters: Puppy/Kitten, Adult, Senior
            </h2>
            <p className="text-muted-foreground mb-3">
              The same food is not ideal for all ages. Pet food is usually
              labeled for specific life stages:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Puppy / Kitten</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                    <li>Higher in calories and protein</li>
                    <li>Supports rapid growth and development</li>
                    <li>Usually fed 3–4 times a day</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Adult</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                    <li>Balanced for maintenance, not growth</li>
                    <li>Helps keep healthy weight and energy</li>
                    <li>Usually 2 meals a day</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Senior</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                    <li>Often lower in calories</li>
                    <li>May include joint, heart, or kidney support</li>
                    <li>Vet may suggest specific diets</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-2xl font-semibold mb-3">
              3. How to Read Pet Food Labels
            </h2>
            <p className="text-muted-foreground mb-3">
              Pet food packaging can be confusing. Here are a few simple checks
              to quickly judge a food:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                <span className="font-medium">
                  Check the first ingredients:
                </span>{" "}
                Ideally, a clear animal protein (like &quot;chicken&quot; or
                &quot;salmon&quot;) is near the top, not just
                &quot;by-products&quot; or grains.
              </li>
              <li>
                <span className="font-medium">Look for life stage:</span> The
                food should say if it&apos;s for puppies/kittens, adults, or all
                life stages.
              </li>
              <li>
                <span className="font-medium">Feeding guidelines:</span> Use the
                chart on the back as a starting point, then adjust based on your
                pet&apos;s body condition and vet advice.
              </li>
              <li>
                <span className="font-medium">Avoid marketing traps:</span>{" "}
                Phrases like &quot;premium&quot; or &quot;gourmet&quot; are not
                regulated terms — focus more on ingredients and nutritional
                info.
              </li>
            </ul>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-2xl font-semibold mb-3">
              4. Portion Sizes &amp; Feeding Routines
            </h2>
            <p className="text-muted-foreground mb-3">
              Even good food can cause problems if your pet eats too much of it.
              Obesity is one of the biggest health issues in pets.
            </p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>
                Start with the feeding guide on the pack for your pet&apos;s
                weight and life stage.
              </li>
              <li>
                Split the total daily amount into 2–3 meals (more for younger
                pets).
              </li>
              <li>
                Monitor your pet&apos;s body — you should usually be able to
                feel ribs without seeing them clearly.
              </li>
              <li>
                Adjust portion slightly every 1–2 weeks based on weight,
                activity, and vet feedback.
              </li>
            </ol>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="text-2xl font-semibold mb-3">
              5. Treats, Human Food &amp; Common Mistakes
            </h2>
            <p className="text-muted-foreground mb-3">
              Treats are great for training and bonding, but they add calories
              quickly. Some human foods are also unsafe for pets.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Smart Treat Rules</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                    <li>
                      Try to keep treats under 10% of daily calories whenever
                      possible.
                    </li>
                    <li>Use small pieces — pets don&apos;t care about size.</li>
                    <li>
                      Use treats mainly for training, not random snacking.
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Common Mistakes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                    <li>Feeding lots of table scraps or oily/spicy food.</li>
                    <li>Changing foods suddenly without transition.</li>
                    <li>
                      Giving bones, chocolate, alcohol, caffeine, onions,
                      garlic, or xylitol-containing foods (these can be harmful
                      or toxic for many pets).
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Section 6 */}
          <div>
            <h2 className="text-2xl font-semibold mb-3">
              6. When to Talk to a Vet About Diet
            </h2>
            <p className="text-muted-foreground mb-3">
              Always involve a vet if you&apos;re planning a big diet change or
              notice worrying signs. Nutrition is a key part of your pet&apos;s
              overall health.
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Sudden weight loss or gain</li>
              <li>Persistent vomiting or diarrhea</li>
              <li>Very dull coat or flaky skin</li>
              <li>Unusual thirst or urination</li>
              <li>
                If your pet has conditions like kidney, liver, or heart disease
              </li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                Ready to Build a Healthy Routine?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">
                Combine the right food, correct portions, and regular check-ups
                and you&apos;ll give your pet a strong foundation for a long,
                healthy life.
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

export default PetNutritionBasicsPage;
