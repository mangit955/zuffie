import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Heart, Users, MessageCircle } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Heart className="h-8 w-8 text-accent" />,
      title: "Find Your Match",
      description:
        "Browse through our loving pets and find the perfect companion for your family.",
    },
    {
      icon: <Shield className="h-8 w-8 text-accent" />,
      title: "Safe & Verified",
      description:
        "All pets are health-checked and verified by licensed veterinarians.",
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-accent" />,
      title: "Direct Communication",
      description:
        "Chat directly with shelters and get all your questions answered instantly.",
    },
    {
      icon: <Users className="h-8 w-8 text-accent" />,
      title: "Community Support",
      description:
        "Join our caring community and get support throughout your adoption journey.",
    },
  ];

  return (
    <section className="py-20 px-8 md:px-16 lg:px-24 bg-muted">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-foreground mb-4">
          More Than Just Adoption
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          We&apos;re committed to creating lasting bonds between pets and their
          families through comprehensive support and care.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="bg-card/80 shadow-md hover:shadow-lg transition-shadow duration-300 "
          >
            <CardHeader>
              <div className="mb-4 p-3 bg-secondary/30 rounded-full w-fit">
                {feature.icon}
              </div>
              <CardTitle className="text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Features;
