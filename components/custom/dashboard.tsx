"use client";
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Mic, Settings, Home, User, Pill } from 'lucide-react';
import { Button } from "@/components/ui/button";

function Dashboard() {
  const [activeMenu, setActiveMenu] = React.useState("home");

  return (
    <div className='flex flex-col'>
      <header>
        <div className='text-7xl p-8 pl-17 text-black font-extrabold flex flex-row-reverse justify-center items-center absolute top-0 left-0'>
          <h1 className='font-mono text-shadow-lg/30 '>POPPY</h1>
          <div className='flex items-center justify-center '>
            <Mic size={50} className='text-red-500 animate-pulse' />
          </div>
        </div>
      </header>
      <main>
        <div className="w-64 absolute left-0 top-1/3 p-6 items-center md:block hidden justify-center">
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
                  <Home style={{ width: '24px', height: '24px' }} />
                </Button>

                <Button
                  variant={activeMenu === "medicines" ? "default" : "ghost"}
                  className={`h-24 justify-center items-center rounded-none ${activeMenu === "medicines"
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "text-slate-700 hover:bg-blue-50"
                    }`}
                  onClick={() => setActiveMenu("medicines")}
                >
                  <Pill style={{ width: '24px', height: '24px' }} />
                </Button>

                <Button
                  variant={activeMenu === "settings" ? "default" : "ghost"}
                  className={`h-24 justify-center items-center rounded-none ${activeMenu === "settings"
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "text-slate-700 hover:bg-blue-50"
                    }`}
                  onClick={() => setActiveMenu("settings")}
                >
                  <Settings style={{ width: '24px', height: '24px' }} />
                </Button>
              </nav>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;