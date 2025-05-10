import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Page } from '@/types';
import { Head } from '@inertiajs/react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { router } from '@inertiajs/react';

interface HomeProps {
    page: Page;
}

export default function Home({ page }: HomeProps) {
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
        router.post(
            route('pages.setRestricted', { page: page.slug }),
            {
                restricted: value,
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Page" />
            <div className="flex h-full flex-1 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="ms-4 mt-4">
                        <h1 className="text-4xl">Abilities</h1>
                        <div className='mt-3'>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    checked={restricted}
                                    id="restricted-mode"
                                    onCheckedChange={toggleRestricted}
                                />
                                <Label htmlFor="restricted-mode">Restricted Mode</Label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
