'use client';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { icons } from '@/constants/icons';
import { DashboardSidebarMenuInterface } from '@/lib/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SidebarNavAdminProps {
  menuLinks: DashboardSidebarMenuInterface[];
}

const SidebarNavAdmin = ({ menuLinks }: SidebarNavAdminProps) => {
  const pathname = usePathname();
  const [activeLink, setActiveLink] = useState('');

  useEffect(() => {
    setActiveLink(pathname);
  }, [pathname]);

  return (
    <nav className='relative grow'>
      <h1></h1>
      <Command className='rounded-lg overflow-visible bg-transparent'>
        <CommandInput placeholder='Search...' />
        <CommandList className='py-2 overflow-hidden'>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup className='overflow-visible pt-0 relative'>
            {menuLinks.map((link, index) => {
              let icon;
              const iconSearch = icons.find((icon) => icon.value === link.icon);
              if (iconSearch) icon = <iconSearch.path />;
              const isActive = activeLink === link.link;

              return (
                <CommandItem
                  className={cn('w-full h-12 cursor-pointer')}
                  key={index}
                >
                  <Link
                    href={link.link}
                    className={cn(
                      'flex items-center gap-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-all w-full p-2',
                      isActive && 'bg-accent text-accent-foreground',
                    )}
                  >
                    {icon}
                    <span>{link.label}</span>
                  </Link>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </Command>
    </nav>
  );
};

export default SidebarNavAdmin;
