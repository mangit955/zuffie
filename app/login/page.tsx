"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Lottie from "lottie-react";
import loader from "@/public/lottie/loader.json";
import { useState } from "react";
import { createSupabaseClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const supabase = createSupabaseClient();
const Login = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

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
    <div className=" min-h-screen bg-background flex flex-col ">
      <nav className="h-14 flex items-center  px-6 md:px-16 lg:px-24  bg-background border-2 border-gray-200">
        <button
          onClick={() => router.push("/")}
          className="p-2 rounded-md hover:bg-muted transition"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 -translate-y-6">
        <motion.div
          initial={
            shouldReduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }
          }
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.2,
            ease: "easeOut",
            delay: 0.05,
          }}
          className="w-full max-w-md"
        >
          <Card className="w-full max-w-md ">
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
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
