
import React, { useState, useEffect } from 'react';
import { getApiKey, saveApiKey } from '@/services/weatherService';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Settings, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const APIKeySettings = () => {
  const [apiKey, setApiKey] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const storedKey = getApiKey();
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error('Please enter a valid API key');
      return;
    }
    
    saveApiKey(apiKey.trim());
    toast.success('API key saved successfully');
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full transition-all hover:bg-primary/10">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="glass sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">API Key Settings</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter your OpenWeatherMap API key below. You can get a free API key by
            <a 
              href="https://home.openweathermap.org/users/sign_up" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary transition-colors hover:text-primary/80 inline-flex items-center ml-1"
            >
              signing up here
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Input
              id="api-key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your OpenWeatherMap API key"
              className="focus:ring-2 focus:ring-primary/40"
            />
            <p className="text-xs text-muted-foreground">
              Your API key is stored locally on your browser and is not sent to our servers.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-none">
            Cancel
          </Button>
          <Button onClick={handleSaveApiKey} className="bg-primary hover:bg-primary/90">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default APIKeySettings;
