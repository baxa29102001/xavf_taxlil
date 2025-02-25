import { useState } from 'react'
import { useDebounce } from 'react-use'

function useDebouncedValue<T>(value: T, time: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)

    useDebounce(
        () => {
            setDebouncedValue(value)
        },
        time,
        [value]
    )

    return debouncedValue
}

export default useDebouncedValue
