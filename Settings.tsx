import { useState } from "react";
import { useTaskContext } from "@/contexts/TaskContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BellIcon, HomeIcon, UsersIcon, KeyIcon, AlertTriangleIcon, SunIcon, MoonIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/ThemeProvider";

export default function Settings() {
  const { household, users } = useTaskContext();
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  
  // Form states
  const [householdName, setHouseholdName] = useState(household?.name || "");
  const [householdDescription, setHouseholdDescription] = useState("");
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState("19:00");
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotationFrequency, setRotationFrequency] = useState("weekly");
  
  // Form submission handlers
  const handleSaveHousehold = () => {
    toast({
      title: "Household settings saved",
      description: "Your household settings have been updated successfully."
    });
  };
  
  const handleSaveNotifications = () => {
    toast({
      title: "Notification settings saved",
      description: "Your notification preferences have been updated."
    });
  };
  
  const handleSaveRotation = () => {
    toast({
      title: "Rotation settings saved",
      description: "Your task rotation settings have been updated."
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
        <p className="text-gray-600">Manage your household and application preferences</p>
      </div>

      <Tabs defaultValue="household" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="household" className="flex items-center gap-2">
            <HomeIcon className="h-4 w-4" />
            <span>Household</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <BellIcon className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="rotation" className="flex items-center gap-2">
            <UsersIcon className="h-4 w-4" />
            <span>Task Rotation</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            {theme === 'dark' ? <MoonIcon className="h-4 w-4" /> : <SunIcon className="h-4 w-4" />}
            <span>Appearance</span>
          </TabsTrigger>
        </TabsList>

        {/* Household Settings */}
        <TabsContent value="household">
          <Card>
            <CardHeader>
              <CardTitle>Household Information</CardTitle>
              <CardDescription>
                Update your household details and manage roommates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="household-name">Household Name</Label>
                <Input
                  id="household-name"
                  value={householdName}
                  onChange={(e) => setHouseholdName(e.target.value)}
                  placeholder="Enter your household name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="household-description">Description (Optional)</Label>
                <Input
                  id="household-description"
                  value={householdDescription}
                  onChange={(e) => setHouseholdDescription(e.target.value)}
                  placeholder="Brief description of your household"
                />
              </div>
              
              <Button onClick={handleSaveHousehold} className="mt-4">
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Manage Roommates</CardTitle>
              <CardDescription>
                View and manage roommates in your household
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                        <img 
                          src={user.avatar || "https://via.placeholder.com/40"} 
                          alt={user.firstName} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full mt-2">
                  <UsersIcon className="h-4 w-4 mr-2" />
                  Invite Roommate
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Customize how and when you receive task notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Task Reminders</h3>
                  <p className="text-sm text-gray-500">Receive reminders for upcoming tasks</p>
                </div>
                <Switch 
                  checked={reminderEnabled}
                  onCheckedChange={setReminderEnabled}
                />
              </div>
              
              {reminderEnabled && (
                <div className="space-y-2 pl-0 ml-0 sm:pl-4 sm:ml-4 sm:border-l border-gray-200">
                  <div className="space-y-2">
                    <Label htmlFor="reminder-time">Default Reminder Time</Label>
                    <Input
                      id="reminder-time"
                      type="time"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">
                      Reminders will be sent at this time on the day of the task
                    </p>
                  </div>
                </div>
              )}
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Task Assignments</h3>
                  <p className="text-sm text-gray-500">Get notified when you're assigned a new task</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Task Completions</h3>
                  <p className="text-sm text-gray-500">Get notified when a roommate completes a task</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Button onClick={handleSaveNotifications}>
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Task Rotation Settings */}
        <TabsContent value="rotation">
          <Card>
            <CardHeader>
              <CardTitle>Task Rotation</CardTitle>
              <CardDescription>
                Configure automatic rotation of recurring tasks among roommates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Automatic Task Rotation</h3>
                  <p className="text-sm text-gray-500">
                    Automatically rotate recurring tasks among roommates
                  </p>
                </div>
                <Switch 
                  checked={autoRotate}
                  onCheckedChange={setAutoRotate}
                />
              </div>
              
              {autoRotate && (
                <div className="space-y-4 pl-0 ml-0 sm:pl-4 sm:ml-4 sm:border-l border-gray-200">
                  <div className="space-y-2">
                    <Label htmlFor="rotation-frequency">Rotation Frequency</Label>
                    <select
                      id="rotation-frequency"
                      value={rotationFrequency}
                      onChange={(e) => setRotationFrequency(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Bi-Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                    <p className="text-xs text-gray-500">
                      How often recurring tasks are reassigned to different roommates
                    </p>
                  </div>
                </div>
              )}
              
              <Button onClick={handleSaveRotation}>
                Save Rotation Settings
              </Button>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangleIcon className="h-5 w-5 text-yellow-500 mr-2" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Reset or delete household data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Button variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50 hover:bg-yellow-100 w-full sm:w-auto">
                  Reset Task History
                </Button>
                <p className="text-xs text-gray-500 mt-1">
                  This will clear all completed tasks but keep your household settings
                </p>
              </div>
              
              <div>
                <Button variant="destructive" className="w-full sm:w-auto">
                  <KeyIcon className="h-4 w-4 mr-2" />
                  Leave Household
                </Button>
                <p className="text-xs text-gray-500 mt-1">
                  This will remove you from this household but keep your account active
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>
                Customize the appearance of your application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="font-medium">Dark Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    Toggle between light and dark themes
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <SunIcon className="h-5 w-5 text-yellow-500" />
                  <Switch 
                    checked={theme === 'dark'}
                    onCheckedChange={toggleTheme}
                  />
                  <MoonIcon className="h-5 w-5 text-slate-700 dark:text-slate-200" />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="font-medium">Theme Color</h3>
                  <p className="text-sm text-muted-foreground">
                    Currently using olive green as the primary color
                  </p>
                </div>
                <div className="h-6 w-6 rounded-full bg-primary" />
              </div>
              
              <p className="text-sm text-muted-foreground italic">
                Additional theme customization options coming soon!
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
