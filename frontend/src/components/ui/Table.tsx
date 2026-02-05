import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown, MoreHorizontal, ArrowUpDown } from 'lucide-react';

interface Column<T> {
    header: string;
    accessorKey: keyof T | ((row: T) => React.ReactNode);
    className?: string;
    cell?: (row: T) => React.ReactNode;
}

interface Action<T> {
    label: string;
    onClick: (row: T) => void;
    className?: string;
    icon?: React.ReactNode;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    onRowClick?: (row: T) => void;
    isLoading?: boolean;
    actions?: Action<T>[];
}

export function DataTable<T extends { id: string | number }>({
    data,
    columns,
    onRowClick,
    isLoading,
    actions
}: DataTableProps<T>) {
    const [openMenuRowId, setOpenMenuRowId] = useState<string | number | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuRowId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (isLoading) {
        return (
            <div className="w-full h-64 flex items-center justify-center text-gray-400">
                Loading data...
            </div>
        );
    }

    const safeData = Array.isArray(data) ? data : [];

    return (
        <div className="w-full overflow-hidden rounded-xl border border-gray-200/60 dark:border-gray-800 bg-white dark:bg-[#1e1e1e] shadow-xl shadow-gray-200/20 dark:shadow-none transition-all duration-300">
            <div className="overflow-x-auto min-h-[400px]">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50/80 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-100 dark:border-gray-800 backdrop-blur-sm">
                        <tr>
                            {columns.map((col, idx) => (
                                <th key={idx} className={cn("px-6 py-4 text-xs font-semibold uppercase tracking-wider transition-colors hover:bg-gray-100/50 dark:hover:bg-gray-800", col.className)}>
                                    <div className="flex items-center gap-2 cursor-pointer group">
                                        {col.header}
                                        <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
                                    </div>
                                </th>
                            ))}
                            {actions && <th className="px-6 py-4 w-10"></th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100/80 dark:divide-gray-800">
                        {safeData.map((row) => (
                            <tr
                                key={row.id}
                                onClick={() => onRowClick?.(row)}
                                className="group hover:bg-gray-50/80 dark:hover:bg-blue-900/10 transition-colors cursor-pointer"
                            >
                                {columns.map((col, idx) => (
                                    <td key={idx} className={cn("px-6 py-4 text-gray-600 dark:text-gray-300 font-medium", col.className)}>
                                        {col.cell ? col.cell(row) : (row[col.accessorKey as keyof T] as React.ReactNode)}
                                    </td>
                                ))}
                                {actions && (
                                    <td className="px-6 py-4 text-right relative">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenMenuRowId(openMenuRowId === row.id ? null : row.id);
                                            }}
                                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                        
                                        {openMenuRowId === row.id && (
                                            <div 
                                                ref={menuRef}
                                                className="absolute right-8 top-8 w-48 bg-white dark:bg-[#1e1e1e] rounded-xl shadow-2xl shadow-gray-200/50 dark:shadow-black/50 border border-gray-100 dark:border-gray-700 z-50 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-100"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {actions.map((action, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => {
                                                            action.onClick(row);
                                                            setOpenMenuRowId(null);
                                                        }}
                                                        className={cn(
                                                            "w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 flex items-center gap-3 transition-colors font-medium text-gray-600 dark:text-gray-300",
                                                            action.className
                                                        )}
                                                    >
                                                        {action.icon}
                                                        {action.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer (Placeholder) */}
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500">
                <span>Showing 1 to {data.length} of {data.length} entries</span>
                <div className="flex gap-2">
                    <button className="px-3 py-1 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50">Previous</button>
                    <button className="px-3 py-1 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50">Next</button>
                </div>
            </div>
        </div>
    );
}
