"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Star, Zap } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 pb-16">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background -z-10" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <Badge className="w-fit bg-indigo-500/10 text-indigo-500 border-indigo-200/20 px-4 py-1.5 backdrop-blur-sm">
              <Zap className="w-3.5 h-3.5 mr-2 fill-indigo-500" />
              Professional Collaboration Platform
            </Badge>
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                <span className="block">Connect with</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                  Top Talent
                </span>
                <span className="block">for Your Projects</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
                SkillSync connects clients with skilled freelancers to bring
                your projects to life. Streamline collaboration, manage
                milestones, and deliver exceptional results.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-8 py-6 text-base shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all rounded-full"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-input hover:bg-accent font-medium px-8 py-6 text-base rounded-full"
              >
                View Demo
              </Button>
            </div>
            
            <div className="flex items-center gap-8 pt-8 border-t border-border/40">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-bold overflow-hidden"
                      style={{ backgroundImage: `url(https://i.pravatar.cc/100?img=${i + 10})`, backgroundSize: 'cover' }}
                    />
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-background bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    2k+
                  </div>
                </div>
                <div>
                  <div className="font-bold text-foreground">Active Users</div>
                  <div className="text-xs text-muted-foreground">Trusted by pros</div>
                </div>
              </div>
              <div className="w-px h-10 bg-border/60" />
              <div>
                <div className="flex items-center gap-1.5 font-bold text-foreground">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  4.9/5
                </div>
                <div className="text-xs text-muted-foreground">Platform Rating</div>
              </div>
            </div>
          </motion.div>

          {/* Mock Widget Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-red-500 to-violet-600 opacity-20 blur-2xl" />
            <div className="relative rounded-2xl border border-border/50 bg-background/60 backdrop-blur-xl p-8 shadow-2xl">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-600">
                        <Zap className="w-5 h-5" />
                     </div>
                     <div>
                        <h3 className="font-semibold text-lg text-foreground leading-none">
                            E-Commerce Redesign
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">Updated 2m ago</p>
                     </div>
                  </div>
                  <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-200/20 px-3 py-1">
                    In Progress
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/40">
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Budget</div>
                    <div className="text-xl font-bold text-foreground">$12,500</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Timeline</div>
                    <div className="text-xl font-bold text-foreground">6 weeks</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-muted-foreground">Sprint Progress</span>
                    <span className="text-indigo-600">67%</span>
                  </div>
                  <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "67%" }}
                        transition={{ duration: 1.5, delay: 0.8 }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" 
                    />
                  </div>
                </div>
                
                <div className="space-y-3 pt-2"> 
                    {[
                        { text: "Homepage Mockups Approved", done: true },
                        { text: "Database Schema Designed", done: true },
                        { text: "Payment Gateway Integration", done: false }
                    ].map((task, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${task.done ? "bg-indigo-500 border-indigo-500 text-white" : "border-muted-foreground/30 text-transparent"}`}>
                                <CheckCircle2 className="w-3 h-3" />
                            </div>
                            <span className={task.done ? "text-foreground" : "text-muted-foreground"}>{task.text}</span>
                        </div>
                    ))}
                </div>

                <div className="pt-4">
                  <Button
                    size="lg"
                    className="w-full bg-foreground text-background hover:bg-foreground/90 font-medium py-6 rounded-xl"
                  >
                    View Project Details
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-border/50 z-20"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-sm font-bold">Payment Released</div>
                        <div className="text-xs text-muted-foreground">$2,500 to Alex</div>
                    </div>
                </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
