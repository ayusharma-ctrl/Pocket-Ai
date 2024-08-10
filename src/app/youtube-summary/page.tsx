import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import YoutubeSummary from '@/components/YoutubeSummary';

const YouSummary = async () => {
    const session = await auth();
    if (!session?.user) redirect("/"); // prevent access to unauthenticated users

    return (
        // grid-rows-[0.2fr,auto] lg:grid-cols-[0.2fr,auto]
        <div className="min-h-[85vh] mt-20">
            <div className='self-start mb-2 px-16'>
                <h1 className='text-lg font-semibold'>AI-Driven Youtube video Transpiler & Summarizer</h1>
                <p className='text-sm font-normal my-0'>Generate concise summaries and transcripts of lengthy youtube videos.</p>
            </div>
            <div className='grid text-xs lg:text-base px-2'>
                <YoutubeSummary email={session?.user?.email || ""} />
            </div>
        </div>
    )
}

export default YouSummary;