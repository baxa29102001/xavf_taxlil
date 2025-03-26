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

export interface IStatusAllOrganization {
  organization_id: number;
  organization_name: string;
  inn: number;
  new_count: number;
  rejected_count: number;
  approved_count: number;
  total_cases_count: number;
  in_progress_count: number;
}

export interface ISubmitedCase {
  category_id: number;
  category_name: string;
  total_cases: number;
  approved_cases: number;
  rejected_cases: number;
  in_progress_cases: number;
}

export interface ISubmitedCaseUserOrganization {
  organization_id: number;
  organization_name: string;
  total_cases: number;
  approved_cases: number;
  rejected_cases: number;
  in_progress_cases: number;
}

export interface IActionTakenByCategory {
  inn: number;
  organization_name: string;
  examinations_count: number;
  instructions_count: number;
  submissions_count: number;
  disciplinary_measures_count: number;
  administrative_measures_count: number;
}
export interface IActionTakenByMainCategory {
  category: string;
  examinations: number;
  profilaktika: number;
  instructions: number;
  submissions: number;
  disciplinary: number;
  administrative: number;
}

export type INNANDNAME = { inn: string; name: string };
export type CategoryField = { category: string };
export interface IActionTakenByProfilatikaByOrganization {
  total_profilaktika: number;
  seminar: number;
  public_discussions: number;
  media_appearances: number;
  open_houses: number;
  distributing_materials: number;
  sending_guidelines: number;
}
