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
import React, { useState } from "react";
import { router } from '@inertiajs/react';

export function AppSearch() {
    const isMobile = useIsMobile()
    const [open, setOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")

    const searchPage = (e: React.FormEvent) => {
        e.preventDefault()
        router.get(route("search", {'search': searchTerm}))
    }

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
                        <Button onClick={searchPage}>Submit</Button>

                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    );
};

