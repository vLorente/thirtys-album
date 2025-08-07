/** @type {import("prettier").Config} */
export default {
	printWidth: 100,
	semi: false,
	singleQuote: true,
	tabWidth: 2,
	trailingComma: "all",
	useTabs: true,
	plugins: ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
	tailwindStylesheet: "./src/styles/globals.css",
	overrides: [
		{
			files: [".*", "*.md", "*.toml", "*.yml"],
			options: {
				useTabs: false,
			},
		},
		{
			files: ["**/*.astro"],
			options: {
				parser: "astro",
			},
		},
	],
	// removeUnusedImports: false,
};
