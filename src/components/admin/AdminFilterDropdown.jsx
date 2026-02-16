import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const AdminFilterDropdown = ({
    value,
    onChange,
    options = [],
    placeholder = "Select...",
    className = ""
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className={`relative min-w-[180px] ${className}`} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-4 py-2.5 bg-white border border-polar-night/10 rounded-xl text-sm font-medium text-polar-night focus:outline-none focus:ring-2 focus:ring-frost-byte/50 transition-all ${isOpen ? 'ring-2 ring-frost-byte/50 border-frost-byte/50' : 'hover:border-polar-night/20'}`}
            >
                <span className="truncate mr-2">{selectedOption ? selectedOption.label : placeholder}</span>
                <ChevronDown
                    size={16}
                    className={`text-text-primary/40 transition-transform duration-300 ease-in-out flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-polar-night/10 rounded-xl shadow-xl shadow-polar-night/5 z-50 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200 origin-top">
                    <div className="p-1">
                        {options.map((option) => (
                            <button
                                type="button"
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${value === option.value
                                    ? 'bg-frost-byte/10 text-polar-night font-bold'
                                    : 'text-text-primary/80 hover:bg-frozen/10 hover:text-polar-night'
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminFilterDropdown;
