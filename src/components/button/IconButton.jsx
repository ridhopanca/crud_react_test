export default function IconButton ({
    type,
    icon: Icon,
    onClick,
    onMouseDown
}) {
    return (
        <button type={type} onClick={onClick} onMouseDown={onMouseDown}>
            <Icon />
        </button>
    )
}