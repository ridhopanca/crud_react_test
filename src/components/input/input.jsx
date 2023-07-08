

import clsx from "clsx";

export default function Input({
    label,
    name,
    type,
    register,
    placeholder,
    errors,
    disabled,
    onBlur,
    icon: Icon
}) {
    return (
        <div>
            <label 
                htmlFor={name}
                className={clsx(`
                    block
                    px-3 py-1.5
                    ring-gray-400
                    border
                    rounded-md
                    relative
                `,
                    errors[name] && 'border-red-500',
                    !errors[name]  && 'focus-within:border-[1.5px] focus-within:border-blue-500 border-gray-400'
                )}
            >
                <span className={clsx(`label block text-sm 
                    font-medium w-full
                    leading-6`,
                     errors[name] && 'text-error',
                     !errors[name] && "text-gray-800"
                    )}
                >
                    {label}
                </span>
                {Icon ? (
                    <div className="flex justify-between items-center">
                        <input 
                            type={type}
                            id={name} 
                            autoComplete="off"
                            placeholder={placeholder}
                            disabled={disabled}
                            onBlur={onBlur}
                            {...register(name)}
                            className={`form-input w-full peer 
                                bg-transparent outline-none 
                                border-0 focus:outline-none 
                                focus:ring-0 focus:ring-transparent 
                                text-gray-800
                                py-0.5 sm:text-sm sm:leading-6 px-0
                            `}
                        />
                        <Icon />
                    </div>
                ) : (
                    <input 
                        type={type}
                        id={name} 
                        autoComplete="off"
                        placeholder={placeholder}
                        disabled={disabled}
                        onBlur={onBlur}
                        {...register(name)}
                        className={`form-input w-full peer 
                            bg-transparent outline-none 
                            border-0 focus:outline-none 
                            focus:ring-0 focus:ring-transparent 
                            text-gray-800
                            py-0.5 sm:text-sm sm:leading-6 px-0
                        `}
                    />
                )}
            </label>
            {errors[name] && (
                <p className="text-red-500">{errors?.[name]?.message?.toString()}</p>
            )}
        </div>
    )
}