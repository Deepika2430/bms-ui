const toCamelCase = (str) => {
    return str.replace(/([-_][a-z])/g, (group) =>
        group.toUpperCase().replace('-', '').replace('_', '')
    );
};

export const transformKeysToCamelCase = (obj) => {
    if (Array.isArray(obj)) {
        return obj.map((v) => transformKeysToCamelCase(v));
    } else if (obj !== null && obj.constructor === Object) {
        return Object.keys(obj).reduce((result, key) => {
            result[toCamelCase(key)] = transformKeysToCamelCase(obj[key]);
            return result;
        }, {});
    }
    return obj;
};
