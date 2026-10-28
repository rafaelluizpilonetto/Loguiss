import { Eye, EyeClosed } from 'lucide-react';

export function ButtonEye({
    isOpen = false,
    size = 20,
    onClick,
    className = '',
    ...props
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`text-gray-500 hover:text-gray-700 focus:outline-none ${className}`}
            {...props}
        >
            {isOpen ? <EyeClosed size={size} /> : <Eye size={size} />}
        </button>
    );
}