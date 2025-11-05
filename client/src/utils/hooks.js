import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Custom hook for managing form state
 * @param {Object} initialValues - Initial form values
 * @returns {Object} Form state and handlers
 */
export const useForm = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const setFieldValue = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const setFieldError = (name, error) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldError,
    setErrors,
    resetForm,
  };
};

/**
 * Custom hook for debouncing values
 * @param {any} value - Value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {any} Debounced value
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Custom hook for managing local storage
 * @param {string} key - Storage key
 * @param {any} initialValue - Initial value
 * @returns {Array} [value, setValue]
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  };

  return [storedValue, setValue];
};

/**
 * Custom hook for managing previous value
 * @param {any} value - Current value
 * @returns {any} Previous value
 */
export const usePrevious = (value) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

/**
 * Custom hook for click outside detection
 * @param {Function} callback - Callback function
 * @returns {Object} Ref object
 */
export const useClickOutside = (callback) => {
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback]);

  return ref;
};

/**
 * Custom hook for window size
 * @returns {Object} Window dimensions
 */
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

/**
 * Custom hook for media query
 * @param {string} query - Media query string
 * @returns {boolean} Match result
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
};

/**
 * Custom hook for async operations
 * @returns {Object} Async state and handlers
 */
export const useAsync = () => {
  const [status, setStatus] = useState("idle");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(async (asyncFunction) => {
    setStatus("loading");
    setData(null);
    setError(null);

    try {
      const response = await asyncFunction();
      setData(response);
      setStatus("success");
      return response;
    } catch (err) {
      setError(err);
      setStatus("error");
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setData(null);
    setError(null);
  }, []);

  return {
    execute,
    status,
    data,
    error,
    isIdle: status === "idle",
    isLoading: status === "loading",
    isSuccess: status === "success",
    isError: status === "error",
    reset,
  };
};

/**
 * Custom hook for pagination
 * @param {number} totalItems - Total number of items
 * @param {number} itemsPerPage - Items per page
 * @returns {Object} Pagination state and handlers
 */
export const usePagination = (totalItems = 0, itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const goToPage = (page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  const goToNextPage = () => {
    goToPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    goToPage(currentPage - 1);
  };

  const goToFirstPage = () => {
    goToPage(1);
  };

  const goToLastPage = () => {
    goToPage(totalPages);
  };

  return {
    currentPage,
    totalPages,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
};

/**
 * Custom hook for toggle state
 * @param {boolean} initialState - Initial state
 * @returns {Array} [state, toggle, setTrue, setFalse]
 */
export const useToggle = (initialState = false) => {
  const [state, setState] = useState(initialState);

  const toggle = useCallback(() => {
    setState((prev) => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setState(true);
  }, []);

  const setFalse = useCallback(() => {
    setState(false);
  }, []);

  return [state, toggle, setTrue, setFalse];
};

/**
 * Custom hook for interval
 * @param {Function} callback - Callback function
 * @param {number} delay - Delay in milliseconds
 */
export const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      const tick = () => {
        savedCallback.current();
      };

      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

/**
 * Custom hook for timeout
 * @param {Function} callback - Callback function
 * @param {number} delay - Delay in milliseconds
 */
export const useTimeout = (callback, delay) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      const id = setTimeout(() => {
        savedCallback.current();
      }, delay);

      return () => clearTimeout(id);
    }
  }, [delay]);
};

/**
 * Custom hook for copy to clipboard
 * @returns {Object} Copy state and handler
 */
export const useCopyToClipboard = () => {
  const [copiedText, setCopiedText] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  const copy = async (text) => {
    if (!navigator?.clipboard) {
      console.warn("Clipboard not supported");
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);

      return true;
    } catch (error) {
      console.error("Copy failed:", error);
      setIsCopied(false);
      return false;
    }
  };

  return { copiedText, isCopied, copy };
};

/**
 * Custom hook for online status
 * @returns {boolean} Online status
 */
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
};

