
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CleaningList } from "./CleaningList";
import { AddCleaningForm } from "./AddCleaningForm";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";

export function CleaningPage() {
  const [activeTab, setActiveTab] = useState("active");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Function to refresh the list after adding a new cleaning
  const handleCleaningAdded = () => {
    setIsAddDialogOpen(false);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Cleaning Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Cleaning Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Cleaning Task</DialogTitle>
              <DialogDescription>
                Create a new cleaning task for a room
              </DialogDescription>
            </DialogHeader>
            <AddCleaningForm onSuccess={handleCleaningAdded} />
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Cleanings</TabsTrigger>
          <TabsTrigger value="schedule">Cleaning Schedule</TabsTrigger>
          <TabsTrigger value="history">Cleaning History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          <p className="text-muted-foreground">
            Manage active cleaning tasks for rooms that need attention.
          </p>
          <CleaningList key={`active-${refreshKey}`} />
        </TabsContent>
        
        <TabsContent value="schedule" className="space-y-4">
          <p className="text-muted-foreground">
            View and manage the upcoming cleaning schedule.
          </p>
          <div className="p-8 text-center border rounded-lg">
            <h3 className="text-lg font-medium">Cleaning Schedule Calendar</h3>
            <p className="text-muted-foreground mt-2">
              The cleaning schedule calendar will be implemented in a future update.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <p className="text-muted-foreground">
            View the history of completed cleaning tasks.
          </p>
          <div className="p-8 text-center border rounded-lg">
            <h3 className="text-lg font-medium">Cleaning History</h3>
            <p className="text-muted-foreground mt-2">
              The cleaning history report will be implemented in a future update.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
