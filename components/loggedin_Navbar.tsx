import { Button } from "@/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

// ⚡ Create Supabase client once per file, not on every render
const supabase = createClientComponentClient();

const Loggedin_Navbar = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const Logout = async () => {
    if (loading) return;
    setLoading(true);

    const { error } = await supabase.auth.signOut();

    router.push("/");

    if (error) console.log("Error logging out:", error.message);
  };

  return (
    <nav className="flex items-center justify-between px-8 md:px-16 lg:px-24 py-6 bg-background border-b">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/logo.png"
          alt="logo"
          className="mr-2"
          width={100}
          height={100}
        />
        <span className="text-2xl font-bold text-foreground">Zuffie</span>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        <Link href="/dashboard" className="nav-link">
          Dashboard
        </Link>
        <Link href="/pets" className="nav-link">
          Adopt
        </Link>
        <Link href="/about" className="nav-link">
          About
        </Link>
        <Link href="/resources" className="nav-link">
          Resources
        </Link>
        <Link href="/vets-near-me" className="nav-link">
          Nearby Veterinaries
        </Link>
      </div>

      <Button
        onClick={Logout}
        disabled={loading}
        className="bg-accent border-2 border-accent hover:bg-accent/90 shadow-md"
      >
        {loading ? "Logging out..." : "Log out"}
      </Button>
    </nav>
  );
};

export default Loggedin_Navbar;
