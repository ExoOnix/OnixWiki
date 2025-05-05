import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react'; // Import usePage from Inertia

import AdminLayout from '@/layouts/admin/layout';
import HeadingSmall from '@/components/heading-small';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Role Admin',
        href: '/admin/role',
    },
];


export default function Role() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />

            <AdminLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Roles" description="Manage Roles and Permissions" />
                    <h1>test</h1>
                </div>
            </AdminLayout>
        </AppLayout>
    );
}
