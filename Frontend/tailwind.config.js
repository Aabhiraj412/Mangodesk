import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	darkMode: "class",
	theme: {
		extend: {
			typography: {
				invert: {
					css: {
						"--tw-prose-body": "#d1d5db",
						"--tw-prose-headings": "#f9fafb",
						"--tw-prose-lead": "#9ca3af",
						"--tw-prose-links": "#60a5fa",
						"--tw-prose-bold": "#f9fafb",
						"--tw-prose-counters": "#9ca3af",
						"--tw-prose-bullets": "#6b7280",
						"--tw-prose-hr": "#374151",
						"--tw-prose-quotes": "#f3f4f6",
						"--tw-prose-quote-borders": "#374151",
						"--tw-prose-captions": "#9ca3af",
						"--tw-prose-code": "#f9fafb",
						"--tw-prose-pre-code": "#d1d5db",
						"--tw-prose-pre-bg": "#1f2937",
						"--tw-prose-th-borders": "#374151",
						"--tw-prose-td-borders": "#374151",
					},
				},
			},
		},
	},
	plugins: [typography],
};
