import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { debounce } from 'lodash';
import { useMemo, useState } from 'react';

interface SearchResult {
    slug: string;
    title: string;
    description: string;
}

interface HomeProps {
    results: SearchResult[];
}

export default function Home({ results }: HomeProps) {
    const breadcrumbs: { title: string; href: string }[] = [
        { title: 'Home', href: '/' },
        { title: 'Search', href: '#' },
    ];

    const [text, setText] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get('search') || '';
    });

    const debouncedSearch = useMemo(
        () =>
            debounce((value: string) => {
                router.get(route('search', { search: value }), {}, { preserveState: true, preserveScroll: true, replace: true });
            }, 300),
        [],
    );

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
        e.preventDefault();
        const value = e.target.value;
        setText(value);
        debouncedSearch(value);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Search" />
            <div className="flex h-full w-full flex-1 justify-center p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border w-full max-w-screen-md rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-900">
                    <section>
                        <h1 className="mb-6 text-3xl font-semibold text-gray-900 dark:text-white">Search Results</h1>
                        <div className="mb-3">
                            <Input placeholder="Search..." onChange={handleSearch} value={text} />
                        </div>
                        <div>
                            {results && results.length > 0 ? (
                                <ul className="space-y-4">
                                    {results.map((result: SearchResult, index: number) => (
                                        <li
                                            key={index}
                                            className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
                                        >
                                            <Link
                                                href={route('pages.show', { page: result.slug })}
                                                className="text-lg font-medium text-blue-600 hover:underline"
                                            >
                                                {result.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">No results found.</p>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
