
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Globe, Hotel, Lock, Mail, RefreshCcw, Save, User, Users } from "lucide-react";

export function SettingsPage() {
  const [hotelName, setHotelName] = useState("Grand Hotel & Suites");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [language, setLanguage] = useState("en");
  const [currency, setCurrency] = useState("USD");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  const [timeFormat, setTimeFormat] = useState("12h");

  const handleSaveGeneralSettings = () => {
    console.log("Saving general settings:", {
      hotelName,
      language,
      currency,
      dateFormat,
      timeFormat
    });
    // In a real app, this would make an API call to save settings
  };

  const handleSaveNotificationSettings = () => {
    console.log("Saving notification settings:", {
      emailNotifications,
      smsNotifications
    });
    // In a real app, this would make an API call to save settings
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <Button variant="outline" className="flex items-center gap-2">
          <RefreshCcw size={16} />
          <span>Reset Defaults</span>
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Hotel size={16} />
            <span>General</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell size={16} />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users size={16} />
            <span>Users & Permissions</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User size={16} />
            <span>Account</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock size={16} />
            <span>Security</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your hotel information and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hotel-name">Hotel Name</Label>
                  <Input 
                    id="hotel-name" 
                    value={hotelName} 
                    onChange={(e) => setHotelName(e.target.value)} 
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">US Dollar ($)</SelectItem>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                        <SelectItem value="GBP">British Pound (£)</SelectItem>
                        <SelectItem value="JPY">Japanese Yen (¥)</SelectItem>
                        <SelectItem value="CAD">Canadian Dollar (C$)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Separator />
                
                <h3 className="text-lg font-medium">Date & Time Format</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date-format">Date Format</Label>
                    <Select value={dateFormat} onValueChange={setDateFormat}>
                      <SelectTrigger id="date-format">
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        <SelectItem value="DD.MM.YYYY">DD.MM.YYYY</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time-format">Time Format</Label>
                    <Select value={timeFormat} onValueChange={setTimeFormat}>
                      <SelectTrigger id="time-format">
                        <SelectValue placeholder="Select time format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                        <SelectItem value="24h">24-hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-border px-6 py-4">
              <Button onClick={handleSaveGeneralSettings} className="ml-auto flex items-center gap-2">
                <Save size={16} />
                <span>Save Changes</span>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div className="space-y-1">
                    <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive email notifications for bookings, cancellations, and other important events</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div className="space-y-1">
                    <Label htmlFor="sms-notifications" className="text-base">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive text messages for urgent alerts and time-sensitive information</p>
                  </div>
                  <Switch
                    id="sms-notifications"
                    checked={smsNotifications}
                    onCheckedChange={setSmsNotifications}
                  />
                </div>
                
                <div className="space-y-2 pt-2">
                  <Label htmlFor="email-address">Email Address for Notifications</Label>
                  <Input id="email-address" type="email" placeholder="hotel@example.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone-number">Phone Number for SMS</Label>
                  <Input id="phone-number" type="tel" placeholder="+1 (555) 123-4567" />
                </div>
                
                <Separator />
                
                <h3 className="text-lg font-medium">Notification Events</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-bookings">New Bookings</Label>
                    <Switch id="notify-bookings" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-cancellations">Cancellations</Label>
                    <Switch id="notify-cancellations" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-checkin">Check-ins</Label>
                    <Switch id="notify-checkin" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-checkout">Check-outs</Label>
                    <Switch id="notify-checkout" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-maintenance">Maintenance Alerts</Label>
                    <Switch id="notify-maintenance" defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-border px-6 py-4">
              <Button onClick={handleSaveNotificationSettings} className="ml-auto flex items-center gap-2">
                <Save size={16} />
                <span>Save Changes</span>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Users & Permissions</CardTitle>
              <CardDescription>Manage users and their access rights</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">User Management</h3>
                  <Button>Add User</Button>
                </div>
                
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted">
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium text-sm">Name</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium text-sm">Email</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium text-sm">Role</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium text-sm">Status</th>
                        <th className="text-right py-3 px-4 text-muted-foreground font-medium text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-border">
                        <td className="py-3 px-4">John Smith</td>
                        <td className="py-3 px-4">john.smith@example.com</td>
                        <td className="py-3 px-4">Administrator</td>
                        <td className="py-3 px-4"><Badge className="bg-green-100 text-green-800">Active</Badge></td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="py-3 px-4">Emily Johnson</td>
                        <td className="py-3 px-4">emily.johnson@example.com</td>
                        <td className="py-3 px-4">Manager</td>
                        <td className="py-3 px-4"><Badge className="bg-green-100 text-green-800">Active</Badge></td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="py-3 px-4">Michael Brown</td>
                        <td className="py-3 px-4">michael.brown@example.com</td>
                        <td className="py-3 px-4">Staff</td>
                        <td className="py-3 px-4"><Badge className="bg-green-100 text-green-800">Active</Badge></td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <Separator className="my-6" />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Role Permissions</h3>
                  
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="font-medium">Administrator</h4>
                      <p className="text-sm text-muted-foreground">Full access to all areas of the system, including user management and system configuration.</p>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium">Manager</h4>
                      <p className="text-sm text-muted-foreground">Access to bookings, rooms, staff, and reports. Can modify data but can't manage users or system settings.</p>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium">Staff</h4>
                      <p className="text-sm text-muted-foreground">Limited access to bookings and room information. Can update cleaning status and handle check-ins/outs.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-border px-6 py-4">
              <Button className="ml-auto">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="account-name">Your Name</Label>
                  <Input id="account-name" defaultValue="John Smith" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="account-email">Email Address</Label>
                  <Input id="account-email" type="email" defaultValue="john.smith@example.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="account-phone">Phone Number</Label>
                  <Input id="account-phone" type="tel" defaultValue="+1 (555) 123-4567" />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Profile Image</h3>
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                      <User size={32} className="text-muted-foreground" />
                    </div>
                    <Button variant="outline">Upload Image</Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-border px-6 py-4">
              <Button className="ml-auto">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Change Password</h3>
                  
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>
                  
                  <Button variant="outline" className="mt-2">Change Password</Button>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable-2fa">Enable Two-Factor Authentication</Label>
                    <Switch id="enable-2fa" />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Session Management</h3>
                  <p className="text-sm text-muted-foreground">Manage your active sessions</p>
                  
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted">
                          <th className="text-left py-3 px-4 text-muted-foreground font-medium text-sm">Device</th>
                          <th className="text-left py-3 px-4 text-muted-foreground font-medium text-sm">Location</th>
                          <th className="text-left py-3 px-4 text-muted-foreground font-medium text-sm">Last Activity</th>
                          <th className="text-right py-3 px-4 text-muted-foreground font-medium text-sm">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t border-border">
                          <td className="py-3 px-4">Chrome on Windows</td>
                          <td className="py-3 px-4">New York, USA</td>
                          <td className="py-3 px-4">Now</td>
                          <td className="py-3 px-4 text-right">
                            <span className="text-muted-foreground text-sm">Current</span>
                          </td>
                        </tr>
                        <tr className="border-t border-border">
                          <td className="py-3 px-4">Safari on iPhone</td>
                          <td className="py-3 px-4">Los Angeles, USA</td>
                          <td className="py-3 px-4">2 days ago</td>
                          <td className="py-3 px-4 text-right">
                            <Button variant="ghost" size="sm">Log Out</Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <Button variant="outline">Log Out All Devices</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-border px-6 py-4">
              <Button className="ml-auto">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Fix the missing badge component
function Badge({ className, children }: { className?: string, children: React.ReactNode }) {
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}
