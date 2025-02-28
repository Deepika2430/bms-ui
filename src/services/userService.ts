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
            firstName: userDetails?.employee_details.first_name,
            lastName: userDetails?.employee_details.last_name,
            role: userDetails?.role,
            id: userDetails?.id,
            phone: userDetails?.employee_details.phone,
            email: userDetails?.email,
            departmentName: userDetails?.departments?.name,
        }
    }
    catch (error) {
        return error?.message;
    }
}
