import axios from 'axios'
var qs = require('qs');

export default {
	//构建引擎
	testEngine(data, name, code, note, response) {
		axios.post("http://127.0.0.1:8090/testEngine", qs.stringify({
				"s": data,
				"n": name,
				"c": code,
				"ne": note
			}))
			.then((res) => {
				response(res);
			})
			.catch((err) => {
				response(err)
			})
	},
	//数据测试及调用
	selectEngine(eid,data,response){
		axios.post("http://127.0.0.1:8090/select", qs.stringify({
				"eid": eid,
				"data": data,
			}))
			.then((res) => {
				response(res);
			})
			.catch((err) => {
				response(err)
			})
	}
}
