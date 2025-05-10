import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type NavItem, type SharedData, type Auth } from '@/types';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { usePage } from '@inertiajs/react';


export default function AdminLayout({ children }: PropsWithChildren) {
    const { auth } = usePage<SharedData & { auth: Auth }>().props;

    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const sidebarNavItems: NavItem[] = [
        ...(auth.can['users.view']
            ? [
                  {
                      title: 'Users',
                      href: '/admin/users',
                      icon: null,
                  },
              ]
            : []),
        ...(auth.can['roles.view']
            ? [
                  {
                      title: 'Roles',
                      href: '/admin/roles',
                      icon: null,
                  },
              ]
            : []),
    ];

    const currentPath = window.location.pathname;

    return (
        <div className="px-4 py-6">
            <Heading title="Admin" description="Management" />

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav className="flex flex-col space-y-1 space-x-0">
                        {sidebarNavItems.map((item, index) => (
                            <Button
                                key={`${item.href}-${index}`}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn('w-full justify-start', {
                                    'bg-muted': currentPath === item.href,
                                })}
                            >
                                <Link href={item.href} prefetch>
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                </aside>

                <Separator className="my-6 md:hidden" />

                <div className="w-full">
                    <section className="space-y-12">{children}</section>
                </div>
            </div>
        </div>
    );
}
