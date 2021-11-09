interface TableNameParsed {
    symbol: string;
    resolution: string;
    from: string;
    to: string;
}

export default class Table {
    public static parseTableName(name: string): TableNameParsed {
        const parts = name.split('_');

        if (parts.length !== 4) {
            throw new Error('Incorrect table name');
        }

        const from = new Date(parseInt(parts[2]));
        const to = new Date(parseInt(parts[3]));

        return {
            symbol: parts[0],
            resolution: parts[1],
            from: from.getFullYear() + '-' + from.getMonth() + '-' + from.getDate(),
            to: to.getFullYear() + '-' + to.getMonth() + '-' + to.getDate()
        }
    }
}