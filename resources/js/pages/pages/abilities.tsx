import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Page } from '@/types';
import { Head } from '@inertiajs/react';

interface HomeProps {
    page: Page;
}


export default function Home({ page }: HomeProps) {
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



    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Page" />
            <div className="flex h-full flex-1 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="ms-4 mt-4">
                        <h1 className="text-4xl">Abilities</h1>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
