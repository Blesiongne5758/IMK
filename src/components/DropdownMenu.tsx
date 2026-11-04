import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export interface MenuItem {
  id: string;
  label: string;
  icon?: any;
  path?: string;
  children?: MenuItem[];
  badge?: number;
}

interface DropdownMenuProps {
  items: MenuItem[];
  activeId?: string;
  onItemClick: (item: MenuItem) => void;
  className?: string;
}

export default function DropdownMenu({ items, activeId, onItemClick, className = '' }: DropdownMenuProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Auto-expand parent of active item
  useEffect(() => {
    if (!activeId) return;
    items.forEach((item) => {
      if (item.children?.some((child) => child.id === activeId)) {
        setExpandedIds((prev) => new Set([...prev, item.id]));
      }
    });
  }, [activeId, items]);

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedIds.has(item.id);
    const isActive = activeId === item.id;

    const baseClasses = `
      w-full flex items-center gap-2 sm:gap-3 
      px-3 sm:px-4 py-2.5 sm:py-3 
      rounded-lg text-xs sm:text-sm font-medium 
      transition-all cursor-pointer
      ${level > 0 ? 'ml-4 sm:ml-6' : ''}
      ${isActive
        ? 'bg-cyan-50 border border-cyan-200 text-cyan-700'
        : 'text-gray-600 hover:text-gray-900 hover:bg-white border border-transparent'
      }
    `;

    return (
      <div key={item.id}>
        <div
          onClick={() => {
            if (hasChildren) {
              toggleExpand(item.id);
            } else if (item.path) {
              onItemClick(item);
            }
          }}
          className={baseClasses}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              if (hasChildren) {
                toggleExpand(item.id);
              } else if (item.path) {
                onItemClick(item);
              }
            }
          }}
        >
          {item.icon && (
            <>
              <item.icon size={16} className="sm:hidden flex-shrink-0" />
              <item.icon size={18} className="hidden sm:block flex-shrink-0" />
            </>
          )}
          <span className="hidden sm:inline flex-1 text-left">{item.label}</span>
          <span className="sm:hidden text-[10px] flex-1 text-left">{item.label}</span>
          
          {item.badge !== undefined && item.badge > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-cyan-100 text-cyan-700 text-[10px] font-semibold">
              {item.badge}
            </span>
          )}

          {hasChildren && (
            <ChevronDown
              size={14}
              className={`transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`}
            />
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav ref={menuRef} className={`space-y-1 ${className}`}>
      {items.map((item) => renderMenuItem(item))}
    </nav>
  );
}
