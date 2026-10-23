export function Inputs({
    type,
    placeholder,
    value,
    onChange,
    onKeyDown,
    onBlur,
    icon: Icon,
    rightElement,
    className = "",
    required,
    options = [],
    error,
    touched = false
}) {
    const mostrarErro = touched && Boolean(error);

    return (
        <div className="w-full">
            <div
                className={`flex items-center gap-3 bg-gray rounded-lg p-3 border mb-1 ${
                    mostrarErro ? "border-red-500" : "border-gray-200"
                } ${className}`}
            >
                {Icon && <Icon size={20} className="text-gray-400" />}

                {type === "select" ? (
                    <select
                        className="w-full outline-none bg-[#15102b] focus:border-[#4EDB4E] text-white"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        required={required}
                        aria-invalid={mostrarErro}
                    >
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        type={type}
                        placeholder={placeholder}
                        className="w-full outline-none bg-transparent text-white"
                        onChange={onChange}
                        onBlur={onBlur}
                        onKeyDown={onKeyDown}
                        value={value}
                        required={required}
                        aria-invalid={mostrarErro}
                    />
                )}

                {rightElement}
            </div>

            {mostrarErro && (
                <p className="text-red-500 text-sm mb-3">
                    {error}
                </p>
            )}
        </div>
    );
}