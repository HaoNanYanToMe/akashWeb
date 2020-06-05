import simple from './simple';
export default {
	data() {
		return {
			//结果展示区
			isShow: true,
			//结果反馈
			selShow: '',
			selId: '',
			engineType: '',
			//参数需求
			columns1: [{
					title: '参数名称',
					key: 'name'
				},
				{
					title: '参数编码',
					key: 'code'
				}
			],
			selectData: [],
			//输出字段
			outData: [],
			//当前执行环节下标
			currentStep: 0,
			//基础配置信息
			base: {
				name: '',
				note: '',
				code: '',
				eType: '0', //引擎类型
			},
			sourceObj: [],
			//排序关系
			sortType: [],
			//聚合关系
			exType: [],
			//多条件组合关系
			query: [],
			//运算关系
			condition: [],
			//连表类型
			joinType: [],
			//匹配关系
			patchList: [],
			//流程数据
			stepList: [],
			//Button操作项
			btNext: [],
			//数据操作类型
			dataType: [],
			//启用状态
			dataStatus: [],
			colList: [],
			//通用数据：数据表集合
			tableList: [],
			//执行流程：主子表
			dataSource0: {
				dataType: '0',
				//指定数据源
				bindSource: '',
				bindSourceAlias: '',
				//已选择的可用数据源
				checkedTable: [],
				engineList: [],
				items0: []
			},
			//执行流程：分组
			dataSource1: {
				isOpen: 0,
				items1: [],
				copyList: [],
				filedList:[]
			},
			//执行流程：查询
			dataSource2: {
				isOpen: 0,
				items2: []
			},
			//执行流程：数据优化
			dataSource3: {
				isOpen: 0,
				items3: []
			},
			//执行流程：输出设置
			dataSource4: {
				isOpen: 0,
				items4: []
			},
			//执行流程：排序
			dataSource5: {
				isOpen: 0,
				items5: []
			},
			//执行流程：分页
			dataSource6: {
				patch: '1',
				isOpen: 0
			}
		};
	},
	methods: {
		/**
		 * 展示引擎数据
		 */
		showEngine(){
			
		},
		sourceChangeUI(e){
			var _this = this;
			let data = {
				tid: e.tag
			};
			this.$http.selectEngine('bf899190164146738625f81e65d874cf', JSON.stringify(data), res => {
				_this.dataSource2.colList = res.data;
			});
			this.changeDataSource(0, e, null);
		},
		/**
		 * 创建拷贝表
		 */
		createdCopy() {
			this.copyList("");
			this.createdChild(false, 0, '');
		},
		changeCopy(e) {
			this.copyList("%" + e + "%");
		},
		selectCopyData(e){
			let data = {
				outId: e,
			};
			var _this = this;
			this.$http.selectEngine('ebe00aacddf94c87bfbe4cd236de015d', JSON.stringify(data), res => {
				_this.dataSource1.filedList = res.data;
			});
			//强制页面刷新
			this.changeData();
		},
		copyList(likeData) {
			likeData = likeData === "" ? null : likeData;
			let data = {
				like_name: likeData,
				like_code: likeData,
			};
			var _this = this;
			this.$http.selectEngine('5f0ee5c127c24961997a1be205499d0c', JSON.stringify(data), res => {
				_this.dataSource1.copyList = res.data;
			});
			//强制页面刷新
			this.changeData();
		},
		/**
		 * 构建： 组装核心数据
		 * @param {Object} sourceObj	数据核心对象
		 * @param {Object} executeTag	执行标识
		 * @param {Object} executeData	执行内容
		 */
		buildData(sourceObj, executeTag, executeData) {
			let data = {
				executeTag: executeTag,
				executeData: executeData,
				executeNum: this.currentStep
			};
			sourceObj.push(data);
		},
		/**
		 * 变更引擎类型
		 * @param {Object} type  类型编号
		 */
		changeEtype(type) {
			if (type === "0") {
				this.stepList = simple.out.stepList;
			} else if (type === "1") {
				this.stepList = simple.out.stepListEdit;
			} else if (type === "2") {
				this.stepList = simple.out.stepListDel;
			}
		},
		/**
		 * 输出字段多选锁定
		 * @param {Object} idx 需要锁定的数据下标
		 */
		changeLock(idx) {
			this.dataSource4.items4[idx].locked = this.dataSource4.items4[idx].colunm.length > 1 ? 1 : 0;
		},
		/**
		 * @param {Object} id   引擎的id
		 * @param {Object} idx  当前操作的数据下标
		 * @param {Object} jdx  当前操作的二级数据下标
		 * @param {Object} cnx  当前操作的三级数据下标
		 */
		changeEngine(id, idx, jdx, cnx) {
			var tag = this.currentStep;
			if (tag === 2) {
				//select
				this.dataSource2.items2[idx].egid = id;
			} else {
				//case
				this.dataSource3.items3[idx].caseQuery[jdx].caseWhere[cnx].egid = id;
			}
		},
		/**
		 * 移除新增项
		 * @param {Object} index  	父级数组下标
		 * @param {Object} isChild	是否移除为子级
		 * @param {Object} idx    	子级字段+数组下标
		 */
		remove(index, isChild, idx) {
			var step = this.currentStep;
			var obj = this['dataSource' + step]['items' + step][index];
			if (isChild) {
				//数据解析：第一层级
				var childList = idx.split(',');
				for (var i = 0; i < childList.length; i++) {
					var c = childList[i];
					if (c !== '') {
						//数据解析：第二层级
						var childFiled = c.split('#');
						obj = obj[childFiled[0]][childFiled[1]];
						//检测数据为caseQuery 执行解锁
						if (childFiled[0] === 'caseQuery') {
							this.dataSource3.items3[index].ex = false;
						}
					}
				}
			}
			obj.status = '0';
		},
		/**
		 * 数据优化：追加子项
		 * @param {Object} index   当前优化项下标
		 * @param {Object} ex      当前优化项追加项禁用状态
		 */
		CaseQuery(index, ex) {
			//追加子项
			this.createdChild(true, index, 'caseQuery');
			var len = this.dataSource3.items3[index].caseQuery.length;
			//变更追加项禁用ban选状态
			this.dataSource3.items3[index].ex = ex;
			this.dataSource3.items3[index]['caseQuery'][len - 1]['ex'] = !ex;
		},
		/**
		 * 执行下一步
		 * @param {Object} go
		 */
		nextStep(go) {
			var sourceObj = this.sourceObj;
			if (go === 'checkmark') {
				//移除已有的结束标识selectFin
				var itemIdx = sourceObj.findIndex(item => item.executeTag === 'selectFin');
				if (itemIdx !== -1) {
					sourceObj.splice(itemIdx, 1);
				}
				//生成end段落标识
				this.buildData(sourceObj, 'selectFin', {});
				//JSON转化
				let json = [];
				for (var i = 0; i < sourceObj.length; i++) {
					var jo = sourceObj[i];
					//数据重组,移除web标识
					var no = {
						executeTag: jo.executeTag,
						executeData: jo.executeData
					};
					json.push(no);
				}
				var _this = this;
				//后台调用
				this.$http.testEngine(JSON.stringify(json), this.base.name, this.base.code, this.base.note, res => {
					var data = res.data;
					_this.selShow = data.execute.select;
					_this.selId = data.engineId;
					if (data.execute.executeParam) {
						//参数字段
						var params = data.execute.executeParam.split(',');
						_this.selectData = [];
						var arr = [];
						//组装参数列表数据
						for (var i = 0; i < params.length; i++) {
							if (params[i] !== '') {
								var extag = params[i].split('#');
								arr.push({
									name: extag[1],
									code: extag[0]
								});
							}
						}
						_this.selectData = arr;

						//输出字段
						var params2 = data.execute.outFiled.split(',');
						_this.outData = [];
						var arr2 = [];
						for (var i = 0; i < params2.length; i++) {
							if (params2[i] !== '') {
								var extag = params2[i].split('#');

								if (extag[0].indexOf(".") > -1) {
									//select
									var ey = extag[0].split(".");
									arr2.push({
										name: ey[0] + "「数据表」",
										code: ey[1]
									});
								} else {
									//case
									arr2.push({
										name: extag[1],
										code: extag[0]
									});
								}
							}
						}
						_this.outData = arr2;
					}
					//确认生成,数据展示
					_this.isShow = true;
				});
			} else {
				var idx = this.currentStep;
				var current = go === 'forward' ? idx + 1 : idx - 1;

				var obj = this['dataSource' + idx];
				//关键字段检测
				if (this.base.name === '' && this.base.code === '') {
					//错误提示
					this.$Message['error']({
						background: true,
						content: '引擎名称或唯一编码未填写',
						duration: 3
					});
					//焦点获取
					if (this.base.name === '') {
						this.$refs.name.focus();
					} else {
						this.$refs.code.focus();
					}
				} else {
					//如果是返回上一步
					if (go === 'back') {
						//执行返回上一步时，若下标为0，则将obj对象清空
						if (idx === 1) {
							sourceObj.splice(0, sourceObj.length);
						} else {
							sourceObj.splice(sourceObj.findIndex(item => item.executeNum >= current), 1);
						}
					} else {
						switch (idx) {
							case 0:
								this.stepZero(sourceObj, obj);
								break;
							case 1:
								this.stepGroup(sourceObj, obj);
								break;
							case 2:
								this.stepSelect(sourceObj, obj);
								break;
							case 3:
								this.stepCase(sourceObj, obj);
								break;
							case 4:
								this.stepOut(sourceObj, obj);
								break;
							case 5:
								this.stepSort(sourceObj, obj);
								break;
							case 6:
								this.stepPage(sourceObj, obj);
								break;
							default:
								break;
						}
					}
					console.log(JSON.stringify(sourceObj));
					this.currentStep = current;
				}
			}
		},
		/**
		 * 执行流程:分页
		 * @param {Object} obj
		 * @param {Object} item
		 */
		stepPage(obj, item) {
			var pg = this.dataSource6;
			//状态：是否开启
			var sStatus = this.dataSource6.isOpen;
			if (sStatus === 0) {
				var pac = pg.patch === '1' ? '@' : '';
				this.buildData(obj, 'dataPaging', {
					pageNo: pg.patch === '1' ? '@' + pg.pageNum : pg.pageNum + '#当前页',
					pageSize: pg.patch === '1' ? '@' + pg.pageSize : pg.pageSize + '#每页条数'
				});
			}
		},
		/**
		 * 执行流程: 数据排序
		 * @param {Object} obj
		 * @param {Object} item
		 */
		stepSort(obj, item) {
			var itms = 'items' + this.currentStep;
			//状态：是否开启
			var sStatus = this.dataSource5.isOpen;
			if (sStatus === 0) {
				var sList = this.dataSource5[itms];
				//循环数据
				for (var i = 0; i < sList.length; i++) {
					//获取对象
					var jo = sList[i];
					var col = '';
					for (var j = 0; j < jo.colunm.length; j++) {
						col = col + ',' + jo.colunm[j];
					}
					if (jo.status === '1') {
						if (col.length > 0) {
							this.buildData(obj, 'dataSort', {
								table: jo.table,
								sortType: jo.sType,
								key: col.substring(1, col.length)
							});
						}
					}
				}
			}
		},
		/**
		 * 执行流程: 输出字段
		 * @param {Object} obj
		 * @param {Object} item
		 */
		stepOut(obj, item) {
			var itms = 'items' + this.currentStep;
			//状态：是否开启
			var oStatus = this.dataSource4.isOpen;
			if (oStatus === 0) {
				var outList = this.dataSource4[itms];
				//循环数据
				for (var i = 0; i < outList.length; i++) {
					//获取对象
					var jo = outList[i];
					let colList = [];
					//判断当前数据是否有效
					if (jo.status === '1') {
						//去除重复数据
						let cols = [];
						for (var c = 0; c < jo.colunm.length; c++) {
							let ex = jo.colunm.length === 1 ? (jo.value === undefined ? '' : '#' + jo.value) : '';
							let tac = jo.table + '.' + jo.colunm[c];
							//判断当前字段是否已存在
							if (!colList.includes(tac, 0)) {
								cols.push(jo.colunm[c] + ex);
								colList.push(tac);
							}
						}
						//cols必须大于0，以确保字段数据存在
						if (cols.length > 0) {
							this.buildData(obj, 'appointColumn', {
								appointTable: jo.table,
								exAppointType: jo.groupType,
								appointColumns: cols.toString()
							});
						}
					}
				}
			}else{
				//如果未开启,则视为查询全部
				var  allTable = this.dataSource0.checkedTable;
				for(var i = 0 ; i < allTable.length ; i++){
					this.buildData(obj, 'appointColumn', {
						appointTable: allTable[i].value + "," + allTable[i].tag,
						exAppointType: "DEF",
						appointColumns: ""
					});
				} 
			}
		},
		/**
		 * 执行流程：输出优化
		 * @param {Object} obj
		 * @param {Object} item
		 */
		stepCase(obj, item) {
			var itms = 'items' + this.currentStep;
			//优化状态：是否开启
			var cStatus = this.dataSource3.isOpen;
			//分组状态：是否开启
			var gStatus = this.dataSource1.isOpen;
			if (cStatus === 0) {
				var caseList = this.dataSource3[itms];
				//循环一级数据
				for (var i = 0; i < caseList.length; i++) {
					//获取一级对象
					var jo = caseList[i];
					//判断当前数据是否有效
					if (jo.status === 1) {
						//case构建
						this.buildData(obj, 'caseBuild', {
							caseAlias: jo.value
						});
						//获取二级query数据
						var caseQuery = jo.caseQuery;
						for (var j = 0; j < caseQuery.length; j++) {
							var co = caseQuery[j];
							//判断当前数据是否有效
							if (co.status == '1') {
								var caseWhere = co.caseWhere;
								//获取三级where数据
								for (var z = 0; z < caseWhere.length; z++) {
									var zo = caseWhere[z];
									var pac = zo.patch === '1' ? '@' : zo.patch === '0' ? '@#' : '';
									//判断当前数据是否有效
									if (zo.status === '1') {
										//Case When记录
										this.buildData(obj, zo.patch === '3' ? 'caseWhenQueryChild' : 'caseWhenQuery', {
											whenQuery: zo.queryType,
											whenTable: zo.table,
											whenColumn: pac + zo.colunm,
											whenCondition: zo.conditionType,
											exCaseType: gStatus === 0 ? zo.groupType : 'DEF',
											id: zo.egid,
											whenValue: zo.patch === '0' ?
												zo.toTable + '.' + zo.toKey :
												zo.patch === '1' || zo.patch === '2' ?
												zo.value :
												zo.patch === '3' ?
												null :
												zo.toValue
										});
									}
								}
								console.log(!co.ex ? 'caseFin' : 'caseThen');
								//Case Then记录
								this.buildData(obj, !co.ex ? 'caseFin' : 'caseThen', {
									thenValue: co.outValue,
									elseValue: co.outValue
								});
							}
						}
					}
				}
			}
		},
		/**
		 * 执行流程：查询
		 * @param {Object} obj
		 * @param {Object} item
		 */
		stepSelect(obj, item) {
			var itms = 'items' + this.currentStep;
			//查询状态：是否开启
			var sStatus = this.dataSource2.isOpen;

			if (sStatus === 0) {
				var selList = this.dataSource2[itms];
				for (var i = 0; i < selList.length; i++) {
					//解析，拆分对象
					var jo = selList[i];
					//分组状态：是否开启
					var gStatus = jo.groupType === 'DEF';
					//判断当前数据节点是否有效
					if (jo.status == '1') {
						var patch = jo.patch === '1' ? '@' : jo.patch === '0' ? '@#' : '';
						this.buildData(obj, !gStatus ? (jo.patch === '3' ? 'groupHavingChild' : 'groupHaving') : jo.patch === '3' ?
							'queryChild' : 'queryBuild', {
								queryType: jo.queryType,
								table: jo.table,
								groupTable: jo.table,
								/**
								 * patch为0、1代表当前为固定入参模式
								 */
								key: patch + jo.colunm,
								conditionType: jo.conditionType,
								/**
								 * patch为0代表使用了字段匹配模式
								 */
								value: jo.patch === '0' ? jo.toTable + '.' + jo.toKey : jo.patch === '1' || jo.patch === '2' ? jo.Value : jo.patch ===
									'3' ? null : jo.toValue,
								id: jo.egid,
								groupColumn: patch + jo.colunm,
								groupType: jo.groupType,
								exQueryType: jo.groupType
							});
					}
				}
			}
		},
		/**
		 * 执行流程：分组
		 * @param {Object} obj
		 * @param {Object} item
		 */
		stepGroup(obj, item) {
			var itms = 'items' + this.currentStep;
			//分组状态：是否开启
			var gStatus = this.dataSource1.isOpen;

			if (gStatus === 0) {
				let colList = [];
				for (var i = 0; i < item[itms].length; i++) {
					//分组变量标识
					let cols = [];
					for (var c = 0; c < item[itms][i].colunm.length; c++) {
						let tac = item[itms][i].table + '.' + item[itms][i].colunm;
						//判断当前字段是否已存在
						if (!colList.includes(tac, 0)) {
							cols.push(item[itms][i].colunm);
							colList.push(tac);
						}
					}
					//分组字段必须大于0
					if (cols.length > 0) {
						this.buildData(obj, 'groupBuild', {
							groupTable: item[itms][i].table,
							groupColumns: cols.toString()
						});
					}
				}
			}
		},
		/**
		 * 执行流程：主子表 -> 下一步
		 * @param {Object} obj
		 * @param {Object} item
		 */
		stepZero(obj, item) {
			// [execute]/[executeChild]
			this.buildData(obj, item.dataType === '0' ? 'execute' : 'executeChild', {
				tableName: item.bindSource,
				alias: item.bindSourceAlias,
				id: item.egid
			});

			var itms = 'items' + this.currentStep;
			for (var i = 0; i < item[itms].length; i++) {
				//二级对象剥离
				var itm = item[itms][i];
				//判断当前数据类型是否为[数据表]
				var dataType = item.dataType === '0';
				//当前数据状态为激活状态
				if (itm.status == '1') {
					// [joinBuild]/[joinChildBuild]
					this.buildData(obj, dataType ? 'joinBuild' : 'joinChildBuild', {
						joinTable: itm.joinTable,
						joinAlias: itm.joinAlias,
						joinType: itm.joinType,
						id: itm.egid
					});
					// [joinColunm]
					this.buildData(obj, 'joinColunm', {
						joinTable: itm.mainTable,
						joinFrom: itm.mainColunm,
						joinTo: itm.joinColunm
					});

					var jw = itm.joinWhere;
					for (var j = 0; j < jw.length; j++) {
						//三级对象剥离
						var jo = jw[j];
						if (jo.status == '1') {
							//特殊字段转化
							var pac = jo.patch === '1' ? '@' : jo.patch === '0' ? '@#' : '';
							// [joinWhereChild]/[joinWhere]
							this.buildData(obj, jo.patch === '3' ? 'joinWhereChild' : 'joinWhere', {
								queryType: jo.queryType,
								table: jo.jwTable,
								key: pac + jo.jwKey,
								conditionType: jo.conditionType,
								value: jo.patch === '0' ? jo.jwToTable + '.' + jo.jwToKey : jo.patch === '1' ? jo.jwValue : jo.patch === '3' ?
									null : jo.jwValue,
								id: jo.egid
							});
						}
					}
					// [joinFin]
					this.buildData(obj, 'joinFin', {});
				}
			}
		},
		/**
		 * 强制刷新页面数据属性
		 */
		changeData() {
			this.$forceUpdate();
		},
		/**
		 * 执行流程：主子表 - 更新切换表与引擎
		 * @param {Object} opt  表（0）与引擎（1）标识
		 * @param {Object} idx	子级下标
		 */
		changeDataType(opt, idx) {
			var out = simple.out;
			var list = opt === '0' ? out.tableList : out.engineList;
			//只要进行切换，就需要将别名重置为空
			if (idx === 0) {
				this.dataSource0.dataSourceList = list;
				this.dataSource0.bindSourceAlias = '';
			} else {
				this.dataSource0.items0[idx - 1].sourceList = list;
				this.dataSource0.items0[idx - 1].joinAlias = '';
			}
			this.changeData();
		},
		/**
		 * 执行流程：主子表 - 更新已选信息的别名字段
		 * @param {Object} idx
		 * @param {Object} opt
		 */
		changeAlias(idx, opt) {
			var itms = 'items' + this.currentStep;
			var value = opt.currentTarget.value;
			var inx = idx <= 0 ? 0 : idx;
			var table = idx === 0 ? this.dataSource0.bindSource : this.dataSource0[itms][inx - 1].joinTable;
			var fin = value === '' ? (table === undefined ? '' : value) : value;
			var label = this.dataSource0.checkedTable[inx].label;
			this.dataSource0.checkedTable[inx].value = fin;
			this.dataSource0.checkedTable[inx].label = fin + '「' + label.split('「')[1];
		},
		/**
		 * 执行流程：主子表 - 新增及更新当前数据引擎可使用主数据源集合
		 * @param {Object} idx
		 * @param {Object} opt
		 */
		changeDataSource(idx, opt, filed) {
			var currentSource = this.dataSource0;
			var checkedTable = currentSource.checkedTable;
			var itms = 'items' + this.currentStep;
			if (opt !== undefined) {
				var inx = idx <= 0 ? 0 : idx - 1;
				//重名数据校验
				var isTable = this.dataSource0.dataType === '0';
				var val =
					idx === 0 ?
					currentSource.bindSourceAlias !== '' ?
					currentSource.bindSourceAlias :
					opt.value :
					currentSource[itms][inx].joinAlias !== undefined ?
					currentSource[itms][inx].joinAlias !== '' ?
					currentSource[itms][inx].joinAlias :
					opt.value :
					opt.value;

				var findAll = checkedTable.filter(t => t.value === val);

				var msInx = findAll === undefined ? '' : findAll.length > 0 ? idx + 1 : '';

				var label = opt.label.split('「');
				//新数据源
				var newSource = {
					value: opt.value + msInx,
					label: label[0] + msInx + '「' + label[1],
					tag: opt.tag,
					index: idx
				};

				//判断当前节点是否为主子表
				//根据数据类型不同，最终获取值也会有相应变化
				if (idx === 0) {
					this.dataSource0.egid = isTable ? opt.value : opt.tag;
				} else {
					this.dataSource0[itms][inx].egid = this.dataSource0.items0[idx - 1].joinDataType === '0' ? opt.value : opt.tag;
				}

				//置入或替换数据源
				if (checkedTable.length > idx) {
					checkedTable.splice(idx, 1, newSource);
				} else {
					checkedTable.push(newSource);
				}

				//变更字段数据
				if (filed !== null) {
					this.changeColunm(filed, opt.tag);
				}
			}
		},
		/**
		 * 新增子节点「」
		 */
		createdChild(isChild, childIdx, childFiled) {
			childIdx = childIdx + '-';
			//获取当前执行节点
			var dataSource = 'dataSource' + this.currentStep;
			var itms = 'items' + this.currentStep;
			//基础属性赋值
			var index = 0;
			//对象最上层
			var obj = this[dataSource][itms];
			if (isChild) {
				var cdx = childIdx.split('-');
				for (var i = 0; i < cdx.length; i++) {
					if (cdx[i] !== '') {
						obj = obj[cdx[i]];
					}
				}
				obj = obj[childFiled];
			}
			index = obj.length;

			//声明：item动态赋值对象空间
			// var item = {};
			var itemSource = simple.out.itemChild;
			//为解决浅拷贝问题
			var item = Object.assign({}, item, itemSource);
			// 拓展属性赋值
			var exChild = isChild ? '_' + childFiled : '';
			var exFiled = simple.out.exItem[dataSource + exChild];
			//数据联动标识
			var colData = false;
			var colTag = '';
			for (var i = 0; i < exFiled.length; i++) {
				//拆分拓展属性字段
				var itm = exFiled[i].split('#');
				//特殊字段值转化操作
				if (itm[1] === 'index') {
					itm[1] = index;
				} else if (itm[1] === 'Array') {
					itm[1] = [];
				} else if (itm[1] === 'sList') {
					itm[1] = simple.out.tableList;
				} else if (itm[1] === 'true') {
					itm[1] = true;
				} else if (itm[1] === 'false') {
					itm[1] = false;
				} else if (itm[1] === 'getData') {
					colData = true;
					colTag = itm[0];
					itm[1] = [];
				}
				//特殊字段追加
				item[itm[0]] = itm[1];
			}
			//赋值
			obj.push(item);

			if (colData) {
				this.$http.selectEngine('80272d292a99479890717a04df11e900', JSON.stringify({}), res => {
					obj[index][colTag] = res.data;
				});
			}
			//强制页面刷新
			this.changeData();
		},
		/**
		 * 获取基础表信息
		 * @param {Object} obj		赋值对象 支持无限下级 a.b.c.d
		 * @param {Object} datas	封装的数据参数
		 * @param {Object} eid      引擎ID
		 */
		getList(obj, eid, datas) {
			var json = {};
			this.$http.selectEngine(eid, JSON.stringify(datas), res => {
				this[obj] = res.data;
			});
		},
		/**
		 * 加载关联表数据字段信息
		 * @param {Object} obj
		 * @param {Object} tid
		 */
		changeColunm(obj, tid) {
			var dataSource = 'dataSource' + this.currentStep;
			let data = {
				tid: tid
			};
			var ob_ject = this[dataSource];
			var named = '';
			var objSplit = obj.split(',');
			for (var i = 0; i < objSplit.length; i++) {
				if (objSplit[i] !== '') {
					if (objSplit[i].indexOf('#') !== -1) {
						var sp = objSplit[i].split('#');
						ob_ject = ob_ject[sp[0]][sp[1]];
					} else {
						named = objSplit[i];
					}
				}
			}
			//后台数据调用
			this.$http.selectEngine('bf899190164146738625f81e65d874cf', JSON.stringify(data), res => {
				if (named === 'joinFiled') {
					ob_ject.joinFiled = res.data;
				} else {
					ob_ject.colList = res.data;
				}
			});
		}
	},
	//基础数据初始化
	created() {
		//从simple.js获取初始化的数据对象
		var out = simple.out;
		//对指定数据进行赋值操作
		this.sortType = out.sortType;
		this.exType = out.exType;
		this.stepList = out.stepList;
		this.btNext = out.btNext;
		this.dataType = out.dataType;
		this.query = out.query;
		this.condition = out.condition;
		this.joinType = out.joinType;
		this.patchList = out.patchList;
		this.engineType = out.engineType;
		this.dataStatus = out.dataStatus;
		this.dataSource0.engineList = out.engineList;
		this.getList('tableList', '80272d292a99479890717a04df11e900', {});
		//初始化对应数据源
		for (var i = 0; i < 7; i++) {
			var data = this['dataSource' + i];
			this['dataSource' + i] = Object.assign(data, out.dataSource);
		}
		//默认使用表集合
		this.changeDataType('0', 0);
	}
};
