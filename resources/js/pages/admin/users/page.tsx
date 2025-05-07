import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import type { PageProps as InertiaPageProps } from '@inertiajs/core';

import AdminLayout from '@/layouts/admin/layout';
import HeadingSmall from '@/components/heading-small';

import { columns } from "./columns"
import { DataTable } from "./data-table"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Admin',
        href: '/admin/user',
    },
];

interface PageProps extends InertiaPageProps {
    users: {
        data: (User & { roles: { name: string }[] })[]; // Include roles in the user type
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function User() {
    const { props } = usePage<PageProps>();
    const { data, current_page, last_page } = props.users;

    const handlePageChange = (page: number) => {
        router.get(window.location.pathname, { page }, { preserveState: true, preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />

            <AdminLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Users" description="Manage Users" />
                    <div className="w-full">
                        <DataTable
                            columns={columns}
                            data={data}
                            pagination={{ current_page, last_page }}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            </AdminLayout>
        </AppLayout>
    );
}
