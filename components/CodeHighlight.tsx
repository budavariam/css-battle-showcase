import React from "react"
import hljs, { AutoHighlightResult } from 'highlight.js';
import javascript from 'highlight.js/lib/languages/javascript';
hljs.registerLanguage('javascript', javascript);

const CodeHighlight = ({ language = 'html', code = '' }: { language?: string, code?: string }): JSX.Element => {
    const languageSubset = hljs.getLanguage(language)
        ? [language]
        : null
    let highlightResult: AutoHighlightResult = null
    try {
        if (code) {
            highlightResult = hljs.highlightAuto(code, languageSubset)
        }
    } catch (err) {
        // console.error(err)
    }

    return (
        <code
            dangerouslySetInnerHTML={{ __html: highlightResult?.value ?? "" }}
        />
    )
}
export default CodeHighlight