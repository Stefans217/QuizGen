import React, {useEffect, useRef} from 'react';

interface Props {
    closeLoginModal: () => void;
}

const LoginForm: React.FC<Props> = ({closeLoginModal}) => {

    const modalRef = useRef<HTMLDivElement | null>(null);
   
    const closeModal = (e: React.MouseEvent<HTMLElement>) => {
        if(modalRef.current === e.target){
            closeLoginModal();
        }
    }

    return (
        <div ref={modalRef} onClick={closeModal} className='fixed inset-0 bg-black bg-opacity-30 backdrop-brightness-50 flex justify-center items-center z-50'>
            <div className='text-xs bg-white p-8 rounded-lg shadow-lg max-w-md w-50px'>
                <h2 className='text-2xl font-bold mb-6 text-center'>Login</h2>
                <form>
                    <div className='mb-4'>
                        <input
                            className='appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            id='email'
                            type='email'
                            placeholder='Email'
                        />
                    </div>
                    <div className='mb-6'>

                        <input
                            className='appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            id='password'
                            type='password'
                            placeholder='Password'
                        />
                    </div>
                    <div className='flex items-center justify-between'>
                        <button
                            className='bg-slate-800 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                            type='button'
                        >
                            Login
                        </button>
                    </div>
                    
                </form>
                <button onClick={closeLoginModal}>Close</button>
            </div>
        </div>
    )
}

export default LoginForm