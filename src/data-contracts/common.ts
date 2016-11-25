export interface UserProfileDTO {
    displayName: string
}

export interface UserDTO {
    id?: string;
    primary_email?: string;
    super_admin?: boolean;
    profile?: UserProfileDTO
}

export interface JsonResponse {
    status: string;
    payload: any
}