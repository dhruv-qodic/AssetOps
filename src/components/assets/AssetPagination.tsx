import React from 'react';
import { useAssetStore } from '@/store/useAssetStore';
import { Pagination } from '@/components/common/Pagination';

import { useTranslation } from 'react-i18next';

interface AssetPaginationProps {
  totalFiltered: number;
  startIndex: number;
  endIndex: number;
  totalPages: number;
  currentPage: number;
}

/**
 * @description: Renders pagination controls connected to the asset store for page updates
 * @param {AssetPaginationProps} props - Pagination state props (totalFiltered, startIndex, endIndex, totalPages, currentPage)
 * @returns {JSX.Element} Pagination JSX component
 */
export const AssetPagination: React.FC<AssetPaginationProps> = (props) => {
  const { t: translateAssets } = useTranslation('asset');
  const setPage = useAssetStore((s) => s.setPage);

  return (
    <Pagination
      {...props}
      onPageChange={setPage}
      entityLabel={translateAssets('toolbar.assetsPlural', { defaultValue: 'assets' })}
    />
  );
};

export default AssetPagination;
