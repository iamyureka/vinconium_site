'use client'

import { PixelButton } from '@/components/PixelButton';
import { signup } from '@/lib/user';
import { useState } from 'react';

export default function SignupPage() {

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    const [msg, setMsg] = useState('');

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();

        if(name.length < 1) return setMsg('name cannot be empty')
        if(username.length < 1) return setMsg('username cannot be empty')
        if(password.length < 9) return setMsg('password must be at least 9 characters')
        if(password !== repeatPassword) return setMsg('passwords do not match')

        signup(username, name, password).then(v => {
            if(v.message) setMsg(v.message)
            if(v.message == 'User registered successfully!'){
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
                        Sign-up to your account
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSignup} className="mt-8 space-y-6">
                    <div className="space-y-4">

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-zinc-300">
                                Name
                            </label>
                            <input
                                type="text"
                                className="mt-1 block w-full rounded-lg border px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm border-zinc-700 bg-zinc-800 text-white"
                                placeholder="Vinco Dev"
                                value={name}
                                onInput={e => setName((e.target as HTMLInputElement).value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-zinc-300">
                                Username
                            </label>
                            <input
                                type="text"
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
                                className="mt-1 block w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm border-zinc-700 bg-zinc-800 text-white"
                                placeholder="••••••••"
                                value={password}
                                onInput={e => setPassword((e.target as HTMLInputElement).value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="repeat-password" className="block text-sm font-medium text-zinc-300">
                                Repeat Password
                            </label>
                            <input
                                type="password"
                                className="mt-1 block w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm border-zinc-700 bg-zinc-800 text-white"
                                placeholder="••••••••"
                                value={repeatPassword}
                                onInput={e => setRepeatPassword((e.target as HTMLInputElement).value)}
                            />
                        </div>
                    </div>

                    <p className='block text-sm font-small text-red-500'>{msg}</p>

                    <PixelButton type='submit' variant="neon" className="px-4 py-2 whitespace-nowrap text-[8px] sm:text-[10px] w-full">
                        SIGN UP
                    </PixelButton>
                </form>

                {/* Footer */}
                <p className="text-center text-sm text-zinc-500">
                    already have an account?{' '}
                    <a href="/signin" className="font-semibold text-neon-green">
                        Sign In
                    </a>
                </p>
            </div>
        </div>
    );
}