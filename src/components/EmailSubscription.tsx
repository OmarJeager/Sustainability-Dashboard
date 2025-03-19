
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Mail } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

const EmailSubscription = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // In a real application, this would send the data to a backend service
      // For now, we'll just simulate a successful API call with localStorage
      
      // Store the email in localStorage
      const subscribedEmails = JSON.parse(localStorage.getItem('subscribedEmails') || '[]');
      
      // Check if email already exists
      if (subscribedEmails.includes(values.email)) {
        toast.info("You're already subscribed for daily weather updates!");
        setIsSubmitting(false);
        return;
      }
      
      // Add the new email and save back to localStorage
      subscribedEmails.push(values.email);
      localStorage.setItem('subscribedEmails', JSON.stringify(subscribedEmails));
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.success("Thank you for subscribing to daily weather updates!");
      form.reset();
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Failed to subscribe. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass p-4 rounded-lg backdrop-blur-sm">
      <h2 className="text-lg font-medium mb-4 flex items-center">
        <Mail className="mr-2 h-5 w-5" />
        Get Daily Weather Updates
      </h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="your@email.com" 
                    type="email" 
                    {...field} 
                    className="bg-white/20 focus:bg-white/30"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </Button>
          
          <p className="text-xs text-center opacity-70 mt-2">
            We'll send you daily forecasts for your selected location.
            You can unsubscribe at any time.
          </p>
        </form>
      </Form>
    </div>
  );
};

export default EmailSubscription;
