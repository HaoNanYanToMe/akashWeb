<style lang="less">
@import './simple.less';
</style>
<template>
	<Div class="step_main">
		<!--展示区-->
		<Div class="lf_tap">
			<Form :label-width="100">
				<FormItem label="引擎名称">
					<i-input :disabled="currentStep > 0" v-model="base.name" style="width:15%" ref="name" />
					<Span class="base">唯一编码</Span>
					<i-input :disabled="currentStep > 0" v-model="base.code" style="width:15%" ref="code" />
					<Span class="base">引擎类型</Span>
					<Select
						:disabled="currentStep > 0"
						v-model="base.eType"
						@on-change="changeEtype($event.value)"
						label-in-value
						placeholder="请指定引擎类型"
						filterable
						style="width:15%"
					>
						<Option v-for="ds in engineType" :value="ds.value" :key="ds.value">{{ ds.label }}</Option>
					</Select>
					<Span class="base">备注信息</Span>
					<i-input :disabled="currentStep > 0" v-model="base.note" style="width:30%" />
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
			<!--执行流程：增改-->
			<DIV v-if="base.eType === '1'">
				<!--执行流程：主子表信息-->
				<Form v-if="currentStep === 0">
					<FormItem class="showMain">
						<Span class="base">操作类型</Span>
						<Select v-model="dataSource0.dataType" placeholder="请选择操作类型" filterable style="width:18%">
							<Option :value="0" :key="0">新增</Option>
							<Option :value="1" :key="1">更新/编辑</Option>
						</Select>
						<Span class="base">主数据源</Span>
						<Select v-model="dataSource0.bindSource" @on-change="sourceChangeUI($event)" label-in-value placeholder="请指定主数据源" filterable style="width:25%">
							<Option v-for="ds in tableList" :value="ds.code" :key="ds.code" :tag="ds.id">{{ ds.name }}「{{ ds.code }}」</Option>
						</Select>
						<Span class="base">主数据源别名</Span>
						<i-input placeholder="请输入当前数据源别名" @on-change="changeAlias(0, $event)" v-model="dataSource0.bindSourceAlias" style="width:15%" />
						<i-input style="display: none;" v-model="dataSource0.id" />
					</FormItem>
				</Form>
				<!--执行流程：是否启用数据拷贝(仅限新增)-->
				<Form v-if="currentStep === 1">
					<FormItem style="margin-left: 32.5%;">
						<Span class="base">是否启用数据拷贝</Span>
						<Select v-model="dataSource2.isOpen" placeholder="请选择是否启用数据拷贝" style="width:28%">
							<Option v-for="ds in dataStatus" :value="ds.id" :key="ds.id">{{ ds.name }}</Option>
						</Select>
						<Button v-show="dataSource2.isOpen === 0" type="primary" @click="createdCopy()" icon="md-add" style="margin: 0 10px  0 10px;">新增待拷贝数据源</Button>
					</FormItem>
					<FormItem v-for="(jw, jdx) in dataSource1.items1" :key="jdx" v-if="jw.status === 1 && dataSource1.isOpen === 0" class="showLine" style="width: 70%">
						<Divider>{{ '  数据拷贝  -  ' + (jdx + 1) }}</Divider>
						<Span class="base">待拷贝数据（引擎）</Span>
						<Select
							v-model="jw.table"
							label-in-value
							placeholder="请指定待拷贝数据（引擎）"
							@on-query-change="changeCopy($event)"
							@on-change="selectCopyData($event.tag)"
							filterable
							style="width:20%"
						>
							<Option v-for="st in dataSource1.copyList" :value="st.id" :key="st.id" :tag="st.id">{{ st.name }}</Option>
						</Select>
						<Button icon="md-add" type="info" style="margin-left: 5px;" @click="showCopy()">查看</Button>
						<Span class="base">待拷贝字段</Span>
						<Select v-model="jw.colunm" label-in-value placeholder="请选择待拷贝字段" filterable style="width:30%" multiple>
							<Option v-for="ds in dataSource1.filedList" :value="ds.code" :key="ds.code" :tag="ds.id">
								「{{ ds.name === '' ? '数据表' : ds.name }} 」{{ ds.code }}
							</Option>
						</Select>
						<Button icon="md-remove" type="error" style="margin-left: 5px;" @click="remove(jdx, false, -1)">移除</Button>
					</FormItem>
				</Form>
				<!--执行流程：新增/更新字段-->
				<Form v-if="currentStep === 2">
					<FormItem style="margin-left: 32.5%;">
						<Button type="primary" @click="createdChild(false, 0, '')" icon="md-add" style="margin: 0 10px  0 10px;">新增字段设定</Button>
					</FormItem>
					<FormItem v-for="(jw, jdx) in dataSource2.items2" :key="jdx" class="showLine" style="width: 70%">
						<Divider>{{ '  待新增/编辑字段  -  ' + (jdx + 1) + jw.table }}</Divider>
						<Span class="base">字段</Span>
						<Select v-model="jw.table" label-in-value placeholder="请选择待新增/编辑字段" style="width: 30%">
							<Option v-for="ds in dataSource2.colList" :value="ds.code" :key="ds.code" :tag="ds.id">
								「{{ ds.name === '' ? '数据表' : ds.name }} 」 {{ ds.code }}
							</Option>
						</Select>
						<Span class="base">匹配方式</Span>
						<Select v-model="jw.patch" @on-change="changeData" placeholder="请选择匹配方式" style="width:14%">
							<Option v-if="c.value !== '3'" v-for="c in patchList" :value="c.value" :key="c.value">{{ c.label }}</Option>
						</Select>
						<Span class="base">匹配值</Span>
						<i-input
							v-if="jw.patch !== '0'"
							placeholder="请输入当前数据源别名"
							@on-change="changeAlias(0, $event)"
							v-model="dataSource0.bindSourceAlias"
							style="width:20%"
						/>
						<Select
							v-if="jw.patch === '0'"
							v-model="jw.jwTable"
							label-in-value
							placeholder="请指定拷贝字段"
							@on-change="changeColunm('items0#' + index + ',joinWhere#' + jdx + ',colList', $event.tag)"
							filterable
							style="width:20%"
						>
							<Option v-for="st in dataSource0.checkedTable" :value="st.value" :key="st.value" :tag="st.tag">{{ st.label }}</Option>
						</Select>
						<Button icon="md-remove" type="error" style="margin-left: 5px;" @click="remove(jdx, false, -1)">移除</Button>
					</FormItem>
				</Form>
			</DIV>
			<!--执行流程：查询-->
			<DIV v-if="base.eType === '0'">
				<!--执行流程：主子表信息-->
				<Form v-if="currentStep === 0">
					<!--执行流程：主表信息-->
					<Span class="base">主数据源类型</Span>
					<Select v-model="dataSource0.dataType" @on-change="changeDataType($event, 0)" placeholder="请选择数据类型" filterable style="width:18%">
						<Option v-for="dt in dataType" :value="dt.id" :key="dt.id">{{ dt.name }}</Option>
					</Select>
					<Span class="base">主数据源</Span>
					<Select
						v-model="dataSource0.bindSource"
						@on-change="changeDataSource(0, $event, null)"
						label-in-value
						placeholder="请指定主数据源"
						filterable
						style="width:25%"
					>
						<Option v-for="ds in tableList" :value="ds.code" :key="ds.code" :tag="ds.id">{{ ds.name }}「{{ ds.code }}」</Option>
					</Select>
					<input v-model="dataSource0.egid" v-show="false" />
					<Span class="base">主数据源别名</Span>
					<i-input placeholder="请输入当前数据源别名" @on-change="changeAlias(0, $event)" v-model="dataSource0.bindSourceAlias" style="width:15%" />
					<i-input style="display: none;" v-model="dataSource0.id" />
					<Button v-if="base.eType === '0'" type="primary" @click="createdChild(false, 0, '')" icon="md-add" style="margin: 0 10px  0 10px;">追加关联表</Button>
					<!--执行流程：子表信息-->
					<DIV v-for="(item, index) in dataSource0.items0" :key="index" v-if="item.status === 1 && base.eType === '0'">
						<Divider>
							<Icon type="md-alert" />
							<strong>{{ '  关联表  「' + (item.index + 1) + '」' }}</strong>
						</Divider>
						<FormItem class="showMain">
							<Span class="base">主数据源</Span>
							<Select
								v-model="item.mainTable"
								label-in-value
								placeholder="请指定主数据源"
								@on-change="changeColunm('items0#' + index + ',colList', $event.tag)"
								filterable
								style="width:15%"
							>
								<Option v-for="st in dataSource0.checkedTable" :value="st.value" :key="st.value" :tag="st.tag">{{ st.label }}</Option>
							</Select>
							<Span class="base">主表字段</Span>
							<Select v-model="item.mainColunm" label-in-value placeholder="请选择主表字段" filterable style="width:15%">
								<Option v-for="ds in item.colList" :value="ds.code" :key="ds.code" :tag="ds.id">{{ ds.name }}「{{ ds.code }}」</Option>
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
							<Select
								v-model="item.joinTable"
								label-in-value
								@on-change="changeDataSource(index + 1, $event, 'items0#' + index + ',joinFiled')"
								placeholder="请指定从数据源"
								filterable
								style="width:15%"
							>
								<Option v-for="ds in item.joinCols" :value="ds.code" :key="ds.code" :tag="ds.id">{{ ds.name }}「{{ ds.code }}」</Option>
							</Select>
							<input v-model="item.egid" v-show="false" />
							<Span class="base">别名</Span>
							<i-input v-model="item.joinAlias" @on-change="changeAlias(index + 1, $event)" placeholder="请输入从数据源别名" style="width:15%"></i-input>
							<Span class="base">从表字段</Span>
							<Select v-model="item.joinColunm" label-in-value placeholder="请选择从表字段" filterable style="width:15%">
								<Option v-for="ds in item.joinFiled" :value="ds.code" :key="ds.code" :tag="ds.id">{{ ds.name }}「{{ ds.code }}」</Option>
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
							<Select
								v-model="jw.jwTable"
								label-in-value
								placeholder="请指定主数据源"
								@on-change="changeColunm('items0#' + index + ',joinWhere#' + jdx + ',colList', $event.tag)"
								filterable
								style="width:20%"
							>
								<Option v-for="st in dataSource0.checkedTable" :value="st.value" :key="st.value" :tag="st.tag">{{ st.label }}</Option>
							</Select>
							<Span class="base">主查询字段</Span>
							<Select v-model="jw.jwKey" label-in-value placeholder="请选择主查询字段" filterable style="width:20%">
								<Option v-for="ds in jw.colList" :value="ds.code" :key="ds.code" :tag="ds.id">{{ ds.name }}「{{ ds.code }}」</Option>
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
								<Select
									v-show="jw.patch === '0'"
									v-model="jw.jwToTable"
									label-in-value
									placeholder="请指定关联数据源"
									@on-change="changeColunm('items0#' + index + ',joinWhere#' + jdx + ',joinFiled', $event.tag)"
									filterable
									style="width:13%"
								>
									<Option v-for="st in dataSource0.checkedTable" :value="st.value" :key="st.value" :tag="st.tag">{{ st.label }}</Option>
								</Select>
								<Select v-show="jw.patch === '0'" v-model="jw.jwToKey" label-in-value placeholder="请选择关联字段" filterable style="width:13%">
									<Option v-for="ds in jw.joinFiled" :value="ds.code" :key="ds.code" :tag="ds.id">{{ ds.name }}「{{ ds.code }}」</Option>
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
						<Button v-show="dataSource1.isOpen === 0" type="primary" @click="createdChild(false, 0, '')" icon="md-add" style="margin: 0 10px  0 10px;">
							新增分组关系
						</Button>
					</FormItem>
					<FormItem v-for="(jw, jdx) in dataSource1.items1" :key="jdx" v-if="jw.status === 1 && dataSource1.isOpen === 0" class="showLine" style="width: 70%">
						<Divider>{{ '  分组关系  -  ' + (jdx + 1) }}</Divider>
						<Span class="base">数据源</Span>
						<Select
							v-model="jw.table"
							label-in-value
							placeholder="请指定主数据源"
							@on-change="changeColunm('items1#' + jdx + ',colList', $event.tag)"
							filterable
							style="width:20%"
						>
							<Option v-for="st in dataSource0.checkedTable" :value="st.value" :key="st.value" :tag="st.tag">{{ st.label }}</Option>
						</Select>
						<Span class="base">指定分组字段</Span>
						<Select v-model="jw.colunm" label-in-value placeholder="请选择主查询字段" filterable style="width:40%" multiple>
							<Option v-for="ds in jw.colList" :value="ds.code" :key="ds.code" :tag="ds.id">{{ ds.name }}「{{ ds.code }}」</Option>
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
						<Button v-show="dataSource2.isOpen === 0" type="primary" @click="createdChild(false, 0, '')" icon="md-add" style="margin: 0 10px  0 10px;">
							新增查询条件
						</Button>
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
						<Select
							v-model="jw.table"
							label-in-value
							placeholder="请指定主数据源"
							@on-change="changeColunm('items2#' + jdx + ',colList', $event.tag)"
							filterable
							style="width:15%"
						>
							<Option v-for="st in dataSource0.checkedTable" :value="st.value" :key="st.value" :tag="st.tag">{{ st.label }}</Option>
						</Select>
						<Span class="base">主查询字段</Span>
						<Select v-model="jw.colunm" label-in-value placeholder="请选择主查询字段" filterable style="width:15%">
							<Option v-for="ds in jw.colList" :value="ds.code" :key="ds.code" :tag="ds.id">{{ ds.name }}「{{ ds.code }}」</Option>
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
							<Select
								v-show="jw.patch === '0'"
								v-model="jw.toTable"
								label-in-value
								placeholder="请指定关联数据源"
								filterable
								@on-change="changeColunm('items2#' + jdx + ',joinFiled', $event.tag)"
								style="width:13%"
							>
								<Option v-for="st in dataSource0.checkedTable" :value="st.value" :key="st.value" :tag="st.tag">{{ st.label }}</Option>
							</Select>
							<Select v-show="jw.patch === '0'" v-model="jw.toKey" label-in-value placeholder="请选择关联字段" filterable style="width:13%">
								<Option v-for="ds in jw.joinFiled" :value="ds.code" :key="ds.code" :tag="ds.id">{{ ds.name }}「{{ ds.code }}」</Option>
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
								<Select v-model="cw.queryType" placeholder="请选择组合关系" style="width:15.5%">
									<Option v-for="q in query" :value="q.value" :key="q.value">{{ q.label }}</Option>
								</Select>
								<Span class="base">主查询数据源</Span>
								<Select
									v-model="cw.table"
									label-in-value
									placeholder="请指定主数据源"
									filterable
									@on-change="changeColunm('items3#' + index + ',caseQuery#' + inx + ',caseWhere#' + cnx + ',colList', $event.tag)"
									style="width:20%"
								>
									<Option v-for="st in dataSource0.checkedTable" :value="st.value" :key="st.value" :tag="st.tag">{{ st.label }}</Option>
								</Select>
								<Span class="base">主查询字段</Span>
								<Select v-model="cw.colunm" label-in-value placeholder="请选择主查询字段" filterable style="width:20%">
									<Option v-for="ds in cw.colList" :value="ds.code" :key="ds.code" :tag="ds.id">{{ ds.name }}「{{ ds.code }}」</Option>
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
									<Select
										v-show="cw.patch === '0'"
										v-model="cw.toTable"
										label-in-value
										placeholder="请指定关联数据源"
										filterable
										@on-change="changeColunm('items3#' + index + ',caseQuery#' + inx + ',caseWhere#' + cnx + ',joinFiled', $event.tag)"
										style="width:22.5%"
									>
										<Option v-for="st in dataSource0.checkedTable" :value="st.value" :key="st.value" :tag="st.tag">{{ st.label }}</Option>
									</Select>
									<Select v-show="cw.patch === '0'" v-model="cw.toKey" label-in-value placeholder="请选择关联字段" filterable style="width:22.5%">
										<Option v-for="ds in cw.joinFiled" :value="ds.code" :key="ds.code" :tag="ds.id">{{ ds.name }}「{{ ds.code }}」</Option>
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
						<Select
							v-model="jw.table"
							label-in-value
							placeholder="请选择数据源"
							filterable
							style="width:40%"
							@on-change="changeColunm('items4#' + jdx + ',colList', $event.tag)"
						>
							<Option v-for="st in dataSource0.checkedTable" :value="st.value" :key="st.value" :tag="st.tag">{{ st.label }}</Option>
						</Select>
						<Span class="base">聚合类型</Span>
						<Select v-model="jw.groupType" placeholder="请选择聚合类型" filterable style="width:40%">
							<Option value="DEF" key="DEF">默认</Option>
							<Option value="DISTINCT" key="DISTINCT" v-if="jdx === 0">数据去重</Option>
							<Option v-if="dataSource4.isOpen === 0" v-for="c in exType" :value="c.value" :key="c.value">{{ c.label }}</Option>
						</Select>
						<DIV style="margin-top: 0.625rem;">
							<Span class="base">输出字段</Span>
							<Select
								v-model="jw.colunm"
								label-in-value
								@on-change="changeLock(jdx)"
								placeholder="请选择输出字段"
								filterable
								style="width:45%"
								:multiple="jw.groupType !== 'DISTINCT'"
							>
								<Option v-for="ds in jw.colList" :value="ds.code" :key="ds.code" :tag="ds.id">{{ ds.name }}「{{ ds.code }}」</Option>
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
							新增排序设置
						</Button>
					</FormItem>
					<FormItem v-for="(jw, jdx) in dataSource5.items5" :key="jdx" v-if="jw.status === '1' && dataSource5.isOpen === 0" class="showLine" style="width: 70%">
						<Divider>{{ '  排序设定  -  ' + (jdx + 1) }}</Divider>
						<Span class="base">数据源</Span>
						<Select
							v-model="jw.table"
							label-in-value
							placeholder="请选择数据源"
							filterable
							style="width:40%"
							@on-change="changeColunm('items5#' + jdx + ',colList', $event.tag)"
						>
							<Option v-for="st in dataSource0.checkedTable" :value="st.value" :key="st.value" :tag="st.tag">{{ st.label }}</Option>
						</Select>
						<Span class="base">排序类型</Span>
						<Select v-model="jw.sType" placeholder="请选择数据排序类型" filterable style="width:40%">
							<Option v-if="dataSource5.isOpen === 0" v-for="c in sortType" :value="c.value" :key="c.value">{{ c.label }}</Option>
						</Select>
						<DIV style="margin-top: 0.625rem;">
							<Span class="base">指定排序字段</Span>
							<Select v-model="jw.colunm" label-in-value placeholder="请指定排序字段" filterable style="width:70%" multiple>
								<Option v-for="ds in jw.colList" :value="ds.code" :key="ds.code" :tag="ds.id">{{ ds.name }}「{{ ds.code }}」</Option>
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
						<Divider>{{ '  SQL-ID  ' }}</Divider>
						<DIV class="tapData">{{ selId }}</DIV>
						<Divider>{{ '  SQL生成结果  ' }}</Divider>
						<DIV class="tapData">{{ selShow }}</DIV>
						<Divider>{{ '  需求参数对照表  ' }}</Divider>
						<Table :columns="columns1" :data="selectData"></Table>
						<Divider>{{ '  输出字段对照表  ' }}</Divider>
						<Table :columns="columns1" :data="outData"></Table>
					</FormItem>
				</Form>
			</DIV>
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
//页面核心JS引入
import defaultIndex from './sampleIndex';
export default {
	//将defaultIndex代码混入当前vue页面
	mixins: [defaultIndex]
};
</script>
