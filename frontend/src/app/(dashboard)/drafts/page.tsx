"use client";

import { useState } from "react";
import { Eye, Check, X, Clock, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ContentStatus = "Draft" | "Review" | "Approved" | "Scheduled" | "Posted";

interface DraftItem {
  id: string;
  title: string;
  platform: string;
  type: string;
  status: ContentStatus;
  content: string;
  author: string;
  createdAt: string;
  scheduledFor?: string;
}

const initialDrafts: DraftItem[] = [
  {
    id: "1",
    title: "10 AI Tools for Creators",
    platform: "Instagram",
    type: "Caption",
    status: "Draft",
    content:
      "🚀 10 AI tools that every content creator needs in 2024:\n\n1. ChatGPT - Content ideation\n2. Midjourney - Image generation\n3. Descript - Video editing\n4. Canva AI - Design automation\n5. Buffer - Social scheduling\n6. Jasper - Copywriting\n7. Synthesia - AI video\n8. Notion AI - Content planning\n9. Grammarly - Writing assistant\n10. AutoContent Engine - Full automation 💪\n\nSave this post for later! 🔖\n\n#AITools #ContentCreation #CreatorEconomy",
    author: "John Doe",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Thread: Future of Content",
    platform: "X / Twitter",
    type: "Thread",
    status: "Review",
    content:
      "🧵 The future of content creation is here.\n\nI've spent 6 months testing every AI tool on the market.\n\nHere's what I learned (thread) 👇\n\n1/ AI doesn't replace creators. It amplifies them.\n\n2/ The best creators will be those who learn to use AI as a co-pilot.\n\n3/ Content quality will go up across the board.\n\n4/ Distribution will become more important than creation.",
    author: "John Doe",
    createdAt: "2024-01-14",
  },
  {
    id: "3",
    title: "Monetization Strategy Guide",
    platform: "YouTube",
    type: "Script",
    status: "Approved",
    content:
      "[INTRO] Welcome back to the channel! Today we're breaking down exactly how I monetize my content across multiple platforms...\n\n[SECTION 1] First, let's talk about the three main revenue streams...\n\n[SECTION 2] Affiliate marketing has been my biggest earner...\n\n[OUTRO] If you found this helpful, don't forget to subscribe!",
    author: "John Doe",
    createdAt: "2024-01-13",
    scheduledFor: "2024-01-20",
  },
  {
    id: "4",
    title: "Morning Routine Reel",
    platform: "Instagram",
    type: "Reel",
    status: "Scheduled",
    content:
      "[HOOK] My 5 AM routine that generates $10K/month 💰\n\n[SCENE 1] 5:00 AM - Wake up, no phone\n[SCENE 2] 5:15 AM - Journal & plan content\n[SCENE 3] 5:45 AM - Record batch content\n[SCENE 4] 7:00 AM - Schedule everything\n[SCENE 5] 7:30 AM - Engage with community\n\n[CTA] Follow for more creator tips!",
    author: "John Doe",
    createdAt: "2024-01-12",
    scheduledFor: "2024-01-18",
  },
  {
    id: "5",
    title: "Weekly Tips Compilation",
    platform: "Facebook",
    type: "Caption",
    status: "Posted",
    content:
      "This week's top 3 content creation tips:\n\n✅ Repurpose your best-performing content\n✅ Use AI to speed up your workflow\n✅ Always include a clear call-to-action\n\nWhich tip are you implementing this week?",
    author: "John Doe",
    createdAt: "2024-01-10",
  },
  {
    id: "6",
    title: "Product Launch Announcement",
    platform: "X / Twitter",
    type: "Caption",
    status: "Draft",
    content:
      "Big announcement coming next week 👀\n\nWe've been building something incredible for content creators.\n\nDrop a 🔥 if you want early access.",
    author: "Jane Smith",
    createdAt: "2024-01-15",
  },
];

function getStatusColor(status: ContentStatus) {
  const colors: Record<ContentStatus, string> = {
    Draft: "bg-slate-100 text-slate-700",
    Review: "bg-amber-100 text-amber-700",
    Approved: "bg-emerald-100 text-emerald-700",
    Scheduled: "bg-blue-100 text-blue-700",
    Posted: "bg-violet-100 text-violet-700",
  };
  return colors[status];
}

export default function DraftsPage() {
  const [drafts, setDrafts] = useState(initialDrafts);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [selectedDraft, setSelectedDraft] = useState<DraftItem | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const filteredDrafts = drafts.filter((d) => {
    if (statusFilter !== "all" && d.status !== statusFilter) return false;
    if (platformFilter !== "all" && d.platform !== platformFilter) return false;
    return true;
  });

  const updateStatus = (id: string, newStatus: ContentStatus) => {
    setDrafts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
    );
    toast.success(`Status updated to ${newStatus}`);
  };

  const statusCounts = drafts.reduce(
    (acc, d) => {
      acc[d.status] = (acc[d.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-5 gap-3">
        {(["Draft", "Review", "Approved", "Scheduled", "Posted"] as const).map(
          (status) => (
            <Card
              key={status}
              className={`cursor-pointer transition-all ${
                statusFilter === status ? "ring-2 ring-violet-500" : ""
              }`}
              onClick={() =>
                setStatusFilter(statusFilter === status ? "all" : status)
              }
            >
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">{statusCounts[status] || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">{status}</p>
              </CardContent>
            </Card>
          )
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Content Pipeline</CardTitle>
              <CardDescription>
                Manage your content through the approval workflow
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Review">Review</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Posted">Posted</SelectItem>
                </SelectContent>
              </Select>
              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="X / Twitter">X / Twitter</SelectItem>
                  <SelectItem value="YouTube">YouTube</SelectItem>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDrafts.map((draft) => (
                <TableRow key={draft.id}>
                  <TableCell className="font-medium">{draft.title}</TableCell>
                  <TableCell>{draft.platform}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{draft.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                        draft.status
                      )}`}
                    >
                      {draft.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {draft.createdAt}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setSelectedDraft(draft);
                          setPreviewOpen(true);
                        }}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      {draft.status === "Draft" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-amber-600 hover:text-amber-700"
                          onClick={() => updateStatus(draft.id, "Review")}
                        >
                          <Send className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      {draft.status === "Review" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-emerald-600 hover:text-emerald-700"
                            onClick={() => updateStatus(draft.id, "Approved")}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700"
                            onClick={() => updateStatus(draft.id, "Draft")}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </>
                      )}
                      {draft.status === "Approved" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-600 hover:text-blue-700"
                          onClick={() => updateStatus(draft.id, "Scheduled")}
                        >
                          <Clock className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedDraft?.title}</DialogTitle>
            <DialogDescription>
              {selectedDraft?.platform} &middot; {selectedDraft?.type} &middot;{" "}
              {selectedDraft?.status}
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg bg-muted/50 p-4">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed">
              {selectedDraft?.content}
            </pre>
          </div>
          <div className="flex justify-end gap-2">
            {selectedDraft?.status === "Review" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    updateStatus(selectedDraft.id, "Draft");
                    setPreviewOpen(false);
                  }}
                >
                  <X className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => {
                    updateStatus(selectedDraft.id, "Approved");
                    setPreviewOpen(false);
                  }}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
