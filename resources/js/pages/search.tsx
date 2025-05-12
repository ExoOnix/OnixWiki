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
                <div className="bg-background w-full max-w-screen-md rounded-lg border p-6 shadow">
                    <section>
                        <h1 className="text-foreground mb-6 text-3xl font-semibold">Search Results</h1>
                        <div className="mb-3">
                            <Input placeholder="Search..." onChange={handleSearch} value={text} />
                        </div>
                        <div>
                            {results && results.length > 0 ? (
                                <ul className="space-y-4">
                                    {results.map((result: SearchResult, index: number) => (
                                        <li key={index} className="bg-muted rounded-lg border p-4">
                                            <Link
                                                href={route('pages.show', { page: result.slug })}
                                                className="text-primary text-lg font-medium hover:underline"
                                            >
                                                {result.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-muted-foreground">No results found.</p>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
