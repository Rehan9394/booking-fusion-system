import React, { useState } from "react";
import { format } from "date-fns";
import { 
  getAllCleanings, 
  getCleaningStatusDisplayName, 
  getCleaningPriorityInfo,
  updateCleaning,
  deleteCleaning,
  Cleaning,
  CleaningStatus,
  CleaningPriority,
  staff 
} from "@/lib/data";
import { cn, formatDate, formatDateTime, formatRelativeTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Edit, Trash, AlertTriangle } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export function CleaningList() {
  const [cleanings, setCleanings] = useState(getAllCleanings());
  const [selectedCleaning, setSelectedCleaning] = useState<Cleaning | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const filterCleanings = (status: CleaningStatus | "all") => {
    if (status === "all") {
      setCleanings(getAllCleanings());
    } else {
      const filteredCleanings = getAllCleanings().filter(
        cleaning => cleaning.status === status
      );
      setCleanings(filteredCleanings);
    }
  };

  const handleStatusUpdate = (id: string, newStatus: CleaningStatus) => {
    const dataToUpdate: Partial<Cleaning> = { status: newStatus };
    
    if (newStatus === "in_progress") {
      dataToUpdate.scheduledAt = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
    } else if (newStatus === "completed") {
      dataToUpdate.completedAt = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
    } else if (newStatus === "verified") {
      dataToUpdate.verifiedAt = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
    }
    
    const updated = updateCleaning(id, dataToUpdate);
    
    if (updated) {
      setCleanings(getAllCleanings());
      toast({
        title: "Status updated",
        description: `Cleaning status updated to ${getCleaningStatusDisplayName(newStatus)}`,
      });
    }
  };

  const handleEdit = (cleaning: Cleaning) => {
    setSelectedCleaning(cleaning);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (cleaning: Cleaning) => {
    setSelectedCleaning(cleaning);
    setIsDeleteDialogOpen(true);
  };

  const saveEditedCleaning = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCleaning) return;
    
    const formData = new FormData(e.currentTarget);
    const updatedData: Partial<Cleaning> = {
      status: formData.get('status') as CleaningStatus,
      priority: formData.get('priority') as CleaningPriority,
      assignedTo: formData.get('assignedTo') as string,
      notes: formData.get('notes') as string,
      scheduledAt: formData.get('scheduledAt') ? 
        new Date(formData.get('scheduledAt') as string).toISOString() : 
        selectedCleaning.scheduledAt,
      estimatedDuration: formData.get('estimatedDuration') ? 
        parseInt(formData.get('estimatedDuration') as string) : 
        selectedCleaning.estimatedDuration
    };
    
    const updated = updateCleaning(selectedCleaning.id, updatedData);
    
    if (updated) {
      setCleanings(getAllCleanings());
      setIsEditDialogOpen(false);
      toast({
        title: "Cleaning updated",
        description: "The cleaning task has been successfully updated",
      });
    }
  };

  const confirmDelete = () => {
    if (!selectedCleaning) return;
    
    const deleted = deleteCleaning(selectedCleaning.id);
    
    if (deleted) {
      setCleanings(getAllCleanings());
      setIsDeleteDialogOpen(false);
      toast({
        title: "Cleaning deleted",
        description: "The cleaning task has been successfully deleted",
        variant: "destructive",
      });
    }
  };

  const getPriorityBadge = (priority: CleaningPriority) => {
    const { name, color } = getCleaningPriorityInfo(priority);
    return (
      <Badge variant="outline" className={cn("font-medium", color)}>
        {name}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => filterCleanings("all")}
        >
          All
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => filterCleanings("pending")}
        >
          Pending
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => filterCleanings("scheduled")}
        >
          Scheduled
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => filterCleanings("in_progress")}
        >
          In Progress
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => filterCleanings("completed")}
        >
          Completed
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => filterCleanings("verified")}
        >
          Verified
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cleanings.map((cleaning) => (
          <Card key={cleaning.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base">
                    Room {cleaning.room?.number}
                  </CardTitle>
                  <CardDescription>
                    {cleaning.room?.type} - Floor {cleaning.room?.floor}
                  </CardDescription>
                </div>
                {getPriorityBadge(cleaning.priority)}
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Status:</span>
                  <Badge variant="secondary">
                    {getCleaningStatusDisplayName(cleaning.status)}
                  </Badge>
                </div>
                
                {cleaning.assignedToStaff && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Assigned to:</span>
                    <span className="text-sm">{cleaning.assignedToStaff.name}</span>
                  </div>
                )}
                
                {cleaning.scheduledAt && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Scheduled:</span>
                    <span className="text-sm">{formatRelativeTime(cleaning.scheduledAt)}</span>
                  </div>
                )}
                
                {cleaning.estimatedDuration && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Est. Duration:</span>
                    <span className="text-sm">{cleaning.estimatedDuration} minutes</span>
                  </div>
                )}
                
                {cleaning.notes && (
                  <div className="mt-2">
                    <span className="text-sm font-medium">Notes:</span>
                    <p className="text-sm text-muted-foreground mt-1">{cleaning.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(cleaning)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(cleaning)}>
                  <Trash className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
              
              <div>
                {cleaning.status === "pending" && (
                  <Button size="sm" variant="secondary" onClick={() => handleStatusUpdate(cleaning.id, "in_progress")}>
                    <Clock className="h-4 w-4 mr-1" />
                    Start
                  </Button>
                )}
                {cleaning.status === "in_progress" && (
                  <Button size="sm" variant="secondary" onClick={() => handleStatusUpdate(cleaning.id, "completed")}>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Complete
                  </Button>
                )}
                {cleaning.status === "completed" && (
                  <Button size="sm" variant="secondary" onClick={() => handleStatusUpdate(cleaning.id, "verified")}>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Verify
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedCleaning && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Cleaning Task</DialogTitle>
              <DialogDescription>
                Update the details for Room {selectedCleaning.room?.number}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={saveEditedCleaning}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue={selectedCleaning.status}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="verified">Verified</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select name="priority" defaultValue={selectedCleaning.priority}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Select name="assignedTo" defaultValue={selectedCleaning.assignedTo || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select staff member" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Unassigned</SelectItem>
                      {staff.map(member => (
                        <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="scheduledAt">Scheduled Date</Label>
                    <Input 
                      type="datetime-local" 
                      name="scheduledAt" 
                      defaultValue={selectedCleaning.scheduledAt ? 
                        new Date(selectedCleaning.scheduledAt).toISOString().slice(0, 16) : 
                        ""}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="estimatedDuration">Est. Duration (mins)</Label>
                    <Input 
                      type="number" 
                      name="estimatedDuration" 
                      defaultValue={selectedCleaning.estimatedDuration} 
                      min="1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea 
                    name="notes" 
                    defaultValue={selectedCleaning.notes || ""} 
                    placeholder="Special instructions or notes"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this cleaning task? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
