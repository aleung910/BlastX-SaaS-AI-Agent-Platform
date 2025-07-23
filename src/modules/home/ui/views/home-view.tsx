"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Video, 
  Plus, 
  User, 
  ArrowRight,
  Sparkles
} from 'lucide-react';


export const HomeView = () =>{
  return(
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
       <div className="absolute flex items-center justify-center opacity-[0.20] pointer-events-none">
          <img 
            src="/logo_2.svg" 
            alt="" 
            className="w-full h-full object-cover min-w-[1400px] min-h-[1400px]" 
          />
        </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center mb-16">
          {/* <div className="flex items-center justify-center gap-2 mb-6">
            <img src="/logo.svg" alt="BlastX" className="h-18" />
          </div> */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            BlastX, Your Personal AI Assistant Platform
          </h1>
        </div>

        {/* Main Content Card */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-8 md:p-12">
            <div className="space-y-8">
              {/* Introduction */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
                  Create. Customize. Connect.
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
                  Welcome to BlastX, where you can create your own specialized AI agents and have meaningful conversations with them. 
                  Design custom AI assistants tailored to your specific needs, give them detailed instructions and expertise, 
                  then schedule video meetings to get personalized help whenever you need it.
                </p>
              </div>

              {/* Process Steps */}
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                {/* Step 1 */}
                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                  <div className="w-12 h-12 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Create Your Agent</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Build a custom AI agent from scratch. Give it a name, personality, and specific expertise. 
                    Define what topics it should specialize in and how it should communicate with you.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                  <div className="w-12 h-12 bg-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Customize Instructions</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Provide detailed instructions about your agent's role, knowledge areas, and communication style. 
                    The more specific you are, the better your agent will assist you.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                  <div className="w-12 h-12 bg-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Schedule Meetings</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Create new meetings and assign your custom agent to help with specific topics. 
                    Have real-time video conversations and get the personalized assistance you need.
                  </p>
                </div>
              </div>

              {/* Call to Action */}
              <div className="text-center pt-8 border-t border-gray-200">
                <p className="text-gray-600 mb-6">
                  Whether you need a business consultant, health advisor, coding mentor, or creative collaborator - 
                  create the perfect AI agent for your unique requirements.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                    <Plus className="w-5 h-5 mr-2" />
                    Create Your First Agent
                  </Button>
                  <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                    <Video className="w-5 h-5 mr-2" />
                    Start a Meeting
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>Empowering personalized AI conversations • Built for meaningful connections</p>
        </div>
      </div>
    </div>
  );
}
