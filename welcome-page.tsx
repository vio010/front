import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";

export default function WelcomePage() {
  const { user } = useAuth();
  
  // Redirect to home if user is already logged in
  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">
            Simplify Chore Management
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-gray-700 max-w-2xl mx-auto">
            Organize household tasks, track contributions, and maintain harmony with your roommates.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="mb-3 text-primary">
                <CheckCircle2 className="h-8 w-8 mx-auto" />
              </div>
              <h3 className="font-semibold mb-2 text-primary text-lg">Fair Distribution</h3>
              <p className="text-gray-600">Equitably share household responsibilities</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="mb-3 text-primary">
                <CheckCircle2 className="h-8 w-8 mx-auto" />
              </div>
              <h3 className="font-semibold mb-2 text-primary text-lg">Track Progress</h3>
              <p className="text-gray-600">Monitor who's doing what and when</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="mb-3 text-primary">
                <CheckCircle2 className="h-8 w-8 mx-auto" />
              </div>
              <h3 className="font-semibold mb-2 text-primary text-lg">Schedule & Reminders</h3>
              <p className="text-gray-600">Never forget another chore with helpful alerts</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="mb-3 text-primary">
                <CheckCircle2 className="h-8 w-8 mx-auto" />
              </div>
              <h3 className="font-semibold mb-2 text-primary text-lg">Reduce Conflicts</h3>
              <p className="text-gray-600">Prevent roommate tensions before they start</p>
            </div>
          </div>
          
          <Link href="/auth">
            <Button size="lg" className="px-8 py-6 text-lg rounded-full">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
      
      <footer className="bg-white py-4 text-center text-gray-600 text-sm">
        <p>© {new Date().getFullYear()} RoommateChore. All rights reserved.</p>
      </footer>
    </div>
  );
}