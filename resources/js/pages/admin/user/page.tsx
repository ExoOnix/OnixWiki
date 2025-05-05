import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react'; // Import usePage from Inertia

import AdminLayout from '@/layouts/admin/layout';
import HeadingSmall from '@/components/heading-small';

import { Payment, columns } from "./columns"
import { DataTable } from "./data-table"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Role Admin',
        href: '/admin/role',
    },
];

function getData(): Payment[] {
    // Fetch data from your API here.
    return [
        {
            id: "728ed52f",
            amount: 100,
            status: "pending",
            email: "m@example.com",
        },
        // ...
    ]
}

export default function User() {
    const data = getData()

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
