import React from 'react'
import { Mic } from 'lucide-react'
function Dashboard() {
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gradient-to-r from-slate-200 via-slate-300 to-slate-400'>
      <header>
    <div className='text-7xl p-8 pl-17 text-black font-extrabold flex flex-row-reverse justify-center items-center absolute top-0 left-0'>
          <h1 className='font-mono text-shadow-lg/30 '>POPPY</h1>
             <div className='flex items-center justify-center '>
            <Mic size={50} className='text-red-500 animate-pulse' />
        </div>
        </div>
      </header>
      <main>
        <div className='flex rounded-full flex-col items-center justify-center '>
          <h2 className='text-4xl font-bold text-gray-800 mb-4'>Welcome to Poppy</h2>
          <p className='text-lg text-gray-600'>Your AI-powered assistant for all your needs.</p>
        </div>
      </main>
    </div>
  )
}

export default Dashboard