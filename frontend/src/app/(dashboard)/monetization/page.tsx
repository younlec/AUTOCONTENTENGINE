"use client";

import { useState } from "react";
import {
  DollarSign,
  Link as LinkIcon,
  MousePointerClick,
  Percent,
  Plus,
  ExternalLink,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const revenueStats = [
  {
    label: "Total Revenue",
    value: "$12,450",
    change: "+8.7%",
    icon: DollarSign,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    label: "Active Links",
    value: "24",
    change: "+3",
    icon: LinkIcon,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    label: "Total Clicks",
    value: "45.2K",
    change: "+15.3%",
    icon: MousePointerClick,
    color: "text-violet-600",
    bgColor: "bg-violet-50",
  },
  {
    label: "Avg. Commission",
    value: "12.5%",
    change: "+0.5%",
    icon: Percent,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
];

const revenueData = [
  { month: "Jul", revenue: 1200, clicks: 3200 },
  { month: "Aug", revenue: 1800, clicks: 4100 },
  { month: "Sep", revenue: 1400, clicks: 3800 },
  { month: "Oct", revenue: 2200, clicks: 5200 },
  { month: "Nov", revenue: 2800, clicks: 6100 },
  { month: "Dec", revenue: 3050, clicks: 7800 },
];

const affiliateLinks = [
  {
    id: "1",
    name: "Canva Pro Referral",
    url: "https://canva.com/ref/auto123",
    platform: "Instagram",
    clicks: 12400,
    conversions: 342,
    revenue: "$3,420",
    commission: "10%",
    status: "Active",
  },
  {
    id: "2",
    name: "Notion Affiliate",
    url: "https://notion.so/ref/auto456",
    platform: "YouTube",
    clicks: 8900,
    conversions: 267,
    revenue: "$2,670",
    commission: "15%",
    status: "Active",
  },
  {
    id: "3",
    name: "Jasper AI Partner",
    url: "https://jasper.ai/ref/auto789",
    platform: "X / Twitter",
    clicks: 6200,
    conversions: 124,
    revenue: "$2,480",
    commission: "20%",
    status: "Active",
  },
  {
    id: "4",
    name: "Buffer Referral",
    url: "https://buffer.com/ref/auto012",
    platform: "Facebook",
    clicks: 4500,
    conversions: 90,
    revenue: "$1,350",
    commission: "15%",
    status: "Active",
  },
  {
    id: "5",
    name: "Descript Partner",
    url: "https://descript.com/ref/auto345",
    platform: "YouTube",
    clicks: 3200,
    conversions: 64,
    revenue: "$1,280",
    commission: "20%",
    status: "Paused",
  },
  {
    id: "6",
    name: "ConvertKit Affiliate",
    url: "https://convertkit.com/ref/auto678",
    platform: "Instagram",
    clicks: 2800,
    conversions: 42,
    revenue: "$1,250",
    commission: "30%",
    status: "Active",
  },
];

export default function MonetizationPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newLink, setNewLink] = useState({
    name: "",
    url: "",
    platform: "",
    commission: "",
  });

  const handleAddLink = () => {
    if (!newLink.name || !newLink.url) {
      toast.error("Please fill in required fields");
      return;
    }
    toast.success("Affiliate link added successfully!");
    setDialogOpen(false);
    setNewLink({ name: "", url: "", platform: "", commission: "" });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {revenueStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bgColor}`}
                >
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-sm text-emerald-600">
                <TrendingUp className="h-3 w-3" />
                <span>{stat.change}</span>
                <span className="text-muted-foreground">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue Over Time</CardTitle>
            <CardDescription>Monthly affiliate revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Bar
                  dataKey="revenue"
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Click Performance</CardTitle>
            <CardDescription>Monthly link clicks</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Affiliate Links</CardTitle>
              <CardDescription>
                Manage your affiliate links and track performance
              </CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Link
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Affiliate Link</DialogTitle>
                  <DialogDescription>
                    Add a new affiliate link to track
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Link Name</Label>
                    <Input
                      placeholder="e.g., Canva Pro Referral"
                      value={newLink.name}
                      onChange={(e) =>
                        setNewLink({ ...newLink, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>URL</Label>
                    <Input
                      placeholder="https://..."
                      value={newLink.url}
                      onChange={(e) =>
                        setNewLink({ ...newLink, url: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Platform</Label>
                      <Select
                        value={newLink.platform}
                        onValueChange={(v) =>
                          setNewLink({ ...newLink, platform: v })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Platform" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="twitter">X / Twitter</SelectItem>
                          <SelectItem value="youtube">YouTube</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Commission %</Label>
                      <Input
                        placeholder="e.g., 15"
                        value={newLink.commission}
                        onChange={(e) =>
                          setNewLink({ ...newLink, commission: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddLink}>Add Link</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead>Conversions</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {affiliateLinks.map((link) => (
                <TableRow key={link.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{link.name}</span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </TableCell>
                  <TableCell>{link.platform}</TableCell>
                  <TableCell>{link.clicks.toLocaleString()}</TableCell>
                  <TableCell>{link.conversions}</TableCell>
                  <TableCell className="font-medium">{link.revenue}</TableCell>
                  <TableCell>{link.commission}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        link.status === "Active" ? "default" : "secondary"
                      }
                    >
                      {link.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
