import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertChoreSchema } from "@shared/schema"; 
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

// Extend the insert schema with additional validation
const createChoreSchema = insertChoreSchema.extend({
  // Add client-side only fields
  dueDate: z.coerce.date(),
  dueTime: z.string().min(1, { message: "Please select a time" }),
});

type CreateChoreFormData = z.infer<typeof createChoreSchema>;

interface CreateChoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateChoreDialog({ open, onOpenChange }: CreateChoreDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Default values for the form
  const defaultValues = {
    name: "",
    description: "",
    dueDate: new Date(),
    dueTime: "18:00",
    assignedTo: undefined,
    repeat: "never",
    reminder: "none",
  };
  
  // Initialize the form
  const form = useForm<CreateChoreFormData>({
    resolver: zodResolver(createChoreSchema),
    defaultValues,
  });
  
  // Fetch roommates for the dropdown
  const { data: roommates = [] } = useQuery({
    queryKey: ["/api/households/1/members"],
    enabled: open,
  });
  
  // Create chore mutation
  const createChoreMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/chores", data);
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["/api/chores"] });
      queryClient.invalidateQueries({ queryKey: ["/api/chores/upcoming"] });
      
      // Show success toast
      toast({
        title: "Chore created",
        description: "The chore has been created successfully.",
      });
      
      // Close the dialog and reset the form
      onOpenChange(false);
      form.reset(defaultValues);
    },
    onError: (error) => {
      toast({
        title: "Error creating chore",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Handle form submission
  const onSubmit = async (data: CreateChoreFormData) => {
    try {
      setIsSubmitting(true);
      
      // Combine date and time fields
      const dueDate = new Date(data.dueDate);
      const [hours, minutes] = data.dueTime.split(":").map(Number);
      dueDate.setHours(hours, minutes);
      
      // Send the request
      await createChoreMutation.mutateAsync({
        name: data.name,
        description: data.description,
        dueDate: dueDate.toISOString(),
        assignedTo: data.assignedTo,
        repeat: data.repeat,
        reminder: data.reminder,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg">Create New Chore</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Chore Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chore Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. Take out trash" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add details about the chore" 
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Due Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field}
                        value={format(field.value, "yyyy-MM-dd")}
                        onChange={(e) => {
                          const date = e.target.value 
                            ? new Date(e.target.value) 
                            : new Date();
                          field.onChange(date);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dueTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Time</FormLabel>
                    <FormControl>
                      <Input 
                        type="time" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Assign To */}
            <FormField
              control={form.control}
              name="assignedTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign To</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString() || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a roommate" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roommates.map((member: any) => (
                        <SelectItem 
                          key={member.user.id} 
                          value={member.user.id.toString()}
                        >
                          {member.user.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="rotation">Rotation (take turns)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Repeat */}
            <FormField
              control={form.control}
              name="repeat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repeat</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="never">Never</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Reminders */}
            <FormField
              control={form.control}
              name="reminder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reminder</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="30min">30 minutes before</SelectItem>
                      <SelectItem value="1hour">1 hour before</SelectItem>
                      <SelectItem value="3hours">3 hours before</SelectItem>
                      <SelectItem value="1day">1 day before</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Chore"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
