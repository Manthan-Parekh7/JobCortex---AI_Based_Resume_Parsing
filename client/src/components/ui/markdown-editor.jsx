import React, { useCallback, useMemo } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TRANSFORMERS, $convertToMarkdownString, $convertFromMarkdownString } from '@lexical/markdown';
import { $getRoot } from 'lexical';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';

import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ListItemNode, ListNode } from '@lexical/list';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { CodeNode } from '@lexical/code';

import { MarkdownTogglePlugin } from './markdown-toggle-plugin';
import { cn } from '../../lib/utils';

const theme = {
    root: 'p-3 border border-gray-300 rounded-lg min-h-[200px] max-h-[400px] overflow-y-auto focus-within:border-primary',
    link: 'cursor-pointer text-blue-500 hover:underline',
    text: {
        bold: 'font-semibold',
        underline: 'underline',
        italic: 'italic',
        strikethrough: 'line-through',
        underlineStrikethrough: 'underline line-through',
    },
    heading: {
        h1: 'text-2xl font-bold mb-2',
        h2: 'text-xl font-bold mb-2',
        h3: 'text-lg font-bold mb-1',
        h4: 'text-base font-bold mb-1',
        h5: 'text-sm font-bold mb-1',
    },
    list: {
        nested: {
            listitem: 'list-none',
        },
        ol: 'list-decimal ml-4',
        ul: 'list-disc ml-4',
        listitem: 'my-1',
    },
    quote: 'border-l-4 border-primary pl-4 ml-4 my-4 text-muted-foreground italic',
    code: 'bg-muted px-1 py-0.5 rounded text-sm font-mono',
};

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed.
function onError(error) {
    console.error(error);
}

function MyCustomAutoFocusPlugin() {
    return <AutoFocusPlugin />;
}

export function MarkdownEditor({
    value = '',
    onChange,
    placeholder = 'Enter text...',
    className,
    autoFocus = false,
    readOnly = false
}) {
    const nodeClasses = useMemo(() => {
        const nodes = [
            HeadingNode,
            ListNode,
            ListItemNode,
            QuoteNode,
            CodeNode,
            TableNode,
            TableCellNode,
            TableRowNode,
            LinkNode,
            AutoLinkNode,
        ];
        return nodes.filter((n) => n && typeof n.getType === 'function');
    }, []);

    const initialConfig = useMemo(
        () => ({
            namespace: 'MarkdownEditor',
            theme,
            onError,
            editable: !readOnly,
            nodes: nodeClasses,
            editorState: value ? () => {
                $convertFromMarkdownString(value, TRANSFORMERS);
            } : undefined,
        }),
        [value, readOnly, nodeClasses]
    );

    const handleOnChange = useCallback((editorState) => {
        if (onChange) {
            editorState.read(() => {
                const markdown = $convertToMarkdownString(TRANSFORMERS);
                onChange(markdown);
            });
        }
    }, [onChange]);

    return (
        <div className={cn('relative', className)}>
            <LexicalComposer initialConfig={initialConfig}>
                <div className="relative">
                    {!readOnly && (
                        <div className="flex justify-end mb-2">
                            <MarkdownTogglePlugin
                                transformers={TRANSFORMERS}
                                shouldPreserveNewLinesInMarkdown={true}
                            />
                        </div>
                    )}
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable
                                className={cn(
                                    theme.root,
                                    "focus:outline-none",
                                    readOnly && "cursor-default"
                                )}
                                placeholder={
                                    <div className="absolute top-3 left-3 text-muted-foreground pointer-events-none">
                                        {placeholder}
                                    </div>
                                }
                            />
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <OnChangePlugin onChange={handleOnChange} />
                    <HistoryPlugin />
                    <LinkPlugin />
                    <ListPlugin />
                    <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
                    {autoFocus && <MyCustomAutoFocusPlugin />}
                </div>
            </LexicalComposer>
        </div>
    );
}

// Read-only markdown viewer component
export function MarkdownViewer({ value, className, compact = false }) {
    const nodeClasses = useMemo(() => {
        const nodes = [
            HeadingNode,
            ListNode,
            ListItemNode,
            QuoteNode,
            CodeNode,
            LinkNode,
            AutoLinkNode,
        ];
        return nodes.filter((n) => n && typeof n.getType === 'function');
    }, []);

    const initialConfig = useMemo(
        () => ({
            namespace: 'MarkdownViewer',
            theme: {
                ...theme,
                root: 'p-3 bg-muted/30 rounded-lg prose prose-sm max-w-none',
            },
            onError,
            editable: false,
            nodes: nodeClasses,
            editorState: value ? () => {
                $getRoot();
                $convertFromMarkdownString(value, TRANSFORMERS);
            } : undefined,
        }),
        [value, nodeClasses]
    );

    return (
        <div className={cn('relative', className)}>
            <LexicalComposer initialConfig={initialConfig}>
                <RichTextPlugin
                    contentEditable={
                        <ContentEditable
                            className={cn(
                                // remove border and optionally padding for compact view
                                theme.root
                                    .replace('border border-gray-300', 'border-0')
                                    .replace(compact ? 'p-3' : 'p-3', compact ? 'p-0' : 'p-3'),
                                "focus:outline-none cursor-default"
                            )}
                        />
                    }
                    placeholder={null}
                    ErrorBoundary={LexicalErrorBoundary}
                />
            </LexicalComposer>
        </div>
    );
}