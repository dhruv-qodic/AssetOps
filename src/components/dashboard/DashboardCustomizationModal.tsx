import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  SlidersHorizontal,
  Search,
  Check,
  RotateCcw,
  Sparkles,
  BarChart3,
  X,
  CreditCard,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DASHBOARD_CARDS,
  DASHBOARD_WIDGETS,
  type DashboardCardDefinition,
  type DashboardWidgetDefinition,
} from '@/constans/dashboard.constants';
import { useDashboardStore } from '@/store/useDashboardStore';

interface DashboardCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DashboardCustomizationModal: React.FC<DashboardCustomizationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    visibleCardIds,
    visibleWidgetIds,
    toggleCard,
    toggleWidget,
    resetLayoutToDefault,
    selectAllCardsAndWidgets,
  } = useDashboardStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'cards' | 'widgets'>('all');

  const filteredCards = useMemo(() => {
    return DASHBOARD_CARDS.filter((card) => {
      const matchesSearch =
        card.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [searchQuery]);

  const filteredWidgets = useMemo(() => {
    return DASHBOARD_WIDGETS.filter((widget) => {
      const matchesSearch =
        widget.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        widget.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [searchQuery]);

  const totalSelected = visibleCardIds.length + visibleWidgetIds.length;
  const totalAvailable = DASHBOARD_CARDS.length + DASHBOARD_WIDGETS.length;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800/80">
          <DialogHeader className="text-left space-y-1">
            <div className="flex items-center gap-2 text-[#4C40F7]">
              <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50">
                <SlidersHorizontal className="size-4 text-[#4C40F7]" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#4C40F7]">
                Dashboard Customizer
              </span>
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
              Customize Dashboard Layout & Widgets
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Select which metrics, activity streams, and analytics charts should be visible on your
              dashboard.
            </DialogDescription>
          </DialogHeader>

          {/* Search & Tabs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search metrics and charts..."
                className="pl-9 h-9 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={cn(
                  'px-3 py-1 rounded-md transition-all cursor-pointer',
                  activeTab === 'all'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white',
                )}
              >
                All ({totalAvailable})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('cards')}
                className={cn(
                  'px-3 py-1 rounded-md transition-all cursor-pointer',
                  activeTab === 'cards'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white',
                )}
              >
                KPI Cards ({DASHBOARD_CARDS.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('widgets')}
                className={cn(
                  'px-3 py-1 rounded-md transition-all cursor-pointer',
                  activeTab === 'widgets'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white',
                )}
              >
                Charts ({DASHBOARD_WIDGETS.length})
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body: Scrollable Widget Cards */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-left">
          {/* Section 1: KPI Summary Cards */}
          {(activeTab === 'all' || activeTab === 'cards') && filteredCards.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="size-4 text-indigo-500" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Summary KPI Cards
                  </h4>
                </div>
                <span className="text-[11px] font-medium text-slate-400">
                  {visibleCardIds.length} of {DASHBOARD_CARDS.length} active
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {filteredCards.map((card: DashboardCardDefinition) => {
                  const isChecked = visibleCardIds.includes(card.id);
                  return (
                    <div
                      key={card.id}
                      onClick={() => toggleCard(card.id)}
                      className={cn(
                        'flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer text-left',
                        isChecked
                          ? 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800/60 shadow-2xs'
                          : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/80 dark:border-slate-800 opacity-60 hover:opacity-100',
                      )}
                    >
                      <div
                        className={cn(
                          'size-4.5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors',
                          isChecked
                            ? 'bg-[#4C40F7] text-white'
                            : 'border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900',
                        )}
                      >
                        {isChecked && <Check className="size-3 stroke-[3]" />}
                      </div>
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {card.label}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 2: Charts and Activity Widgets */}
          {(activeTab === 'all' || activeTab === 'widgets') && filteredWidgets.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="size-4 text-sky-500" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Charts & Activity Widgets
                  </h4>
                </div>
                <span className="text-[11px] font-medium text-slate-400">
                  {visibleWidgetIds.length} of {DASHBOARD_WIDGETS.length} active
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {filteredWidgets.map((widget: DashboardWidgetDefinition) => {
                  const isChecked = visibleWidgetIds.includes(widget.id);
                  return (
                    <div
                      key={widget.id}
                      onClick={() => toggleWidget(widget.id)}
                      className={cn(
                        'flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer text-left',
                        isChecked
                          ? 'bg-sky-50/40 dark:bg-sky-950/20 border-sky-200 dark:border-sky-800/60 shadow-2xs'
                          : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/80 dark:border-slate-800 opacity-60 hover:opacity-100',
                      )}
                    >
                      <div
                        className={cn(
                          'size-4.5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors',
                          isChecked
                            ? 'bg-sky-600 text-white'
                            : 'border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900',
                        )}
                      >
                        {isChecked && <Check className="size-3 stroke-[3]" />}
                      </div>
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {widget.label}
                          </p>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {widget.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {filteredCards.length === 0 && filteredWidgets.length === 0 && (
            <div className="py-12 text-center text-slate-400">
              <Search className="size-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold">No items match your search</p>
              <p className="text-xs text-slate-500">Try searching for another term</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={resetLayoutToDefault}
              className="flex-1 sm:flex-initial text-xs h-8 text-slate-600 dark:text-slate-300"
            >
              <RotateCcw className="size-3.5 mr-1" />
              Reset Defaults
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={selectAllCardsAndWidgets}
              className="flex-1 sm:flex-initial text-xs h-8 text-slate-600 dark:text-slate-300"
            >
              <Sparkles className="size-3.5 mr-1" />
              Show All ({totalSelected}/{totalAvailable})
            </Button>
          </div>

          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={onClose}
            className="w-full sm:w-auto bg-[#4C40F7] hover:bg-[#3D32DB] text-white text-xs h-8 px-5 font-semibold shadow-xs"
          >
            Apply & Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardCustomizationModal;
