"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { MessageInterface } from '@/lib/utils';
import { getAiSummary, getSummaries, saveSummaries } from '@/actions/authActions';
import { toast } from 'sonner';

const ChatBox = ({ email }: { email: string }) => {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // state to store list of summaries/messages
    const [messages, setMessages] = useState<MessageInterface[]>([
        { text: 'Hello! How can I assist you today?', sender: 'ai' },
    ]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // method to get the list of previously generated summaries
    const fetchSummaries = async () => {
        try {
            if (email && email.length > 0) {
                setIsLoading(true);
                const summary: MessageInterface[] = await getSummaries(email);
                setIsLoading(false);
                if (summary && summary.length > 0) {
                    setMessages(summary);
                }
            }
        } catch (error) {
            console.log("Something went wrong", error);
            setIsLoading(false);
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
                // api call to get AI response
                const text = await getAiSummary(prompt);
                if (text) {
                    await saveSummaries(text, 'ai'); // save result to db
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { text: text, sender: 'ai' },
                    ]);
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
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        fetchSummaries();
    }, []);

    return (
        <>
            <div className='flex-grow max-h-[60vh] overflow-y-auto p-4 flex flex-col my-4 border-2 rounded-xl min-w-full'>
                {isLoading ? <h1>Loading...</h1> : messages.map((message, index) => (
                    <div
                        key={index}
                        className={`mb-2 p-2 rounded-lg max-w-[80%] ${message.sender === 'user'
                            ? 'bg-blue-500 text-white self-end'
                            : 'bg-gray-200 text-black self-start'
                            }`}
                    >
                        {message.text}
                        {message.sender === 'ai' && (
                            <div className='text-xs text-red-950 flex justify-end mt-2'>
                                AI generated
                            </div>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className='mt-auto min-w-full flex justify-center items-baseline gap-2 lg:gap-4'>
                <Input
                    className='border-black border-2 focus:border-0'
                    placeholder='Type your message to generate AI summary'
                    type='text'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <Button
                    disabled={(isLoading || input.trim().length === 0) ? true : false}
                    onClick={handleSend}
                >
                    {isLoading ? "Loading..." : "Generate"}
                </Button>
            </div>
        </>
    );
};

export default ChatBox;