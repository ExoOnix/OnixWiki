import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type Auth, type SharedData, type User } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { Lock, LogOut, Settings } from 'lucide-react';

interface UserMenuContentProps {
    user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const { auth } = usePage<SharedData & { auth: Auth }>().props;

    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                {auth.can['users.view'] ? (
                    <DropdownMenuItem asChild>
                        <Link className="block w-full" href={route('admin.users.index')} as="button" prefetch onClick={cleanup}>
                            <Lock className="mr-2" />
                            Admin
                        </Link>
                    </DropdownMenuItem>
                ) : auth.can['roles.view'] ? (
                    <DropdownMenuItem asChild>
                        <Link className="block w-full" href={route('admin.roles.index')} as="button" prefetch onClick={cleanup}>
                            <Lock className="mr-2" />
                            Admin
                        </Link>
                    </DropdownMenuItem>
                ) : null}
                <DropdownMenuItem asChild>
                    <Link className="block w-full" href={route('profile.edit')} as="button" prefetch onClick={cleanup}>
                        <Settings className="mr-2" />
                        Settings
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link className="block w-full" method="post" href={route('logout')} as="button" onClick={handleLogout}>
                    <LogOut className="mr-2" />
                    Log out
                </Link>
            </DropdownMenuItem>
        </>
    );
}
