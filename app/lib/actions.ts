'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import bcrypt from 'bcryptjs';
import postgres from 'postgres';


// ...
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
export async function registerUser(
    state: string | undefined,
    formData: FormData
): Promise<string | undefined> {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
        const res = await fetch('./app/api/register', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
            const data = await res.json();
            return data?.error || 'Registration failed.';
        }

        return undefined; // Success = no error
    } catch (err) {
        console.error('Error during registration:', err);
        return 'Something went wrong.';
    }
}




export async function authenticate(
    state: string | undefined,
    formData: FormData,
): Promise<string | undefined> {
    try {
        await signIn('credentials', formData);
        return undefined; // success
    } catch (error) {
        if (error instanceof AuthError) {
            // Use error.message or just catch all
            return 'Invalid credentials.';
        }
        return 'Something went wrong.';
    }
}