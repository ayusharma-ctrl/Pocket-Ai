"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import Image from 'next/image'
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { signInWithGoogle, signOutWithGoogle, getSession } from '@/actions/authActions';
import { UserInterface } from '@/lib/utils';
import { toast } from 'sonner';


const Navbar = () => {
    const [user, setUser] = useState<UserInterface | null>(null);

    const router = useRouter();

    // method to get the user data from session
    const getUserDetails = async() => {
        const user = await getSession();
        if (user) {
            setUser({
                name: user.name,
                email: user.email,
                image: user.image
            });
        }
    }

    // method to signin
    const login = async() => {
        await signInWithGoogle();
        toast.success("Welcome back!");
    }

    // method to signout
    const logout = async() => {
        await signOutWithGoogle();
        toast.success("Signout Successfully!");
        setUser(null);
    }

    useEffect(() => {
        getUserDetails();
    }, []);

    return (
        <div className='fixed top-0 w-full z-10 shadow-md backdrop-blur-md py-2 px-4 lg:px-8 border-b-[1px]'>
            <div className='flex flex-row items-center justify-between gap-2 md:gap-0'>
                <Image
                    onClick={() => router.push('/')}
                    className="block cursor-pointer rounded-full object-cover"
                    src="/images/logo.svg"
                    height={40}
                    width={50}
                    alt="Logo"
                    loading='lazy'
                />
                <div className='flex justify-evenly items-center gap-2 lg:gap-4'>
                    <h1 className='text-sm italic'>{user ? user.name.split(' ')[0] : "Try Now..."}</h1>
                    {
                        user && 
                        <Avatar className='border-red-300 border-2'>
                            <AvatarImage src={user.image} alt='user' />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    }
                    <form action={user ? logout : login}>
                        <Button
                            size={'sm'}
                            className='text-xs xl:text-sm'
                            type='submit'
                            aria-label="login-logout"
                        >
                            {user ? "Logout" : "Login"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Navbar