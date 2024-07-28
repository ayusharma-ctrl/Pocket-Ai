import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Loader = ({ message }: { message: string }): JSX.Element => {
    return (
        <div className='w-1/4 self-center flex justify-center items-center gap-1 my-8 text-sm text-bold text-white'>
            <FontAwesomeIcon icon={faSpinner} size="1x" spin />
            <h1>{message}</h1>
        </div>
    )
}

export default Loader