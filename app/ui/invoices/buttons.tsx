'use client';
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteInvoice } from '@/app/lib/actions';
import { useFormState } from 'react-dom';

export function CreateInvoice() {
  return (
    <Link
      href="/dashboard/invoices/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Invoice</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateInvoice({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/invoices/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteInvoice({ id }: { id: string }) {
  const [state, formAction] = useFormState(deleteInvoice, null);

  const handleDelete = (event: React.FormEvent<HTMLFormElement>) => {
    const confirmed = window.confirm('Are you sure you want to delete this invoice?');
    if (!confirmed) {
      event.preventDefault();
    }
  };

  return (
    <form action={formAction} onSubmit={handleDelete}>
      <input type="hidden" name="id" value={id} />
      <button className="rounded-md border p-2 hover:bg-gray-100" type="submit">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
      {state?.message && <p className="text-red-500 text-sm">{state.message}</p>}
    </form>
  );
}
