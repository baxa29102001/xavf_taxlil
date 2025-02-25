
export interface IOrganizationScore {
    id: number;
    inn: number;
    Q1_score: number;
    Q2_score: number;
    Q3_score: number;
    Q4_score: number;
    name: string;
    total_score: number;
}

export interface IOrganizationByRegion<> {
    organization_id: number;
    organization_name: string;
    region: string;
    region_id: number;
    criteria_scores: {
        id: number;
        name: string;
        score: number;
        region_id: number;
    }[];
}

export interface IStatusBuCategory {
    approved_count: number;
    category_id: number;
    category_name: string;
    in_progress_count: number;
    new_count: number;
    rejected_count: number;
    total_cases_count: number;
}