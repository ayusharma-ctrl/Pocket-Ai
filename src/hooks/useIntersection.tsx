import { useEffect, useState, MutableRefObject } from "react";

const options: IntersectionObserverInit = {
    root: null, // viewport - default
    rootMargin: '0px', // no margin - default
    threshold: 0.8, // 80% of target visible
};

// custom hook to track the position of any html element
export const useIntersectionObserver = (targetRef: MutableRefObject<HTMLElement | null>, initialState: boolean): boolean => {
    const [isVisible, setIsVisible] = useState<boolean>(initialState);

    const callback: IntersectionObserverCallback = ([entry]) => {
        setIsVisible(entry.isIntersecting);
    };

    useEffect(() => {
        const observer = new IntersectionObserver(callback, options);

        if (targetRef.current) {
            observer.observe(targetRef.current);
        }

        return () => {
            if (targetRef.current) {
                observer.unobserve(targetRef.current);
            }
        };

    }, []);

    return isVisible;
};