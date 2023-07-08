import Modal from "./Modal"
import Button from "../button/Button";
import { Dialog } from "@headlessui/react";
import { FiAlertTriangle } from 'react-icons/fi';

const ConfirmDelete = ({
    isOpen,
    isLoading,
    onClose,
    onDelete
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className="sm:flex sm:items-start">
                <div
                    className="
                        mx-auto
                        flex
                        h-12
                        w-12
                        flex-shrink-0
                        rounded-full
                        items-center
                        justify-center
                        bg-red-100
                        sm:mx-0
                        sm:h-10
                        sm:w-10
                    "
                >
                    <FiAlertTriangle
                        className="h-6 w-6 text-red-600"
                    />
                </div>
                <div
                    className="
                        mt-3
                        text-center
                        sm:ml-4
                        sm:mt-0
                        sm:text-left
                    "
                >
                    <Dialog.Title
                        as="h3"
                        className="
                            text-base
                            text-gray-800
                            font-semibold
                            leading-6
                        "
                    >
                        Delete Data
                    </Dialog.Title>
                    <div className="mt-2">
                        <p className="text-sm text-gray-500">
                            Are you sure want to delete this data? this action cannot be undone.
                        </p>
                    </div>
                </div>
            </div>
            <div
                className="
                    mt-5
                    sm:mt-4
                    sm:flex
                    sm:flex-row-reverse
                "
            >
                <Button
                    type="button"
                    disabled={isLoading || false}
                    danger
                    onClick={onDelete}
                >
                    Delete
                </Button>
                <Button
                    type="button"
                    disabled={isLoading || false}
                    secondary
                    onClick={onClose}
                >
                    Cancel
                </Button>
            </div>

        </Modal>
    )
}

export default ConfirmDelete