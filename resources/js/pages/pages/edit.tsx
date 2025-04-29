import Editor from '@/components/editor';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Page } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface HomeProps {
    page: Page;
}

type CreatePageForm = {
    content: string;
};

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
            title: 'Edit',
            href: '#',
        },
    ];

    const { data, setData, patch, processing, errors } = useForm<Required<CreatePageForm>>({
        content: page?.content,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('pages.update', { page: page.slug }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Page" />
            <div className="flex h-full flex-1 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <form className="ms-auto me-auto mt-4 w-[85%] space-y-4" onSubmit={submit}>
                        <h1 className="text-4xl">Editor</h1>
                        <div>
                            <div className="mt-1 w-full">
                                <Editor value={data.content} onChange={(value: string) => setData('content', value)} />
                            </div>
                            {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content}</p>}
                        </div>
                        <Button className="mb-5" type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Edit Page'}
                        </Button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
