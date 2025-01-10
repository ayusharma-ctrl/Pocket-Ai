'use client';

import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

interface ScrollAnimationProps {
    children: React.ReactNode
    direction?: 'left' | 'right' | 'up' | 'down'
};

export const ScrollAnimation: React.FC<ScrollAnimationProps> = ({ children, direction = 'up' }) => {
    const controls = useAnimation();

    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    useEffect(() => {
        if (inView) {
            controls.start('visible')
        }
    }, [controls, inView]);

    const variants = {
        hidden: {
            opacity: 0,
            x: direction === 'left' ? 70 : direction === 'right' ? -70 : 0,
            y: direction === 'up' ? 70 : direction === 'down' ? -70 : 0,
        },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            transition: {
                duration: 0.8,
                ease: 'easeOut',
            },
        },
    };

    return (
        <motion.div
            ref={ref}
            animate={controls}
            initial="hidden"
            variants={variants}
        >
            {children}
        </motion.div>
    )
}
