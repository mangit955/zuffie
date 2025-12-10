import { Button } from "@/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { motion, LayoutGroup } from "framer-motion";

// Create Supabase client once per file, not on every render
const supabase = createClientComponentClient();

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/pets", label: "Adopt" },
  { href: "/about", label: "About" },
  { href: "/resources", label: "Resources" },
  { href: "/vets-near-me", label: "Nearby Veterinaries" },
];

const Loggedin_Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
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

      <LayoutGroup>
        <div className="relative hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-1 py-2 text-sm font-medium"
              >
                <span
                  className={`transition-colors ${
                    isActive ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </span>

                {isActive && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute left-0 right-0 -bottom-1 h-0.5 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </LayoutGroup>

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
