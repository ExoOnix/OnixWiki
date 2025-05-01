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

interface Suggestion {
    title: string;
    slug: string;
}

export function AppSearch() {
    const isMobile = useIsMobile()
    const [open, setOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

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
                        <Search className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4 bg-background border border-border rounded-md shadow-md">
                        <form onSubmit={searchPage}>
                            <Input
                                placeholder="Search..."
                                className="w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                             />
                            {suggestions.length > 0 && (
                                <ul className="mt-2 bg-background border border-border rounded-md shadow-md">
                                    {suggestions.map((suggestion, index) => (
                                        <li key={index} className="p-2 hover:bg-accent hover:text-accent-foreground cursor-pointer" onClick={() => router.get(route("pages.show", {page: suggestion.slug}))}>
                                            {suggestion.title}
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
                    <Search className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
                </DrawerTrigger>
                <DrawerContent className="p-4 bg-background border border-border rounded-md shadow-md">
                    <DrawerHeader>
                        <DrawerTitle className="text-lg font-semibold text-foreground">Search</DrawerTitle>
                    </DrawerHeader>
                    <DrawerFooter className="flex flex-col gap-4">
                        {suggestions.length > 0 && (
                            <ul className="mt-2 bg-background border border-border rounded-md shadow-md">
                                {suggestions.map((suggestion, index) => (
                                    <li key={index} className="p-2 hover:bg-accent hover:text-accent-foreground cursor-pointer" onClick={() => router.get(route("pages.show", { page: suggestion.slug }))}>
                                        {suggestion.title}
                                    </li>
                                ))}
                            </ul>
                        )}
                        <Input
                            placeholder="Search..."
                            className="w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button onClick={searchPage}>Submit</Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    );
};

