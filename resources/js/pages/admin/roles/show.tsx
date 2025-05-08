import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Role as BaseRole } from '@/types';
import { Head } from '@inertiajs/react';

import AdminLayout from '@/layouts/admin/layout';
import HeadingSmall from '@/components/heading-small';
import { usePage } from '@inertiajs/react';

interface Ability {
    id: number;
    name: string;
    title: string;
    entity_id: number | null;
    entity_type: string | null;
    only_owned: boolean;
    options: any[]; // you can replace `any` with a more specific type if known
    scope: string | null;
    created_at: string;
    updated_at: string;
    pivot: {
        entity_type: string;
        entity_id: number;
        ability_id: number;
        forbidden: number;
        scope: string | null;
    };
}

interface Role extends BaseRole {
    abilities: Ability[];
}


interface RolesPageProps {
    role: Role;
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
                    <HeadingSmall title={props.role.title} description={`Manage the ${props.role.title} role`} />
                    <div className="w-full">
                        <p className='text-2xl'>Abilities list</p>
                        <ul className="list-disc pl-5">
                            {props.role.abilities.map((ability: Ability) => (
                                <li key={ability.title} className="my-2">
                                    {ability.title}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </AdminLayout>
        </AppLayout>
    );
}
