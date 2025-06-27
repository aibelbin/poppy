import React from 'react'
import { Mic } from 'lucide-react'
function Dashboard() {
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gradient-to-r from-slate-200 via-slate-300 to-slate-400'>
        <div className='text-9xl text-black font-extrabold'>
          <h1 className='font-mono text-shadow-lg/30 '>POPPY</h1>
          <div className='flex items-center justify-center mt-4'>
            <Mic size={100} className='text-red-500 animate-pulse' />
          </div>
        </div>
    </div>
  )
}

export default Dashboard