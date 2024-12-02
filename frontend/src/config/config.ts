/*
export default {
    host: 'http://localhost:3000/api',
}

*/
const host = 'http://localhost:3000/api';
const config = {
    host: host,
    api: host + '/api',
    categoryType: {
        income: 'income',
        expense: 'expense',
    },
}

export default config;