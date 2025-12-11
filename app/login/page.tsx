"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import Lottie from "lottie-react";
import loader from "@/public/lottie/loader.json";
import { useState } from "react";

const supabase = createClientComponentClient();
const Login = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/pets`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      console.log("Error signing in:", error.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Lottie animationData={loader} loop className="w-48 h-48" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center ">
            <Image
              src="/logo.png"
              alt="logo"
              className="mr-2"
              width={180}
              height={180}
            />
          </div>
          <CardTitle className="text-3xl">Join Zuffie</CardTitle>
          <CardDescription>
            Get started with your Zuffie account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Button
            type="submit"
            className="w-full cursor-pointer "
            size="lg"
            onClick={handleLogin}
          >
            <Image
              src="/google.png"
              alt="Google"
              className="mr-2"
              width={35}
              height={35}
            />
            Continue with Google
          </Button>
        </CardContent>
        {/* <CardFooter className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground text-center">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Register here
            </Link>
          </p>
        </CardFooter> */}
      </Card>
    </div>
  );
};

export default Login;
