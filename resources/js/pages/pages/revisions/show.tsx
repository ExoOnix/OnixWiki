import BlockViewer from '@/components/block-viewer';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Page, type PageRevision, type SharedData, type Auth } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

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
            title: `Revision #${revision.id}`,
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
                        <div className="flex justify-center">
                            {page && auth.can['update-pages'] && (
                                <Button
                                    onClick={() => {
                                        if (confirm('Are you sure you want to revert to this revision?')) {
                                            router.patch(route('pages.revisions.revert', { page: page.slug, revision: revision }));
                                        }
                                    }}
                                >
                                    Revert
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
