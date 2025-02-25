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
    criteria_scores: {
        id: number
        name: string
    };
}