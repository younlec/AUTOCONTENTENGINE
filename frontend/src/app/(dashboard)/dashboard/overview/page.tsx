"use client";

import { useState } from "react";
import {
  BarChart3,
  Eye,
  Heart,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { useSocketEvent } from "@/hooks/use-socket";

const stats = [
  {
    label: "Total Posts",
    value: "1,247",
    change: "+12.5%",
    icon: BarChart3,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    label: "Total Reach",
    value: "2.4M",
    change: "+18.2%",
    icon: Eye,
    color: "text-violet-600",
    bgColor: "bg-violet-50",
  },
  {
    label: "Engagement Rate",
    value: "4.8%",
    change: "+2.1%",
    icon: Heart,
    color: "text-rose-600",
    bgColor: "bg-rose-50",
  },
  {
    label: "Revenue",
    value: "$12,450",
    change: "+8.7%",
    icon: DollarSign,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
];

const engagementData = [
  { name: "Jan", engagement: 2400, reach: 4000, posts: 40 },
  { name: "Feb", engagement: 1398, reach: 3000, posts: 35 },
  { name: "Mar", engagement: 3800, reach: 5000, posts: 55 },
  { name: "Apr", engagement: 3908, reach: 4780, posts: 48 },
  { name: "May", engagement: 4800, reach: 5890, posts: 60 },
  { name: "Jun", engagement: 3490, reach: 4390, posts: 42 },
  { name: "Jul", engagement: 4300, reach: 6490, posts: 65 },
  { name: "Aug", engagement: 5200, reach: 7200, posts: 72 },
  { name: "Sep", engagement: 4100, reach: 5800, posts: 50 },
  { name: "Oct", engagement: 5900, reach: 8100, posts: 78 },
  { name: "Nov", engagement: 6200, reach: 8500, posts: 80 },
  { name: "Dec", engagement: 7100, reach: 9200, posts: 88 },
];

const recentPosts = [
  {
    id: "1",
    title: "10 AI Tools Every Creator Needs",
    platform: "Instagram",
    status: "Published",
    engagement: "2.4K",
    date: "2024-01-15",
  },
  {
    id: "2",
    title: "The Future of Content Creation",
    platform: "X / Twitter",
    status: "Published",
    engagement: "5.1K",
    date: "2024-01-14",
  },
  {
    id: "3",
    title: "How to Monetize Your Audience",
    platform: "YouTube",
    status: "Scheduled",
    engagement: "-",
    date: "2024-01-16",
  },
  {
    id: "4",
    title: "Weekly Productivity Tips Thread",
    platform: "X / Twitter",
    status: "Draft",
    engagement: "-",
    date: "2024-01-17",
  },
  {
    id: "5",
    title: "Behind the Scenes: My Setup",
    platform: "Instagram",
    status: "Published",
    engagement: "3.8K",
    date: "2024-01-13",
  },
];

const topContent = [
  { title: "10 AI Tools Every Creator Needs", reach: "124K", growth: "+42%" },
  { title: "The Future of Content Creation", reach: "98K", growth: "+35%" },
  { title: "My Morning Routine for Success", reach: "87K", growth: "+28%" },
  { title: "5 Revenue Streams for Creators", reach: "76K", growth: "+22%" },
];

function getStatusVariant(status: string) {
  switch (status) {
    case "Published":
      return "default" as const;
    case "Scheduled":
      return "secondary" as const;
    case "Draft":
      return "outline" as const;
    default:
      return "outline" as const;
  }
}

export default function OverviewPage() {
  const [liveTopics, setLiveTopics] = useState<any[]>([]);
  const [livePostUpdates, setLivePostUpdates] = useState<any[]>([]);

  useSocketEvent('trends.discovered', (data: { topics: any[] }) => {
    setLiveTopics(prev => [...data.topics, ...prev].slice(0, 5));
  });

  useSocketEvent('post.published', (data: any) => {
    setLivePostUpdates(prev => [data, ...prev].slice(0, 10));
  });

  useSocketEvent('analytics.updated', () => {
    // Trigger refetch of analytics data in a real implementation
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
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

      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-base">Engagement Over Time</CardTitle>
            <CardDescription>
              Monthly engagement and reach metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={engagementData}>
                <defs>
                  <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="engagement"
                  stroke="#8b5cf6"
                  fillOpacity={1}
                  fill="url(#colorEngagement)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="reach"
                  stroke="#6366f1"
                  fillOpacity={1}
                  fill="url(#colorReach)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">Top Performing Content</CardTitle>
            <CardDescription>Your best content this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topContent.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                      {i + 1}
                    </span>
                    <p className="text-sm font-medium truncate">{item.title}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm text-muted-foreground">
                      {item.reach}
                    </span>
                    <span className="text-xs text-emerald-600 flex items-center">
                      <ArrowUpRight className="h-3 w-3" />
                      {item.growth}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Posts</CardTitle>
          <CardDescription>
            Your latest content across all platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Engagement</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.platform}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(post.status)}>
                      {post.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{post.engagement}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {post.date}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {liveTopics.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <CardTitle className="text-base">Live Activity</CardTitle>
            </div>
            <CardDescription>Real-time updates from your content pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {liveTopics.map((topic: any, i: number) => (
                <div key={topic.id || i} className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary">New Trend</Badge>
                  <span className="truncate">{topic.title}</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    Score: {typeof topic.score === 'number' ? topic.score.toFixed(1) : topic.score}
                  </span>
                </div>
              ))}
              {livePostUpdates.map((update: any, i: number) => (
                <div key={update.postId || i} className="flex items-center gap-2 text-sm">
                  <Badge>Published</Badge>
                  <span>Post published to {update.platform}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
