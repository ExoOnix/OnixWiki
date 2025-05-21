import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Role } from '@/types';
import { Head } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import AdminLayout from '@/layouts/admin/layout';
import { Link, usePage } from '@inertiajs/react';

interface RolesPageProps {
    roles: Role[];
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Role Admin',
        href: '/admin/roles',
    },
];

export default function User() {
    const { props } = usePage<RolesPageProps>(); // Corrected type for usePage
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
            <AdminLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Roles" description="Manage Roles" />
                    <div className="w-full">
                        {props.roles.map(
                            (
                                role, // Role type is inferred from RolesPageProps
                            ) => (
                                <Link
                                    href={route('admin.roles.show', { role: role.id })}
                                    key={role.id}
                                    className="my-3 flex items-center justify-between rounded border px-4 py-2 shadow-sm"
                                >
                                    <span>{role.title}</span>
                                    <span className="text-sm text-gray-500">{role.abilities_count} permissions</span>
                                </Link>
                            ),
                        )}
                    </div>
                </div>
            </AdminLayout>
        </AppLayout>
    );
}
