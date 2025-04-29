import BlockViewer from '@/components/block-viewer';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Page, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react'; // Import usePage from Inertia

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Home',
        href: '/',
    },
];

interface HomeProps {
    page: Page;
}

export default function Home({ page }: HomeProps) {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Home" />
            <div className="flex h-full flex-1 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="ms-4 mt-4">
                        <h1 className="mb-4 text-5xl">{page?.title || 'No Title Available'}</h1>
                        <div>
                            {page?.content ? <BlockViewer blocks={JSON.parse(page.content)} /> : 'No Content Available'}
                            <br />
                            {!page &&
                                auth.user && ( // Check if user is logged in
                                    <Button variant="outline" asChild>
                                        <Link href={route('pages.create', { title: 'Home' })}>Create Page</Link>
                                    </Button>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
