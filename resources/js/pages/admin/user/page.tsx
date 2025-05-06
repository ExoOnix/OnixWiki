import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import type { PageProps as InertiaPageProps } from '@inertiajs/core';

import AdminLayout from '@/layouts/admin/layout';
import HeadingSmall from '@/components/heading-small';

import { columns } from "./columns"
import { DataTable } from "./data-table"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Role Admin',
        href: '/admin/role',
    },
];

interface PageProps extends InertiaPageProps {
    users: User[]; // Define the type of users
}

export default function User() {
    const { props } = usePage<PageProps>(); // Use the PageProps interface
    const data: User[] = props.users;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />

            <AdminLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Users" description="Manage Users" />
                    <div className="w-full">
                        <DataTable columns={columns} data={data} />
                    </div>
                </div>
            </AdminLayout>
        </AppLayout>
    );
}
