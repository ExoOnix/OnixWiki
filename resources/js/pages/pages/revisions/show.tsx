import BlockViewer from '@/components/block-viewer';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type Auth, type BreadcrumbItem, type Page, type SharedData, type PageRevision } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react'; // Import usePage from Inertia

interface HomeProps {
    page: Page;
    revision: PageRevision;
}

export default function Home({ page, revision }: HomeProps) {
    const { auth } = usePage<SharedData & { auth: Auth }>().props;

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
            title: 'Revision History',
            href: `/pages/${page?.slug}/revisions`,
        },
        {
            title: `Revision ${revision.id}`,
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={page?.title || 'Untitled Page'} />
            <div className="flex h-full flex-1 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="ms-4 mt-4">
                        <h1 className="mb-4 text-5xl">{page?.title || 'No Title Available'}</h1>
                        {page?.content ? <BlockViewer blocks={JSON.parse(revision.content)} /> : 'No Content Available'}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
