// app/lib/auth.ts
export async function registerUser(formData: {
    name: string;
    email: string;
    password: string;
}) {
    try {
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        return data;
    } catch (error) {
        throw error;
    }
}

// Email validation helper
export async function checkEmailExists(email: string): Promise<boolean> {
    const response = await fetch(`/api/check-email?email=${encodeURIComponent(email)}`);
    const data = await response.json();
    return data.exists;
}