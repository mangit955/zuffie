"use client";
import Loggedin_Navbar from "@/components/loggedin_Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { useProtectRoute } from "@/hooks/useProtectRoute";
import { Heart, Users, Shield, Home } from "lucide-react";

const About = () => {
  useProtectRoute();

  const values = [
    {
      icon: Heart,
      title: "Compassion First",
      description:
        "Every pet deserves a loving home and we're committed to making that happen.",
    },
    {
      icon: Users,
      title: "Community Driven",
      description:
        "Building a strong community of pet lovers, shelters, and advocates.",
    },
    {
      icon: Shield,
      title: "Safety & Trust",
      description:
        "Ensuring safe and verified adoption processes for everyone involved.",
    },
    {
      icon: Home,
      title: "Forever Homes",
      description:
        "Our mission is to find permanent, loving homes for every pet.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Loggedin_Navbar />

      <section className="py-20 px-8 md:px-16 lg:px-24">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            About Zuffie
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            We&apos;re on a mission to connect loving families with pets in need
            of homes. Every year, millions of pets enter shelters, and we
            believe that every one of them deserves a chance at a happy, healthy
            life with a caring family.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                      <p className="text-muted-foreground">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4">Our Story</h2>
              <p className="text-muted-foreground leading-relaxed">
                Zuffie was founded in 2024 with a simple yet powerful vision: to
                make pet adoption accessible, transparent, and joyful. Our
                platform connects shelters, veterinarians, and potential
                adopters in one unified space, streamlining the adoption process
                while ensuring the best outcomes for both pets and families.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-4xl font-bold text-primary mb-2">1000+</p>
                  <p className="text-muted-foreground">Pets Adopted</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-primary mb-2">50+</p>
                  <p className="text-muted-foreground">Partner Shelters</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-primary mb-2">500+</p>
                  <p className="text-muted-foreground">Happy Families</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default About;
