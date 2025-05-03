// app/ui/signup/button.tsx
import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
}

export function Button({ children, isLoading, ...props }: ButtonProps) {
    return (
        <button
            {...props}
            disabled={isLoading || props.disabled}
            className={`px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400 transition-colors ${props.className || ''
                }`}
        >
            {isLoading ? (
                <div className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                        {/* Loading spinner SVG */}
                    </svg>
                    Processing...
                </div>
            ) : (
                children
            )}
        </button>
    );
}