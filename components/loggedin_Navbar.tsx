import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, LayoutGroup } from "framer-motion";
import { createSupabaseClient } from "@/lib/supabaseClient";

// Create Supabase client once per file, not on every render
const supabase = createSupabaseClient();

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
  const [unreadCount, setUnreadCount] = useState(0);

  const Logout = async () => {
    if (loading) return;
    setLoading(true);

    const { error } = await supabase.auth.signOut();

    router.push("/");

    if (error) console.log("Error logging out:", error.message);
  };

  useEffect(() => {
    const supabase = createSupabaseClient();

    const loadUnreadCount = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { count } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("read", false);

      setUnreadCount(count || 0);
    };

    loadUnreadCount();
    // Set up real-time subscription
    const channel = supabase
      .channel("navbar-notifications")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
        },
        () => loadUnreadCount()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <nav className="flex items-center justify-between px-8 md:px-16 lg:px-24 py-2 bg-background border-2 border-gray-200">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/logo.png"
          alt="logo"
          className="mr-2"
          width={100}
          height={100}
        />
        <span className="text-3xl font-bold text-foreground">Zuffie</span>
      </Link>

      <LayoutGroup>
        <div className="relative hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            // Check if this is the Dashboard link
            const isDashboard = item.href === "/dashboard";

            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-1 py-2 text-md font-large "
              >
                <span
                  className={`transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </span>

                {/* Add notification badge only for Dashboard */}
                {isDashboard && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-semibold">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}

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
        className="bg-accent  hover:bg-accent/90 shadow-md cursor-pointer"
      >
        {loading ? "Logging out..." : "Log out"}
      </Button>
    </nav>
  );
};

export default Loggedin_Navbar;
