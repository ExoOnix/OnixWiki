import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Drawer,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useIsMobile } from "@/hooks/use-mobile";
import React, { useState, useEffect } from "react";
import { router } from '@inertiajs/react';
import axios from "axios";
import { debounce } from "lodash";

export function AppSearch() {
    const isMobile = useIsMobile()
    const [open, setOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const searchPage = (e: React.FormEvent) => {
        e.preventDefault()
        router.get(route("search", {'search': searchTerm}))
    }

    useEffect(() => {
        const fetchSuggestions = debounce((term: string) => {
            if (term) {
                axios.get(route("search.suggestions", { search: term }))
                    .then((response) => setSuggestions(response.data.suggestions))
                    .catch(() => setSuggestions([]));
            } else {
                setSuggestions([]);
            }
        }, 100);

        fetchSuggestions(searchTerm);

        return () => {
            fetchSuggestions.cancel();
        };
    }, [searchTerm]);

    if (!isMobile) {
        return (
            <div>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger>
                        <Search className="!size-5 opacity-80 group-hover:opacity-100" />
                    </PopoverTrigger>
                    <PopoverContent>
                        <form onSubmit={searchPage}>
                            <Input
                                placeholder="Search..."
                                className="w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                             />
                            {suggestions.length > 0 && (
                                <ul className="mt-2 bg-white border rounded shadow">
                                    {suggestions.map((suggestion, index) => (
                                        <li key={index} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => setSearchTerm(suggestion)}>
                                            {suggestion}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </form>
                    </PopoverContent>
                </Popover>
            </div>
        );
    }
    return (
        <div>
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger>
                    <Search className="!size-5 opacity-80 group-hover:opacity-100" />
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Search</DrawerTitle>
                    </DrawerHeader>
                    <DrawerFooter>
                        <Input
                            placeholder="Search..."
                            className="w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {suggestions.length > 0 && (
                            <ul className="mt-2 bg-white border rounded shadow">
                                {suggestions.map((suggestion, index) => (
                                    <li key={index} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => setSearchTerm(suggestion)}>
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        )}
                        <Button onClick={searchPage}>Submit</Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    );
};

