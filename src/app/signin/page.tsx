'use client'

import { PixelButton } from '@/components/PixelButton';
import { signin } from '@/lib/user';
import { useState } from 'react';

export default function SigninPage() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);

    const [msg, setMsg] = useState('');

    const handleSignin = (e: React.FormEvent) => {
        e.preventDefault();

        if(username.length < 1) return setMsg('username cannot be empty')
        if(password.length < 9) return setMsg('password cannot be less than 9')
        
        signin(username, password, remember).then(v => {
            if(v.message) setMsg(v.message)
            if(v.message == 'User logged in successfully!'){
                location.href = '/'
            }
        })
    };

    return (
        <div className="flex mt-8 items-center justify-center px-4 py-12">
            <div className="w-full max-w-md space-y-8 rounded-1xl border p-8 shadow-sm border-zinc-800 bg-zinc-900">

                {/* Header */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-white">
                        Welcome
                    </h2>
                    <p className="mt-3 text-sm text-zinc-400">
                        Sign-in to your account
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSignin} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-zinc-300">
                                Username
                            </label>
                            <input
                                type="text"
                                required
                                className="mt-1 block w-full rounded-lg border px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm border-zinc-700 bg-zinc-800 text-white"
                                placeholder="vinconium"
                                value={username}
                                onInput={e => setUsername((e.target as HTMLInputElement).value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                className="mt-1 block w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm border-zinc-700 bg-zinc-800 text-white"
                                placeholder="••••••••"
                                value={password}
                                onInput={e => setPassword((e.target as HTMLInputElement).value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                checked={remember}
                                onChange={e => setRemember((e.target as HTMLInputElement).checked)}
                            />
                            <label htmlFor="remember" className="ml-2 block text-sm text-zinc-300">
                                Remember
                            </label>
                        </div>
                    </div>

                    <p className='block text-sm font-small text-red-500'>{msg}</p>

                    <PixelButton type='submit' variant="neon" className="px-4 py-2 whitespace-nowrap text-[8px] sm:text-[10px] w-full">
                        SIGN IN
                    </PixelButton>
                </form>

                {/* Footer */}
                <p className="text-center text-sm text-zinc-500">
                    Don't have account yet?{' '}
                    <a href="/signup" className="font-semibold text-neon-green">
                        Sign Up
                    </a>
                </p>
            </div>
        </div>
    );
}