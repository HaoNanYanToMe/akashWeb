import Env from './env';
import global from '../global.js'

let config = {
	env: Env,
	build: {
		assetsRoot: path.resolve(__dirname, '../dist'),
		assetsSubDirectory: 'static',
		assetsPublicPath: global.app.publicPath
	}
};
export default config;
