// app/ui/signup-form.tsx
'use client';

import { lusitana } from '@/app/ui/fonts';
import { AtSymbolIcon, KeyIcon, ExclamationCircleIcon, UserCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';
import { useFormState, useFormStatus } from 'react-dom';
import { signUp } from '@/app/lib/actions';
import { useEffect, useState } from 'react';
import { debounce } from 'lodash';

export function SignupForm() {
    const [state, formAction] = useFormState(signUp, null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);

    // Debounced email check
    const checkEmail = debounce(async (email: string) => {
        if (email) {
            setIsCheckingEmail(true);
            try {
                const res = await fetch('/api/check-email', {
                    method: 'POST',
                    body: JSON.stringify({ email }),
                });
                const { exists } = await res.json();
                setEmailError(exists ? 'Email already registered' : '');
            } catch (error) {
                setEmailError('Error checking email');
            }
            setIsCheckingEmail(false);
        }
    }, 500);

    useEffect(() => {
        if (email.includes('@')) {
            checkEmail(email);
        }
        return () => checkEmail.cancel();
    }, [email]);

    const validatePasswords = () => {
        if (password && confirmPassword && password !== confirmPassword) {
            setPasswordError('Passwords do not match');
        } else {
            setPasswordError('');
        }
    };

    useEffect(() => {
        validatePasswords();
    }, [password, confirmPassword]);

    return (
        <form action={formAction} className="space-y-3">
            <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
                <h1 className={`${lusitana.className} mb-3 text-2xl`}>
                    Create a new account
                </h1>
                <div className="w-full space-y-4">
                    {/* Name Field */}
                    <div>
                        <label className="mb-3 block text-xs font-medium text-gray-900" htmlFor="name">
                            Name *
                        </label>
                        <div className="relative">
                            <input
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                id="name"
                                type="text"
                                name="name"
                                placeholder="Enter your name"
                                required
                            />
                            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="mb-3 block text-xs font-medium text-gray-900" htmlFor="email">
                            Email *
                        </label>
                        <div className="relative">
                            <input
                                className={`peer block w-full rounded-md border py-[9px] pl-10 text-sm outline-2 ${emailError ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                            {isCheckingEmail && (
                                <ArrowPathIcon className="animate-spin absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                            )}
                        </div>
                        {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
                    </div>

                    {/* Password Fields */}
                    <div className="space-y-4">
                        <div>
                            <label className="mb-3 block text-xs font-medium text-gray-900" htmlFor="password">
                                Password *
                            </label>
                            <div className="relative">
                                <input
                                    className={`peer block w-full rounded-md border py-[9px] pl-10 text-sm outline-2 ${passwordError ? 'border-red-500' : 'border-gray-200'
                                        }`}
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="Enter password (min 6 characters)"
                                    required
                                    minLength={6}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                            </div>
                        </div>

                        <div>
                            <label className="mb-3 block text-xs font-medium text-gray-900" htmlFor="confirmPassword">
                                Confirm Password *
                            </label>
                            <div className="relative">
                                <input
                                    className={`peer block w-full rounded-md border py-[9px] pl-10 text-sm outline-2 ${passwordError ? 'border-red-500' : 'border-gray-200'
                                        }`}
                                    id="confirmPassword"
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm password"
                                    required
                                    minLength={6}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                            </div>
                            {passwordError && <p className="text-xs text-red-500 mt-1">{passwordError}</p>}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <SignupButton />

                    {/* Error Messages */}
                    <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
                        {state && (
                            <>
                                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                                <p className="text-sm text-red-500">{state}</p>
                            </>
                        )}
                    </div>

                    {/* Login Link */}
                    <p className="text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <a href="/login" className="font-semibold text-blue-600 hover:underline">
                            Log in here
                        </a>
                    </p>
                </div>
            </div>
        </form>
    );
}

function SignupButton() {
    const { pending } = useFormStatus();

    return (
        <Button
            className="mt-4 w-full flex items-center justify-center gap-2"
            aria-disabled={pending}
            disabled={pending}
        >
            {pending ? (
                <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
                <>
                    <span>Sign Up</span>
                    <ArrowRightIcon className="h-5 w-5 text-white" />
                </>
            )}
        </Button>
    );
}