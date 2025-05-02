'use client';

import { useActionState } from 'react';
import { registerUser } from '@/app/lib/actions';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/ui/button';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function SignupForm() {
  const router = useRouter();

  const [error, formAction, isPending] = useActionState(
    async (_prevState: string | undefined, formData: FormData) => {
      const err = await registerUser(undefined, formData);
      if (!err) {
        router.push('/login'); // redirect only on success
      }
      return err; // error string or undefined
    },
    undefined
  );

  return (
    <form action={formAction} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold">Create Account</h2>

      <label className="block text-sm">
        <span>Name</span>
        <input name="name" type="text" required className="mt-1 block w-full rounded-md border" />
      </label>

      <label className="block text-sm">
        <span>Email</span>
        <input name="email" type="email" required className="mt-1 block w-full rounded-md border" />
      </label>

      <label className="block text-sm">
        <span>Password</span>
        <input name="password" type="password" minLength={6} required className="mt-1 block w-full rounded-md border" />
      </label>

      <Button disabled={isPending} className="w-full">
        {isPending ? 'Signing up…' : 'Sign Up'}
      </Button>

      {error && (
        <p className="mt-2 flex items-center text-sm text-red-600">
          <ExclamationCircleIcon className="mr-1 h-5 w-5" />
          {error}
        </p>
      )}
    </form>
  );
}
