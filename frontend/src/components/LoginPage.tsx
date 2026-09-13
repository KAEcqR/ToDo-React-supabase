import { supabase } from "../lib/supabase";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";


const LoginPage = () => {
  const handleGoogleLogin = async () => { 
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google", }); 
    if (error) {
      console.error("Google login error:", error); 
    } 
  };

  return (
    <div className="flex min-h-[calc(100vh-3.6rem)] items-center justify-center">
      <Card className="relative w-full max-w-sm rounded-xl"> 
        <CardHeader>
          <CardTitle>
            Login
          </CardTitle>
          <CardDescription>
            Sign in with your Google account to continue.
          </CardDescription>
        </CardHeader> 
            <CardContent> 
              <Button type="button" className="w-full rounded-lg" onClick={handleGoogleLogin} > 
                Continue with Google
              </Button>
            </CardContent> 
        </Card> 
      </div>
  );
};

export default LoginPage;