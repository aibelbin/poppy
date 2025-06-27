"use client";
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Mic, Settings, Home, User, Pill } from 'lucide-react';
import { Button } from "@/components/ui/button";

function Dashboard() {
  const [activeMenu, setActiveMenu] = React.useState("home");

  return (
    <div className='flex flex-col min-h-screen bg-white'>
      <header>
        <div className='text-7xl p-8 pl-17 text-black font-extrabold flex flex-row-reverse justify-center items-center absolute top-0 left-0'>
          <h1 className='font-mono text-shadow-lg/30 '>POPPY</h1>
          <div className='flex items-center justify-center '>
            <Mic size={50} className='text-red-500 animate-pulse' />
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <div className="w-64 absolute left-0 top-1/3 p-6 items-center hidden md:block justify-center">
          <Card className="w-full bg-white/90 backdrop-blur-sm border-blue-200 shadow-xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-sky-500 text-white text-center py-8">
              <CardTitle className="text-2xl font-semibold flex items-center justify-center gap-3">
                <User size={40} />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="flex flex-col">
                <Button
                  variant={activeMenu === "home" ? "default" : "ghost"}
                  className={`h-24 flex justify-center items-center rounded-none ${activeMenu === "home"
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "text-slate-700 hover:bg-blue-50"
                    }`}
                  onClick={() => setActiveMenu("home")}
                >
                  <Home style={{ width: '32px', height: '32px' }} />
                </Button>

                <Button
                  variant={activeMenu === "medicines" ? "default" : "ghost"}
                  className={`h-24 justify-center items-center rounded-none ${activeMenu === "medicines"
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "text-slate-700 hover:bg-blue-50"
                    }`}
                  onClick={() => setActiveMenu("medicines")}
                >
                  <Pill style={{ width: '32px', height: '32px' }} />
                </Button>

                <Button
                  variant={activeMenu === "settings" ? "default" : "ghost"}
                  className={`h-24 justify-center items-center rounded-none ${activeMenu === "settings"
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "text-slate-700 hover:bg-blue-50"
                    }`}
                  onClick={() => setActiveMenu("settings")}
                >
                  <Settings style={{ width: '32px', height: '32px' }} />
                </Button>
              </nav>
            </CardContent>
          </Card>
        </div>

        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
          <Card className="w-full bg-white/95 backdrop-blur-sm border-t-2 border-blue-200 shadow-2xl p-0">
            <CardContent className="p-0">
              <nav className="flex justify-around items-center py-4">
                <Button
                  variant="ghost"
                  className="flex-1 h-16 flex justify-center items-center bg-transparent hover:bg-transparent mx-1"
                  onClick={() => setActiveMenu("home")}
                >
                  <div className={`w-12 h-12 flex justify-center items-center rounded-full ${activeMenu === "home"
                    ? "bg-blue-500 text-white"
                    : "text-slate-700"
                    }`}>
                    <Home style={{ width: '24px', height: '24px' }} />
                  </div>
                </Button>

                <Button
                  variant="ghost"
                  className="flex-1 h-16 flex justify-center items-center bg-transparent hover:bg-transparent mx-1"
                  onClick={() => setActiveMenu("medicines")}
                >
                  <div className={`w-12 h-12 flex justify-center items-center rounded-full ${activeMenu === "medicines"
                    ? "bg-blue-500 text-white"
                    : "text-slate-700"
                    }`}>
                    <Pill style={{ width: '24px', height: '24px' }} />
                  </div>
                </Button>

                <Button
                  variant="ghost"
                  className="flex-1 h-16 flex justify-center items-center bg-transparent hover:bg-transparent mx-1"
                  onClick={() => setActiveMenu("settings")}
                >
                  <div className={`w-12 h-12 flex justify-center items-center rounded-full ${activeMenu === "settings"
                    ? "bg-blue-500 text-white"
                    : "text-slate-700"
                    }`}>
                    <Settings style={{ width: '24px', height: '24px' }} />
                  </div>
                </Button>
              </nav>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <div className="md:hidden pb-20"></div>
    </div>
  );
}

export default Dashboard;