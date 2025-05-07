"use client"

import { ColumnDef } from "@tanstack/react-table"
import { type User, type Role } from "@/types"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { router, usePage } from "@inertiajs/react";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface RolesPageProps {
    roles: Role[]; // Ensure roles is an array of Role objects
}

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "roles",
        header: "Roles",
        cell: ({ row }) => {
            const roles = Array.isArray(row.original.roles) ? row.original.roles : []; // Ensure roles is an array
            return roles.length > 0
                ? roles.map((role) => role.title).join(", ") // Use role.title consistently
                : "No roles assigned";
        },
    },
    {
        accessorKey: "created_at",
        header: "Created At",
        cell: ({ row }) => {
            const createdAt: string = row.original.created_at;
            const date = new Date(createdAt);
            return new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "numeric",
                minute: "2-digit",
            }).format(date);
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const user: User = row.original;
            const { props } = usePage<{ props: RolesPageProps }>();
            const roles = props.roles as Role[]; // Explicitly cast props.roles to Role[]

            // Ensure roles is an array and get the user's current role title or default to "No Roles"
            const userRoleTitle = Array.isArray(user.roles) && user.roles.length > 0
                ? user.roles[0].title // Use title instead of name
                : "No Roles";

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(String(user.id))}
                        >
                            Copy user ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <RadioGroup
                            className="my-3"
                            defaultValue={userRoleTitle} // Match defaultValue with role.title
                            onValueChange={(selectedRoleTitle) => {
                                const selectedRoleId = roles.find((role) => role.title === selectedRoleTitle)?.id || null; // Match by title
                                router.post(route('admin.users.assignRole', { user: user.id, role_id: selectedRoleId }), { preserveState: true, preserveScroll: true })
                            }}
                        >
                            {roles.map((role) => (
                                <div key={role.id} className="flex items-center space-x-2">
                                    <RadioGroupItem value={role.title} id={`role-${role.id}`} /> {/* Use title */}
                                    <Label htmlFor={`role-${role.id}`}>{role.title}</Label> {/* Use title */}
                                </div>
                            ))}
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="No Roles" id="no-roles" />
                                <Label htmlFor="no-roles">No Roles</Label>
                            </div>
                        </RadioGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive"
                            onClick={() => router.delete(route('admin.users.destroy', { user: user.id }), { preserveState: true, preserveScroll: true })}
                        >Delete user</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
]
