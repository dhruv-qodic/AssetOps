import React, { useState, useMemo, useCallback } from 'react';
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
} from '@/constant/dashboard.constants';
import { useDashboardStore } from '@/store/useDashboardStore';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { DASHBOARD_CUSTOMIZATION_TEXT } from './constants/DashboardCustomizationModal.constants';

interface DashboardCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * @description: Modal dialog allowing users to customize visible KPI cards and analytics charts on the dashboard
 * @param {DashboardCustomizationModalProps}props: DashboardCustomizationModalProps containing modal open state and close callback
 * @return {JSX.Element}: React modal element for customizing dashboard layout
 */
export const DashboardCustomizationModal: React.FC<DashboardCustomizationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t: translateDashboard } = useTranslation('dashboard');
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

  const getCardTranslation = useCallback(
    (card: DashboardCardDefinition) => {
      switch (card.id) {
        case 'total_assets':
          return {
            label: translateDashboard('kpi.totalAssets', { defaultValue: card.label }),
            description: translateDashboard('kpi.totalAssetsDesc', {
              defaultValue: card.description,
            }),
          };
        case 'available_assets':
          return {
            label: translateDashboard('kpi.availableAssets', { defaultValue: card.label }),
            description: translateDashboard('kpi.availableAssetsDesc', {
              defaultValue: card.description,
            }),
          };
        case 'assigned_assets':
          return {
            label: translateDashboard('kpi.assignedAssets', { defaultValue: card.label }),
            description: translateDashboard('kpi.assignedAssetsDesc', {
              defaultValue: card.description,
            }),
          };
        case 'maintenance_assets':
          return {
            label: translateDashboard('kpi.maintenanceAssets', { defaultValue: card.label }),
            description: translateDashboard('kpi.maintenanceAssetsDesc', {
              defaultValue: card.description,
            }),
          };
        case 'total_asset_value':
          return {
            label: translateDashboard('kpi.totalAssetValue', { defaultValue: card.label }),
            description: translateDashboard('kpi.totalAssetValueDesc', {
              defaultValue: card.description,
            }),
          };
        default:
          return { label: card.label, description: card.description };
      }
    },
    [translateDashboard],
  );

  const getWidgetTranslation = useCallback(
    (widget: DashboardWidgetDefinition) => {
      switch (widget.id) {
        case 'lifecycle_chart':
          return {
            label: translateDashboard('widgets.lifecycleChart', { defaultValue: widget.label }),
            description: translateDashboard('widgets.lifecycleChartDesc', {
              defaultValue: widget.description,
            }),
          };
        case 'recent_activity':
          return {
            label: translateDashboard('widgets.recentActivity', { defaultValue: widget.label }),
            description: translateDashboard('widgets.recentActivityDesc', {
              defaultValue: widget.description,
            }),
          };
        case 'growth_line_chart':
          return {
            label: translateDashboard('widgets.growthTrend', { defaultValue: widget.label }),
            description: translateDashboard('widgets.growthTrendDesc', {
              defaultValue: widget.description,
            }),
          };
        case 'valuation_area_chart':
          return {
            label: translateDashboard('widgets.valuationTrend', { defaultValue: widget.label }),
            description: translateDashboard('widgets.valuationTrendDesc', {
              defaultValue: widget.description,
            }),
          };
        case 'depreciation_chart':
          return {
            label: translateDashboard('widgets.depreciationChart', { defaultValue: widget.label }),
            description: translateDashboard('widgets.depreciationChartDesc', {
              defaultValue: widget.description,
            }),
          };
        case 'distribution_pie_chart':
          return {
            label: translateDashboard('widgets.statusDistribution', { defaultValue: widget.label }),
            description: translateDashboard('widgets.statusDistributionDesc', {
              defaultValue: widget.description,
            }),
          };
        default:
          return { label: widget.label, description: widget.description };
      }
    },
    [translateDashboard],
  );

  /**
   * @description: Filters dashboard summary KPI cards based on user search term
   * @return {Array<DashboardCardDefinition>}: Filtered list of dashboard card definitions
   */
  const filteredCards = useMemo(() => {
    return DASHBOARD_CARDS.filter((card) => {
      const { label, description } = getCardTranslation(card);
      const q = searchQuery.toLowerCase();
      return (
        card.label.toLowerCase().includes(q) ||
        card.description.toLowerCase().includes(q) ||
        label.toLowerCase().includes(q) ||
        description.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, getCardTranslation]);

  /**
   * @description: Filters dashboard chart widgets based on user search term
   * @return {Array<DashboardWidgetDefinition>}: Filtered list of dashboard widget definitions
   */
  const filteredWidgets = useMemo(() => {
    return DASHBOARD_WIDGETS.filter((widget) => {
      const { label, description } = getWidgetTranslation(widget);
      const q = searchQuery.toLowerCase();
      return (
        widget.label.toLowerCase().includes(q) ||
        widget.description.toLowerCase().includes(q) ||
        label.toLowerCase().includes(q) ||
        description.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, getWidgetTranslation]);

  const totalSelected = visibleCardIds.length + visibleWidgetIds.length;
  const totalAvailable = DASHBOARD_CARDS.length + DASHBOARD_WIDGETS.length;

  /**
   * @description: Applies current customization changes and closes the modal
   * @return {void}: void
   */
  const handleApply = () => {
    toast.success(DASHBOARD_CUSTOMIZATION_TEXT.TOAST_UPDATED);
    onClose();
  };

  /**
   * @description: Resets card and widget visibility back to standard defaults
   * @return {void}: void
   */
  const handleReset = () => {
    resetLayoutToDefault();
    toast.info(DASHBOARD_CUSTOMIZATION_TEXT.TOAST_RESET);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800/80">
          <DialogHeader className="text-left space-y-1">
            <div className="flex items-center gap-2 text-primary">
              <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50">
                <SlidersHorizontal className="size-4 text-primary" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                {translateDashboard('customizer.badge', {
                  defaultValue: DASHBOARD_CUSTOMIZATION_TEXT.OVERLINE,
                })}
              </span>
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
              {translateDashboard('customizer.title', {
                defaultValue: DASHBOARD_CUSTOMIZATION_TEXT.TITLE,
              })}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {translateDashboard('customizer.description', {
                defaultValue: DASHBOARD_CUSTOMIZATION_TEXT.DESCRIPTION,
              })}
            </DialogDescription>
          </DialogHeader>

          {/* Search & Tabs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={translateDashboard('customizer.searchPlaceholder', {
                  defaultValue: DASHBOARD_CUSTOMIZATION_TEXT.SEARCH_PLACEHOLDER,
                })}
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
                {translateDashboard('customizer.tabs.all', {
                  defaultValue: DASHBOARD_CUSTOMIZATION_TEXT.TAB_ALL,
                })}{' '}
                ({totalAvailable})
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
                {translateDashboard('customizer.tabs.cards', {
                  defaultValue: DASHBOARD_CUSTOMIZATION_TEXT.TAB_CARDS,
                })}{' '}
                ({DASHBOARD_CARDS.length})
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
                {translateDashboard('customizer.tabs.widgets', {
                  defaultValue: DASHBOARD_CUSTOMIZATION_TEXT.TAB_WIDGETS,
                })}{' '}
                ({DASHBOARD_WIDGETS.length})
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
                    {translateDashboard('customizer.sections.cards', {
                      defaultValue: DASHBOARD_CUSTOMIZATION_TEXT.SECTION_CARDS_TITLE,
                    })}
                  </h4>
                </div>
                <span className="text-[11px] font-medium text-slate-400">
                  {translateDashboard('customizer.activeCount', {
                    active: visibleCardIds.length,
                    total: DASHBOARD_CARDS.length,
                    defaultValue: `${visibleCardIds.length} of ${DASHBOARD_CARDS.length} active`,
                  })}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {filteredCards.map((card: DashboardCardDefinition) => {
                  const isChecked = visibleCardIds.includes(card.id);
                  const { label, description } = getCardTranslation(card);
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
                            ? 'bg-primary text-white'
                            : 'border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900',
                        )}
                      >
                        {isChecked && <Check className="size-3 stroke-[3]" />}
                      </div>
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {label}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {description}
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
                    {translateDashboard('customizer.sections.widgets', {
                      defaultValue: DASHBOARD_CUSTOMIZATION_TEXT.SECTION_WIDGETS_TITLE,
                    })}
                  </h4>
                </div>
                <span className="text-[11px] font-medium text-slate-400">
                  {translateDashboard('customizer.activeCount', {
                    active: visibleWidgetIds.length,
                    total: DASHBOARD_WIDGETS.length,
                    defaultValue: `${visibleWidgetIds.length} of ${DASHBOARD_WIDGETS.length} active`,
                  })}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {filteredWidgets.map((widget: DashboardWidgetDefinition) => {
                  const isChecked = visibleWidgetIds.includes(widget.id);
                  const { label, description } = getWidgetTranslation(widget);
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
                            {label}
                          </p>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {description}
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
              <p className="text-sm font-semibold">
                {DASHBOARD_CUSTOMIZATION_TEXT.EMPTY_SEARCH_TITLE}
              </p>
              <p className="text-xs text-slate-500">
                {DASHBOARD_CUSTOMIZATION_TEXT.EMPTY_SEARCH_DESC}
              </p>
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
              onClick={handleReset}
              className="flex-1 sm:flex-initial text-xs h-8 text-slate-600 dark:text-slate-300 cursor-pointer"
            >
              <RotateCcw className="size-3.5 mr-1" />
              {translateDashboard('customizer.resetButton', {
                defaultValue: DASHBOARD_CUSTOMIZATION_TEXT.RESET_BUTTON,
              })}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={selectAllCardsAndWidgets}
              className="flex-1 sm:flex-initial text-xs h-8 text-slate-600 dark:text-slate-300 cursor-pointer"
            >
              <Sparkles className="size-3.5 mr-1" />
              {translateDashboard('customizer.showAllButton', {
                count: totalSelected,
                total: totalAvailable,
                defaultValue: `${DASHBOARD_CUSTOMIZATION_TEXT.SHOW_ALL_BUTTON} (${totalSelected}/${totalAvailable})`,
              })}
            </Button>
          </div>

          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={handleApply}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-8 px-5 font-semibold shadow-xs cursor-pointer"
          >
            {translateDashboard('customizer.applyButton', {
              defaultValue: DASHBOARD_CUSTOMIZATION_TEXT.APPLY_BUTTON,
            })}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardCustomizationModal;
