import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Page } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

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
}

type FormInput = {
    permission: string;
    target_type: string;
    target_id: number;
    forbidden: boolean;
};

export default function Home({ page, permissions }: HomeProps) {
    const [assignToValue, assignToSetValue] = useState('');
    const [assignToOpen, setAssignToOpen] = useState(false);
    const [userOptions, setUserOptions] = useState<UserInfo[]>([]);
    const [roleOptions, setRoleOptions] = useState<RoleInfo[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [restricted, setRestricted] = useState(page?.restricted ?? false);
    const [formError, setFormError] = useState('');

    const { data, setData, post, processing, reset } = useForm<FormInput>({
        permission: '',
        target_type: '',
        target_id: 0,
        forbidden: false,
    });

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
            fetch(route('search.users', { q: searchTerm }))
                .then((res) => res.json())
                .then((data) => setUserOptions(data.users || []));
            fetch(route('search.roles', { q: searchTerm }))
                .then((res) => res.json())
                .then((data) => setRoleOptions(data.roles || []));
        }
    }, [assignToOpen, searchTerm]);

    const handleSubmit = () => {
        if (!data.permission || !data.target_type || !data.target_id) {
            setFormError('Please fill in all fields.');
            return;
        }

        setFormError(''); // clear error if passing

        post(route('pages.setAbility', { page: page.slug }), {
            onSuccess: () => {
                reset();
                assignToSetValue('');
            },
        });
    };

    const handleDelete = (permissionId: number) => {
        router.post(
            route('pages.deleteAbility', { page: page.slug }),
            { permission: permissionId },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Page" />
            <div className="flex h-full flex-1 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="ms-4 mt-4">
                        <h1 className="text-4xl">Abilities</h1>
                        <div className="mt-3">
                            <div className="flex items-center space-x-2">
                                <Switch checked={restricted} id="restricted-mode" onCheckedChange={toggleRestricted} />
                                <Label htmlFor="restricted-mode">Restricted Mode</Label>
                            </div>

                            <div className="mt-6 flex justify-end pr-4">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button>Add Ability Override</Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full max-w-xs">
                                        <Label htmlFor="abilityType">Set ability type</Label>
                                        <Select name="abilityType" value={data.permission} onValueChange={(value) => setData('permission', value)}>
                                            <SelectTrigger className="w-full min-w-[140px]">
                                                <SelectValue placeholder="Select an ability type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Abilities</SelectLabel>
                                                    <SelectItem value="view">View</SelectItem>
                                                    <SelectItem value="update">Update</SelectItem>
                                                    <SelectItem value="update.abilities">Update Page Abilities</SelectItem>
                                                    <SelectItem value="delete">Delete</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>

                                        <Label htmlFor="assignTo" className="mt-4 block">
                                            Assign to
                                        </Label>
                                        <div>
                                            <Popover open={assignToOpen} onOpenChange={setAssignToOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button variant="outline" className="w-full min-w-[140px] justify-start text-left">
                                                        {assignToValue ? assignToValue : 'Select user or role'}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-full max-w-xs p-0">
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
                                                                            setData('target_type', 'role');
                                                                            setData('target_id', role.id);
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
                                                                            setData('target_type', 'user');
                                                                            setData('target_id', user.id);
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

                                        <div className="mt-3 flex items-center space-x-2">
                                            <Switch
                                                id="forbidden"
                                                checked={data.forbidden}
                                                onCheckedChange={(value) => setData('forbidden', value)}
                                            />
                                            <Label htmlFor="forbidden">Forbidden Mode</Label>
                                        </div>
                                        {formError && <div className="mt-3 text-sm font-medium text-red-600">{formError}</div>}

                                        <Button className="mt-4" onClick={handleSubmit} disabled={processing}>
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
                                            <TableHead>Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {permissions.map((permission) => {
                                            const targetType = permission.target_type;
                                            const targetInfo = permission.target_info;
                                            return (
                                                <TableRow key={permission.id}>
                                                    <TableCell>{permission.ability_name}</TableCell>
                                                    <TableCell>
                                                        {targetType === 'App\\Models\\User'
                                                            ? `User: ${targetInfo.name}`
                                                            : targetType === 'roles'
                                                              ? `Role: ${targetInfo.name}`
                                                              : 'Unknown'}
                                                    </TableCell>
                                                    <TableCell>{permission.forbidden ? 'Yes' : 'No'}</TableCell>
                                                    <TableCell>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDelete(permission.id)}
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
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