/**
 * Custom hook for scroll position
 * @returns {Object} Scroll position
 */
export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition({
        x: window.scrollX,
        y: window.scrollY,
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollPosition;
};

/**
 * Custom hook for array state management
 * @param {Array} initialArray - Initial array
 * @returns {Object} Array state and handlers
 */
export const useArray = (initialArray = []) => {
  const [array, setArray] = useState(initialArray);

  const push = (element) => {
    setArray((prev) => [...prev, element]);
  };

  const filter = (callback) => {
    setArray((prev) => prev.filter(callback));
  };

  const update = (index, newElement) => {
    setArray((prev) => [
      ...prev.slice(0, index),
      newElement,
      ...prev.slice(index + 1),
    ]);
  };

  const remove = (index) => {
    setArray((prev) => [...prev.slice(0, index), ...prev.slice(index + 1)]);
  };

  const clear = () => {
    setArray([]);
  };

  return { array, set: setArray, push, filter, update, remove, clear };
};

/**
 * Custom hook for fetch data
 * @param {string} url - API URL
 * @param {Object} options - Fetch options
 * @returns {Object} Fetch state
 */
export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url, options);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

/**
 * Custom hook for hover state
 * @returns {Array} [hoverRef, isHovered]
 */
export const useHover = () => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  useEffect(() => {
    const node = ref.current;

    if (node) {
      node.addEventListener("mouseenter", handleMouseEnter);
      node.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        node.removeEventListener("mouseenter", handleMouseEnter);
        node.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, []);

  return [ref, isHovered];
};

/**
 * Custom hook for document title
 * @param {string} title - Document title
 */
export const useDocumentTitle = (title) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    return () => {
      document.title = prevTitle;
    };
  }, [title]);
};

/**
 * Custom hook for search/filter
 * @param {Array} items - Items to search
 * @param {string} searchTerm - Search term
 * @param {Array} searchKeys - Keys to search in
 * @returns {Array} Filtered items
 */
export const useSearch = (items = [], searchTerm = "", searchKeys = []) => {
  const [filteredItems, setFilteredItems] = useState(items);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredItems(items);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = items.filter((item) =>
      searchKeys.some((key) => {
        const value = key.split(".").reduce((obj, k) => obj?.[k], item);
        return String(value).toLowerCase().includes(term);
      })
    );

    setFilteredItems(filtered);
  }, [items, searchTerm, searchKeys]);

  return filteredItems;
};

/**
 * Custom hook for sort
 * @param {Array} items - Items to sort
 * @param {string} sortKey - Key to sort by
 * @param {string} sortOrder - Sort order (asc, desc)
 * @returns {Array} Sorted items
 */
export const useSort = (items = [], sortKey = "", sortOrder = "asc") => {
  const [sortedItems, setSortedItems] = useState(items);

  useEffect(() => {
    if (!sortKey) {
      setSortedItems(items);
      return;
    }

    const sorted = [...items].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setSortedItems(sorted);
  }, [items, sortKey, sortOrder]);

  return sortedItems;
};

/**
 * Custom hook for mount status
 * @returns {boolean} Is mounted
 */
export const useIsMounted = () => {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return isMounted;
};

/**
 * Custom hook for update effect (skip first render)
 * @param {Function} effect - Effect function
 * @param {Array} deps - Dependencies
 */
export const useUpdateEffect = (effect, deps) => {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    return effect();
  }, deps);
};

export default {
  useForm,
  useDebounce,
  useLocalStorage,
  usePrevious,
  useClickOutside,
  useWindowSize,
  useMediaQuery,
  useAsync,
  usePagination,
  useToggle,
  useInterval,
  useTimeout,
  useCopyToClipboard,
  useOnlineStatus,
  useScrollPosition,
  useArray,
  useFetch,
  useHover,
  useDocumentTitle,
  useSearch,
  useSort,
  useIsMounted,
  useUpdateEffect,
};
