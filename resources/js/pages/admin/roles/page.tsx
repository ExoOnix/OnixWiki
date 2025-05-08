import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Role } from '@/types';
import { Head } from '@inertiajs/react';

import AdminLayout from '@/layouts/admin/layout';
import HeadingSmall from '@/components/heading-small';
import { usePage, Link } from '@inertiajs/react';

interface RolesPageProps {
    roles: Role[];
    [key: string]: any;
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
                        {props.roles.map((role) => ( // Role type is inferred from RolesPageProps
                            <Link
                                href={route('admin.roles.show', { role: role.id })}
                                key={role.id}
                                className="border rounded px-4 py-2 shadow-sm my-3 flex justify-between items-center"
                            >
                                <span>{role.title}</span>
                                <span className="text-gray-500 text-sm">
                                    {role.abilities_count} permissions
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </AdminLayout>
        </AppLayout>
    );
}
