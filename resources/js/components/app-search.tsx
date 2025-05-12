import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useIsMobile } from '@/hooks/use-mobile';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { debounce } from 'lodash';
import { Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface Suggestion {
    title: string;
    slug: string;
}

export function AppSearch() {
    const isMobile = useIsMobile();
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

    const searchPage = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('search', { search: searchTerm }));
    };

    useEffect(() => {
        const controller = new AbortController();
        const fetchSuggestions = debounce((term: string) => {
            if (term) {
                axios
                    .get(route('search.suggestions', { search: term }), { signal: controller.signal })
                    .then((response) => setSuggestions(response.data.suggestions))
                    .catch((error) => {
                        if (axios.isCancel(error)) {
                            console.log('Request canceled');
                        } else {
                            setSuggestions([]);
                        }
                    });
            }
        }, 100);

        if (!searchTerm) {
            setSuggestions([]);
            controller.abort();
        } else {
            fetchSuggestions(searchTerm);
        }

        return () => {
            fetchSuggestions.cancel();
            controller.abort();
        };
    }, [searchTerm]);

    if (!isMobile) {
        return (
            <div>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger>
                        <Search className="text-muted-foreground group-hover:text-foreground h-5 w-5" />
                    </PopoverTrigger>
                    <PopoverContent className="bg-background border-border w-80 rounded-md border p-4 shadow-md">
                        <form onSubmit={searchPage}>
                            <Input placeholder="Search..." className="w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            {suggestions.length > 0 && (
                                <ul className="bg-background border-border mt-2 rounded-md border shadow-md">
                                    {suggestions.map((suggestion, index) => (
                                        <li
                                            key={index}
                                            className="hover:bg-accent hover:text-accent-foreground cursor-pointer p-2"
                                            onClick={() => router.get(route('pages.show', { page: suggestion.slug }))}
                                        >
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
            <Drawer open={open} onOpenChange={setOpen} repositionInputs={false}>
                <DrawerTrigger>
                    <Search className="text-muted-foreground group-hover:text-foreground h-5 w-5" />
                </DrawerTrigger>
                <DrawerContent className="bg-background border-border rounded-md border p-4 shadow-md">
                    <DrawerHeader>
                        <DrawerTitle className="text-foreground text-lg font-semibold">Search</DrawerTitle>
                    </DrawerHeader>
                    <DrawerFooter className="flex flex-col gap-4">
                        {suggestions.length > 0 && (
                            <ul className="bg-background border-border mt-2 rounded-md border shadow-md">
                                {suggestions.map((suggestion, index) => (
                                    <li
                                        key={index}
                                        className="hover:bg-accent hover:text-accent-foreground cursor-pointer p-2"
                                        onClick={() => router.get(route('pages.show', { page: suggestion.slug }))}
                                    >
                                        {suggestion.title}
                                    </li>
                                ))}
                            </ul>
                        )}
                        <Input placeholder="Search..." className="w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <Button onClick={searchPage}>Submit</Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    );
}
