import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Layout = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => { 
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      setUser(user);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign out error:", error);
    }
    navigate("/login");
  };

  const username =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    "User";

  return (
    <main className="dark min-h-screen bg-background text-foreground">
      <nav className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="font-semibold">
            Todo App
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground flex items-center">
                  Welcome,
                  <span className="font-medium text-foreground">
                    {username}
                  </span>
                  <Avatar className="ml-4">
                    <AvatarImage src={ user?.user_metadata?.avatar_url} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </span>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="rounded-md border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </nav>

      <Outlet />
    </main>
  );
};

export default Layout;