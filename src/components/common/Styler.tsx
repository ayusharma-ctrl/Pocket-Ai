import { Pacifico } from "next/font/google";

const pacifico = Pacifico({ weight: '400', subsets: ["latin"] });

interface StylerProps {
    text: string,
    className?: string,
};

const Styler: React.FC<StylerProps> = ({ text, className = '' }) => {
    return (
        <span className={`${pacifico.className} ${className}`}> {text} </span>
    )
}

export default Styler;