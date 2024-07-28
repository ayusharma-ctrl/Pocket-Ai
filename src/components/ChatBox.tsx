"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { MessageInterface } from '@/lib/utils';
import { getAiSummary, getSummaries, saveSummaries } from '@/actions/authActions';
import { toast } from 'sonner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faPlay } from "@fortawesome/free-solid-svg-icons";
import { useIntersectionObserver } from '@/hooks/useIntersection';
import MessageBox from './common/MessageBox';
import Loader from './common/Loader';
import ScrollToBottom from './common/ScrollToBottom';

const ChatBox = ({ email }: { email: string }): JSX.Element => {
    const [isLoading, setIsLoading] = useState<boolean>(false); //loading state
    const [isFetching, setIsFetching] = useState<boolean>(false); //data fetching state
    const [noMoreData, setNoMoreData] = useState<boolean>(false); // prevent unnecessary api calls
    const [input, setInput] = useState<string>(''); //user input
    const [responseStream, setResponseStream] = useState<string>(''); //store most recent ai response for streamline effect
    const [page, setPage] = useState<number>(1);

    const [messages, setMessages] = useState<MessageInterface[]>([
        { text: 'Hello! How can I assist you today?', sender: 'ai' },
    ]); //state to store list of summaries/messages

    const messagesStartRef = useRef<HTMLDivElement>(null); // ref used for infinite scroll effect

    const messagesEndRef = useRef<HTMLDivElement>(null); // ref used for scroll to bottom

    //using custom hook to check div is in viewport
    const isAtTop = useIntersectionObserver(messagesStartRef, false);
    const isVisible = useIntersectionObserver(messagesEndRef, true);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // method to get the list of previously generated summaries only if we know data does exist
    const fetchSummaries = async () => {
        try {
            if (email && email.length > 0 && !noMoreData) {
                setIsLoading(true);
                if (messages.length >= 4) setIsFetching(true);
                const summary: MessageInterface[] = await getSummaries(email, page);
                setIsLoading(false);
                setIsFetching(false);
                if (summary && summary.length > 0) {
                    if (messages.length > 1) {
                        setMessages(prevMessages => [...summary, ...prevMessages]);
                    } else {
                        setMessages(summary);
                    }
                } else {
                    setNoMoreData(true); // no more data exist in db
                }
            }
        } catch (error) {
            console.log("Something went wrong", error);
            setIsLoading(false);
            setIsFetching(false);
            toast.error("Something went wrong!");
        }
    }

    // method to generate a new AI summary
    const handleSend = async () => {
        try {
            // validation
            if (input.trim() !== '') {
                setMessages([...messages, { text: input, sender: 'user' }]);
                setIsLoading(true);
                await saveSummaries(input, 'user'); // save input to db
                const prompt = "Please summarise this document." + input;
                const text = await getAiSummary(prompt); // api call to get AI response
                if (text) {
                    await saveSummaries(text, 'ai'); // save result to db
                    //update responseStream string at a fixed interval for streamline effect - logic - if we have responseStream - render it on UI
                    let index = -1;
                    const interval = setInterval(() => { // adding each letter of ai response one by one
                        setResponseStream((prev) => prev + text[index]);
                        index++;
                        // once we are at the last index - clear the interval and update the message state - render response from message state
                        if (index === text.length) {
                            clearInterval(interval);
                            setResponseStream('');
                            setMessages((prevMessages) => [
                                ...prevMessages,
                                { text: text, sender: 'ai' },
                            ]);
                        }
                    }, 25);
                }
                setIsLoading(false);
                setInput('');
                toast.success("Success!");
            }
        } catch (error) {
            setIsLoading(false);
            console.log("Something went wrong", error);
            toast.error("Something went wrong!");
        }
    };

    useEffect(() => {
        fetchSummaries();
    }, [page]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isAtTop && messages.length >= 4) {
            setPage((prev) => prev + 1);
        }
    }, [isAtTop]);

    return (
        <>
            {/* Conversation Component */}
            <div className={`flex-grow max-h-[64vh] overflow-y-auto p-4 flex flex-col my-2 border-2
                ${messages.length === 1 && "justify-end"} border-teal-950 rounded-2xl min-w-full bg-teal-800`}>

                <div className='my-24' ref={messagesStartRef} />

                {/* show loader */}
                {isFetching && <Loader message='Fetching previous summaries' />}

                {messages.length >= 4 &&
                    <h1 className='self-center text-white my-6'>
                        {noMoreData ? "No more data" : "Scroll up to see older messages..."}
                    </h1>
                }

                {/* display previous conversations */}
                {messages && messages.length > 0 && messages.map((message, index) => (
                    <MessageBox key={index} message={message.text} sender={message.sender} />
                ))}

                {/* streamline AI response */}
                {responseStream && responseStream.length > 0 && (
                    <MessageBox message={responseStream} sender='ai' />
                )}

                {/* show loader */}
                {isLoading && <Loader message='Loading' />}

                {/* div to implement auto-scroll */}
                <div ref={messagesEndRef} />

            </div>

            {/* button to scroll - render if latest message is not visible on UI */}
            {!isVisible && <ScrollToBottom scrollToBottom={scrollToBottom} />}

            {/* Input box and button */}
            <div className='mt-auto min-w-full flex justify-center items-center gap-2 lg:gap-4'>
                <Input
                    className='border-black border-2 focus:border-0'
                    placeholder='Type your message. Press enter or click button to generate AI Summary'
                    type='text'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        // check if the Enter key was pressed
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                />
                <Button
                    disabled={(isLoading || input.trim().length === 0) ? true : false}
                    onClick={handleSend}
                    size={'icon'}
                >
                    {isLoading ? <FontAwesomeIcon icon={faSpinner} size="1x" spin /> : <FontAwesomeIcon icon={faPlay} size="1x" />}
                </Button>
            </div>
        </>
    );
};

export default ChatBox;