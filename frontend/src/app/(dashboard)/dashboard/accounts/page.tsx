"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  Check,
  Unplug,
  ExternalLink,
  Users,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SocialAccount {
  id: string;
  platform: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  connected: boolean;
  username?: string;
  followers?: string;
  posts?: number;
  lastSync?: string;
}

const initialAccounts: SocialAccount[] = [
  {
    id: "instagram",
    platform: "Instagram",
    icon: Instagram,
    color: "text-pink-600",
    bgColor: "bg-gradient-to-br from-pink-500 to-purple-600",
    connected: true,
    username: "@autocontent.engine",
    followers: "24.5K",
    posts: 342,
    lastSync: "2 minutes ago",
  },
  {
    id: "facebook",
    platform: "Facebook",
    icon: Facebook,
    color: "text-blue-600",
    bgColor: "bg-blue-600",
    connected: true,
    username: "AutoContent Engine",
    followers: "18.2K",
    posts: 156,
    lastSync: "5 minutes ago",
  },
  {
    id: "twitter",
    platform: "X / Twitter",
    icon: Twitter,
    color: "text-sky-500",
    bgColor: "bg-slate-900",
    connected: false,
  },
  {
    id: "youtube",
    platform: "YouTube",
    icon: Youtube,
    color: "text-red-600",
    bgColor: "bg-red-600",
    connected: true,
    username: "AutoContent Engine",
    followers: "12.8K",
    posts: 87,
    lastSync: "10 minutes ago",
  },
];

export default function AccountsPage() {
  const [accounts, setAccounts] = useState(initialAccounts);

  const handleConnect = (id: string) => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === id
          ? {
              ...acc,
              connected: true,
              username: `@${id}_user`,
              followers: "0",
              posts: 0,
              lastSync: "Just now",
            }
          : acc
      )
    );
    toast.success("Account connected successfully!");
  };

  const handleDisconnect = (id: string) => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === id
          ? {
              ...acc,
              connected: false,
              username: undefined,
              followers: undefined,
              posts: undefined,
              lastSync: undefined,
            }
          : acc
      )
    );
    toast.success("Account disconnected");
  };

  const connectedAccounts = accounts.filter((a) => a.connected);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {accounts.map((account) => (
          <Card
            key={account.id}
            className={`relative overflow-hidden ${
              account.connected ? "" : "opacity-75"
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${account.bgColor} text-white`}
                >
                  <account.icon className="h-6 w-6" />
                </div>
                {account.connected && (
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                    <Check className="h-3 w-3 mr-1" />
                    Connected
                  </Badge>
                )}
              </div>

              <div className="mt-4">
                <h3 className="font-semibold">{account.platform}</h3>
                {account.connected ? (
                  <div className="mt-2 space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {account.username}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {account.followers}
                      </span>
                      <span className="flex items-center gap-1">
                        <BarChart3 className="h-3 w-3" />
                        {account.posts} posts
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Last sync: {account.lastSync}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDisconnect(account.id)}
                    >
                      <Unplug className="h-3.5 w-3.5 mr-1.5" />
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground mb-3">
                      Not connected
                    </p>
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0"
                      onClick={() => handleConnect(account.id)}
                    >
                      <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                      Connect
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {connectedAccounts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Connected Accounts</CardTitle>
            <CardDescription>
              Detailed view of your connected social accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Platform</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Followers</TableHead>
                  <TableHead>Posts</TableHead>
                  <TableHead>Last Sync</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {connectedAccounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <account.icon
                          className={`h-4 w-4 ${account.color}`}
                        />
                        <span className="font-medium">{account.platform}</span>
                      </div>
                    </TableCell>
                    <TableCell>{account.username}</TableCell>
                    <TableCell>{account.followers}</TableCell>
                    <TableCell>{account.posts}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {account.lastSync}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                        Active
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
