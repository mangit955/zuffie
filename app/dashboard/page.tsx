"use client";

import Navbar from "@/components/Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, FileText, Calendar, MessageCircle } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loggedin_Navbar from "@/components/loggedin_Navbar";

type AdoptionApplication = {
  id: string;
  user_id: string | null;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  housing_type: string;
  has_yard: boolean;
  has_other_pets: boolean;
  experience: string | null;
  why_adopt: string;
  status: string;
  created_at: string;
};

const Dashboard = () => {
  const supabase = createClientComponentClient();
  const { toast } = useToast();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [applications, setApplications] = useState<AdoptionApplication[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(true);

  // 1) Load current user

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Auth error:", error);
        toast({
          title: "Authentication error",
          description: "Please log in to view your dashboard",
          variant: "destructive",
        });
        router.push("/login");
        return;
      }
      setUser(user);
    };

    loadUser();
  }, [supabase, toast, router]);

  // 2) Once we know the user, load their applications
  useEffect(() => {
    if (!user) return;

    const loadApplications = async () => {
      setLoadingApplications(true);

      const { data, error } = await supabase
        .from("adoption_applications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetchong applications:", error);
        toast({
          title: "Error loading applications",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setApplications(data || []);
      }
      setLoadingApplications(false);
    };
    loadApplications();
  }, [supabase, user, toast]);

  const favorites = [
    { name: "Max", breed: "Golden Retriever", emoji: "🐕" },
    { name: "Luna", breed: "Persian Cat", emoji: "🐱" },
  ];

  const appointments = [
    { pet: "Max", shelter: "Happy Paws", date: "2025-10-25", time: "2:00 PM" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar based on auth */}
      {user ? <Loggedin_Navbar /> : <Navbar />}

      <section className="py-12 px-8 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              My Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your adoption journey
            </p>
          </div>

          <Tabs defaultValue="favorites" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="favorites">
                <Heart className="mr-2 h-4 w-4" />
                Favorites
              </TabsTrigger>
              <TabsTrigger value="applications">
                <FileText className="mr-2 h-4 w-4" />
                Applications
              </TabsTrigger>
              <TabsTrigger value="appointments">
                <Calendar className="mr-2 h-4 w-4" />
                Appointments
              </TabsTrigger>
              <TabsTrigger value="messages">
                <MessageCircle className="mr-2 h-4 w-4" />
                Messages
              </TabsTrigger>
            </TabsList>

            <TabsContent value="favorites" className="space-y-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favorites.map((pet, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="text-6xl text-center mb-2">
                        {pet.emoji}
                      </div>
                      <CardTitle>{pet.name}</CardTitle>
                      <CardDescription>{pet.breed}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full">View Details</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="applications" className="space-y-4">
              {loadingApplications ? (
                <p className="text-muted-foreground">
                  Loading your applications...
                </p>
              ) : applications.length === 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>No application yet</CardTitle>
                    <CardDescription>
                      You haven&apos;t submitted any adoptation applications
                      yet.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => router.push("/adopt")}>
                      Start an application
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                applications.map((app) => (
                  <Card key={app.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="mb-2">
                            Adoption Application
                          </CardTitle>
                          <CardDescription>
                            Submitted on{" "}
                            {new Date(app.created_at).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge
                          variant={
                            app.status.toLowerCase() === "approved"
                              ? "default"
                              : app.status.toLowerCase() === "rejected"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {app.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p>
                        <span className="font-medium">Name:</span>{" "}
                        {app.full_name}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span> {app.email}
                      </p>
                      <p>
                        <span className="font-medium">Phone:</span> {app.phone}
                      </p>
                      <p>
                        <span className="font-medium">Address:</span>{" "}
                        {app.address}
                      </p>
                      <p>
                        <span className="font-medium">Housing Type:</span>{" "}
                        {app.housing_type}
                        {app.has_yard ? "(Has yard)" : " "}
                      </p>
                      <p>
                        <span className="font-medium">Other Pets:</span>{" "}
                        {app.has_other_pets ? "Yes" : "No"}
                      </p>
                      {app.experience && (
                        <p>
                          <span className="font-medium">Experience:</span>{" "}
                          {app.experience}
                        </p>
                      )}
                      <p>
                        <span className="font-medium">Why adopt:</span>{" "}
                        {app.why_adopt}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="appointments" className="space-y-4">
              {appointments.map((apt, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>Meeting with {apt.shelter}</CardTitle>
                    <CardDescription>To meet {apt.pet}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Date:</span> {apt.date}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Time:</span> {apt.time}
                    </p>
                    <Button variant="outline" className="w-full">
                      Reschedule
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="messages" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Messages</CardTitle>
                  <CardDescription>Conversations with shelters</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    No messages yet. Start a conversation with a shelter!
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
