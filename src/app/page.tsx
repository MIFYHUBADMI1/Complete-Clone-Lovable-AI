"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Sparkles, Code, Rocket, Zap } from "lucide-react";

export default function Home() {
  const [value, setValue] = useState<string>("");
  const router = useRouter();
  const trpc = useTRPC();

  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onError: (error) => {
        console.error("Project creation error:", error);
      },
      onSuccess: (data) => {
        router.push(`/projects/${data.id}`);
      },
    })
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium animate-fade-in">
            <Sparkles className="w-4 h-4" />
            AI-Powered Code Generation
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight animate-slide-up">
            Build Apps with
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
              {" "}AI Magic
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-slide-up animation-delay-200">
            Describe your idea in plain English, and watch our AI transform it into a fully functional application in seconds.
          </p>

          {/* Input Section */}
          <div className="max-w-2xl mx-auto space-y-4 animate-slide-up animation-delay-400">
            <div className="relative">
              <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="E.g., Build me a todo app with dark mode and categories..."
                className="w-full h-16 text-lg px-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-400 shadow-lg"
                disabled={createProject.isPending}
              />
            </div>
            
            <Button
              onClick={() => value.trim() && createProject.mutate({ value })}
              disabled={createProject.isPending || !value.trim()}
              className="w-full h-16 text-lg font-semibold rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 dark:from-purple-500 dark:to-blue-500 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              {createProject.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Your Project...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Rocket className="w-5 h-5" />
                  Generate My App
                </div>
              )}
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-16 animate-fade-in animation-delay-600">
            <div className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">AI-Powered</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Advanced AI understands your requirements and generates production-ready code
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 mx-auto">
                <Code className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Live Preview</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                See your app running in a live sandbox environment instantly
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 mx-auto">
                <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Lightning Fast</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                From idea to working prototype in seconds, not hours or days
              </p>
            </div>
          </div>

          {/* How It Works */}
          <div className="mt-20 animate-fade-in animation-delay-800">
            <h2 className="text-3xl font-bold mb-8">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <h3 className="font-semibold text-lg">Describe Your Idea</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Type what you want to build in plain English. Be as detailed or simple as you like.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <h3 className="font-semibold text-lg">AI Generates Code</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Our AI analyzes your requirements and writes clean, production-ready code.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <h3 className="font-semibold text-lg">View & Deploy</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  See your app running live, make changes, and deploy when ready.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .animation-delay-800 {
          animation-delay: 0.8s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
}
