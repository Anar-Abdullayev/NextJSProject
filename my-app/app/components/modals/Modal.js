'use client'

export default function CustomModal({ isOpen, title, onCancel, children }) {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                <h2 className="text-xl font-bold mb-2 text-black">{title}</h2>
                <div>
                    {children}
                </div>
                <div className="flex justify-end gap-2 mt-2">
                    <button onClick={onCancel}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}