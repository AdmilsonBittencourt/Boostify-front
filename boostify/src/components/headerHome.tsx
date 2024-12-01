'use client';

import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { User, Home, LogOut } from "lucide-react";
import { useRouter } from 'next/navigation';

export default function HeaderHome(){
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        router.push('/login');
    };

    return (
        <header className="flex justify-between items-center mb-6 px-5 pt-2">
            <h1 className="text-5xl font-bold">Boostify</h1>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Abrir menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push('/home')}>
                        <Home className="mr-2 h-4 w-4" />
                        <span>Início</span>   
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/perfil')}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Perfil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    )
}