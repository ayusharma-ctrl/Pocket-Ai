import React from 'react'

type IMessageBox = {
    message: string,
    sender: string,
};

const MessageBox = (props: IMessageBox): JSX.Element => {
    const { message, sender } = props;
    return (
        <div className={`mb-4 py-2 px-3 rounded-2xl max-w-[80%] text-xs lg:text-sm ${sender === 'user'
            ? 'bg-rose-700 text-white self-end rounded-br-none'
            : 'bg-gray-300 text-black self-start rounded-bl-none'
            }`}
        >
            {message}
            {sender === 'ai' && (
                <div className='text-xs text-red-700 flex justify-start mt-2 italic'>
                    AI generated
                </div>
            )}
        </div>
    )
}

export default MessageBox;