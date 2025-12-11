import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createSupabaseClient } from "@/lib/supabaseClient";

export function useProtectRoute() {
  const supabase = createSupabaseClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checksession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
      } else {
        setUser(session.user);
        setLoading(false);
      }
    };
    checksession();
  }, [supabase, router]);

  return { user, loading };
}
