export type SORT_DIR = 'descending' | 'ascending';

export type PageableQueryParams = Partial<{
    keyword: string;
    sortDir: SORT_DIR;
    paginate: boolean;
    perPage: number;
    page: number;
    sortBy: number;
}>

interface PageData {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
}

export interface PageableTableData<T> {
  data: T[],
  meta: PageData
}