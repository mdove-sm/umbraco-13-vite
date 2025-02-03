import { defineConfig, splitVendorChunkPlugin } from "vite";
import { resolve } from "path";
import { getAspDotNetCertificate } from "./certs/certs";

// PLUGINS ///
import FullReload from "vite-plugin-full-reload";
import VitePluginSvgSpritemap from "@spiriit/vite-plugin-svg-spritemap";

export default defineConfig(async ({ mode }) => {
	console.log(`Configuring Vite for ${mode} mode.`);

	const config = {
		css: {
			devSourcemap: true,
		},
		publicDir: "./assets/", // Must match output dir for bui;d
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
				},
				output: {
					entryFileNames: "[name].[hash].js",
					chunkFileNames: "_[name].[hash].js",
					assetFileNames: "[name].[hash].[ext]",
				},
			},
		},
		plugins: [
			splitVendorChunkPlugin(),
			FullReload(["config/routes.rb", "./Views/**/*"]), // Refresh dev when .cshtml changes
			VitePluginSvgSpritemap("./assets/svg/*.svg", {
				prefix: false,
				svgo: true,
				injectSvgOnDev: true,
				output: {
					name: "spritemap",
					filename: "../svg/[name][extname]",
					view: false,
					use: false,
				},
				styles: {
					filename: "src/scss/utilities/_spritemap.scss",
					names: {
						mixin: "icon-sprite",
						prefix: "icon-prefix",
						sprites: "icons",
					},
					// callback: ({ content, options, createSpritemap }) => {
					// 	let insert = "";
					// 	insert += createSpritemap((name, svg) => {
					// 		const selector = `${options.prefix}${name}`;
					// 		let sprite = "";
					// 		sprite = `.ico-${selector} {`;
					// 		sprite += `\n\tbackground: url("${svg.svgDataUri}") center no-repeat;`;
					// 		sprite += "\n}";
					// 		return sprite;
					// 	});
					// 	return insert;
					// },
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
