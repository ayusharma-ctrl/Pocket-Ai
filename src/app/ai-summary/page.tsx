import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import ChatBox from '@/components/ChatBox';


const AiSummary = async () => {
  const session = await auth();
  if (!session?.user) redirect("/"); // prevent access to unauthenticated users
  
  return (
    <div className="min-h-[85vh] flex flex-col items-center mt-20 px-8 md:px-12 lg:px-16 xl:px-24">
      <div className='self-start mb-2'>
        <h1 className='text-lg font-semibold'>AI-Driven Event Summarizer</h1>
        <p className='text-sm font-normal my-0'>Generate concise summaries of lengthy artcles, reports, or discussions.</p>
      </div>
      <ChatBox email={session?.user?.email || ""}/>
    </div>
  )
}

export default AiSummary;