import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { account } from "../lib/appwrite";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "../components/ui/label";
import { Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";

export default function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Try login

      await account.createEmailPasswordSession(email, password);
    } catch (loginErr: any) {
      if (loginErr.code === 401) {
        try {
          await account.create("unique()", email, password);
          await account.createEmailPasswordSession(email, password);
        } catch (regErr: any) {
          setError(regErr.message || "Registration failed");
          setLoading(false);
          return;
        }
      } else if (loginErr.status === 409) {
        await account.createEmailPasswordSession(email, password);
      } else {
        setError(loginErr.message || "Authentication failed");
        setLoading(false);
        return;
      }
    }

    const session = await account.get();
    localStorage.setItem("user", JSON.stringify(session));
    setLoading(false);
    navigate("/app");
  };
  return (
    <div className="min-h-screen flex items-center justify-center  from-blue-50 to-indigo-100 p-6">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to continue. If you don’t have an
            account, we’ll create one automatically.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleAuth} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                className="h-12"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                className="h-12"
                placeholder="Enter password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 h-12"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Processing..." : "Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
