"use client";

import Loggedin_Navbar from "@/components/loggedin_Navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useProtectRoute } from "@/hooks/useProtectRoute";

const CatBehaviorUnderstandingPage = () => {
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
          <div className="flex text-center items-center gap-3 mb-3">
            <Badge variant="secondary">Guide</Badge>
            <span className="text-xs text-muted-foreground">
              ~8–10 min read
            </span>
          </div>

          <h1 className="text-4xl font-bold mb-3">
            Cat Behavior Understanding
          </h1>
          <p className="text-muted-foreground text-lg">
            Decode your cat&apos;s body language, sounds, and daily habits so
            you can respond better, reduce stress, and build a stronger bond.
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
                  Cats communicate a lot through body language: tail, ears, and
                  eyes tell you how they feel.
                </li>
                <li>
                  Sudden changes in behavior are often a sign of stress or a
                  health issue.
                </li>
                <li>
                  Scratching, hiding, and night zoomies are normal behaviors,
                  not &quot;bad&quot; habits — they just need the right outlets.
                </li>
                <li>
                  Respecting your cat&apos;s space actually makes them trust you
                  more.
                </li>
                <li>
                  Understanding early signs of fear or aggression can prevent
                  bites and scratches.
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
              1. Reading Cat Body Language
            </h2>
            <p className="text-muted-foreground mb-3">
              Cats rarely just randomly &quot;attack&quot; or act moody. Their
              body language usually gives clear clues about how they feel —
              curious, relaxed, scared, or annoyed.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Relaxed / Happy</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                    <li>Tail up, gently curved at the tip</li>
                    <li>Ears facing forward or slightly to the side</li>
                    <li>Slow blinking or soft eyes</li>
                    <li>Body looks loose, not stiff</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Scared / Stressed</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                    <li>Tail tucked close to body or puffed up</li>
                    <li>Ears flattened sideways or back</li>
                    <li>Dilated pupils, wide eyes</li>
                    <li>Body low to the ground, ready to run</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-2xl font-semibold mb-3">
              2. Tail, Ears, and Eyes: Small Details, Big Signals
            </h2>
            <p className="text-muted-foreground mb-3">
              Focusing on a few key areas can help you quickly understand your
              cat&apos;s mood.
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                <span className="font-medium">Tail:</span> A straight-up tail
                usually signals a confident, friendly cat. A rapidly swishing
                tail often means irritation.
              </li>
              <li>
                <span className="font-medium">Ears:</span> Forward ears =
                interested or playful. Ears back or flat = scared, annoyed, or
                defensive.
              </li>
              <li>
                <span className="font-medium">Eyes:</span> Slow blinks are like
                &quot;cat kisses&quot;. Very wide pupils can mean excitement,
                fear, or hunting mode.
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-2xl font-semibold mb-3">
              3. Common Cat Sounds and What They Mean
            </h2>
            <p className="text-muted-foreground mb-3">
              Cats use meows mainly for humans, not other cats. Different sounds
              can mean different things.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Friendly Sounds</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                    <li>
                      <span className="font-medium">Soft meow:</span> greeting,
                      asking for attention or food.
                    </li>
                    <li>
                      <span className="font-medium">Purring:</span> usually
                      content, but can also be self-soothing when in pain or
                      stressed.
                    </li>
                    <li>
                      <span className="font-medium">Chirps / trills:</span>{" "}
                      excitement or &quot;follow me&quot; kind of sound.
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Warning Sounds</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                    <li>
                      <span className="font-medium">Growling:</span> serious
                      warning to back off.
                    </li>
                    <li>
                      <span className="font-medium">Hissing:</span> fear or
                      feeling cornered — do not push further.
                    </li>
                    <li>
                      <span className="font-medium">Loud yowling:</span> can
                      mean pain, stress, or mating behavior — worth checking
                      with a vet if it&apos;s new or frequent.
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-2xl font-semibold mb-3">
              4. &quot;Weird&quot; Cat Behaviors That Are Actually Normal
            </h2>
            <p className="text-muted-foreground mb-3">
              Many behaviors that look strange are just natural cat instincts.
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                <span className="font-medium">Zoomies at night:</span> Cats are
                naturally more active during dawn and dusk. Extra playtime in
                the evening can help.
              </li>
              <li>
                <span className="font-medium">Scratching furniture:</span> They
                need to stretch and maintain their claws. Provide sturdy
                scratching posts near favorite spots.
              </li>
              <li>
                <span className="font-medium">Hiding:</span> Many cats like
                hiding places to feel safe. A sudden increase in hiding can mean
                stress or illness, though.
              </li>
              <li>
                <span className="font-medium">Kneading:</span> Pressing paws on
                blankets or your lap is usually a sign of comfort and
                contentment.
              </li>
            </ul>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="text-2xl font-semibold mb-3">
              5. Signs of Stress, Fear, or Aggression
            </h2>
            <p className="text-muted-foreground mb-3">
              Catching early warning signs helps you avoid bites, scratches, and
              long-term behavior issues.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Early Warning Signs</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                    <li>Tail flicking or lashing back and forth</li>
                    <li>Ears rotating back</li>
                    <li>Stiff body, staring intensely</li>
                    <li>Growling or low, tense meow</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">More Serious Signs</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                    <li>Hissing, swatting, or biting</li>
                    <li>Urinating outside the litter box</li>
                    <li>Overgrooming or licking one area repeatedly</li>
                    <li>Refusing to eat or interact at all</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            <p className="text-muted-foreground mt-3">
              If you see these signs often or suddenly, it&apos;s a good idea to
              look for possible stress triggers (new pet, loud noises, changes
              at home) and speak with a vet.
            </p>
          </div>

          {/* Section 6 */}
          <div>
            <h2 className="text-2xl font-semibold mb-3">
              6. How to Build Trust with Your Cat
            </h2>
            <p className="text-muted-foreground mb-3">
              Cats aren&apos;t &quot;cold&quot; — they just like to feel safe
              and in control. Trust builds slowly through small, consistent
              actions.
            </p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>
                Let your cat approach you instead of always reaching out first.
              </li>
              <li>
                Use slow blinks and calm movements, especially with shy cats.
              </li>
              <li>
                Offer treats or play sessions and stop while they&apos;re still
                interested, not bored or overwhelmed.
              </li>
              <li>
                Respect &quot;no&quot; signals — tail flicking, turning away, or
                walking off.
              </li>
              <li>
                Keep routines (feeding, play, quiet time) fairly consistent to
                make them feel secure.
              </li>
            </ol>
          </div>

          {/* Section 7 */}
          <div>
            <h2 className="text-2xl font-semibold mb-3">
              7. When to Talk to a Vet or Behavior Expert
            </h2>
            <p className="text-muted-foreground mb-3">
              Sometimes behavior changes are not just &quot;personality&quot; —
              they can signal pain, illness, or serious stress.
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Sudden aggression in a usually calm cat</li>
              <li>Complete change in eating, drinking, or litter box use</li>
              <li>Constant hiding, crying, or overgrooming</li>
              <li>
                Repeated urination or spraying around the house (especially on
                beds, couches, or doors)
              </li>
              <li>
                Any behavior that appears suddenly and doesn&apos;t improve with
                small changes at home
              </li>
            </ul>
            <p className="text-muted-foreground mt-2">
              A vet can rule out medical issues first. If everything looks
              healthy, they might suggest a behaviorist or environmental changes
              to help your cat feel better.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                Ready to Understand Your Cat Better?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">
                Paying attention to your cat&apos;s signals makes life calmer
                for both of you — fewer scratches for you, less stress for them.
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

export default CatBehaviorUnderstandingPage;
