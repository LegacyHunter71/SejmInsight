import api from "./client";
import type { components } from "../generated/api-types";
import type { PageableParams } from "../utils/pagination";

type PageDeputyListItemDto = components["schemas"]["PageDeputyListItemDto"];

export async function getDeputies(params?: PageableParams & { name?: string; club?: string; districtName?: string; active?: boolean }) {
    const query: Record<string, any> = {
        ...(params ? { page: params.page, size: params.size, sort: params.sort } : {}),
        name: params?.name,
        club: params?.club,
        districtName: params?.districtName,
        active: params?.active,
    };

    const res = await api.get<any>(`/deputies`, { query });

    // The backend sometimes returns snake_case fields (first_name, last_name, district_name, attendance_rate)
    // Normalize to camelCase so the UI can rely on consistent property names.
    const normalize = (d: any) => ({
        id: d.id,
        firstName: d.firstName ?? d.first_name,
        lastName: d.lastName ?? d.last_name,
        club: d.club,
        districtName: d.districtName ?? d.district_name,
        active: d.active,
        attendanceRate: d.attendanceRate ?? d.attendance_rate,
        presentVotings: d.present_votings,
        // keep original in case it's needed
        __raw: d,
    });

    if (Array.isArray(res)) {
        return res.map(normalize);
    }

    // assume page object
    const page: any = {
        ...res,
        content: Array.isArray(res.content) ? res.content.map(normalize) : res.content,
    };

    // Normalize common pagination meta fields from snake_case to camelCase if present.
    if (res.total_pages !== undefined && page.totalPages === undefined) {
        page.totalPages = res.total_pages;
        delete page.total_pages;
    }
    if (res.total_elements !== undefined && page.totalElements === undefined) {
        page.totalElements = res.total_elements;
        delete page.total_elements;
    }
    // also normalize other possible snake_case variants
    if (res.number_of_elements !== undefined && page.numberOfElements === undefined) {
        page.numberOfElements = res.number_of_elements;
        delete page.number_of_elements;
    }
    if (res.first !== undefined && page.first === undefined) {
        page.first = res.first;
    }
    if (res.last !== undefined && page.last === undefined) {
        page.last = res.last;
    }

    return page as PageDeputyListItemDto;
}

export async function getDeputyVotings(deputyId: number, params?: PageableParams & { vote?: string; title?: string }) {
    const query: Record<string, any> = {
        ...(params ? { page: params.page, size: params.size, sort: params.sort } : {}),
        vote: params?.vote,
        title: params?.title,
    };

    return api.get<PageDeputyListItemDto | components["schemas"]["PageVotingDto"]>(`/deputies/${deputyId}/votings`, { query });
}

export async function getDeputyById(deputyId: number) {
    // Try to fetch the deputy from the /deputies endpoint by scanning content.
    // The API does not expose a dedicated /deputies/{id} endpoint in api-docs.json,
    // so we request a reasonably large page and search for the id.
    const pageSize = 500;
    const res = await api.get<any>(`/deputies`, { query: { page: 0, size: pageSize } });

    const normalize = (d: any) => ({
        id: d.id,
        firstName: d.firstName ?? d.first_name,
        lastName: d.lastName ?? d.last_name,
        club: d.club,
        districtName: d.districtName ?? d.district_name,
        active: d.active,
        attendanceRate: d.attendanceRate ?? d.attendance_rate,
        __raw: d,
    });

    const list = Array.isArray(res) ? res : res?.content ?? [];
    const found = list.find((d: any) => Number(d.id) === Number(deputyId));
    return found ? normalize(found) : null;
}

export default { getDeputies, getDeputyVotings };
