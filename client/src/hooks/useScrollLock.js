import { useEffect } from "react";

/**
 * Custom hook to manage body scroll locking
 * Prevents background scrolling when modals/dialogs are open
 * and ensures proper cleanup when they close
 */
export const useScrollLock = (isOpen) => {
    useEffect(() => {
        if (isOpen) {
            // Store original overflow style
            const originalOverflow = document.body.style.overflow;
            const originalPaddingRight = document.body.style.paddingRight;

            // Calculate scrollbar width to prevent layout shift
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

            // Lock scroll and compensate for scrollbar width
            document.body.style.overflow = "hidden";
            if (scrollbarWidth > 0) {
                document.body.style.paddingRight = `${scrollbarWidth}px`;
            }

            // Cleanup function
            return () => {
                document.body.style.overflow = originalOverflow;
                document.body.style.paddingRight = originalPaddingRight;
            };
        }
    }, [isOpen]);
};

export default useScrollLock;
