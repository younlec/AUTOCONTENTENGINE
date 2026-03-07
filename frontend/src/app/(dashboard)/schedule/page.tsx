"use client";

import { useState } from "react";
import { Clock, ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, type CalendarEvent } from "@/components/ui/calendar";

const scheduledPosts: (CalendarEvent & {
  platform: string;
  time: string;
  type: string;
  content: string;
})[] = [
  {
    id: "1",
    title: "AI Tools Carousel",
    date: new Date(2024, 0, 18, 10, 0),
    platform: "Instagram",
    time: "10:00 AM",
    type: "Caption",
    color: "bg-pink-100 text-pink-700",
    content: "🚀 10 AI tools that every content creator needs...",
  },
  {
    id: "2",
    title: "Content Strategy Thread",
    date: new Date(2024, 0, 19, 14, 30),
    platform: "X / Twitter",
    time: "2:30 PM",
    type: "Thread",
    color: "bg-sky-100 text-sky-700",
    content:
      "🧵 The content strategy that grew my audience from 0 to 100K...",
  },
  {
    id: "3",
    title: "Monetization Guide",
    date: new Date(2024, 0, 20, 9, 0),
    platform: "YouTube",
    time: "9:00 AM",
    type: "Script",
    color: "bg-red-100 text-red-700",
    content: "[INTRO] Welcome back! Today we're breaking down monetization...",
  },
  {
    id: "4",
    title: "Morning Routine Reel",
    date: new Date(2024, 0, 18, 18, 0),
    platform: "Instagram",
    time: "6:00 PM",
    type: "Reel",
    color: "bg-pink-100 text-pink-700",
    content: "[HOOK] My 5 AM routine that generates $10K/month...",
  },
  {
    id: "5",
    title: "Weekly Tips Post",
    date: new Date(2024, 0, 22, 12, 0),
    platform: "Facebook",
    time: "12:00 PM",
    type: "Caption",
    color: "bg-blue-100 text-blue-700",
    content: "This week's top 3 content creation tips...",
  },
  {
    id: "6",
    title: "Behind the Scenes Story",
    date: new Date(2024, 0, 23, 15, 0),
    platform: "Instagram",
    time: "3:00 PM",
    type: "Caption",
    color: "bg-pink-100 text-pink-700",
    content:
      "Here's what a typical day looks like behind the scenes of running a content business...",
  },
  {
    id: "7",
    title: "Product Review Video",
    date: new Date(2024, 0, 25, 11, 0),
    platform: "YouTube",
    time: "11:00 AM",
    type: "Script",
    color: "bg-red-100 text-red-700",
    content: "[INTRO] Today I'm reviewing the top 5 content creation tools...",
  },
  {
    id: "8",
    title: "Engagement Tips Thread",
    date: new Date(2024, 0, 24, 8, 0),
    platform: "X / Twitter",
    time: "8:00 AM",
    type: "Thread",
    color: "bg-sky-100 text-sky-700",
    content: "🧵 How to 10x your engagement rate (real data inside)...",
  },
];

function getPlatformColor(platform: string) {
  const colors: Record<string, string> = {
    Instagram: "bg-pink-500",
    "X / Twitter": "bg-sky-500",
    YouTube: "bg-red-500",
    Facebook: "bg-blue-500",
    TikTok: "bg-slate-800",
  };
  return colors[platform] || "bg-slate-500";
}

export default function SchedulePage() {
  const [selectedPost, setSelectedPost] = useState<(typeof scheduledPosts)[0] | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const upcomingPosts = [...scheduledPosts].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Content Calendar</CardTitle>
              <CardDescription>
                View and manage your scheduled content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                events={scheduledPosts}
                onDateClick={(date) => {
                  const postsOnDate = scheduledPosts.filter(
                    (p) =>
                      new Date(p.date).toDateString() === date.toDateString()
                  );
                  if (postsOnDate.length > 0) {
                    setSelectedPost(postsOnDate[0]);
                    setDetailOpen(true);
                  }
                }}
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">Upcoming</CardTitle>
              <CardDescription>Next scheduled posts</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="px-6 pb-6 space-y-3">
                  {upcomingPosts.map((post) => (
                    <div
                      key={post.id}
                      className="rounded-lg border p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => {
                        setSelectedPost(post);
                        setDetailOpen(true);
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${getPlatformColor(
                            post.platform
                          )}`}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">
                            {post.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Badge
                              variant="secondary"
                              className="text-[10px] px-1.5 py-0"
                            >
                              {post.platform}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {post.time}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
                            {post.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedPost?.title}</DialogTitle>
            <DialogDescription>
              <span className="flex items-center gap-2 mt-1">
                <Badge variant="secondary">{selectedPost?.platform}</Badge>
                <Badge variant="outline">{selectedPost?.type}</Badge>
                <span className="text-xs flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {selectedPost?.time}
                </span>
              </span>
            </DialogDescription>
          </DialogHeader>
          <Separator />
          <div className="rounded-lg bg-muted/50 p-4">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed">
              {selectedPost?.content}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
