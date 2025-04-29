import Editor from '@/components/editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create',
        href: '/pages/create',
    },
];

type CreatePageForm = {
    title: string;
    content: string;
};

export default function Home() {
    const queryParams = new URLSearchParams(window.location.search);
    const initialTitle = queryParams.get('title') || ''; // Extract title from query parameters

    const { data, setData, post, processing, errors } = useForm<Required<CreatePageForm>>({
        title: initialTitle,
        content: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('pages.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Page" />
            <div className="flex h-full flex-1 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <form className="ms-auto me-auto mt-4 w-[85%] space-y-4" onSubmit={submit}>
                        <h1 className="text-4xl">Editor</h1>

                        <div>
                            <Label htmlFor="title" className="block text-sm font-medium">
                                Title
                            </Label>
                            <Input
                                id="title"
                                name="title"
                                type="text"
                                placeholder="Enter the title"
                                className="mt-1 w-full"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                            />
                            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                        </div>
                        <div>
                            <Label htmlFor="content" className="block text-sm font-medium">
                                Content
                            </Label>
                            <div className="mt-1 w-full">
                                <Editor value={data.content} onChange={(value: string) => setData('content', value)} />
                            </div>
                            {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content}</p>}
                        </div>
                        <Button className="mb-5" type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Page'}
                        </Button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
