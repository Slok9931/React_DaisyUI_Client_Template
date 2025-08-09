import React, { useMemo, useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';
import { Card, CardBody, SearchBar, Tooltip } from '@/components';

const iconEntries = Object.entries(LucideIcons).filter(
  ([, icon]) =>
    typeof icon === 'object' &&
    icon !== null &&
    'displayName' in icon &&
    typeof (icon as any).displayName === 'string'
) as Array<[string, ForwardRefExoticComponent<any> & RefAttributes<SVGSVGElement>]>;

interface InfinityIconsProps {
  color?: string;
  iconSize?: number | string;
  className?: string;
  cardClassName?: string;
  style?: React.CSSProperties;
  batchSize?: number;
}

const ShimmerGrid: React.FC<{ iconSize: number | string; count?: number }> = ({ iconSize, count = 100 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="animate-pulse bg-base-200 rounded-lg flex items-center justify-center border border-base-300 aspect-square"
          style={{
            minHeight: 48,
          }}
        >
          <div
            className="bg-base-300 rounded-full animate-pulse"
            style={{
              width: typeof iconSize === 'number' ? iconSize : 28,
              height: typeof iconSize === 'number' ? iconSize : 28,
            }}
          />
        </div>
      ))}
    </>
  );
};

export const InfinityIcons: React.FC<InfinityIconsProps> = ({
  color = 'currentColor',
  iconSize = 24,
  className = '',
  cardClassName = '',
  style,
  batchSize = 100,
}) => {
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const filteredIcons = useMemo(() => {
    if (!search) return iconEntries;
    return iconEntries.filter(([name]) =>
      name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  React.useEffect(() => {
    setVisibleCount(batchSize);
    setInitialLoading(true);
    const timeout = setTimeout(() => setInitialLoading(false), 600);
    return () => clearTimeout(timeout);
  }, [search, batchSize]);

  const visibleIcons = filteredIcons.slice(0, visibleCount);

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(c => c + batchSize);
      setLoadingMore(false);
    }, 800);
  };

  const clearSearch = () => setSearch('');

  return (
    <div className={`w-full ${className}`} style={style}>
      {/* Search Bar with Chip */}
      <div className="sticky top-0 z-10 bg-base-100 border-b border-base-300 p-4 shadow-sm">
        <SearchBar
          value={search}
          onChange={e => setSearch(e.target.value)}
          onClear={clearSearch}
          placeholder="Search infinity icons..."
          width="w-full"
        />
        <div className="text-xs text-base-content/60 mt-2">
          {filteredIcons.length} icons found
        </div>
      </div>

      {/* Icons Grid */}
      <div className="p-2 grid grid-cols-4 sm:grid-cols-8 md:grid-cols-12 lg:grid-cols-16 gap-2">
        {initialLoading ? (
          <ShimmerGrid iconSize={iconSize} count={batchSize} />
        ) : (
          <>
            {visibleIcons.map(([name, Icon]) => (
              <Tooltip key={name} tip={name}>
                <Card
                  className={`flex items-center justify-center cursor-pointer transition-all hover:bg-primary/20 hover:scale-105 aspect-square ${cardClassName}`}
                  compact
                  bordered
                >
                  <CardBody className="flex items-center justify-center p-2">
                    <Icon
                      className="transition-all duration-200"
                      color={color}
                      size={iconSize}
                    />
                  </CardBody>
                </Card>
              </Tooltip>
            ))}
            {/* Loading More Shimmer */}
            {loadingMore && (
              <ShimmerGrid iconSize={iconSize} count={batchSize} />
            )}
          </>
        )}
      </div>

      {/* No Results */}
      {!initialLoading && filteredIcons.length === 0 && (
        <div className="text-center text-base-content/60 py-12">
          <div className="text-lg font-medium">No icons found</div>
          <div className="text-sm">Try a different search term</div>
        </div>
      )}

      {/* Load More Button */}
      {!initialLoading && visibleCount < filteredIcons.length && (
        <div className="flex justify-center p-6">
          <button
            className="btn btn-primary btn-sm gap-2 min-w-32"
            onClick={handleLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Loading...
              </>
            ) : (
              <>
                Load More
                <div className="badge badge-secondary badge-sm">
                  +{Math.min(batchSize, filteredIcons.length - visibleCount)}
                </div>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};