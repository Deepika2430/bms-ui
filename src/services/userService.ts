import config from "@/config";
import { getToken } from "./authService";

export const getUserDetails = async () => {
    const token = getToken();
    try {
        const response = await fetch(`${config.apiBaseUrl}/user/details`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            redirect: "follow"
        });
        const userDetails = (await response.json());
        return {
            firstName: userDetails?.employee_details?.first_name ?? userDetails?.name,
            lastName: userDetails?.employee_details?.last_name ?? "",
            role: userDetails?.role,
            id: userDetails?.id,
            phone: userDetails?.employee_details?.phone ?? "",
            mobile: userDetails?.employee_details?.mobile ?? "",
            dateOfBirth: userDetails?.employee_details?.date_of_birth ?? "",
            email: userDetails?.email ?? "",
            departmentName: userDetails?.department ?? "",
            designation: userDetails?.employee_details?.designation ?? "",
            status: userDetails?.employee_details?.status ?? "",
            department: userDetails?.employee_details?.department ?? "",
            departmentId: userDetails?.employee_details?.department_id ?? "",
            dateOfJoining: userDetails?.employee_details?.date_of_joining ?? "",
            empId: userDetails?.employee_details?.emp_id ?? "",
            resignationDate: userDetails?.employee_details?.resignation_date ?? "",
            currentAddress: userDetails?.employee_details?.current_address ?? "",
            permanentAddress: userDetails?.employee_details?.permanent_address ?? "",
            gender: userDetails?.employee_details?.gender ?? "",
            bloodGroup: userDetails?.employee_details?.blood_group ?? "",
            contractEndDate: userDetails?.employee_details?.contract_end_date ?? "",
            createdAt: userDetails?.created_at ?? "",
            updatedAt: userDetails?.employee_details?.updated_at ?? "",
        }
    }
    catch (error) {
        return error?.message;
    }
}

export const getAllUsers = async () => {
    const token = getToken();
    try {
        const response = await fetch(`${config.apiBaseUrl}/user`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            redirect: "follow"
        });
        const users = (await response.json());
        if (response.status !== 200) {
            throw new Error(users?.error);
        } else {
        return users; 
        }
    }
    catch (error) {
        throw error?.message;
        // return error?.message;
    }
}

export const updateUser = async (id, user) => {
    const token = getToken();
    try {
        const response = await fetch(`${config.apiBaseUrl}/user/${id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user),
            redirect: "follow"
        });
        return await response.json();
    }
    catch (error) {
        return error?.message;
    }
}