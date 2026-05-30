export interface PageableParams {
    page?: number;
    size?: number;
    sort?: string[];
}

export function toPageQuery(p?: PageableParams) {
    const q: Record<string, any> = {};
    if (!p) return q;
    if (p.page !== undefined) q.page = p.page;
    if (p.size !== undefined) q.size = p.size;
    if (p.sort !== undefined && p.sort.length) q.sort = p.sort;
    return q;
}
