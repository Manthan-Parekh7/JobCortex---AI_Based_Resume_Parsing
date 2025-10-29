import { useState, useCallback } from "react";

const useFetch = (asyncFunction) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = useCallback(
        async (...args) => {
            console.log("useFetch - asyncFunction:", asyncFunction);
            console.log("useFetch - args:", args);
            setLoading(true);
            setError(null);
            try {
                const result = await asyncFunction(...args);
                console.log("useFetch - API call result:", result);
                setData(result);
                return { success: true, data: result };
            } catch (err) {
                console.error("useFetch - Error caught:", err);
                const errorMessage = err.message || "An unknown error occurred.";
                setError(errorMessage);
                return { success: false, error: errorMessage };
            } finally {
                setLoading(false);
            }
        },
        [asyncFunction]
    );

    return { data, loading, error, execute };
};

export default useFetch;
