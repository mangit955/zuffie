import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
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
        <span className="text-2xl font-bold text-foreground">Zuffie</span>
      </Link>

      {/* <div className="hidden md:flex items-center gap-8">
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
          href="/vets-near-me"
          className="text-foreground hover:text-primary transition-colors font-medium"
        >
          Nearby Veterinaries
        </Link>
      </div> */}

      <Link href="/login">
        <Button className="bg-accent hover:bg-accent/90 cursor-pointer">
          Get Started
        </Button>
      </Link>
    </nav>
  );
};

export default Navbar;
