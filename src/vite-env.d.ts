/// <reference types="vite/client" />
interface ImportMetaEnv {
	readonly VITE_WORDS_API_KEY: string;
	readonly VITE_WORDS_API_HOST: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
