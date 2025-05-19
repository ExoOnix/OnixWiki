import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Page, type User, type Role } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"

type AbilityPerms = {
    ability_name: string;
    ability_id: number;
    target_type: string;
    target_info: RoleInfo | UserInfo;
    forbidden: boolean;
    id: number;
};


type RoleInfo = {
    id: number;
    name: string;
    title: string;
    scope: string | null;
    created_at: string;
    updated_at: string;
};

type UserInfo = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
  };

interface HomeProps {
    page: Page;
    permissions: AbilityPerms[];
    roles: Role[];
    users: User[];
}

export default function Home({ page, permissions, roles, users }: HomeProps) {
    const [assignToValue, assignToSetValue] = useState("")
    const [assignToOpen, setAssignToOpen] = useState(false)
    const [assignToType, setAssignToType] = useState<"user"|"role"|"">("")
    const [userOptions, setUserOptions] = useState<UserInfo[]>([]);
    const [roleOptions, setRoleOptions] = useState<RoleInfo[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [restricted, setRestricted] = useState(page?.restricted ?? false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Home',
            href: '/',
        },
        {
            title: page?.title || 'Untitled Page',
            href: `/pages/${page?.slug}`,
        },
        {
            title: 'Abilities',
            href: '#',
        },
    ];

    const toggleRestricted = (value: boolean) => {
        setRestricted(value);
        router.post(route('pages.setRestricted', { page: page.slug }), {
            restricted: value,
            preserveState: true,
            preserveScroll: true,
        });
    };

    useEffect(() => {
        if (assignToOpen) {
            // Fetch both users and roles on open, or filter by searchTerm
            fetch(`/search/users?q=${encodeURIComponent(searchTerm)}`)
                .then(res => res.json())
                .then(data => setUserOptions(data.users || []));
            fetch(`/search/roles?q=${encodeURIComponent(searchTerm)}`)
                .then(res => res.json())
                .then(data => setRoleOptions(data.roles || []));
        }
    }, [assignToOpen, searchTerm]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Page" />
            <div className="flex h-full flex-1 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="ms-4 mt-4">
                        <h1 className="text-4xl">Abilities</h1>
                        <div className="mt-3">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    checked={restricted}
                                    id="restricted-mode"
                                    onCheckedChange={toggleRestricted}
                                />
                                <Label htmlFor="restricted-mode">Restricted Mode</Label>
                            </div>

                            {/* Permissions Table */}
                            <div className="flex justify-end mt-6 pr-4">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button>
                                            Add Ability Override
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="max-w-xs w-full">
                                        <Label htmlFor="abilities">Set ability type</Label>

                                        <Select name="abilities">
                                            <SelectTrigger className="min-w-[140px] w-full">
                                                <SelectValue placeholder="Select a ability type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Abilities</SelectLabel>
                                                    <SelectItem value="view">View</SelectItem>
                                                    <SelectItem value="create">Create</SelectItem>
                                                    <SelectItem value="update">Update</SelectItem>
                                                    <SelectItem value="delete">Delete</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <Label htmlFor="assignTo">Assign to</Label>
                                        <div>
                                            <Popover open={assignToOpen} onOpenChange={setAssignToOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button variant="outline" className="min-w-[140px] w-full justify-start text-left">
                                                        {assignToValue ? assignToValue : "Select user or role"}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="max-w-xs w-full p-0">
                                                    <Command>
                                                        <CommandInput
                                                            placeholder="Search user or role..."
                                                            value={searchTerm}
                                                            onValueChange={setSearchTerm}
                                                        />
                                                        <CommandList>
                                                            <CommandEmpty>No match found.</CommandEmpty>
                                                            <CommandGroup heading="Roles">
                                                                {roleOptions.map((role) => (
                                                                    <CommandItem
                                                                        key={`role-${role.id}`}
                                                                        value={role.name}
                                                                        onSelect={() => {
                                                                            assignToSetValue(role.name);
                                                                            setAssignToType("role");
                                                                            setAssignToOpen(false);
                                                                        }}
                                                                    >
                                                                        {role.name}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                            <CommandGroup heading="Users">
                                                                {userOptions.map((user) => (
                                                                    <CommandItem
                                                                        key={`user-${user.id}`}
                                                                        value={user.name}
                                                                        onSelect={() => {
                                                                            assignToSetValue(user.name);
                                                                            setAssignToType("user");
                                                                            setAssignToOpen(false);
                                                                        }}
                                                                    >
                                                                        {user.name}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                        <div className="flex items-center space-x-2 mt-3">
                                            <Switch id="forbidden" />
                                            <Label htmlFor="forbidden">Forbidden Mode</Label>
                                        </div>
                                        <Button className="mt-4">
                                            Submit
                                        </Button>
                                    </PopoverContent>
                                </Popover>

                            </div>

                            <div className="mt-2">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Ability</TableHead>
                                            <TableHead>Assigned To</TableHead>
                                            <TableHead>Forbidden</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {permissions.map((permission) => {
                                            if (permission.target_type === 'App\\Models\\User') {
                                                return (
                                                    <TableRow key={permission.id}>
                                                        <TableCell>{permission.ability_name}</TableCell>
                                                        <TableCell>User: {permission.target_info.name}</TableCell>
                                                        <TableCell>
                                                            {permission.forbidden ? 'Yes' : 'No'}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            } else if (permission.target_type === 'roles') {
                                                return (
                                                    <TableRow key={permission.id}>
                                                        <TableCell>{permission.ability_name}</TableCell>
                                                        <TableCell>Role: {permission.target_info.name}</TableCell>
                                                        <TableCell>
                                                            {permission.forbidden ? 'Yes' : 'No'}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            }
                                            return null;
                                        })}

                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
