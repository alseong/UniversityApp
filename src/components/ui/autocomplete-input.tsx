import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "./input";
import { Button } from "./button";

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  options?: string[];
  placeholder?: string;
  className?: string;
  id?: string;
  emptyMessage?: string;
}

export function AutocompleteInput({
  value,
  onChange,
  options = [],
  placeholder = "Type to search...",
  className,
  id,
  emptyMessage = "No options found. You can type your own entry.",
}: AutocompleteInputProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update internal state when external value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Filter options based on input
  const filteredOptions = (options || []).filter((option) =>
    option.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (selectedValue: string) => {
    console.log("Selecting:", selectedValue); // Debug log
    setInputValue(selectedValue);
    onChange(selectedValue);
    setOpen(false);
    inputRef.current?.focus();
  };

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    onChange(newValue);
    // Open dropdown if we have content and options
    if (newValue.length > 0 && options.length > 0) {
      setOpen(true);
    } else if (newValue.length === 0) {
      setOpen(false);
    }
  };

  const handleInputFocus = () => {
    // Open if we have options to show
    if (options.length > 0) {
      setOpen(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && filteredOptions.length === 0) {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    } else if (e.key === "ArrowDown" && !open && filteredOptions.length > 0) {
      e.preventDefault();
      setOpen(true);
    }
  };

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!open && options.length > 0) {
      inputRef.current?.focus();
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Input
          ref={inputRef}
          id={id}
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn("pr-8", className)}
          onFocus={handleInputFocus}
          autoComplete="off"
        />
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-2 hover:bg-transparent"
          onClick={handleDropdownClick}
          type="button"
          tabIndex={-1}
        >
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </div>

      {/* Custom dropdown */}
      {open && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-md max-h-60 overflow-auto"
          style={{
            minWidth: "var(--radix-popover-trigger-width)",
          }}
        >
          {filteredOptions.length > 0 ? (
            <div className="p-1">
              {filteredOptions.map((option, index) => (
                <div
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={cn(
                    "flex items-center px-2 py-1.5 text-sm cursor-pointer rounded-sm hover:bg-accent hover:text-accent-foreground select-none transition-colors",
                    value === option && "bg-accent text-accent-foreground"
                  )}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option}
                </div>
              ))}
            </div>
          ) : inputValue.length > 0 ? (
            <div className="p-3 text-sm text-muted-foreground text-center">
              {emptyMessage}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
