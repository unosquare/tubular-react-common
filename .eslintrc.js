module.exports = {
    settings: {
        'import/resolver': {
            node: {
                paths: ['./src'],
            },
        },
    },
    env: {
        es6: true,
        browser: true,
        jest: true,
    },
    parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
    },
    extends: 'eslint-config-unosquare',
    plugins: ['eslint-plugin-prettier'],
    rules: {
        'prettier/prettier': 'error',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-unsafe-call': 'warn',
    },
};
