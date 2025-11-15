import { useCallback, useState } from 'react'

type CheckHTTPsProtocol<TRoute extends string> = `https://${TRoute}`

interface CopyWithAttributionProps {
    resetInterval?: number
    source?: CheckHTTPsProtocol<string>
    date?: string
    name?: string
    license? : string
}

/**
 * // Source - https://stackoverflow.com/a/78545784 // window.location.href;
 * // Posted by Tristan Wise // name
 * // Retrieved 2025-11-15, License - CC BY-SA 4.0
 * @param resetInterval
 */

export function useCopyToClipboard({resetInterval = 2000}: CopyWithAttributionProps) {
    const [isCopied, setIsCopied] = useState(false)

    const copy = useCallback(async (text: string) => {
        if (!text) {return false}
        const win: Window & typeof globalThis = window

        let success = false

        if (win.navigator.clipboard && win.isSecureContext) {
            try {
                await win.navigator.clipboard.writeText(text)
                success = true
            } catch (err) {
                console.warn('Clipboard API failed:', err)
            }
        }

        setIsCopied(success)
        if (success && resetInterval > 0) {
            setTimeout(() => setIsCopied(false), resetInterval)
        }

        return success
    }, [resetInterval])

    return { copy, isCopied }
}

