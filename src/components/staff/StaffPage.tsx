
import React, { useState } from "react";
import { UsersRound, Search, Filter, UserPlus, MoreVertical, Mail, Phone, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: "active" | "inactive";
  avatar?: string;
  startDate: string;
}

const staffMembers: StaffMember[] = [
  {
    id: "staff-1",
    name: "Emma Johnson",
    email: "emma.johnson@example.com",
    phone: "+1 (555) 123-4567",
    role: "Manager",
    department: "Front Desk",
    status: "active",
    startDate: "2021-03-15",
  },
  {
    id: "staff-2",
    name: "Michael Chen",
    email: "michael.chen@example.com",
    phone: "+1 (555) 234-5678",
    role: "Receptionist",
    department: "Front Desk",
    status: "active",
    startDate: "2022-01-10",
  },
  {
    id: "staff-3",
    name: "Sophia Martinez",
    email: "sophia.martinez@example.com",
    phone: "+1 (555) 345-6789",
    role: "Housekeeping Manager",
    department: "Housekeeping",
    status: "active",
    startDate: "2020-06-22",
  },
  {
    id: "staff-4",
    name: "William Taylor",
    email: "william.taylor@example.com",
    phone: "+1 (555) 456-7890",
    role: "Maintenance",
    department: "Facilities",
    status: "active",
    startDate: "2019-11-05",
  },
  {
    id: "staff-5",
    name: "Olivia Brown",
    email: "olivia.brown@example.com",
    phone: "+1 (555) 567-8901",
    role: "Housekeeper",
    department: "Housekeeping",
    status: "inactive",
    startDate: "2021-08-17",
  },
  {
    id: "staff-6",
    name: "James Wilson",
    email: "james.wilson@example.com",
    phone: "+1 (555) 678-9012",
    role: "Concierge",
    department: "Front Desk",
    status: "active",
    startDate: "2022-04-30",
  },
  {
    id: "staff-7",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "+1 (555) 789-0123",
    role: "Housekeeper",
    department: "Housekeeping",
    status: "active",
    startDate: "2021-12-03",
  },
  {
    id: "staff-8",
    name: "Daniel Garcia",
    email: "daniel.garcia@example.com",
    phone: "+1 (555) 890-1234",
    role: "Maintenance",
    department: "Facilities",
    status: "active",
    startDate: "2020-09-14",
  },
];

export function StaffPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  
  const filteredStaff = staffMembers.filter(staff => {
    // Apply search filter
    const matchesSearch = 
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply department filter if selected
    const matchesDepartment = departmentFilter ? staff.department === departmentFilter : true;
    
    return matchesSearch && matchesDepartment;
  });

  const departments = Array.from(new Set(staffMembers.map(staff => staff.department)));

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
        <Button className="flex items-center gap-2">
          <UserPlus size={18} />
          <span>Add Staff Member</span>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search staff..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter size={16} />
                <span>{departmentFilter || "All Departments"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setDepartmentFilter(null)}>
                All Departments
              </DropdownMenuItem>
              {departments.map(dept => (
                <DropdownMenuItem key={dept} onClick={() => setDepartmentFilter(dept)}>
                  {dept}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-card border border-border/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium text-sm">Name</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium text-sm">Contact</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium text-sm">Role</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium text-sm">Department</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium text-sm">Status</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium text-sm">Start Date</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={staff.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {staff.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{staff.name}</p>
                        <p className="text-sm text-muted-foreground">{staff.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail size={14} className="mr-2 text-muted-foreground" />
                        <span>{staff.email}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone size={14} className="mr-2 text-muted-foreground" />
                        <span>{staff.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">{staff.role}</td>
                  <td className="py-3 px-4">
                    <Badge variant="outline">{staff.department}</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      {staff.status === "active" ? (
                        <>
                          <CheckCircle size={14} className="mr-1 text-green-500" />
                          <span className="text-green-600">Active</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={14} className="mr-1 text-red-500" />
                          <span className="text-red-600">Inactive</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">{staff.startDate}</td>
                  <td className="py-3 px-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit Staff</DropdownMenuItem>
                        <DropdownMenuItem>View Schedule</DropdownMenuItem>
                        <DropdownMenuItem>
                          {staff.status === "active" ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {filteredStaff.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">
                    <UsersRound size={32} className="mx-auto mb-3 text-muted-foreground/50" />
                    <p>No staff members found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
