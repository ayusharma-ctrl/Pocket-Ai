"use client";
import { useEffect, useState } from 'react';
import { extractYouTubeID, ISavedYoutubeSummary } from '@/lib/utils';
import { generateSummaryService, getYoutubeSummaries } from '@/actions/youSummaryActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import YouTubePlayer from './common/YouTubePlayer';

const YoutubeSummary = ({ email }: { email: string }): JSX.Element => {
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [summaries, setSummaries] = useState<ISavedYoutubeSummary[]>();
    const [url, setUrl] = useState<string>('');
    const [aiSummary, setAiSummary] = useState<string>('');
    const [transcript, setTranscript] = useState<string>('');

    // handle update url
    const handleUrlChange = (text: string) => {
        if (url && url.length > 0) {
            setAiSummary('');
            setTranscript('');
        }
        setUrl(text);
    }

    // generate and save youtube video summary
    const handleGenerate = async () => {
        try {
            // youtube video link validation
            if (url && url.length > 0) {
                const processedVideoId = extractYouTubeID(url);
                if (!processedVideoId) {
                    return toast.error("Invalid youtube video id");
                }

                setIsLoading(true);

                // call server action method to get the response
                const data = await generateSummaryService(url);
                if (data && data.summary) setAiSummary(data.summary);
                if (data && data.transcript) setTranscript(data.transcript);

                // here we have the video url, transcript and ai summary - call async method to save to it database to maintain history

                setIsLoading(false);
            }
        } catch (err) {
            setIsLoading(false);
            toast.error("Something went wrong");
            console.log(err);
        }
    }

    // fetching previously generated histories
    const fetchHistory = async () => {
        try {
            if (email) {
                setIsFetching(true);
                const savedSummaries = await getYoutubeSummaries(email, 1);
                if (savedSummaries?.data && savedSummaries.data?.length > 0) {
                    setSummaries(savedSummaries.data);
                }
                setIsFetching(false);
            }
        } catch (err) {
            setIsFetching(false);
            console.log(err);
        }
    }

    useEffect(() => {
        // fetchHistory();
    }, []);

    return (
        <>
            {/* <div className='text-xs lg:text-sm lg:px-2'>
                {isFetching ? <div className='text-xs'><FontAwesomeIcon icon={faSpinner} size="1x" spin /> <span>Loading saved summaries</span></div> :
                    (summaries && summaries?.length > 0) ? summaries.map((summary, idx) => <h1 key={idx}>{summary.title}</h1>) :
                        "No data found"
                }
            </div> */}
            <div className='lg:p-4 w-full'>
                <div className='flex items-center justify-center gap-2'>
                    <Input
                        type="text"
                        placeholder="Paste a link and click search icon"
                        className='max-w-[90%] text-xs lg:text-sm rounded-2xl border-none outline-2 outline outline-black ml-4 text-blue-600'
                        value={url}
                        onChange={(e) => handleUrlChange(e.target.value)}
                    />
                    <Button onClick={handleGenerate} size={'icon'} variant={'ghost'} aria-label="search">
                        <FontAwesomeIcon icon={faSearch} size="2x" />
                    </Button>
                </div>
                <div className='w-full my-8'>
                    {
                        url && !isLoading && transcript && aiSummary &&
                        <div className='flex justify-center'>
                            <YouTubePlayer videoUrl={url} />
                        </div>
                    }
                    {isLoading && "Generating Summary"}
                    {aiSummary?.length > 0 && <p className='my-4'> <b>AI Summary:</b> {aiSummary}</p>}
                    {transcript?.length > 0 && <p className='my-4'> <b>Transcript:</b> {transcript}</p>}
                </div>
            </div>
        </>
    )
}

export default YoutubeSummary