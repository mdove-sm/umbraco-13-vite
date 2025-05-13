import { defineConfig } from "vite";
import { resolve } from "path";
import { getAspDotNetCertificate } from "./certs/certs";

// PLUGINS ///
import FullReload from "vite-plugin-full-reload";
import ViteSvgSpriteWrapper from "vite-svg-sprite-wrapper";
import VitePluginSvgSpritemap from "@spiriit/vite-plugin-svg-spritemap";

export default defineConfig(async ({ mode }) => {
	console.log(`Configuring Vite for ${mode} mode.`);

	const config = {
		css: {
			devSourcemap: true,
		},
		publicDir: "./assets/", // Must match output dir for build
		build: {
			outDir: "./wwwroot/assets/",
			emptyOutDir: true, // clear the outout directory each build
			sourcemap: true, // sourcemaps for js and css
			cssCodeSplit: true, // allow seperate css outputfiles per input
			rollupOptions: {
				external: [/^@umbraco/],
				input: {
					main: resolve(__dirname, "src/js/main.js"),
					modules: resolve(__dirname, "src/js/modules.js"),
					print: resolve(__dirname, "src/scss/print.scss"),
				},
				output: {
					entryFileNames: "[name].[hash].js",
					chunkFileNames: "_[name].[hash].js",
					assetFileNames: "[name].[hash].[ext]",
				},
			},
		},
		plugins: [
			FullReload("./Views/**/*"), // Refresh dev when .cshtml changes

			// provide .scss sheet and sprite for production
			VitePluginSvgSpritemap("./assets/svg/*.svg", {
				prefix: false,
				svgo: true,
				injectSvgOnDev: false,
				output: {
					filename: "../icons/sprite.[hash][extname]",
					view: true,
					use: true,
				},
				styles: {
					filename: "src/scss/utilities/_spritemap.scss",
					names: {
						mixin: "icon-sprite",
						prefix: "icon-prefix",
						sprites: "icons",
					},
				},
			}),
		],
	};

	if (mode === "development") {
		// only get the certificate if we're in development mode
		const cert = getAspDotNetCertificate();

		config.server = {
			strictPort: true,
			hmr: {
				clientPort: 5173,
			},
			https: {
				cert: cert.certificate,
				key: cert.privateKey,
			},
		};
	}

	return config;
});

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////

// export default defineConfig(async ({ mode }) => {
// 	console.log(`Configuring Vite for ${mode} mode.`);

// 	const config = {
// 		css: {
// 			devSourcemap: true,
// 		},
// 		build: {
// 			lib: {
// 				entry: [
// 					resolve(__dirname, "src/main/main.js"),
// 					resolve(__dirname, "src/modules/modules.js"),
// 				],
// 				formats: ["es"],
// 			},
// 			outDir: "../MyProject/wwwroot/assets/",
// 			emptyOutDir: true,
// 			sourcemap: true,
// 			// cssCodeSplit: true,
// 			rollupOptions: {
// 				external: [/^@umbraco/],
// 				manualChunks: {
// 					main: ["main"],
// 					modules: ["modules"],
// 				},
// 				output: {
// 					entryFileNames: "[name].[hash].js",
// 					chunkFileNames: "[name].[hash].js",
// 					// assetFileNames: "main.[ext]",
// 					assetFileNames: (file) => {
// 						console.log("-->", file);
// 						return "[name].[hash].[ext]";
// 						// if (file.name == "main.css") {
// 						// 	return "main.[ext]";
// 						// } else {
// 						// 	return "modules.[ext]";
// 						// }
// 					},
// 				},
// 			},
// 		},
// 		plugins: [
// 			VitePluginSvgSpritemap("./src/icons/*.svg", {
// 				prefix: false,
// 				svgo: true,
// 				injectSvgOnDev: true,
// 				output: {
// 					name: "spritemap",
// 					filename: "../svg/[name].[hash][extname]",
// 					view: false,
// 					use: false,
// 				},
// 				styles: {
// 					filename: "src/main/scss/spritemap.scss",
// 					names: {
// 						mixin: "icon-sprite",
// 						prefix: "icon-prefix",
// 						sprites: "icons",
// 					},
// 				},
// 			}),
// 		],
// 	};

// 	if (mode === "development") {
// 		// only get the certificate if we're in development mode
// 		const cert = getAspDotNetCertificate();

// 		config.server = {
// 			strictPort: true,
// 			hmr: {
// 				clientPort: 5173,
// 			},
// 			https: {
// 				cert: cert.certificate,
// 				key: cert.privateKey,
// 			},
// 		};
// 	}

// 	return config;
// });
