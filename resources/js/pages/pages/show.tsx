import BlockViewer from '@/components/block-viewer';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Page, type SharedData, type Auth as BaseAuth } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react'; // Import usePage from Inertia

interface HomeProps {
    page: Page;
}

interface Auth extends BaseAuth {
    can: {
        'edit-pages': boolean;
        'create-pages': boolean;
        'delete-pages': boolean;
    };
}

export default function Home({ page }: HomeProps) {
    const { auth } = usePage<SharedData & { auth: Auth }>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Home',
            href: '/',
        },
        {
            title: page?.title || 'Untitled Page',
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
                        <div>
                            {page?.content ? <BlockViewer blocks={JSON.parse(page.content)} /> : 'No Content Available'}
                                <div className="flex justify-center">
                                    {page && auth.can['edit-pages'] && (
                                        <Button className="mr-2" variant="default" asChild>
                                            <Link href={route('pages.edit', { page: page?.slug })}>Edit</Link>
                                        </Button>
                                    )}
                                    {page && auth.can['delete-pages'] && (
                                        <Button
                                            variant="destructive"
                                            onClick={() => {
                                                if (confirm('Are you sure you want to delete this page?')) {
                                                    router.delete(route('pages.destroy', { page: page?.slug }));
                                                }
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    )}
                                </div>

                            <br />
                            {!page &&
                                auth.can['create-pages'] && (
                                    <Button variant="outline" asChild>
                                        <Link href={route('create.page', { title: 'Home' })}>Create Page</Link>
                                    </Button>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
