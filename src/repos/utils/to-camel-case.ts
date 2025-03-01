export const toCamelCase = (rows: Record<string, any>[]) => {
    return rows.map((row) => {
        const replaced: Record<string, any> = {};

        for (let key in row) {
            const camelCase = key.replace(/([-_][a-z])/gi, ($1) =>
                $1.toUpperCase().replace("_", ""),
            );
            replaced[camelCase] = row[key];
        }
        return replaced;
    });
};

export default toCamelCase;
