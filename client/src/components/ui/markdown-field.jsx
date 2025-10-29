import React, { forwardRef } from 'react';
import { MarkdownEditor } from './markdown-editor';
import { Label } from './label';
import { cn } from '../../lib/utils';

export const MarkdownField = forwardRef(({
    label,
    value,
    onChange,
    placeholder,
    className,
    error,
    required,
    ...props
}, ref) => {
    return (
        <div className={cn('space-y-2', className)}>
            {label && (
                <Label className={cn(required && "after:content-['*'] after:ml-0.5 after:text-red-500")}>
                    {label}
                </Label>
            )}
            <MarkdownEditor
                ref={ref}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                {...props}
            />
            {error && (
                <p className="text-sm text-destructive">{error}</p>
            )}
        </div>
    );
});

MarkdownField.displayName = 'MarkdownField';