import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import sourcemaps from "rollup-plugin-sourcemaps2";

const watchPlugins = () => {
	if (!process.env.ROLLUP_WATCH) {
		// empty unless started with --watch
		return [];
	}

	return [
		sourcemaps(),
		livereload(),
		serve({
			port: 8080,
			contentBase: "public/",
		}),
	];
};

export default {
	input: "src/index.ts",
	output: [
		{
			file: "public/index.js",
			format: "es",
			sourcemap: true,
		},
	],
	plugins: [typescript(), resolve()].concat(watchPlugins()),
};
