import Link from 'next/link';
import { SignupForm } from '../ui/signup/signup-form';

export default function SignupPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg">
                <h1 className="text-center text-3xl font-bold text-gray-900">
                    Create an Account
                </h1>

                <SignupForm />

                <p className="text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link
                        href="/login"
                        className="font-medium text-blue-600 hover:underline"
                    >
                        Log in here
                    </Link>
                </p>
            </div>
        </div>
    );
}