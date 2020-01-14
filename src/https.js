import axios from 'axios'
var qs = require('qs');

export default {
	testEngine(data, response) {
		axios.post("http://127.0.0.1:8090/testEngine", qs.stringify({
				"s": data
			}))
			.then((res) => {
				response(res);
			})
			.catch((err) => {
				response(err)
			})
	},
}
