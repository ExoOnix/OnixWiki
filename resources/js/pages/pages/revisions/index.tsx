import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Page, type PageRevision } from '@/types';
import { Head } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import AdminLayout from '@/layouts/admin/layout';
import { Link, usePage } from '@inertiajs/react';

interface HomeProps {
    page: Page;
    revisions: PageRevision[];
}


export default function Revisions({ page, revisions }: HomeProps) {
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
            href: '#',
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Revisions" />
            <div className='px-4 py-6'>
                <div className='mt-3'>
                    <HeadingSmall title="Revisions" description="Browse Revisions" />
                </div>
                <div className="space-y-6">
                    <div className="w-full">
                        <Link
                            href={route('pages.show', { page: page })}
                            key='Current'
                            className="my-3 flex items-center justify-between rounded border px-4 py-2 shadow-sm"
                        >
                            <span>Current</span>
                        </Link>
                        {revisions.map(
                            (revision) => (
                                <Link
                                    href={route('pages.revisions.show', { page: page, revision: revision })}
                                    key={revision.id}
                                    className="my-3 flex items-center justify-between rounded border px-4 py-2 shadow-sm"
                                >
                                    <span>{new Date(revision.created_at).toLocaleString()}</span>
                                    <span className="text-sm text-gray-500">{revision.user.name}</span>
                                </Link>
                            ),
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
