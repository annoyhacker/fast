// app/ui/signup/signup-form.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './button';
import { checkEmailExists, registerUser } from '../../lib/auth';

export function SignupForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [serverError, setServerError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }

        // Check email availability on blur
        if (name === 'email' && e.type === 'blur') {
            if (!value.trim()) return;

            try {
                const exists = await checkEmailExists(value);
                if (exists) {
                    setErrors(prev => ({
                        ...prev,
                        email: 'Email is already registered'
                    }));
                }
            } catch (error) {
                console.error('Email check error:', error);
            }
        }
    };

    const validateForm = async () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm Password is required';
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        // Check email existence before submission
        if (formData.email.trim()) {
            try {
                const exists = await checkEmailExists(formData.email);
                if (exists) {
                    newErrors.email = 'Email is already registered';
                }
            } catch (error) {
                console.error('Email check error:', error);
                newErrors.email = 'Error checking email availability';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError('');
        setIsSubmitting(true);

        try {
            const isValid = await validateForm();
            if (!isValid) return;

            await registerUser({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });

            // Redirect to login page with success message
            router.push('/login?signup=success');
        } catch (error) {
            console.error('Signup error:', error);
            setServerError(
                error instanceof Error ? error.message : 'An unexpected error occurred'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div>
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleInputChange}
                    className="w-full p-2 border rounded"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div>
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            <div>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                />
                {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                )}
            </div>

            {serverError && (
                <p className="text-red-500 text-sm text-center">{serverError}</p>
            )}

            <Button
                type="submit"
                className="w-full"
                isLoading={isSubmitting}
                disabled={isSubmitting}
            >
                Sign Up
            </Button>
        </form>
    );
}