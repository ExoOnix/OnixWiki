import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Page } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create',
        href: '/create',
    },
    {
        title: 'Page',
        href: '/create/page',
    }
];

interface HomeProps {
    page: Page;
}

type CreatePageForm = {
    title: string;
    content: string;
};

export default function Home({ page }: HomeProps) {
    const queryParams = new URLSearchParams(window.location.search);
    const initialTitle = queryParams.get('title') || ''; // Extract title from query parameters

    const { data, setData, post, processing, errors } = useForm<Required<CreatePageForm>>({
        title: initialTitle,
        content: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('store.page'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Create Page' />
            <div className="flex h-full flex-1 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <form className="mt-4 ms-4 space-y-4" onSubmit={submit}>
                        <div>
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                name="title"
                                type="text"
                                placeholder="Enter the title"
                                className="mt-1 w-full"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                            />
                            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                        </div>
                        <div>
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                                id="content"
                                name="content"
                                placeholder="Enter the content"
                                className="mt-1 w-full h-96"
                                rows={6}
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                            />
                            {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
                        </div>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Page'}
                        </Button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
