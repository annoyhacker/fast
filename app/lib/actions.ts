'use server';

import { z } from 'zod';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import bcrypt from 'bcryptjs';

// PostgreSQL client
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Types
export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
};

// Schemas

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({ invalid_type_error: 'Please select a customer.' }),
    amount: z.coerce
        .number()
        .gt(0, { message: 'Please enter an amount greater than $0.' }),
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select an invoice status.',
    }),
    date: z.string(),
});

const SignupSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

//signup user
export async function signUp(prevState: string | null, formData: FormData): Promise<string> {
    const validatedFields = SignupSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
    });

    if (!validatedFields.success) {
        return 'Invalid form data';
    }

    const { name, email, password } = validatedFields.data;


    try {
        // Check if user already exists
        const existingUser = await sql`
        SELECT id FROM users WHERE email = ${email}
      `;

        if (existingUser.length > 0) {
            return 'User already exists with this email';
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        await sql`
        INSERT INTO users (id, name, email, password)
  VALUES (
    uuid_generate_v4(), 
    ${name}, 
    ${email}, 
    ${hashedPassword}
  )
`;

    } catch (error) {
        console.error('Signup error:', error);
        return 'Failed to create account';
    }

    redirect('/login');
}

const CreateInvoiceSchema = FormSchema.omit({ id: true, date: true });
// Create invoice
export async function createInvoice(prevState: State, formData: FormData) {
    const validatedFields = CreateInvoiceSchema.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        };
    }

    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    try {
        await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
        revalidatePath('/dashboard/invoices');
        redirect('/dashboard/invoices');
    } catch (error) {
        console.error(error);
        return { message: 'Database Error: Failed to create Invoice' };
    }
}

// Update invoice
export async function updateInvoice(
    id: string,
    prevState: State,
    formData: FormData
) {
    const validatedFields = CreateInvoiceSchema.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Invoice.',
        };
    }

    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;

    try {
        await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
        revalidatePath('/dashboard/invoices');
        redirect('/dashboard/invoices');
    } catch (error) {
        console.error(error);
        return { message: 'Database Error: Failed to update Invoice' };
    }
}

// Delete invoice
export async function deleteInvoice(prevState: any, formData: FormData) {
    try {
        const id = formData.get('id') as string;
        await sql`DELETE FROM invoices WHERE id = ${id}`;
        revalidatePath('/dashboard/invoices');
        return { message: 'Invoice deleted successfully' };
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Invoice.' };
    }
}

// Authenticat
export async function authenticate(
    prevState: string | undefined,
    formData: FormData,

) {

    try {
        await signIn('credentials', formData);
    } catch (error) {

        if (error instanceof AuthError && typeof (error as any).type === 'string') {
            switch ((error as any).type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}