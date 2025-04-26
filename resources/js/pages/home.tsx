import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Page, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react'; // Import usePage from Inertia
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

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
            <Head title='Home' />
            <div className="flex h-full flex-1 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="mt-4 ms-4">
                        <h1 className="text-5xl mb-4">{page?.title || 'No Title Available'}</h1>
                        <div>
                            {page?.content || 'No Content Avaliable'}
                            <br />
                            {!page && auth.user && ( // Check if user is logged in
                                <Button variant="outline" asChild>
                                    <Link href={route('create.page', { title: 'Home' })}>
                                        Create Page
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
