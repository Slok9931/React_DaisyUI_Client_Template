import { cn } from '@/utils';
import React, { useState } from 'react';

type TabsVariant = 'border' | 'lift' | 'box';
type TabsSize = 'xs' | 'sm' | 'md' | 'lg';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  variant?: TabsVariant;
  size?: TabsSize;
  className?: string;
  onChange?: (tabId: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  size = 'md',
  className = '',
  onChange,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const tabsClasses = [
    'tabs',
    `tabs-${size}`,
    className
  ].filter(Boolean).join(' ');

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div>
      <div className={cn(tabsClasses, "tabs-lift")}>
        {tabs.map((tab) => (
          <a
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'tab-active' : ''} ${tab.disabled ? 'tab-disabled' : ''}`}
            onClick={() => !tab.disabled && handleTabChange(tab.id)}
          >
            {tab.label}
          </a>
        ))}
      </div>
      <div className="mt-4">
        {activeTabContent}
      </div>
    </div>
  );
};