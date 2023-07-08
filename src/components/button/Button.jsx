import clsx from "clsx";


export default function Button({
    children,
    type,
    fullWidth,
    onClick,
    secondary,
    danger,
    disabled,
    outlined,
    colorOutlined
}) {
    return (
        <button
            onClick={onClick}
            type={type}
            disabled={disabled}
            className={clsx(`
                flex
                justify-center
                rounded-md
                px-3
                py-2
                text-sm
                cursor-pointer
                font-medium
                focus-visible:outline
                focus-visible:outline-2
                focus-visible:outline-offset-2
            `,
            disabled && `opacity-50 cursor-progress`,
            fullWidth && 'w-full',
            secondary ? 'text-gray-800' : (outlined && colorOutlined) ? colorOutlined : 'text-white',
            outlined && colorOutlined && `bg-transparent ${colorOutlined}`,
            danger && 'bg-rose-500 hover:bg-rose-600 focus-visible:outline-rose-600',
            !secondary && !danger && 'bg-blue-500 hover:bg-blue-600 focus-visible:outline-blue-600'
            )}
        >
            {children}
        </button>
    )
}
