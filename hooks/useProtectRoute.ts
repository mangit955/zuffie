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
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setLoading(false);
        router.push("/login");
        return;
      }

      setUser(session.user);
      setLoading(false);
    };

    checkSession();
  }, [supabase, router]);

  return { user, loading };
}
