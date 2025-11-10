import { Button } from "@/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import Link from "next/link";

const Loggedin_Navbar = () => {
  const supabase = createClientComponentClient();
  const Logout = async () => {
    const { error } = await supabase.auth.signOut();
    // You may want to redirect after sign out explicitly if needed:
    window.location.href = "/";

    if (error) console.log("Error logging out:", error.message);
    else console.log("Redirecting...");
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
        <Link
          href="/"
          className="text-foreground hover:text-primary transition-colors font-medium"
        >
          Home
        </Link>
        <Link
          href="/pets"
          className="text-foreground hover:text-primary transition-colors font-medium"
        >
          Adopt
        </Link>
        <Link
          href="/about"
          className="text-foreground hover:text-primary transition-colors font-medium"
        >
          About
        </Link>
        <Link
          href="/resources"
          className="text-foreground hover:text-primary transition-colors font-medium"
        >
          Resources
        </Link>
        <Link
          href="/contact"
          className="text-foreground hover:text-primary transition-colors font-medium"
        >
          Contact
        </Link>
      </div>

      <Button onClick={Logout} className="bg-accent hover:bg-accent/90">
        Log out
      </Button>
    </nav>
  );
};

export default Loggedin_Navbar;
