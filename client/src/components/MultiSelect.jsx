import React, { useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { CommandList } from "./ui/command";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Badge } from "./ui/badge";

const MultiSelect = ({ options, value, onChange, placeholder }) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const VISIBLE_COUNT = 3;
  const visibleChips = value.slice(0, VISIBLE_COUNT);
  const hiddenCount = Math.max(0, value.length - VISIBLE_COUNT);

  const handleSelect = (option) => {
    onChange([...value, option]);
  };

  const handleDeselect = (option) => {
    onChange(value.filter((v) => v.value !== option.value));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue) {
      const newOption = { value: inputValue.toLowerCase(), label: inputValue };
      if (!options.some(group => group.options.some(opt => opt.value === newOption.value)) && !value.some(v => v.value === newOption.value)) {
        handleSelect(newOption);
      }
      setInputValue("");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-10 px-3"
        >
          <div className="flex items-center gap-1 overflow-hidden">
            {value.length > 0 ? (
              <>
                {visibleChips.map((option) => (
                  <Badge
                    variant="secondary"
                    key={option.value}
                    className="mr-1 cursor-pointer select-none"
                    title={`Remove ${option.label}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeselect(option);
                    }}
                  >
                    {option.label}
                    <X
                      className="ml-2 h-4 w-4 cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeselect(option);
                      }}
                      aria-label={`Remove ${option.label}`}
                    />
                  </Badge>
                ))}
                {hiddenCount > 0 && (
                  <button
                    type="button"
                    className="text-xs text-muted-foreground hover:underline underline-offset-2"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setOpen(true);
                    }}
                  >
                    +{hiddenCount} more
                  </button>
                )}
              </>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0 max-h-80 overflow-hidden">
        <div className="flex items-center justify-between border-b p-2">
          <span className="text-xs text-muted-foreground">{value.length} selected</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 px-2"
            onClick={() => onChange([])}
            disabled={value.length === 0}
          >
            Clear all
          </Button>
        </div>
        <Command onKeyDown={handleKeyDown}>
          <CommandInput
            placeholder="Search or create..."
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList className="max-h-60 overflow-y-auto">
            <CommandEmpty>No options found.</CommandEmpty>
            {options.map((group) => (
              <CommandGroup key={group.label} heading={group.label}>
                {group.options
                  .filter((option) =>
                    option.label.toLowerCase().includes(inputValue.toLowerCase())
                  )
                  .map((option) => {
                    const isSelected = value.some(
                      (v) => v.value === option.value
                    );
                    return (
                      <CommandItem
                        key={option.value}
                        onSelect={() => {
                          if (isSelected) {
                            handleDeselect(option);
                          } else {
                            handleSelect(option);
                          }
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            isSelected ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {option.label}
                      </CommandItem>
                    );
                  })}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelect;
