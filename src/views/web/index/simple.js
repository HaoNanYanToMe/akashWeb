module.exports = {
	out: {
		engineType: [{
				value: '0',
				label: '查询'
			},
			{
				value: '1',
				label: '编辑「增/改」'
			},
			{
				value: '2',
				label: '删除'
			},
		],
		//聚合类型
		exType: [{
				value: 'AVG',
				label: '平均值'
			},
			{
				value: 'DISTINCT',
				label: '数据去重'
			},
			{
				value: 'COUNT',
				label: '数据总行数'
			},
			{
				value: 'COUNTDIS',
				label: '数据总行数(去重)'
			},
			{
				value: 'MAX',
				label: '最大值'
			},
			{
				value: 'MIN',
				label: '最小值'
			},
			{
				value: 'SUM',
				label: '求和'
			}
		],
		//排序类型
		sortType: [{
				value: 'DESC',
				label: '倒序'
			},
			{
				value: 'ASC',
				label: '正序'
			},
			{
				value: 'UTF_ASC',
				label: '中文正序'
			},
			{
				value: 'UTF_DESC',
				label: '中文倒序'
			}
		],
		//执行流程
		stepList: [{
				id: 0,
				title: '主子表',
				note: '设置查询使用的主子表及其对应关联信息'
			},
			{
				id: 1,
				title: '分组',
				note: '设置需要执行分组统计的字段信息'
			},
			{
				id: 2,
				title: '查询',
				note: '设置查询数据需要使用的条件信息'
			},
			{
				id: 3,
				title: '数据优化',
				note: '输出时对指定字段进行优化'
			},
			{
				id: 4,
				title: '输出设置',
				note: '设置需要输出的字段信息'
			},
			{
				id: 5,
				title: '排序',
				note: '设置数据的排序方式信息'
			},
			{
				id: 6,
				title: '分页',
				note: '设置数据使用的分页信息'
			},
			{
				id: 7,
				title: '完成',
				note: '检测数据最终的执行结果'
			}
		],
		//执行流程:增改
		stepListEdit: [{
			id: 0,
			title: '主表',
			note: '设置编辑「增/改」时使用的主表'
		}, {
			id: 1,
			title: '拷贝',
			note: '拷贝指定数据引擎的数据信息'

		}, {
			id: 2,
			title: '字段',
			note: '设置编辑「增/改」时的字段及相关信息'
		}, {
			id: 3,
			title: '条件',
			note: '设置编辑「增/改」时的条件项'
		}, {
			id: 4,
			title: '完成',
			note: '检测数据最终的执行结果'
		}],
		//执行流程:删除
		stepListDel: [{
			id: 0,
			title: '主表',
			note: '设置删除时使用的主表'
		}, {
			id: 1,
			title: '条件',
			note: '设置删除时需要附加的条件'
		
		}, {
			id: 3,
			title: '完成',
			note: '检测数据最终的执行结果'
		}],
		//操作按钮
		btNext: [{
				id: 'back',
				icon: 'ios-arrow-back',
				note: '上一步'
			},
			{
				id: 'forward',
				icon: 'ios-arrow-forward',
				note: '下一步'
			},
			{
				id: 'checkmark',
				icon: 'md-checkmark',
				note: '确认生成'
			},
		],
		//匹配关系
		patchList: [{
				value: '0',
				label: '字段匹配',
				case: 0
			},
			{
				value: '1',
				label: '固定值',
				case: 1
			},
			{
				value: '2',
				label: '动态参数',
				case: 1
			},
			{
				value: '3',
				label: '关联数据引擎',
				case: 0
			}
		],
		//多条件组合关系
		query: [{
				value: 'and',
				label: '和'
			},
			{
				value: 'or',
				label: '或'
			},
			{
				value: 'andMerge',
				label: '条件组开始「和」'
			},
			{
				value: 'orMerge',
				label: '条件组开始「或」'
			},
			{
				value: 'andMergeEnd',
				label: '条件组结束「和」'
			},
			{
				value: 'orMergeEnd',
				label: '条件组结束「或」'
			}
		],
		//运算关系
		condition: [{
				value: 'EQ',
				label: '等于'
			},
			{
				value: 'LIKE',
				label: '模糊查询'
			},
			{
				value: 'NOT_LIKE',
				label: '反向模糊查询'
			},
			{
				value: 'LIKE_BINARY',
				label: '忽略中英文大小写匹配'
			},
			// {
			// 	value: 'LIKE_ESCAPE',
			// 	label: '模糊查询'
			// },
			{
				value: 'NOT_LIKE_ESCAPE',
				label: '反向模糊查询「安全模式」'
			},
			{
				value: 'LIKE_BINARY_ESCAPE',
				label: '忽略中英文大小写匹配「安全模式」'
			},
			{
				value: 'GT',
				label: '大于'
			},
			{
				value: 'GTEQ',
				label: '大于等于'
			},
			{
				value: 'LT',
				label: '小于'
			},
			{
				value: 'LTEQ',
				label: '小于等于'
			},
			{
				value: 'NEQ',
				label: '不等于'
			},
			{
				value: 'IN',
				label: '包含'
			},
			{
				value: 'NOTIN',
				label: '不包含'
			},
			{
				value: 'ISNULL',
				label: '为空'
			},
			{
				value: 'NOTNULL',
				label: '不为空'
			},
			{
				value: 'BET',
				label: '区间值'
			}
		],
		//连表类型
		joinType: [{
				value: 'N',
				label: '普联'
			}, {
				value: 'R',
				label: '右联'
			},

			{
				value: 'L',
				label: '左联'
			},
			{
				value: 'I',
				label: '内联'
			},
			{
				value: 'C',
				label: '交叉'
			},
			{
				value: 'S',
				label: '自动'
			},
			{
				value: 'RO',
				label: '右全联'
			},
			{
				value: 'LO',
				label: '左全联'
			}
		],
		//数据操作类型
		dataType: [{
				id: '0',
				name: '数据表「Table」',
			},
			{
				id: '1',
				name: 'SQL引擎「SQLEngie」',
			}
		],
		//启用状态
		dataStatus: [{
				id: 0,
				status: true,
				name: '启用',
			},
			{
				id: 1,
				status: false,
				name: '禁用',
			}
		],
		//数据源初始化项
		dataSource: {
			id: '',
			status: false,
		},
		//SQL引擎模拟数据
		engineList: [{
				id: '9a192579fa1e43acabefc334f042dacf',
				name: '测试查询A',
				code: 't_Acc',
			},
			{
				id: '7c4815cf256046a8a09a020bd5fbeea3',
				name: '测试查询B',
				code: 'test'
			}
		],
		//子节点固定数据
		itemChild: {
			id: '',
			value: '',
			status: 1,
		},
		//子节点拓展数据
		//注意:在新增本项数据时,请遵循 拓展字段名#默认值 的写法,默认值不填等于为空,index和Array为关键字
		exItem: {
			dataSource0: [
				"id#index",
				"joinWhere#Array",
				"joinSelect#0",
				"joinAlias#",
				"joinType#N",
				"mainTable#",
				"mainColunm#",
				"joinTable#",
				"joinDataType#0",
				"joinColunm#",
				"egid#",
				"index#index",
				"colList#Array",
				"joinCols#getData",
				"joinFiled#Array",
				"sourceList#sList"
			],
			dataSource0_joinWhere: [
				"id#index",
				"queryType#and",
				"jwTable#",
				"jwKey#",
				"conditionType#EQ",
				"patch#1",
				"jwToTable#",
				"jwToKey#",
				"egid#",
				"jwValue#",
				"jwEngine#",
				"colList#Array",
				"joinFiled#Array"
			],
			dataSource1: [
				"id#index",
				"table#",
				"colunm#",
				"colList#Array"
			],
			dataSource2: [
				"id#index",
				"queryType#and",
				"table#",
				"colunm#",
				"conditionType#EQ",
				"patch#1",
				"toToTable#",
				"toToKey#",
				"toValue#",
				"toEngine#",
				"egid#",
				"groupType#DEF",
				"colList#Array",
				"joinFiled#Array"
			],
			dataSource3: [
				"id#index",
				"ex#false",
				"index#index",
				"value#",
				"caseQuery#Array"
			],
			dataSource3_caseQuery: [
				"id#index",
				"outValue#",
				"index#index",
				"status#1",
				"ex#true",
				"caseWhere#Array"
			],
			dataSource3_caseWhere: [
				"id#index",
				"status#1",
				"groupType#DEF",
				"queryType#and",
				"table#",
				"colunm#",
				"conditionType#EQ",
				"patch#1",
				"toTable#",
				"toKey#",
				"value#",
				"egid#",
				"toEngine#",
				"colList#Array",
				"joinFiled#Array"
			],
			dataSource4: [
				"id#index",
				"table#",
				"status#1",
				"colunm#",
				"groupType#",
				"value#",
				"locked#0",
				"colList#Array",
				"joinFiled#Array"
			],
			dataSource5: [
				"id#index",
				"table#",
				"status#1",
				"colunm#",
				"sType#Array",
				"colList#Array",
				"joinFiled#Array"
			],
			dataSource6: [
				"id#index",
				"status#1",
				"pageNum#",
				"pageSize#",
			],
		}
	}

}
