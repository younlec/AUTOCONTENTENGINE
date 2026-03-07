"use client";

import { useState } from "react";
import { Sparkles, Copy, Edit, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const previousContent = [
  {
    id: "1",
    type: "Caption",
    platform: "Instagram",
    prompt: "Productivity tips for remote workers",
    preview: "🚀 5 game-changing productivity hacks for remote workers...",
    date: "2024-01-15",
    provider: "OpenAI",
  },
  {
    id: "2",
    type: "Thread",
    platform: "X / Twitter",
    prompt: "The future of AI in content creation",
    preview: "1/ AI is revolutionizing content creation. Here's how...",
    date: "2024-01-14",
    provider: "Claude",
  },
  {
    id: "3",
    type: "Script",
    platform: "YouTube",
    prompt: "How to start a SaaS business",
    preview: "[INTRO] Hey everyone, today we're diving into...",
    date: "2024-01-13",
    provider: "OpenAI",
  },
  {
    id: "4",
    type: "Caption",
    platform: "Facebook",
    prompt: "New year motivation post",
    preview: "2024 is YOUR year. Here's why I believe that...",
    date: "2024-01-12",
    provider: "Claude",
  },
  {
    id: "5",
    type: "Reel",
    platform: "Instagram",
    prompt: "Quick cooking recipe hook",
    preview: "[HOOK] You won't believe this 30-second recipe...",
    date: "2024-01-11",
    provider: "OpenAI",
  },
];

const mockGeneratedContent: Record<string, string> = {
  Caption:
    "🔥 Ready to level up your content game?\n\nHere are 5 tips that transformed my online presence:\n\n1️⃣ Consistency beats perfection\n2️⃣ Engage with your community daily\n3️⃣ Use analytics to guide your strategy\n4️⃣ Repurpose content across platforms\n5️⃣ Invest in quality over quantity\n\nWhich tip resonates most with you? Drop a comment below! 👇\n\n#ContentCreation #SocialMediaTips #CreatorEconomy",
  Thread:
    "🧵 1/ Let me share the content strategy that grew my audience from 0 to 100K in 6 months.\n\nNo paid ads. No shortcuts. Just pure value.\n\nHere's the thread 👇\n\n2/ First, I identified my niche. I didn't try to be everything to everyone. I focused on ONE topic I could speak about with authority.\n\n3/ Then I created a content calendar. I posted at least 3x per week, always at peak engagement times for my audience.\n\n4/ The secret sauce? I engaged authentically. For every post I made, I commented on 10 others. Genuine comments, not generic ones.\n\n5/ I also repurposed everything. A YouTube video became a blog post, which became a Twitter thread, which became Instagram carousels.\n\n6/ Results don't lie:\n📈 100K followers\n💰 $5K/month in affiliate revenue\n🤝 12 brand partnerships\n\nYour turn. Start today. 🚀",
  Script:
    "[INTRO]\nHey everyone, welcome back to the channel! Today we're diving into something that completely changed how I approach content creation.\n\n[HOOK]\nWhat if I told you that you could create a month's worth of content in just ONE day? Sounds crazy, right? But that's exactly what I've been doing for the past 6 months.\n\n[BODY]\nHere's the system:\n\nStep 1: Batch your content ideas. Spend 30 minutes brainstorming topics.\nStep 2: Create templates for each format - videos, posts, stories.\nStep 3: Record everything back to back. No breaks between topics.\nStep 4: Edit in batches. Process all footage at once.\nStep 5: Schedule everything using automation tools.\n\n[OUTRO]\nIf this was helpful, smash that like button and subscribe for more content creation tips. Drop a comment with your biggest content challenge. See you in the next one!",
  Short:
    "[HOOK - 0-3s]\n\"Stop scrolling. This changed my life.\"\n\n[CONTENT - 3-25s]\n\"I used to spend 8 hours a day creating content. Now I spend 2. Here's my secret: AI-powered content automation.\n\nI use tools that generate captions, schedule posts, and even analyze what works best. The result? 3x more content, 5x more engagement.\"\n\n[CTA - 25-30s]\n\"Follow for more creator productivity hacks. Link in bio for my full toolkit.\"",
  Reel:
    "[OPENING SHOT - Dramatic zoom in]\n\"POV: You just discovered the content creation hack of 2024\"\n\n[TRANSITION - Quick cuts]\nShowing laptop → phone → analytics dashboard\n\n[VOICEOVER]\n\"Three months ago I was struggling to post once a week. Now I post three times a day across four platforms.\n\nThe difference? I stopped trying to do everything manually.\n\nAI writes my first drafts. Automation handles my scheduling. Analytics tell me what to create next.\"\n\n[ENDING]\n\"Save this for later. You'll thank me. 🔥\"\n\n#ContentCreator #AITools #SocialMediaGrowth",
};

export default function ContentPage() {
  const [contentType, setContentType] = useState("");
  const [platform, setPlatform] = useState("");
  const [topic, setTopic] = useState("");
  const [aiProvider, setAiProvider] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleGenerate = async () => {
    if (!contentType || !platform || !topic) {
      toast.error("Please fill in all required fields");
      return;
    }

    setGenerating(true);
    setGeneratedContent("");

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const content = mockGeneratedContent[contentType] || mockGeneratedContent.Caption;
    setGeneratedContent(content);
    setGenerating(false);
    toast.success("Content generated successfully!");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="generate">
        <TabsList>
          <TabsTrigger value="generate">Generate</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6 mt-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-violet-500" />
                  Generate Content
                </CardTitle>
                <CardDescription>
                  Use AI to generate content for your social platforms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Content Type</Label>
                    <Select value={contentType} onValueChange={setContentType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Caption">Caption</SelectItem>
                        <SelectItem value="Thread">Thread</SelectItem>
                        <SelectItem value="Script">Script</SelectItem>
                        <SelectItem value="Short">Short</SelectItem>
                        <SelectItem value="Reel">Reel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Platform</Label>
                    <Select value={platform} onValueChange={setPlatform}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="twitter">X / Twitter</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Topic / Prompt</Label>
                  <Textarea
                    placeholder="Describe what content you want to generate..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>AI Provider</Label>
                  <Select value={aiProvider} onValueChange={setAiProvider}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openai">OpenAI (GPT-4)</SelectItem>
                      <SelectItem value="claude">Claude (Anthropic)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0"
                >
                  {generating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Content
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Generated Content</CardTitle>
                    <CardDescription>
                      Review, edit, and use your generated content
                    </CardDescription>
                  </div>
                  {generatedContent && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        <Edit className="h-3.5 w-3.5 mr-1" />
                        {isEditing ? "Preview" : "Edit"}
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleCopy}>
                        <Copy className="h-3.5 w-3.5 mr-1" />
                        Copy
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {generating ? (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin text-violet-500 mb-3" />
                    <p className="text-sm">Generating your content...</p>
                  </div>
                ) : generatedContent ? (
                  isEditing ? (
                    <Textarea
                      value={generatedContent}
                      onChange={(e) => setGeneratedContent(e.target.value)}
                      className="min-h-[300px] font-mono text-sm"
                    />
                  ) : (
                    <div className="rounded-lg bg-muted/50 p-4 min-h-[300px]">
                      <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                        {generatedContent}
                      </pre>
                    </div>
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                    <Sparkles className="h-8 w-8 mb-3 opacity-30" />
                    <p className="text-sm">
                      Generated content will appear here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Generation History</CardTitle>
              <CardDescription>
                Previously generated content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Prompt</TableHead>
                    <TableHead>Preview</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previousContent.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Badge variant="secondary">{item.type}</Badge>
                      </TableCell>
                      <TableCell>{item.platform}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {item.prompt}
                      </TableCell>
                      <TableCell className="max-w-[250px] truncate text-muted-foreground">
                        {item.preview}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.provider}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.date}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
