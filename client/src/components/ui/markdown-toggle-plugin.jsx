"use client"

import { useCallback, useState } from "react"
import {
    $convertFromMarkdownString,
    $convertToMarkdownString,
    TRANSFORMERS,
} from "@lexical/markdown"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $getRoot, $createTextNode, $createParagraphNode } from "lexical"
import { FileTextIcon } from "lucide-react"

import { Button } from "./button"

export function MarkdownTogglePlugin({
    shouldPreserveNewLinesInMarkdown,
    transformers = TRANSFORMERS,
}) {
    const [editor] = useLexicalComposerContext()
    const [isMarkdownMode, setIsMarkdownMode] = useState(false)

    const handleMarkdownToggle = useCallback((e) => {
        // Prevent submitting the surrounding form and stop event bubbling
        if (e) {
            e.preventDefault()
            e.stopPropagation()
        }
        editor.update(() => {
            if (isMarkdownMode) {
                // Convert from markdown text to rich text
                const root = $getRoot()
                const textContent = root.getTextContent()
                root.clear()
                $convertFromMarkdownString(
                    textContent,
                    transformers,
                    undefined,
                    shouldPreserveNewLinesInMarkdown
                )
                setIsMarkdownMode(false)
            } else {
                // Convert from rich text to markdown
                const markdown = $convertToMarkdownString(
                    transformers,
                    undefined,
                    shouldPreserveNewLinesInMarkdown
                )
                const root = $getRoot()
                root.clear()
                root.append($createParagraphNode().append($createTextNode(markdown)))
                setIsMarkdownMode(true)
            }
        })
    }, [editor, shouldPreserveNewLinesInMarkdown, isMarkdownMode, transformers])

    return (
        <Button
            variant={"ghost"}
            type="button"
            onClick={handleMarkdownToggle}
            title="Convert From Markdown"
            aria-label="Convert from markdown"
            size={"sm"}
            className="p-2"
        >
            <FileTextIcon className="size-4" />
        </Button>
    )
}