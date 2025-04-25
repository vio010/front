import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Redirect, Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function AuthPage() {
  const { toast } = useToast();
  const { user, loginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");

  // Login form state
  const [loginUsername, setLoginUsername] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");

  // Register form state
  const [registerUsername, setRegisterUsername] = useState<string>("");
  const [registerPassword, setRegisterPassword] = useState<string>("");
  const [registerFirstName, setRegisterFirstName] = useState<string>("");
  const [registerLastName, setRegisterLastName] = useState<string>("");
  const [registerEmail, setRegisterEmail] = useState<string>("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await loginMutation.mutateAsync({
        username: loginUsername,
        password: loginPassword
      });
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error) {
      // Error toast is handled in the mutation
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await registerMutation.mutateAsync({
        username: registerUsername,
        password: registerPassword,
        firstName: registerFirstName,
        lastName: registerLastName,
        email: registerEmail
      });
      
      toast({
        title: "Registration successful",
        description: "Your account has been created.",
      });
    } catch (error) {
      // Error toast is handled in the mutation
    }
  };

  // Redirect to home if user is already logged in
  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="w-full max-w-md mx-auto p-4 sm:p-6 md:p-8 flex-1 flex flex-col justify-center">
        <Link href="/" className="flex items-center text-gray-500 hover:text-gray-700 mb-6 self-start">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to welcome page
        </Link>
        
        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              <span className="bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">
                RoommateChore
              </span>
            </CardTitle>
            <CardDescription className="text-center">
              {activeTab === "login" 
                ? "Sign in to manage your household chores" 
                : "Create an account to get started"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-username">Username</Label>
                      <Input 
                        id="login-username" 
                        type="text" 
                        value={loginUsername} 
                        onChange={(e) => setLoginUsername(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input 
                        id="login-password" 
                        type="password" 
                        value={loginPassword} 
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Logging in..." : "Login"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegister}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-username">Username</Label>
                      <Input 
                        id="register-username" 
                        type="text" 
                        value={registerUsername} 
                        onChange={(e) => setRegisterUsername(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <Input 
                        id="register-password" 
                        type="password" 
                        value={registerPassword} 
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="register-first-name">First Name</Label>
                        <Input 
                          id="register-first-name" 
                          type="text" 
                          value={registerFirstName} 
                          onChange={(e) => setRegisterFirstName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-last-name">Last Name</Label>
                        <Input 
                          id="register-last-name" 
                          type="text" 
                          value={registerLastName} 
                          onChange={(e) => setRegisterLastName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input 
                        id="register-email" 
                        type="email" 
                        value={registerEmail} 
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "Creating account..." : "Register"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="text-sm text-center text-muted-foreground">
            <p className="w-full">
              {activeTab === "login" 
                ? "Don't have an account? Click on Register" 
                : "Already have an account? Click on Login"}
            </p>
          </CardFooter>
        </Card>
      </div>
      
      <footer className="bg-white py-4 text-center text-gray-600 text-sm border-t">
        <p>© {new Date().getFullYear()} RoommateChore. All rights reserved.</p>
      </footer>
    </div>
  );
}