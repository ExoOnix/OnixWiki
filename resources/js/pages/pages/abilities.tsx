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
import { type BreadcrumbItem, type Page } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

type AbilityPerms = {
    ability_name: string;
    ability_id: number;
    target_type: string;
    target_info: RoleInfo | UserInfo;
    forbidden: boolean;
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

export default function Home({ page, permissions }: HomeProps) {
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
                            <div className="mt-6">
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
                                                    <TableRow key={permission.ability_id}>
                                                        <TableCell>{permission.ability_name}</TableCell>
                                                        <TableCell>User: {permission.target_info.name}</TableCell>
                                                        <TableCell>
                                                            {permission.forbidden ? 'Yes' : 'No'}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            } else if (permission.target_type === 'roles') {
                                                return (
                                                    <TableRow key={permission.ability_id}>
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
