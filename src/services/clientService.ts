import config from "@/config";
import { getToken } from "./authService";
import { transformKeysToCamelCase } from "@/utils/transformKeys";

const transformClientData = (client) => ({
    company_name: client.companyName,
    client_type: client.clientType,
    pan_number: client.panNumber,
    is_active: client.isActive,
    contact_person: client.contactPerson,
    mailing_country: client.mailingCountry,
    mailing_street: client.mailingStreet,
    mailing_city: client.mailingCity,
    mailing_state: client.mailingState,
    mailing_zip_code: client.mailingZipCode,
    mailing_phone: client.mailingPhone,
    mailing_mobile: client.mailingMobile,
    mailing_fax: client.mailingFax,
    mailing_email: client.mailingEmail,
    same_as_mailing: client.sameAsMailing,
    billing_attention: client.billingAttention,
    billing_country: client.billingCountry,
    billing_street: client.billingStreet,
    billing_city: client.billingCity,
    billing_state: client.billingState,
    billing_zip_code: client.billingZipCode,
    billing_phone: client.billingPhone,
    billing_mobile: client.billingMobile,
    billing_fax: client.billingFax,
    billing_email: client.billingEmail,
});

export const updateClient = async (clientId, client) => {
    const token = getToken();
    try {
        const response = await fetch(`${config.apiBaseUrl}/clients/${clientId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(transformClientData(client)),
            redirect: "follow"
        });
        return await response.json();
    }
    catch (error) {
        return error?.message;
    }
}

export const createClient = async (client) => {
    const token = getToken();
    try {
        const response = await fetch(`${config.apiBaseUrl}/clients`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(transformClientData(client)),
            redirect: "follow"
        });
        return await response.json();
    }
    catch (error) {
        return error?.message;
    }
}

export const getClient = async (clientId) => {
    const token = getToken();
    try {
        const response = await fetch(`${config.apiBaseUrl}/clients/${clientId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            redirect: "follow"
        });
        return await response.json();
    }
    catch (error) {
        return error?.message;
    }
}

export const getClients = async () => {
    const token = getToken();
    try {
        const response = await fetch(`${config.apiBaseUrl}/clients`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            redirect: "follow"
        });

        return transformKeysToCamelCase(await response.json());
    }
    catch (error) {
        return error?.message;
    }
}