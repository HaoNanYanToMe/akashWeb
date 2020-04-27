<style lang="less">
@import './simple.less';
</style>
<template>
	<Div class="step_main">
		<!--展示区-->
		<Div class="lf_tap">
			<Form :label-width="100">
				<FormItem label="引擎名称">
					<i-input :disabled="currentStep !== 0" v-model="base.name" style="width:15%" ref="name" />
					<Span class="base">唯一编码</Span>
					<i-input :disabled="currentStep !== 0" v-model="base.code" style="width:15%" ref="code" />
					<Span class="base">备注信息</Span>
					<i-input :disabled="currentStep !== 0" v-model="base.note" style="width:55%" />
				</FormItem>
			</Form>
			<Divider />
			<!--数据核心区-->
			<Form :label-width="100" v-show="step.id === currentStep" v-for="step in stepList" :key="step.id">
				<!--操作提示区-->
				<DIV class="tipTap">
					<Icon type="md-alert" />
					{{ step.note }}
					<Divider />
				</DIV>
			</Form>
			<!--执行流程：主子表信息-->
			<Form v-if="currentStep === 0">
				<!--执行流程：主表信息-->
				<Span class="base">主数据源类型</Span>
				<Select v-model="dataSource0.dataType" @on-change="changeDataType($event, 0)" placeholder="请选择数据类型" filterable style="width:18%">
					<Option v-for="dt in dataType" :value="dt.id" :key="dt.id">{{ dt.name }}</Option>
				</Select>
				<Span class="base">主数据源</Span>
				<Select v-model="dataSource0.bindSource" @on-change="changeDataSource(0, $event)" label-in-value placeholder="请指定主数据源" filterable style="width:25%">
					<Option v-for="ds in dataSource0.dataSourceList" :value="ds.code" :key="ds.code" :tag="ds.id">{{ ds.name }}「{{ ds.code }}」</Option>
				</Select>
				<input v-model="dataSource0.egid" v-show="false" />
				<Span class="base">主数据源别名</Span>
				<i-input placeholder="请输入当前数据源别名" @on-change="changeAlias(0, $event)" v-model="dataSource0.bindSourceAlias" style="width:15%" />
				<i-input style="display: none;" v-model="dataSource0.id" />
				<Button type="primary" @click="createdChild(false, 0, '')" icon="md-add" style="margin: 0 10px  0 10px;">追加关联表</Button>
				<!--执行流程：子表信息-->
				<DIV v-for="(item, index) in dataSource0.items0" :key="index" v-if="item.status === 1">
					<Divider>
						<Icon type="md-alert" />
						<strong>{{ '  关联表  「' + (item.index + 1) + '」' }}</strong>
					</Divider>
					<FormItem class="showMain">
						<Span class="base">主数据源</Span>
						<Select v-model="item.mainTable" label-in-value placeholder="请指定主数据源" filterable style="width:15%">
							<Option v-for="st in dataSource0.checkedTable" :value="st.value" :key="st.value">{{ st.label }}</Option>
						</Select>
						<Span class="base">主表字段</Span>
						<Select v-model="item.mainColunm" label-in-value placeholder="请选择主表字段" filterable style="width:15%">
							<Option v-for="ds in colList" :value="ds.code" :key="ds.code" :tag="ds.id">{{ ds.name }}「{{ ds.code }}」</Option>
						</Select>
						<Span class="base">连表类型</Span>
						<Select v-model="item.joinType" @on-change="changeData" placeholder="请选择连表类型" filterable style="width:15%">
							<Option v-for="dt in joinType" :value="dt.value" :key="dt.value">{{ dt.label }}</Option>
						</Select>
						<Button v-show="item.joinType !== 'N'" type="primary" @click="createdChild(true, index, 'joinWhere')" icon="md-add" style="margin: 0 10px  0 10px;">
							追加关联关系
						</Button>
					</FormItem>
					<FormItem class="showMain">
						<Span class="base">从数据源类型</Span>
						<Select v-model="item.joinDataType" @on-change="changeDataType($event, index + 1)" placeholder="请选择从数据源类型" filterable style="width:15%">
							<Option v-for="dt in dataType" :value="dt.id" :key="dt.id">{{ dt.name }}</Option>
						</Select>
						<Span class="base">从数据源</Span>
						<Select v-model="item.joinTable" label-in-value @on-change="changeDataSource(index + 1, $event)" placeholder="请指定从数据源" filterable style="width:15%">
							<Option v-for="ds in item.sourceList" :value="ds.code" :key="ds.code" :tag="ds.id">{{ ds.name }}「{{ ds.code }}」</Option>
						</Select>
						<input v-model="item.egid" v-show="false" />
						<Span class="base">别名</Span>
						<i-input v-model="item.joinAlias" @on-change="changeAlias(index + 1, $event)" placeholder="请输入从数据源别名" style="width:15%"></i-input>
						<Span class="base">从表字段</Span>
						<Select v-model="item.joinColunm" label-in-value placeholder="请选择从表字段" filterable style="width:15%">
							<Option v-for="ds in colList" :value="ds.code" :key="ds.code" :tag="ds.id">{{ ds.name }}「{{ ds.code }}」</Option>
						</Select>
						<Button icon="md-remove" type="error" @click="remove(index, false, -1)">取消关联</Button>
					</FormItem>
					<!--执行流程：子表关联信息-->
					<FormItem v-for="(jw, jdx) in dataSource0.items0[index].joinWhere" :key="jdx" v-if="jw.status === 1" class="showLine" style="width: 70%">
						<Divider>{{ '  关联关系  -  ' + (jdx + 1) }}</Divider>
						<Span class="base">组合关系</Span>
						<Select v-model="jw.queryType" placeholder="请选择组合关系" filterable style="width:15.5%">
							<Option v-for="q in query" :value="q.value" :key="q.value">{{ q.label }}</Option>
						</Select>
						<Span class="base">主查询数据源</Span>
						<Select v-model="jw.jwTable" label-in-value placeholder="请指定主数据源" filterable style="width:20%">
							<Option v-for="st in dataSource0.checkedTable" :value="st.value" :key="st.value">{{ st.label }}</Option>
						</Select>
						<Span class="base">主查询字段</Span>
						<Select v-model="jw.jwKey" label-in-value placeholder="请选择主查询字段" filterable style="width:20%">
							<Option v-for="ds in colList" :value="ds.code" :key="ds.code" :tag="ds.id">{{ ds.name }}「{{ ds.code }}」</Option>
						</Select>
						<DIV style="margin-top: 0.625rem;">
							<Span class="base">运算标识</Span>
							<Select v-model="jw.conditionType" placeholder="请选择运算标识" filterable style="width:14%">
								<Option v-for="c in condition" :value="c.value" :key="c.value">{{ c.label }}</Option>
							</Select>
							<Span class="base">数据匹配方式</Span>
							<Select v-model="jw.patch" @on-change="changeData" placeholder="请选择匹配方式" style="width:14%">
								<Option v-for="c in patchList" :value="c.value" :key="c.value">{{ c.label }}</Option>
							</Select>
							<Span class="base">关联设置</Span>
							<i-input
								v-show="jw.patch === '1' || jw.patch === '2'"
								v-model="jw.jwValue"
								:placeholder="jw.patch === '1' ? '请输入固定值' : '请设置动态参数名称'"
								style="width:26.5%"
							></i-input>
							<Select v-show="jw.patch === '3'" v-model="item.jwEngine" label-in-value placeholder="请选择关联的数据引擎" filterable style="width:26.5%">
								<Option v-for="ds in dataSource0.engineList" :value="ds.code" :key="ds.code" :tag="ds.id">{{ ds.name }}「{{ ds.code }}」</Option>
							</Select>
							<Select v-show="jw.patch === '0'" v-model="jw.jwToTable" label-in-value placeholder="请指定关联数据源" filterable style="width:13%">
								<Option v-for="st in dataSource0.checkedTable" :value="st.value" :key="st.value">{{ st.label }}</Option>
							</Select>
							<Select v-show="jw.patch === '0'" v-model="jw.jwToKey" label-in-value placeholder="请选择关联字段" filterable style="width:13%">
								<Option v-for="ds in colList" :value="ds.code" :key="ds.code" :tag="ds.id">{{ ds.name }}「{{ ds.code }}」</Option>
							</Select>
							<Button icon="md-remove" type="error" style="margin-left: 5px;" @click="remove(index, true, 'joinWhere#' + jdx)">关系解除</Button>
						</DIV>
					</FormItem>
				</DIV>
			</Form>
			<!-- 执行流程：数据分组-->
			<Form v-if="currentStep === 1">
				<FormItem style="margin-left: 32.5%;">
					<Span class="base">是否启用数据分组</Span>
					<Select v-model="dataSource1.isOpen" placeholder="请选择数据分组的启用状态" style="width:28%">
						<Option v-for="ds in dataStatus" :value="ds.id" :key="ds.id">{{ ds.name }}</Option>
					</Select>
					<Button v-show="dataSource1.isOpen === 0" type="primary" @click="createdChild(false, 0, '')" icon="md-add" style="margin: 0 10px  0 10px;">新增分组关系</Button>
				</FormItem>
				<FormItem v-for="(jw, jdx) in dataSource1.items1" :key="jdx" v-if="jw.status === 1 && dataSource1.isOpen === 0" class="showLine" style="width: 70%">
					<Divider>{{ '  分组关系  -  ' + (jdx + 1) }}</Divider>
					<Span class="base">数据源</Span>
					<Select v-model="jw.table" label-in-value placeholder="请指定主数据源" filterable style="width:20%">
						<Option v-for="st in dataSource0.checkedTable" :value="st.value" :key="st.value">{{ st.label }}</Option>
					</Select>
					<Span class="base">指定分组字段</Span>
					<Select v-model="jw.colunm" label-in-value placeholder="请选择主查询字段" filterable style="width:40%" multiple>
						<Option v-for="ds in colList" :value="ds.code" :key="ds.code" :tag="ds.id">{{ ds.name }}「{{ ds.code }}」</Option>
					</Select>
					<Button icon="md-remove" type="error" style="margin-left: 5px;" @click="remove(jdx, false, -1)">取消选定</Button>
				</FormItem>
			</Form>
			<!-- 执行流程：数据查询-->
			<Form v-if="currentStep === 2">
				<FormItem style="margin-left: 32.5%;">
					<Span class="base">是否启用数据查询</Span>
					<Select v-model="dataSource2.isOpen" placeholder="请选择数据查询的启用状态" style="width:28%">
						<Option v-for="ds in dataStatus" :value="ds.id" :key="ds.id">{{ ds.name }}</Option>
					</Select>
					<Button v-show="dataSource2.isOpen === 0" type="primary" @click="createdChild(false, 0, '')" icon="md-add" style="margin: 0 10px  0 10px;">新增查询条件</Button>
				</FormItem>
				<FormItem v-for="(jw, jdx) in dataSource2.items2" :key="jdx" v-if="jw.status === 1" class="showLine" style="width: 70%">
					<Divider>{{ '  关联关系  -  ' + (jdx + 1) }}</Divider>
					<Span class="base">组合关系</Span>
					<Select v-model="jw.queryType" placeholder="请选择组合关系" filterable style="width:13%">
						<Option v-for="q in query" :value="q.value" :key="q.value">{{ q.label }}</Option>
					</Select>
					<Span class="base">聚合类型</Span>
					<Select v-model="jw.groupType" placeholder="请选择聚合类型" filterable style="width:13%">
						<Option value="DEF" key="DEF">默认</Option>
						<Option v-if="dataSource1.isOpen === 0" v-for="c in exType" :value="c.value" :key="c.value">{{ c.label }}</Option>
					</Select>
					<Span class="base">主查询数据源</Span>
					<Select v-model="jw.table" label-in-value placeholder="请指定主数据源" filterable style="width:15%">
						<Option v-for="st in dataSource0.checkedTable" :value="st.value" :key="st.value">{{ st.label }}</Option>
					</Select>
					<Span class="base">主查询字段</Span>
					<Select v-model="jw.colunm" label-in-value placeholder="请选择主查询字段" filterable style="width:15%">
						<Option v-for="ds in colList" :value="ds.code" :key="ds.code" :tag="ds.id">{{ ds.name }}「{{ ds.code }}」</Option>
					</Select>
					<DIV style="margin-top: 0.625rem;">
						<Span class="base">运算标识</Span>
						<Select v-model="jw.conditionType" placeholder="请选择运算标识" filterable style="width:14%">
							<Option v-for="c in condition" :value="c.value" :key="c.value">{{ c.label }}</Option>
						</Select>
						<Span class="base">数据匹配方式</Span>
						<Select v-model="jw.patch" @on-change="changeData" placeholder="请选择匹配方式" style="width:14%">
							<Option v-for="c in patchList" :value="c.value" :key="c.value">{{ c.label }}</Option>
						</Select>
						<Span class="base">关联设置</Span>
						<i-input
							v-show="jw.patch === '1' || jw.patch === '2'"
							v-model="jw.Value"
							:placeholder="jw.patch === '1' ? '请输入固定值' : '请设置动态参数名称'"
							style="width:26.5%"
						></i-input>
						<Select
							v-show="jw.patch === '3'"
							@on-change="changeEngine($event.tag, jdx)"
							v-model="jw.toEngine"
							label-in-value
							placeholder="请选择关联的数据引擎"
							filterable
							style="width:26.5%"
						>
							<Option v-for="ds in dataSource0.engineList" :value="ds.code" :key="ds.code" :tag="ds.id">{{ ds.name }}「{{ ds.code }}」</Option>
						</Select>
						<input v-model="jw.egid" v-show="false" />
						<Select v-show="jw.patch === '0'" v-model="jw.toTable" label-in-value placeholder="请指定关联数据源" filterable style="width:13%">
							<Option v-for="st in dataSource0.checkedTable" :value="st.value" :key="st.value">{{ st.label }}</Option>
						</Select>
						<Select v-show="jw.patch === '0'" v-model="jw.toKey" label-in-value placeholder="请选择关联字段" filterable style="width:13%">
							<Option v-for="ds in colList" :value="ds.code" :key="ds.code" :tag="ds.id">{{ ds.name }}「{{ ds.code }}」</Option>
						</Select>
						<Button icon="md-remove" type="error" style="margin-left: 5px;" @click="remove(jdx, false, -1)">条件移除</Button>
					</DIV>
				</FormItem>
			</Form>
			<!-- 数据优化Case When Then-->
			<Form v-if="currentStep === 3">
				<FormItem class="showMain">
					<Span class="base">是否启用数据优化</Span>
					<Select v-model="dataSource3.isOpen" placeholder="请选择数据优化的启用状态" style="width:28%">
						<Option v-for="ds in dataStatus" :value="ds.id" :key="ds.id">{{ ds.name }}</Option>
					</Select>
					<Button v-show="dataSource3.isOpen === 0" type="primary" @click="createdChild(false, 0, '')" icon="md-add" style="margin: 0 10px  0 10px;">
						新增数据输出优化项
					</Button>
				</FormItem>
				<FormItem v-for="(item, index) in dataSource3.items3" :key="index" v-if="item.status === 1" class="showMain">
					<Divider>{{ '  数据优化项  -  ' + (index + 1) }}</Divider>
					<Span class="base">输出项别名</Span>
					<i-input v-model="item.value" placeholder="请设置筛选输出项别名" style="width:35%"></i-input>
					<Button type="primary" @click="CaseQuery(index, false)" :disabled="item.ex" icon="md-add">追加case子项</Button>
					<Button type="primary" @click="CaseQuery(index, true)" :disabled="item.ex || item.caseQuery.length === 0" icon="md-add">追加else分支项</Button>
					<Button @click="remove(index, fasle, -1)" icon="md-remove" type="error">删除优化项</Button>
					<FormItem v-for="(jw, inx) in item.caseQuery" :key="inx" v-if="jw.status === '1'" class="showMain" style="width: 70%;margin-top:0.625rem;">
						<Divider>{{ '  指定输出结果  -  ' + (inx + 1) }}</Divider>
						<Span class="base">输出结果</Span>
						<i-input v-model="jw.outValue" placeholder="请设置输出结果" style="width:35%"></i-input>
						<Button type="primary" @click="createdChild(true, index + '-caseQuery-' + inx, 'caseWhere')" icon="md-add" v-if="jw.ex">追加条件</Button>
						<Button @click="remove(index, true, 'caseQuery#' + inx)" icon="md-remove" type="error">移除条件</Button>
						<FormItem v-for="(cw, cnx) in jw.caseWhere" v-if="cw.status === '1'" :key="cnx" class="showMain" style="width: 95%;margin-top:0.625rem;">
							<Divider>{{ '  指定匹配条件  -  ' + (cnx + 1) }}</Divider>
							<Span class="base">组合关系</Span>
							<Select v-model="cw.queryType" placeholder="请选择组合关系" filterable style="width:15.5%">
								<Option v-for="q in query" :value="q.value" :key="q.value">{{ q.label }}</Option>
							</Select>
							<Span class="base">主查询数据源</Span>
							<Select v-model="cw.table" label-in-value placeholder="请指定主数据源" filterable style="width:20%">
								<Option v-for="st in dataSource0.checkedTable" :value="st.value" :key="st.value">{{ st.label }}</Option>
							</Select>
							<Span class="base">主查询字段</Span>
							<Select v-model="cw.colunm" label-in-value placeholder="请选择主查询字段" filterable style="width:20%">
								<Option v-for="ds in colList" :value="ds.code" :key="ds.code" :tag="ds.id">{{ ds.name }}「{{ ds.code }}」</Option>
							</Select>
							<DIV style="margin-top: 0.625rem;">
								<Span class="base">聚合类型</Span>
								<Select v-model="cw.groupType" placeholder="请选择聚合类型" filterable style="width:20%">
									<Option value="DEF" key="DEF">默认</Option>
									<Option v-if="dataSource1.isOpen === 0" v-for="c in exType" :value="c.value" :key="c.value">{{ c.label }}</Option>
								</Select>
								<Span class="base">运算标识</Span>
								<Select v-model="cw.conditionType" placeholder="请选择运算标识" filterable style="width:20%">
									<Option v-for="c in condition" :value="c.value" :key="c.value">{{ c.label }}</Option>
								</Select>
								<Span class="base">数据匹配方式</Span>
								<Select v-model="cw.patch" @on-change="changeData" placeholder="请选择匹配方式" style="width:18%">
									<Option v-for="c in patchList" :value="c.value" :key="c.value">{{ c.label }}</Option>
								</Select>
							</DIV>
							<DIV style="margin-top: 0.625rem;">
								<Span class="base">关联设置</Span>
								<i-input
									v-show="cw.patch === '1' || cw.patch === '2'"
									v-model="cw.value"
									:placeholder="cw.patch === '1' ? '请输入固定值' : '请设置动态参数名称'"
									style="width:26.5%"
								></i-input>
								<Select
									v-show="cw.patch === '3'"
									@on-change="changeEngine($event.tag, index, inx, cnx)"
									v-model="cw.toEngine"
									label-in-value
									placeholder="请选择关联的数据引擎"
									filterable
									style="width:26.5%"
								>
									<Option v-for="ds in dataSource0.engineList" :value="ds.code" :key="ds.code" :tag="ds.id">{{ ds.name }}「{{ ds.code }}」</Option>
								</Select>
								<input v-model="cw.egid" v-show="false" />
								<Select v-show="cw.patch === '0'" v-model="cw.toTable" label-in-value placeholder="请指定关联数据源" filterable style="width:22.5%">
									<Option v-for="st in dataSource0.checkedTable" :value="st.value" :key="st.value">{{ st.label }}</Option>
								</Select>
								<Select v-show="cw.patch === '0'" v-model="cw.toKey" label-in-value placeholder="请选择关联字段" filterable style="width:22.5%">
									<Option v-for="ds in colList" :value="ds.code" :key="ds.code" :tag="ds.id">{{ ds.name }}「{{ ds.code }}」</Option>
								</Select>
								<Button icon="md-remove" type="error" @click="remove(index, true, 'caseQuery#' + inx + ',caseWhere#' + cnx)">条件移除</Button>
							</DIV>
						</FormItem>
					</FormItem>
				</FormItem>
			</Form>
			<!--字段输出-->
			<Form v-if="currentStep === 4">
				<FormItem class="showMain">
					<Span class="base">是否指定输出字段</Span>
					<Select v-model="dataSource4.isOpen" placeholder="请选择是否需要指定输出字段" style="width:28%">
						<Option v-for="ds in dataStatus" :value="ds.id" :key="ds.id">{{ ds.name }}</Option>
					</Select>
					<Button v-show="dataSource4.isOpen === 0" type="primary" @click="createdChild(false, 0, '')" icon="md-add" style="margin: 0 10px  0 10px;">
						新增数据输出字段
					</Button>
				</FormItem>
				<FormItem v-for="(jw, jdx) in dataSource4.items4" :key="jdx" v-if="jw.status === '1' && dataSource4.isOpen === 0" class="showLine" style="width: 70%">
					<Divider>{{ '  数据输出  -  ' + (jdx + 1) }}</Divider>
					<Span class="base">数据源</Span>
					<Select v-model="jw.table" label-in-value placeholder="请选择数据源" filterable style="width:40%">
						<Option v-for="st in dataSource0.checkedTable" :value="st.value" :key="st.value">{{ st.label }}</Option>
					</Select>
					<Span class="base">聚合类型</Span>
					<Select v-model="jw.groupType" placeholder="请选择聚合类型" filterable style="width:40%">
						<Option value="DEF" key="DEF">默认</Option>
						<Option v-if="dataSource4.isOpen === 0" v-for="c in exType" :value="c.value" :key="c.value">{{ c.label }}</Option>
					</Select>
					<DIV style="margin-top: 0.625rem;">
						<Span class="base">输出字段</Span>
						<Select v-model="jw.colunm" label-in-value @on-change="changeLock(jdx)" placeholder="请选择输出字段" filterable style="width:45%" multiple>
							<Option v-for="ds in colList" :value="ds.code" :key="ds.code" :tag="ds.id">{{ ds.name }}「{{ ds.code }}」</Option>
						</Select>
						<Span class="base">字段别名</Span>
						<i-input v-model="jw.value" :disabled="jw.locked === 1" placeholder="请指定输出字段别名(可为空)" style="width:20%"></i-input>
						<Button icon="md-remove" type="error" style="margin-left: 5px;" @click="remove(jdx, false, -1)">取消指定</Button>
					</DIV>
				</FormItem>
			</Form>
			<!--排序设置-->
			<Form v-if="currentStep === 5">
				<FormItem class="showMain">
					<Span class="base">是否开启排序</Span>
					<Select v-model="dataSource5.isOpen" placeholder="请选择是否开启排序" style="width:28%">
						<Option v-for="ds in dataStatus" :value="ds.id" :key="ds.id">{{ ds.name }}</Option>
					</Select>
					<Button v-show="dataSource5.isOpen === 0" type="primary" @click="createdChild(false, 0, '')" icon="md-add" style="margin: 0 10px  0 10px;">
						新增数据输出字段
					</Button>
				</FormItem>
				<FormItem v-for="(jw, jdx) in dataSource5.items5" :key="jdx" v-if="jw.status === '1' && dataSource5.isOpen === 0" class="showLine" style="width: 70%">
					<Divider>{{ '  排序设定  -  ' + (jdx + 1) }}</Divider>
					<Span class="base">数据源</Span>
					<Select v-model="jw.table" label-in-value placeholder="请选择数据源" filterable style="width:40%">
						<Option v-for="st in dataSource0.checkedTable" :value="st.value" :key="st.value">{{ st.label }}</Option>
					</Select>
					<Span class="base">排序类型</Span>
					<Select v-model="jw.sType" placeholder="请选择数据排序类型" filterable style="width:40%">
						<Option v-if="dataSource5.isOpen === 0" v-for="c in sortType" :value="c.value" :key="c.value">{{ c.label }}</Option>
					</Select>
					<DIV style="margin-top: 0.625rem;">
						<Span class="base">指定排序字段</Span>
						<Select v-model="jw.colunm" label-in-value placeholder="请指定排序字段" filterable style="width:70%" multiple>
							<Option v-for="ds in colList" :value="ds.code" :key="ds.code" :tag="ds.id">{{ ds.name }}「{{ ds.code }}」</Option>
						</Select>
						<Button icon="md-remove" type="error" style="margin-left: 5px;" @click="remove(jdx, false, -1)">取消设置</Button>
					</DIV>
				</FormItem>
			</Form>
			<!--分页设置-->
			<Form v-if="currentStep === 6">
				<FormItem class="showLine">
					<Span class="base">是否开启分页</Span>
					<Select v-model="dataSource6.isOpen" placeholder="请选择是否开启分页" style="width:28%">
						<Option v-for="ds in dataStatus" :value="ds.id" :key="ds.id">{{ ds.name }}</Option>
					</Select>
				</FormItem>
				<FormItem v-if="dataSource6.isOpen === 0" class="showLine" style="width: 70%">
					<Divider>{{ '  分页设置  ' }}</Divider>
					<Span class="base">数据匹配方式</Span>
					<Select v-model="dataSource6.patch" placeholder="请选择匹配方式" style="width:18%">
						<Option v-for="c in patchList" v-if="c.value === '1' || c.value === '2'" :value="c.value" :key="c.value">{{ c.label }}</Option>
					</Select>
					<Span class="base">当前页</Span>
					<i-input v-model="dataSource6.pageNum" placeholder="请设置当前页值" :type="dataSource6.patch === '1' ? 'number' : 'text'" style="width:25%"></i-input>
					<Span class="base">每页条数</Span>
					<i-input v-model="dataSource6.pageSize" placeholder="请设置每页条数值" :type="dataSource6.patch === '1' ? 'number' : 'text'" style="width:25%"></i-input>
				</FormItem>
			</Form>
			<!--结果输出区-->
			<Form v-if="currentStep === 7">
				<FormItem v-if="isShow" class="showLine" style="width: 70%">
					<Divider>{{ '  SQL生成结果  ' }}</Divider>
					<DIV class="tapData">{{ selShow }}</DIV>
					<Divider>{{ '  需求参数对照表  ' }}</Divider>
					<Table :columns="columns1" :data="selectData"></Table>
				</FormItem>
			</Form>
			<!--操作及控制区-->
			<Form class="btn_next">
				<Button
					type="primary"
					size="large"
					shape="circle"
					v-for="bt in btNext"
					:key="bt.id"
					style="margin-right: 0.625rem;"
					v-show="
						bt.id === 'back' && currentStep != 0 ? true : bt.id === 'forward' && currentStep != 7 ? true : bt.id === 'checkmark' && currentStep === 7 ? true : false
					"
					@click="nextStep(bt.id)"
				>
					<Span v-show="bt.id != 'back'">{{ bt.note }}</Span>
					<Icon :type="bt.icon" />
					<Span v-show="bt.id === 'back'">{{ bt.note }}</Span>
				</Button>
			</Form>
		</Div>
		<!--流程区-->
		<Div class="rt_list">
			<Steps :current="currentStep" direction="vertical"><Step v-for="step in stepList" :key="step.id" :title="step.title"></Step></Steps>
		</Div>
	</Div>
