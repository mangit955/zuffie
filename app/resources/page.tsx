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
import { useProtectRoute } from "@/hooks/useProtectRoute";

const Resources = () => {
  const router = useRouter();

  useProtectRoute();

  const articles = [
    {
      title: "First-Time Pet Owner's Guide",
      description: "Everything you need to know before bringing your pet home",
      category: "Guide",
      icon: BookOpen,
      type: "article",
      href: "/resources/first-time-pet-owner", //need to create this page
    },
    {
      title: "Pet Nutrition Basics",
      description: "Learn about proper feeding and nutrition for your pet",
      category: "Health",
      icon: FileText,
      type: "article",
      href: "/resources/pet-nutrition-basics",
    },
    {
      title: "Training Tips for New Dogs",
      description: "Essential training techniques for your new canine friend",
      category: "Training",
      icon: Video,
      type: "video",
      href: "https://youtu.be/HTXajoc4a3k?si=tma2qxYW3sOIc8aA",
    },
    {
      title: "Cat Behavior Understanding",
      description: "Decode your cat's behavior and body language",
      category: "Guide",
      icon: BookOpen,
      type: "article",
      href: "/resources/cat-behaviour-understanding",
    },
    {
      title: "Pet Healthcare Essentials",
      description: "Important health information every pet owner should know",
      category: "Health",
      icon: FileText,
      type: "article",
      href: "/resources/pet-healthcare-essentials",
    },
    {
      title: "Grooming Your Pet at Home",
      description: "Step-by-step guide to grooming your pet",
      category: "Care",
      icon: Video,
      type: "video",
      href: "https://youtu.be/qzKdpMfzCKo?si=blJcRzjfBj5Okn6i",
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
                className="hover:shadow-lg cursor-pointer transition-transform hover:scale-[1.02]"
                onClick={() => {
                  if (article.type === "video") {
                    window.open(article.href, "_blank", "noopener,noreferrer");
                  } else {
                    router.push(article.href);
                  }
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (article.type === "video") {
                      window.open(
                        article.href,
                        "_blank",
                        "noopener,noreferrer"
                      );
                    } else {
                      router.push(article.href);
                    }
                  }
                }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="secondary">
                      {article.category}
                      {article.type === "video" && " Video"}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{article.title}</CardTitle>
                  <CardDescription>{article.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-primary hover:underline">
                    {article.type === "video"
                      ? "Watch Video →"
                      : "Read Guide →"}
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
