<template>
	<Div class="step_main">
		<Span>选择引擎</Span>
		<Select style="width:20%" label-in-value placeholder="请选择要使用的数据引擎" @on-change="changeEng($event.tag)" @on-query-change="changeList($event)" filterable>
			<Option v-for="st in engList" :value="st.code" :tag="st.id">{{ st.name }}</Option>
		</Select>
		<br />
		<br />
		<br />
		<DIV v-for="(item, idx) in dataParam" :key="idx">
			<Span>{{ item.name }}</Span>
			<i-input placeholder="请输入参数值" v-model="item.value" style="width:20%" />
		</DIV>
		<br />
		<br />
		<Button icon="md-add" type="info" @click="execute()">确认查询</Button>
		<br />
		<br />
		<br />
		<Button type="primary" size="large" @click="exportData()">
			<Icon type="ios-download-outline"></Icon>
			数据导出
		</Button>
		<Table stripe :columns="columns1" :data="data1" ref="table"></Table>
	</Div>
</template>
<script>
export default {
	data() {
		return {
			engId: '',
			engList: [],
			dataParam: [],
			//数据表格
			columns1: [],
			data1: []
		};
	},
	methods: {
		execute() {
			let data = {};
			var dp = this.dataParam;
			for (var i = 0; i < dp.length; i++) {
				data[dp[i].code] = dp[i].value;
			}
			var _this = this;
			//获取colunmList(动态表格表头)
			this.$http.selectEngine(this.engId, JSON.stringify(data), res => {
				_this.data1 = res.data;
			});
			this.changeData();
		},
		//导出数据
		exportData() {
			this.$refs.table.exportCsv({
				filename: '动态数据导出'
			});
		},
		//切换数据引擎执行
		changeEng(eid) {
			let data = {
				eid: eid
			};
			this.engId = eid;
			var _this = this;
			//获取colunmList(动态表格表头)
			this.$http.selectEngine('e2ff616ec5cc403899a20d3063a80929', JSON.stringify(data), res => {
				_this.columns1 = [];
				for (var i = 0; i < res.data.length; i++) {
					_this.columns1.push({
						key: res.data[i].title,
						title: res.data[i].title,
						sortable: true
					});
				}
			});

			//获取入参数据(动态表格)
			this.$http.selectEngine('493c6cefcb8c470193fca0a394ac63cf', JSON.stringify(data), res => {
				_this.dataParam = res.data;
			});
			this.changeData();
		},
		//获取数据引擎数据
		changeList(likeData) {
			likeData = likeData === '' ? null : likeData;
			let data = {
				like_name: likeData,
				like_code: likeData
			};
			var _this = this;
			this.$http.selectEngine('5f0ee5c127c24961997a1be205499d0c', JSON.stringify(data), res => {
				_this.engList = res.data;
			});
			this.changeData();
		},
		/**
		 * 强制刷新页面数据属性
		 */
		changeData() {
			this.$forceUpdate();
		}
	},
	//基础数据初始化
	created() {
		//初始化引擎数据
		this.changeList('');
	}
};
</script>
