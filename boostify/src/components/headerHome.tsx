'use client';

import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { User, Home, Settings } from "lucide-react";
import Link from 'next/link';

export default function HeaderHome(){
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
                    <DropdownMenuItem>
                        <Link href="/home" className="flex items-center">
                            <Home className="mr-2 h-4 w-4" />
                            <span>Início</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href="/perfil" className="flex items-center">
                            <User className="mr-2 h-4 w-4" />
                            <span>Perfil</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Configurações</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    )
}