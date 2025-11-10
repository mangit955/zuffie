"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Video, FileText } from "lucide-react";
import Loggedin_Navbar from "@/components/loggedin_Navbar";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect } from "react";

const Resources = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
      }
    };
    checkSession();
  }, [supabase, router]);

  const articles = [
    {
      title: "First-Time Pet Owner's Guide",
      description: "Everything you need to know before bringing your pet home",
      category: "Guide",
      icon: BookOpen,
    },
    {
      title: "Pet Nutrition Basics",
      description: "Learn about proper feeding and nutrition for your pet",
      category: "Health",
      icon: FileText,
    },
    {
      title: "Training Tips for New Dogs",
      description: "Essential training techniques for your new canine friend",
      category: "Training",
      icon: Video,
    },
    {
      title: "Cat Behavior Understanding",
      description: "Decode your cat's behavior and body language",
      category: "Guide",
      icon: BookOpen,
    },
    {
      title: "Pet Healthcare Essentials",
      description: "Important health information every pet owner should know",
      category: "Health",
      icon: FileText,
    },
    {
      title: "Grooming Your Pet at Home",
      description: "Step-by-step guide to grooming your pet",
      category: "Care",
      icon: Video,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Loggedin_Navbar />

      <section className="py-12 px-8 md:px-16 lg:px-24">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Pet Care Resources
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Learn everything you need to know about caring for your pet with our
            comprehensive guides and articles
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => {
            const Icon = article.icon;
            return (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow cursor-pointer"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="secondary">{article.category}</Badge>
                  </div>
                  <CardTitle className="text-xl">{article.title}</CardTitle>
                  <CardDescription>{article.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-primary hover:underline">
                    Read More →
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Need More Help?</CardTitle>
              <CardDescription>
                Can&apos;t find what you&apos;re looking for? Our community is
                here to help!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Join our community forum to ask questions, share experiences,
                and connect with other pet owners and experts.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Resources;
