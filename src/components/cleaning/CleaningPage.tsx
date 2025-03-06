
import React, { useState } from "react";
import { CheckCircle2, Clock, Filter, RefreshCcw, Search, ShowerHead, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { rooms, Room } from "@/lib/data";

// Type for cleaning status
type CleaningStatus = "pending" | "in_progress" | "completed" | "verified" | "scheduled";

// Type for cleaning task
interface CleaningTask {
  id: string;
  roomId: string;
  roomNumber: string;
  roomType: string;
  floor: number;
  status: CleaningStatus;
  assignedTo?: string;
  priority: "low" | "medium" | "high";
  notes?: string;
  scheduledFor?: string;
  completedAt?: string;
}

// Mock data for cleaning tasks
const cleaningTasks: CleaningTask[] = [
  {
    id: "task-1",
    roomId: "room-2",
    roomNumber: "102",
    roomType: "standard",
    floor: 1,
    status: "pending",
    priority: "medium",
    scheduledFor: "2023-07-20T14:00:00Z",
  },
  {
    id: "task-2",
    roomId: "room-3",
    roomNumber: "103",
    roomType: "deluxe",
    floor: 1,
    status: "in_progress",
    assignedTo: "Emily Davis",
    priority: "high",
    scheduledFor: "2023-07-20T12:30:00Z",
  },
  {
    id: "task-3",
    roomId: "room-8",
    roomNumber: "105",
    roomType: "standard",
    floor: 1,
    status: "pending",
    priority: "low",
    scheduledFor: "2023-07-20T16:00:00Z",
  },
  {
    id: "task-4",
    roomId: "room-11",
    roomNumber: "204",
    roomType: "suite",
    floor: 2,
    status: "completed",
    assignedTo: "Sophia Martinez",
    priority: "medium",
    scheduledFor: "2023-07-20T11:00:00Z",
    completedAt: "2023-07-20T11:45:00Z",
  },
  {
    id: "task-5",
    roomId: "room-5",
    roomNumber: "202",
    roomType: "suite",
    floor: 2,
    status: "scheduled",
    priority: "low",
    scheduledFor: "2023-07-21T10:00:00Z",
  },
  {
    id: "task-6",
    roomId: "room-1",
    roomNumber: "101",
    roomType: "standard",
    floor: 1,
    status: "verified",
    assignedTo: "Sophia Martinez",
    priority: "medium",
    scheduledFor: "2023-07-20T09:00:00Z",
    completedAt: "2023-07-20T09:35:00Z",
  },
  {
    id: "task-7",
    roomId: "room-4",
    roomNumber: "201",
    roomType: "deluxe",
    floor: 2,
    status: "scheduled",
    priority: "medium",
    scheduledFor: "2023-07-21T12:00:00Z",
  },
  {
    id: "task-8",
    roomId: "room-7",
    roomNumber: "104",
    roomType: "standard",
    floor: 1,
    status: "in_progress",
    assignedTo: "Emily Davis",
    priority: "high",
    scheduledFor: "2023-07-20T13:00:00Z",
  },
];

// Helper to get status display name
const getStatusDisplayName = (status: CleaningStatus): string => {
  switch (status) {
    case "pending": return "Pending";
    case "in_progress": return "In Progress";
    case "completed": return "Completed";
    case "verified": return "Verified";
    case "scheduled": return "Scheduled";
    default: return status;
  }
};

// Helper to get status color
const getStatusColor = (status: CleaningStatus): string => {
  switch (status) {
    case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "in_progress": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "completed": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "verified": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "scheduled": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

// Helper to get priority color
const getPriorityColor = (priority: "low" | "medium" | "high"): string => {
  switch (priority) {
    case "low": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "high": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

// Helper to get priority display name
const getPriorityDisplayName = (priority: "low" | "medium" | "high"): string => {
  switch (priority) {
    case "low": return "Low";
    case "medium": return "Medium";
    case "high": return "High";
    default: return priority;
  }
};

export function CleaningPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CleaningStatus | "all">("all");
  const [floorFilter, setFloorFilter] = useState<number | "all">("all");
  const [view, setView] = useState<"list" | "kanban">("list");
  
  // Filter tasks based on search query and filters
  const filteredTasks = cleaningTasks.filter(task => {
    // Apply room number search
    const matchesSearch = task.roomNumber.includes(searchQuery);
    
    // Apply status filter if not "all"
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    
    // Apply floor filter if not "all"
    const matchesFloor = floorFilter === "all" || task.floor === floorFilter;
    
    return matchesSearch && matchesStatus && matchesFloor;
  });

  // Group tasks by status for Kanban view
  const tasksByStatus = {
    scheduled: filteredTasks.filter(task => task.status === "scheduled"),
    pending: filteredTasks.filter(task => task.status === "pending"),
    in_progress: filteredTasks.filter(task => task.status === "in_progress"),
    completed: filteredTasks.filter(task => task.status === "completed"),
    verified: filteredTasks.filter(task => task.status === "verified"),
  };

  // Get unique floors for filter
  const floors = Array.from(new Set(rooms.map(room => room.floor)));

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Cleaning Management</h1>
        <Button className="flex items-center gap-2">
          <RefreshCcw size={16} />
          <span>Refresh Tasks</span>
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search room number..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select 
            value={statusFilter} 
            onValueChange={(value) => setStatusFilter(value as CleaningStatus | "all")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={floorFilter.toString()} 
            onValueChange={(value) => setFloorFilter(value === "all" ? "all" : parseInt(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by floor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Floors</SelectItem>
              {floors.map(floor => (
                <SelectItem key={floor} value={floor.toString()}>Floor {floor}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs value={view} onValueChange={(v) => setView(v as "list" | "kanban")} className="w-auto">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {view === "list" ? (
        <div className="bg-card rounded-lg shadow-card border border-border/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium text-sm">Room</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium text-sm">Room Type</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium text-sm">Floor</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium text-sm">Status</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium text-sm">Priority</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium text-sm">Assigned To</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium text-sm">Scheduled For</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-medium">Room {task.roomNumber}</div>
                    </td>
                    <td className="py-3 px-4 capitalize">{task.roomType}</td>
                    <td className="py-3 px-4">{task.floor}</td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(task.status)}>
                        {getStatusDisplayName(task.status)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getPriorityColor(task.priority)}>
                        {getPriorityDisplayName(task.priority)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">{task.assignedTo || "Unassigned"}</td>
                    <td className="py-3 px-4">
                      {task.scheduledFor ? new Date(task.scheduledFor).toLocaleString() : "Not scheduled"}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">Actions</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Assign Staff</DropdownMenuItem>
                          <DropdownMenuItem>Mark as Complete</DropdownMenuItem>
                          <DropdownMenuItem>Verify Cleaning</DropdownMenuItem>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
                {filteredTasks.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-muted-foreground">
                      <ShowerHead size={32} className="mx-auto mb-3 text-muted-foreground/50" />
                      <p>No cleaning tasks found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // Kanban board view
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-auto pb-4">
          {Object.entries(tasksByStatus).map(([status, tasks]) => (
            <div key={status} className="flex flex-col h-full min-h-[70vh]">
              <div className="flex items-center justify-between mb-2 bg-muted p-2 rounded-t-md">
                <h3 className="font-medium flex items-center">
                  {status === "scheduled" && <Clock size={18} className="mr-2 text-purple-500" />}
                  {status === "pending" && <Clock size={18} className="mr-2 text-yellow-500" />}
                  {status === "in_progress" && <RefreshCcw size={18} className="mr-2 text-blue-500" />}
                  {status === "completed" && <CheckCircle2 size={18} className="mr-2 text-green-500" />}
                  {status === "verified" && <CheckCircle2 size={18} className="mr-2 text-green-700" />}
                  {getStatusDisplayName(status as CleaningStatus)}
                </h3>
                <Badge>{tasks.length}</Badge>
              </div>
              <div className="bg-muted/50 rounded-b-md p-2 flex-1 overflow-auto">
                <div className="space-y-2">
                  {tasks.map((task) => (
                    <Card key={task.id} className="p-3 bg-card hover:shadow-md transition-shadow cursor-pointer">
                      <div className="font-medium">Room {task.roomNumber}</div>
                      <div className="text-sm text-muted-foreground capitalize">{task.roomType}</div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge className={getPriorityColor(task.priority)} variant="outline">
                          {getPriorityDisplayName(task.priority)}
                        </Badge>
                        <Badge variant="outline">Floor {task.floor}</Badge>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        {task.assignedTo ? `Assigned to: ${task.assignedTo}` : "Unassigned"}
                      </div>
                      <div className="flex justify-end mt-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">Actions</Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Assign Staff</DropdownMenuItem>
                            <DropdownMenuItem>Change Status</DropdownMenuItem>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </Card>
                  ))}
                  {tasks.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      <p>No tasks</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
