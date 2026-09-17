import React from 'react';
import { useAssetStore } from '@/store/useAssetStore';
import { Pagination } from '@/components/common/Pagination';

interface AssetPaginationProps {
  totalFiltered: number;
  startIndex: number;
  endIndex: number;
  totalPages: number;
  currentPage: number;
}

export const AssetPagination: React.FC<AssetPaginationProps> = (props) => {
  const setPage = useAssetStore((s) => s.setPage);

  return <Pagination {...props} onPageChange={setPage} entityLabel="assets" />;
};

export default AssetPagination;
