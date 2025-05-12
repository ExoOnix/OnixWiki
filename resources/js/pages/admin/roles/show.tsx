import AppLayout from '@/layouts/app-layout';
import { type Role as BaseRole, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import AdminLayout from '@/layouts/admin/layout';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface Ability {
    id: number;
    name: string;
    title: string;
    entity_id: number | null;
    entity_type: string | null;
    only_owned: boolean;
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
    isAssigned: boolean;
}

interface Role extends BaseRole {
    abilities: Ability[];
}

interface RolesPageProps {
    role: Role;
    auth: {
        can: {
            'update-role': boolean;
        };
    };
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Role Admin',
        href: '/admin/roles',
    },
];

export default function User() {
    const { props } = usePage<RolesPageProps>();
    const [abilitiesState, setAbilitiesState] = useState<Record<number, boolean>>(() =>
        Object.fromEntries(props.role.abilities.map((ability) => [ability.id, ability.isAssigned])),
    );

    const handleToggle = (id: number) => {
        setAbilitiesState((prev) => {
            const newState = { ...prev, [id]: !prev[id] };
            router.post(route('admin.roles.setAbility', { role: props.role.id, ability: id, allow: newState[id] }), {
                preserveState: true,
                preserveScroll: true,
            });
            return newState;
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
            <AdminLayout>
                <div className="space-y-6">
                    <HeadingSmall title={props.role.title} description={`Manage the ${props.role.title} role`} />
                    <div className="w-full space-y-3">
                        <p className="text-2xl">Abilities Settings</p>
                        {props.role.abilities.map((ability) => (
                            <div key={ability.id} className="flex items-center space-x-2">
                                <Switch
                                    disabled={!props.auth.can['update-role']}
                                    checked={abilitiesState[ability.id]}
                                    onCheckedChange={() => handleToggle(ability.id)}
                                    id={ability.title}
                                />
                                <Label htmlFor={ability.title}>{ability.title}</Label>
                            </div>
                        ))}
                    </div>
                </div>
            </AdminLayout>
        </AppLayout>
    );
}
