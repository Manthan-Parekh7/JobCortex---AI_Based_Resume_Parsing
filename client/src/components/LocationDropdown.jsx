import React, { useState } from "react";
import { Check, ChevronsUpDown, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "./ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "./ui/popover";
import { cn } from "../lib/utils";
import { popularCities } from "../data/cities";

const LocationDropdown = ({ value, onChange, placeholder = "Select city or state..." }) => {
    const [open, setOpen] = useState(false);

    const handleSelect = (selectedValue) => {
        onChange(selectedValue === value ? "" : selectedValue);
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between h-12 rounded-xl border-border bg-background/50 text-foreground hover:bg-accent/50 relative"
                >
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <span className={cn("truncate ml-8", !value && "text-muted-foreground")}>
                        {value || placeholder}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 border-border bg-card/95 backdrop-blur-xl rounded-2xl shadow-xl">
                <Command>
                    <CommandInput placeholder="Search cities..." className="border-0" />
                    <CommandList>
                        <CommandEmpty>No city found.</CommandEmpty>
                        <CommandGroup>
                            {/* Option to clear selection */}
                            {value && (
                                <CommandItem
                                    onSelect={() => handleSelect("")}
                                    className="text-muted-foreground"
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            !value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    Clear selection
                                </CommandItem>
                            )}
                            {popularCities.map((city) => (
                                <CommandItem
                                    key={city}
                                    onSelect={() => handleSelect(city)}
                                    className="cursor-pointer"
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === city ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {city}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default LocationDropdown;