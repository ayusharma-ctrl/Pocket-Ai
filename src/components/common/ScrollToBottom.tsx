import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type IProps = {
    scrollToBottom: () => void;
}

const ScrollToBottom = ({ scrollToBottom }: IProps): JSX.Element => {
    return (
        <div className='relative -top-12 bg-blue-500 py-1 px-2 rounded-full cursor-pointer'>
            <FontAwesomeIcon icon={faAngleDown} size="1x" onClick={scrollToBottom} />
        </div>
    );
}

export default ScrollToBottom;