</template>

<script>
import simple from './simple.js';
export default {
	data() {
		return {
			//结果展示区
			isShow: true,
			//结果反馈
			selShow: '',
			//参数需求
			columns1: [
				{
					title: '参数名称',
					key: 'name'
				},
				{
					title: '参数编码',
					key: 'code'
				}
			],
			selectData: [],
			//当前执行环节下标
			currentStep: 0,
			//基础配置信息
			base: {
				name: '',
				note: '',
				code: ''
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
			//执行流程：主子表
			dataSource0: {
				dataType: '0',
				//指定数据源
				bindSource: '',
				bindSourceAlias: '',
				//已选择的可用数据源
				checkedTable: [],
				dataSourceList: [],
				engineList: [],
				items0: []
			},
			//执行流程：分组
			dataSource1: {
				isOpen: 0,
				items1: []
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
					if (data.execute.executeParam) {
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
						this.buildData(obj,"caseBuild",{
							caseAlias: jo.value
						})
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
											whenValue:
												zo.patch === '0'
													? zo.toTable + '.' + zo.toKey
													: zo.patch === '1' || zo.patch === '2'
													? zo.value
													: zo.patch === '3'
													? null
													: zo.toValue
										});
									}
								}
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
						this.buildData(obj, !gStatus ? (jo.patch === '3' ? 'groupHavingChild' : 'groupHaving') : jo.patch === '3' ? 'queryChild' : 'queryBuild', {
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
							value: jo.patch === '0' ? jo.toTable + '.' + jo.toKey : jo.patch === '1' || jo.patch === '2' ? jo.Value : jo.patch === '3' ? null : jo.toValue,
							id: jo.egid,
							groupColumn: jo.colunm,
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
								value: jo.patch === '0' ? jo.jwToTable + '.' + jo.jwToKey : jo.patch === '1' ? jo.jwValue : jo.patch === '3' ? null : jo.jwValue,
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
		changeDataSource(idx, opt) {
			var currentSource = this.dataSource0;
			var checkedTable = currentSource.checkedTable;
			var itms = 'items' + this.currentStep;
			if (opt !== undefined) {
				var inx = idx <= 0 ? 0 : idx - 1;
				//重名数据校验
				var isTable = this.dataSource0.dataType === '0';
				var val =
					idx === 0
						? currentSource.bindSourceAlias !== ''
							? currentSource.bindSourceAlias
							: opt.value
						: currentSource[itms][inx].joinAlias !== undefined
						? currentSource[itms][inx].joinAlias !== ''
							? currentSource[itms][inx].joinAlias
							: opt.value
						: opt.value;

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
				}
				//特殊字段追加
				item[itm[0]] = itm[1];
			}
			//赋值
			obj.push(item);

			//强制页面刷新
			this.changeData();
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
		this.dataStatus = out.dataStatus;
		this.dataSource0.engineList = out.engineList;
		this.colList = out.colList;
		//初始化对应数据源
		for (var i = 0; i < 7; i++) {
			var data = this['dataSource' + i];
			this['dataSource' + i] = Object.assign(data, out.dataSource);
		}
		//默认使用表集合
		this.changeDataType('0', 0);
	}
};
</script>
