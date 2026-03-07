"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Zap, Sparkles, Calendar, DollarSign, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function LandingPage() {
  const { isAuthenticated, hydrate } = useAuth();
  const router = useRouter();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard/overview");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950">
      <header className="container mx-auto flex items-center justify-between p-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white">AutoContent Engine</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/10">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 pt-20 pb-32 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300 mb-8">
          <Sparkles className="h-4 w-4" />
          AI-Powered Content Automation
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight max-w-4xl mx-auto">
          Create, Schedule &{" "}
          <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Monetize
          </span>{" "}
          Your Content
        </h1>

        <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          The all-in-one SaaS platform for automated content generation, scheduling,
          and monetization across all your social media platforms. Powered by AI.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <Link href="/register">
            <Button
              size="lg"
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white h-12 px-8 text-base border-0"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 text-base border-slate-700 text-slate-300 hover:text-white hover:bg-white/5"
            >
              Sign In
            </Button>
          </Link>
        </div>

        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-left">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-500/10">
              <Sparkles className="h-6 w-6 text-violet-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">
              AI Content Generation
            </h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Generate captions, threads, scripts, and more using OpenAI and Claude.
              Tailored for every platform.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-left">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/10">
              <Calendar className="h-6 w-6 text-indigo-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">
              Smart Scheduling
            </h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Schedule content across platforms with an intelligent calendar.
              Never miss the perfect posting time.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-left">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10">
              <DollarSign className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">
              Monetization Tools
            </h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Track affiliate links, manage revenue streams, and maximize your
              content&apos;s earning potential.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800 py-8">
        <p className="text-center text-sm text-slate-500">
          &copy; 2024 AutoContent Engine. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
