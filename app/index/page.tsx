"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PetCard from "@/components/PetCard";
import Features from "@/components/Features";
import ChatWidget from "@/components/ChatWidget";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Loggedin_Navbar from "@/components/loggedin_Navbar";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

const pets = [
  {
    name: "Max",
    breed: "Golden Retriever",
    age: "2 years",
    gender: "Male",
    emoji: "🐕",
  },
  {
    name: "Luna",
    breed: "Persian Cat",
    age: "1 year",
    gender: "Female",
    emoji: "🐱",
  },
  {
    name: "Charlie",
    breed: "Labrador",
    age: "3 years",
    gender: "Male",
    emoji: "🐕",
  },
  {
    name: "Bella",
    breed: "Siamese Cat",
    age: "2 years",
    gender: "Female",
    emoji: "🐱",
  },
];

export default function Index() {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 1) Get initial user
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    loadUser();

    // 2) Subscribe to auth changes (login / logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // 3) Cleanup listener on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar based on auth */}
      {user ? <Loggedin_Navbar /> : <Navbar />}

      {/* Optional: Hero section if you want to show it */}
      <Hero />

      {/* Pet Listings Section */}
      <section className="py-20 px-8 md:px-16 lg:px-24">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Meet Your Future Best Friend
          </h2>
          <p className="text-muted-foreground text-lg">
            These adorable pets are waiting to bring joy to your life
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pets.map((pet, index) => (
            <PetCard key={index} {...pet} />
          ))}
        </div>
      </section>

      <Features />

      {/* Call to Action Section */}
      <section className="py-20 px-8 md:px-16 lg:px-24 bg-primary text-primary-foreground text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to Make a Difference?</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
          Start your adoption journey today and give a loving pet their forever
          home
        </p>
      </section>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}
