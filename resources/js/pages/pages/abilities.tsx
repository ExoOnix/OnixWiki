import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Page } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

type AbilityPerms = {
    id: number;
    ability_id: number;
    entity_id: number;
    entity_type: string;
    forbidden: boolean;
    scope: string | null;
    ability_name: string;
    ability_title: string;
    ability_entity_type: string;
    ability_scope: string | null;
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
                                <Switch checked={restricted} id="restricted-mode" onCheckedChange={toggleRestricted} />
                                <Label htmlFor="restricted-mode">Restricted Mode</Label>
                            </div>
                            {/* Loop over permissions and display them */}
                            {permissions.map((permission) => (
                                <div key={permission.id} className="mt-3">
                                    <h3
                                        className="my-3 flex items-center justify-between rounded border px-4 py-2 shadow-sm"
                                    >
                                        <span>{permission.ability_name}</span>
                                        <span className="text-sm text-gray-500">{permission.entity_id}</span>
                                        <span className="text-sm text-gray-500">{permission.forbidden ? 'true' : 'false'}</span>
                                    </h3>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
