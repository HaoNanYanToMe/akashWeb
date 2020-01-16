<style scoped lang="less">
.step_main {
	margin: 2.5%;
	padding: 0;
	.rt_list {
		margin-left: 2.5%;
		display: inline-block;
	}
	.lf_tap {
		width: 68.5%;
		margin-left: 10.5%;
		margin-right: 10.5%;
		vertical-align: top;
		display: inline-block;
	}
	.btn_next {
		text-align: center;
	}
}
</style>
<template>
	<div class="step_main">
		<div class="lf_tap">
			<Form :label-width="100" v-show="displayList.idx0 != true">
				<FormItem label="主数据表">
					<Select
						label-in-value
						@on-change="createSelect(0, $event)"
						v-model="dataSourceStep0.mainTable"
						:placeholder="dataSourceStep0.currentMain === 0 ? '请选择主数据表' : '请选择主数据引擎'"
						style="width:50%"
					>
						<Option v-for="item in dataSourceStep0.mainTableList" :value="item.value" :key="item.value">{{ item.label }}</Option>
					</Select>
					<i-input style="display: none;" v-model="dataSourceStep0.id" />
					<i-input v-model="dataSourceStep0.mainTableAlias" @on-blur="changeAlias(0, $event)" style="width:20%" placeholder="请输入别名"></i-input>
					<Button :type="dataSourceStep0.currentMain === 0 ? 'primary' : 'success'" @click="changeMain(dataSourceStep0.currentMain)">
						切换至{{ dataSourceStep0.currentMain === 0 ? '数据引擎' : '数据源表' }}
					</Button>
					<Button type="primary" @click="handleAdd" icon="md-add">追加关联表</Button>
				</FormItem>
				<FormItem v-for="(item, index) in dataSourceStep0.items" v-if="item.status" :key="index" :label="'关联子表 ' + item.index" :prop="'items.' + index + '.value'">
					<Row>
						<i-col span="3">
							<Select v-model="item.mainTable" placeholder="主数据表" filterable>
								<Option v-for="st in dataSourceStep0.selectTable" :value="st.value" :key="st.value">{{ st.label }}</Option>
							</Select>
						</i-col>
						<i-col span="3" style="padding-left: 5px;">
							<Select v-model="item.mainColunm" placeholder="主表字段" filterable allow-create @on-create="handleCreate2">
								<Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
							</Select>
						</i-col>
						<i-col span="2" style="padding-left: 10px;">
							<Select v-model="item.joinSelect" placeholder="数据类型" filterable>
								<Option value="table">数据表</Option>
								<Option value="eng">引擎</Option>
							</Select>
						</i-col>
						<i-col span="3" style="padding-left: 10px;">
							<Select label-in-value @on-change="createSelect(index + 1, $event)" v-model="item.joinTable" placeholder="请选择子表或引擎" filterable>
								<Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
							</Select>
							<i-input style="display: none;" v-model="item.id" />
						</i-col>
						<i-col span="2" style="padding-left: 10px;width: 150px;">
							<i-input v-model="item.joinAlias" placeholder="请输入子表别名" @on-blur="changeAlias(index + 1, $event)"></i-input>
						</i-col>
						<i-col span="2" style="padding-left: 10px;">
							<Select v-model="item.joinType" placeholder="请选择关联类型" filterable>
								<Option v-for="item in dataSourceStep0.joinType" :value="item.value" :key="item.value">{{ item.label }}</Option>
							</Select>
						</i-col>
						<i-col span="4" style="padding-left: 10px;">
							<Select v-model="item.joinColunm" placeholder="请选择关联字段" filterable allow-create @on-create="handleCreate3">
								<Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
							</Select>
						</i-col>
						<i-col span="2" style="width: 115px;padding-left: 10px;"><Button type="primary" @click="handleAddJw(index)" icon="md-add">查询条件</Button></i-col>
						<i-col span="1" style="padding-left: 15px;"><Button @click="handleRemove(index)" icon="md-remove" type="error">取消关联</Button></i-col>
					</Row>
					<Row>
						<FormItem
							v-for="(jw, inx) in dataSourceStep0.items[index].joinWhere"
							v-show="jw.status"
							:key="inx"
							:label="'查询条件 ' + jw.index"
							:prop="'jw.' + inx + '.jw'"
							style="margin-top:0.625rem"
						>
							<i-col span="2" style="padding-left: 5px;">
								<Select v-model="jw.queryType" placeholder="匹配关系" filterable>
									<Option v-for="q in dataSourceStep0.query" :value="q.value" :key="q.value">{{ q.label }}</Option>
								</Select>
							</i-col>
							<i-col span="3" style="padding-left: 5px;">
								<Select v-model="jw.jwTable" placeholder="待查询数据表" filterable>
									<Option v-for="st in dataSourceStep0.selectTable" :value="st.value" :key="st.value">{{ st.label }}</Option>
								</Select>
							</i-col>
							<i-col span="3" style="padding-left: 5px;">
								<Select v-model="jw.jwKey" placeholder="待查询数据字段" filterable>
									<Option value="table">数据表</Option>
									<Option value="eng">引擎</Option>
								</Select>
							</i-col>
							<i-col span="2" style="padding-left: 5px;">
								<Select v-model="jw.conditionType" placeholder="运算关系" filterable>
									<Option v-for="c in dataSourceStep0.condition" :value="c.value" :key="c.value">{{ c.label }}</Option>
								</Select>
							</i-col>
							<i-col span="2" style="padding-left: 5px;">
								<Select v-model="jw.patch" placeholder="匹配方式" @on-change="changePatch(index, jw.index, $event, 0)">
									<Option v-for="c in dataSourceStep0.patchList" :value="c.value" :key="c.value">{{ c.label }}</Option>
								</Select>
							</i-col>
							<i-col span="3" style="padding-left: 5px;" v-show="jw.patch === '0'">
								<Select v-model="jw.jwToTable" placeholder="关联数据表" filterable>
									<Option v-for="st in dataSourceStep0.selectTable" :value="st.value" :key="st.value">{{ st.label }}</Option>
								</Select>
							</i-col>
							<i-col span="3" style="padding-left: 5px;" :hidden="true" v-show="jw.patch === '0'">
								<Select v-model="jw.jwToKey" placeholder="关联字段" filterable>
									<Option value="table">数据表</Option>
									<Option value="eng">引擎</Option>
								</Select>
							</i-col>
							<i-col span="2" style="padding-left: 10px;width: 150px;" v-show="jw.patch === '1' || jw.patch === '2'">
								<i-input v-model="jw.jwValue" placeholder="参数匹配值"></i-input>
							</i-col>
							<i-col span="2" style="padding-left: 10px;width: 150px;" v-show="jw.patch === '3'">
								<Select v-model="jw.jwEngine" placeholder="指定引擎" filterable>
									<Option value="table">数据表</Option>
									<Option value="eng">引擎</Option>
								</Select>
							</i-col>
							<i-col span="2" style="padding-left: 15px;"><Button @click="handleRemoveJw(index, inx)" icon="md-remove" type="error">移除条件</Button></i-col>
						</FormItem>
					</Row>
				</FormItem>
			</Form>
			<!-- 分组模块-->
			<Form :label-width="100" v-show="displayList.idx1 != true" style="margin-left: 25%;">
				<FormItem label="数据分组">
					<Select v-model="dataSourceStep1.status" placeholder="请选择分组状态" style="width:45%" @on-change="changeGroup($event)">
						<Option value="close">关闭</Option>
						<Option value="open">开启</Option>
					</Select>
					<Button type="primary" :style="dataSourceStep1.status === 'close' ? 'visibility:hidden;' : 'visibility:visible;'" @click="addGroup">
						<Icon type="ios-add" />
						新增分组
					</Button>
				</FormItem>
				<FormItem v-for="(item, index) in dataSourceStep1.items" v-if="item.status" :key="index" :label="'分组设定 ' + item.index" :prop="'items.' + index + '.value'">
					<Row>
						<i-col>
							<Select v-model="item.table" placeholder="选择数据源" style="width:30%">
								<Option v-for="st in dataSourceStep0.selectTable" :value="st.value" :key="st.value">{{ st.label }}</Option>
							</Select>
							<Select v-model="item.colunm" placeholder="选择分组字段" style="width:35%" multiple>
								<Option value="beijing">beijing</Option>
								<Option value="shanghai">shanghai</Option>
							</Select>
							<Button @click="handleRemoveGroup(index)" icon="md-remove" type="error">移除分组</Button>
						</i-col>
					</Row>
				</FormItem>
			</Form>
			<!-- 查询条件模块-->
			<Form :label-width="100" v-show="displayList.idx2 != true">
				<FormItem label="查询条件">
					<Select v-model="dataSourceStep2.status" placeholder="请选择查询状态" style="width:45%">
						<Option value="close">关闭</Option>
						<Option value="open">开启</Option>
					</Select>
					<Button type="primary" :style="dataSourceStep2.status === 'close' ? 'visibility:hidden;' : 'visibility:visible;'" @click="addSelect">
						<Icon type="ios-add" />
						新增查询
					</Button>
				</FormItem>
				<FormItem v-for="(item, index) in dataSourceStep2.items" v-show="item.status" :key="index" :label="'查询设定 ' + item.index" :prop="'items.' + index + '.value'">
					<Row>
						<i-col>
							<Select v-model="item.queryType" placeholder="匹配关系" filterable style="width:10%">
								<Option v-for="q in dataSourceStep0.query" :value="q.value" :key="q.value">{{ q.label }}</Option>
							</Select>
							<Select v-model="item.sType" placeholder="查询类型" style="width:10%">
								<Option v-for="s in dataSourceStep2.selectType" v-if="s.status" :value="s.value" :key="s.value">{{ s.label }}</Option>
							</Select>
							<Select v-model="item.groupType" placeholder="聚合类型" style="width:10%" v-show="item.sType === 'g'">
								<Option v-for="s in dataSourceStep2.exType" :value="s.value" :key="s.value">{{ s.label }}</Option>
							</Select>
							<Select v-model="item.table" placeholder="数据源" style="width:10%">
								<Option v-for="st in dataSourceStep0.selectTable" :value="st.value" :key="st.value">{{ st.label }}</Option>
							</Select>
							<Select v-model="item.colunm" placeholder="主查询字段" style="width:10%">
								<Option value="beijing">beijing</Option>
								<Option value="shanghai">shanghai</Option>
							</Select>
							<Select v-model="item.conditionType" placeholder="运算关系" filterable style="width:10%">
								<Option v-for="c in dataSourceStep0.condition" :value="c.value" :key="c.value">{{ c.label }}</Option>
							</Select>
							<Select v-model="item.patch" placeholder="匹配方式" @on-change="changePatch(index, 0, $event, 2)" style="width:10%">
								<Option v-for="c in dataSourceStep0.patchList" :value="c.value" :key="c.value">{{ c.label }}</Option>
							</Select>
							<Select v-model="item.toTable" placeholder="关联数据表" style="width:10%" filterable v-show="item.patch === '0'">
								<Option v-for="st in dataSourceStep0.selectTable" :value="st.value" :key="st.value">{{ st.label }}</Option>
							</Select>
							<Select v-model="item.toKey" placeholder="关联字段" style="width:10%" filterable v-show="item.patch === '0'">
								<Option value="table">数据表</Option>
								<Option value="eng">引擎</Option>
							</Select>
							<i-input v-model="item.value" placeholder="请输入参数匹配值" style="width:15%" v-show="item.patch === '1' || item.patch === '2'"></i-input>
							<Select v-model="item.toEngine" placeholder="指定引擎" style="width:10%" filterable v-show="item.patch === '3'">
								<Option value="table">数据表</Option>
								<Option value="eng">引擎</Option>
							</Select>
							<Button @click="handleRemoveSelect(index)" icon="md-remove" type="error">移除查询</Button>
						</i-col>
					</Row>
				</FormItem>
			</Form>
			<!-- 数据筛选模块-->
			<Form :label-width="100" v-show="displayList.idx3 != true">
				<FormItem label="数据筛选">
					<Select v-model="dataSourceStep3.status" placeholder="请选择查询状态" style="width:45%">
						<Option value="close">关闭</Option>
						<Option value="open">开启</Option>
					</Select>
					<Button type="primary" :style="dataSourceStep3.status === 'close' ? 'visibility:hidden;' : 'visibility:visible;'" @click="addCase">
						<Icon type="ios-add" />
						新增筛选项
					</Button>
				</FormItem>
				<FormItem v-for="(item, index) in dataSourceStep3.items" v-show="item.status" :key="index" :label="'筛选设定 ' + item.index" :prop="'items.' + index + '.value'">
					<Row>
						<i-col>
							<i-input v-model="item.value" placeholder="请输入筛选项别名" style="width:35%"></i-input>
							<Button type="primary" @click="handleAddCaseQuery(index, false)" :disabled="item.ex" icon="md-add">追加case子项</Button>
							<Button type="primary" @click="handleAddCaseQuery(index, true)" :disabled="item.ex" icon="md-add">追加else子项</Button>
							<Button @click="handleRemoveCase(index)" icon="md-remove" type="error">删除筛选项</Button>
						</i-col>
					</Row>
					<Row>
						<i-col>
							<FormItem
								v-for="(jw, inx) in dataSourceStep3.items[index].caseQuery"
								v-show="jw.status"
								:key="inx"
								:label="'子项 ' + jw.index"
								:prop="'jw.' + inx + '.jw'"
								style="margin-top:0.625rem;margin-left: -3.875rem;"
							>
								<i-col>
									<i-input v-model="jw.outValue" placeholder="结果输出值" style="width:15%"></i-input>
									<Button type="primary" @click="handleAddCaseWhere(index, inx)" icon="md-add" v-if="!jw.ex">新增条件</Button>
									<Button @click="handleRemoveCaseQuery(index, inx)" icon="md-remove" type="error">移除条件</Button>
								</i-col>
								<Row>
									<i-col>
										<FormItem
											v-for="(nw, idx) in dataSourceStep3.items[index].caseQuery[inx].caseWhere"
											v-show="nw.status"
											:key="idx"
											:label="'条件 ' + nw.index"
											:prop="'nw.' + idx + '.nw'"
											style="margin-top:0.625rem;margin-left: 3.875rem;"
										>
											<i-col v-if="!jw.ex">
												<Select v-model="nw.queryType" placeholder="匹配关系" filterable style="width:8%">
													<Option v-for="q in dataSourceStep0.query" :value="q.value" :key="q.value">{{ q.label }}</Option>
												</Select>
												<Select v-model="nw.sType" placeholder="查询类型" style="width:8%">
													<Option v-for="s in dataSourceStep2.selectType" :value="s.value" :key="s.value">{{ s.label }}</Option>
												</Select>
												<Select v-model="nw.groupType" placeholder="聚合类型" style="width:8%">
													<Option v-for="s in dataSourceStep2.exType" :value="s.value" :key="s.value">{{ s.label }}</Option>
												</Select>
												<Select v-model="nw.table" placeholder="数据源" style="width:10%">
													<Option v-for="st in dataSourceStep0.selectTable" :value="st.value" :key="st.value">{{ st.label }}</Option>
												</Select>
												<Select v-model="nw.colunm" placeholder="主查询字段" style="width:10%">
													<Option value="beijing">beijing</Option>
													<Option value="shanghai">shanghai</Option>
												</Select>
												<Select v-model="nw.conditionType" placeholder="运算关系" filterable style="width:10%">
													<Option v-for="c in dataSourceStep0.condition" :value="c.value" :key="c.value">{{ c.label }}</Option>
												</Select>
												<Select v-model="nw.patch" placeholder="匹配方式" @on-change="changePatch(index, jw.index, $event, 3)" style="width:10%">
													<Option v-for="c in dataSourceStep0.patchList" v-if="c.case" :value="c.value" :key="c.value">{{ c.label }}</Option>
												</Select>
												<i-input v-model="nw.value" placeholder="参数匹配值" style="width:15%"></i-input>
												<Button @click="handleAddCaseWhere(index, inx, idx)" icon="md-remove" type="error">移除子项</Button>
											</i-col>
										</FormItem>
									</i-col>
								</Row>
							</FormItem>
						</i-col>
					</Row>
				</FormItem>
			</Form>
			<!-- 输出字段模块-->
			<Form :label-width="100" v-show="displayList.idx4 != true">
				<FormItem label="输出字段">
					<Select v-model="dataSourceStep4.status" placeholder="请选择输出类型" style="width:45%">
						<Option value="close">全部</Option>
						<Option value="open">指定</Option>
					</Select>
					<Button type="primary" :style="dataSourceStep4.status === 'close' ? 'visibility:hidden;' : 'visibility:visible;'" @click="addFiled">
						<Icon type="ios-add" />
						新增输出字段
					</Button>
				</FormItem>
				<FormItem v-for="(item, index) in dataSourceStep4.items" v-show="item.status" :key="index" :label="'输出设定 ' + item.index" :prop="'items.' + index + '.value'">
					<Row>
						<i-col>
							<Select v-model="item.table" placeholder="数据源" style="width:15%">
								<Option v-for="st in dataSourceStep0.selectTable" :value="st.value" :key="st.value">{{ st.label }}</Option>
							</Select>
							<Select v-model="item.sType" placeholder="查询类型" style="width:8%">
								<Option v-for="s in dataSourceStep2.selectType" :value="s.value" :key="s.value">{{ s.label }}</Option>
							</Select>
							<Select v-model="item.groupType" placeholder="聚合类型" style="width:8%">
								<Option v-for="s in dataSourceStep2.exType" :value="s.value" :key="s.value">{{ s.label }}</Option>
							</Select>
							<Select v-model="item.colunm" placeholder="输出字段" style="width:25%" multiple>
								<Option value="beijing">beijing</Option>
								<Option value="shanghai">shanghai</Option>
							</Select>
							<i-input v-model="item.value" placeholder="请输入输出字段别名" style="width:15%"></i-input>
							<Button @click="handleRemoveFiled(index)" icon="md-remove" type="error">删除字段</Button>
						</i-col>
					</Row>
				</FormItem>
			</Form>
			<!-- 排序模块-->
			<Form :label-width="100" v-show="displayList.idx5 != true">
				<FormItem label="排序状态">
					<Select v-model="dataSourceStep5.status" placeholder="请选择排序状态" style="width:45%">
						<Option value="close">关闭</Option>
						<Option value="open">开启</Option>
					</Select>
					<Button type="primary" :style="dataSourceStep5.status === 'close' ? 'visibility:hidden;' : 'visibility:visible;'" @click="addSort">
						<Icon type="ios-add" />
						新增排序
					</Button>
				</FormItem>
				<FormItem v-for="(item, index) in dataSourceStep5.items" v-show="item.status" :key="index" :label="'排序设定 ' + item.index" :prop="'items.' + index + '.value'">
					<Row>
						<i-col>
							<Select v-model="item.table" placeholder="数据源" style="width:15%">
								<Option v-for="st in dataSourceStep0.selectTable" :value="st.value" :key="st.value">{{ st.label }}</Option>
							</Select>
							<Select v-model="item.colunm" placeholder="排序字段" style="width:25%">
								<Option value="beijing">beijing</Option>
								<Option value="shanghai">shanghai</Option>
							</Select>
							<Select v-model="item.sType" placeholder="排序类型" style="width:8%">
								<Option v-for="s in dataSourceStep5.sortType" :value="s.value" :key="s.value">{{ s.label }}</Option>
							</Select>
							<Button @click="handleRemoveSort(index)" icon="md-remove" type="error">删除排序</Button>
						</i-col>
					</Row>
				</FormItem>
			</Form>
			<!-- 分页模块-->
			<Form :label-width="100" v-show="displayList.idx6 != true">
				<FormItem label="分页状态">
					<Select v-model="dataSourceStep6.status" placeholder="请选择分页状态" style="width:45%">
						<Option value="close">关闭</Option>
						<Option value="open">开启</Option>
					</Select>
				</FormItem>
				<FormItem label="分页设置" :style="dataSourceStep6.status === 'close' ? 'visibility:hidden;' : 'visibility:visible;'">
					<Row>
						<i-col>
						
							<i-input v-model="dataSourceStep6.pageNum" placeholder="请输入固定值或动态参数名称(当前页)" style="width:25%"></i-input>
							<i-input v-model="dataSourceStep6.pageSize" placeholder="请输入固定值或动态参数名称(查询条数)" style="width:25%"></i-input>
						</i-col>
					</Row>
				</FormItem>
			</Form>
			<Form :label-width="100" v-show="displayList.idx7 != true">
				输出：{{sel}}
			</Form>
			<div class="btn_next">
				<Button type="primary" size="large" shape="circle" v-show="currentStep != 0" @click="nextStep(false)">
					<Icon type="ios-arrow-back" />
					上一步
				</Button>
				<Button type="primary" size="large" shape="circle" v-show="currentStep != 7" @click="nextStep(true)">
					下一步
					<Icon type="ios-arrow-forward" />
				</Button>
				<Button type="primary" size="large" shape="circle" v-show="currentStep === 7">确认生成</Button>
			</div>
		</div>
		<div class="rt_list">
			<Steps :current="currentStep" direction="vertical">
				<Step title="主子表"></Step>
				<Step title="分组"></Step>
				<Step title="查询"></Step>
				<Step title="数据优化"></Step>
				<Step title="输出"></Step>
				<Step title="排序"></Step>
				<Step title="分页"></Step>
				<Step title="完成"></Step>
			</Steps>
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			sel: '',
			/**
			 * 引擎待处理数据
			 */
			engineSource: [],
			/**
			 * 数据表单显隐控制
			 */
			displayList: {
				idx0: false,
				idx1: true,
				idx2: true,
				idx3: true,
				idx4: true,
				idx5: true,
				idx6: true,
				idx7: true
			},
			/**
			 * Step默认起始点
			 */
			currentStep: 0,
			cityList: [
				{
					value: 'New York',
					label: 'New York'
				},
				{
					value: 'beijing',
					label: 'beijing'
				},
				{
					value: 'shanghai',
					label: 'shanghai'
				}
			],
			/**
			 * 分页字段
			 */
			dataSourceStep6: {
				/**
				 * 追加字段集合
				 */
				items: [],
				/**
				 * 默认字段状态
				 */
				status: 'close',
				/**
				 * 默认追加序列号
				 */
				index: 0,
				pageType: '0'
			},
			/**
			 * 数据排序
			 */
			dataSourceStep5: {
				/**
				 * 追加排序集合
				 */
				items: [],
				/**
				 * 默认排序状态
				 */
				status: 'close',
				/**
				 * 默认追加序列号
				 */
				index: 0,
				sortType: [
					{
						value: 'DESC',
						label: '倒序'
					},
					{
						value: 'ASC',
						label: '正序'
					},
					{
						value: 'UASC',
						label: '中文正序'
					},
					{
						value: 'UDESC',
						label: '中文倒序'
					}
				]
			},
			/**
			 * 输出字段
			 */
			dataSourceStep4: {
				/**
				 * 追加字段集合
				 */
				items: [],
				/**
				 * 默认字段状态
				 */
				status: 'close',
				/**
				 * 默认追加序列号
				 */
				index: 0
			},
			/**
			 * 筛选条件
			 */
			dataSourceStep3: {
				/**
				 * 追加筛选集合
				 */
				items: [],
				/**
				 * 默认筛选状态
				 */
				status: 'close',
				/**
				 * 默认追加序列号
				 */
				index: 0
			},
			/**
			 * 查询条件
			 */
			dataSourceStep2: {
				exType: [
					{
						value: 'DEF',
						label: '默认'
					},
					{
						value: 'AVG',
						label: '平均值'
					},
					{
						value: 'COUNT',
						label: '数据总行数'
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
				selectType: [
					{
						value: 's',
						label: '默认',
						status: 1
					},
					{
						value: 'g',
						label: '聚合',
						status: 0
					}
				],
				/**
				 * 追加条件集合
				 */
				items: [],
				/**
				 * 默认条件状态
				 */
				status: 'close',
				/**
				 * 默认追加序列号
				 */
				index: 0
			},
			/**
			 * 分组对象
			 */
			dataSourceStep1: {
				/**
				 * 追加分组集合
				 */
				items: [],
				/**
				 * 默认分组状态
				 */
				status: 'close',
				/**
				 * 默认追加序列号
				 */
				index: 0
			},
			/**
			 * 数据源对象
			 */
			dataSourceStep0: {
				patchList: [
					{
						value: '0',
						label: '字段匹配',
						case: 0
					},
					{
						value: '1',
						label: '固定值设置',
						case: 1
					},
					{
						value: '2',
						label: '动态参数匹配',
						case: 1
					},
					{ value: '3', label: '查询引擎匹配', case: 0 }
				],
				/**
				 * 当前已选择数据表及引擎
				 */
				selectTable: [],
				/**
				 * 当前主表获取类型  0-数据表 / 1-引擎
				 */
				currentMain: 0,
				/**
				 * 主表/引擎列表
				 */
				mainTableList: [
					{
						value: 'New York',
						label: 'New York'
					}
				],
				/**
				 * 基础存储字段
				 */
				mainTable: '',
				mainTableAlias: '',
				items: [],
				/**
				 * 追加的子数据源下标
				 */
				index: 0,
				/**
				 * 条件类型
				 */
				query: [
					{
						value: 'and',
						label: '串联'
					},
					{
						value: 'or',
						label: '并联'
					},
					{
						value: 'andMerge',
						label: '串联整合开始'
					},
					{
						value: 'orMerge',
						label: '并联整合开始'
					},
					{
						value: 'andMergeEnd',
						label: '串联整合结束'
					},
					{
						value: 'orMergeEnd',
						label: '并联整合开始'
					}
				],
				/**
				 * 运算关系
				 */
				condition: [
					{
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
					{
						value: 'LIKE_ESCAPE',
						label: '模糊查询'
					},
					{
						value: 'NOT_LIKE_ESCAPE',
						label: '反向模糊查询（安全模式）'
					},
					{
						value: 'LIKE_BINARY_ESCAPE',
						label: '忽略中英文大小写匹配（安全模式）'
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
				/**
				 * 连表类型
				 */
				joinType: [
					{
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
				]
			}
		};
	},
	methods: {
		/**
		 * 主数据表/主数据引擎切换
		 * @param {Object} jt
		 */
		changeMain(jt) {
			/**
			 * 变更当前值
			 */
			this.dataSourceStep0.currentMain = jt === 0 ? 1 : 0;
			if (jt === 0) {
				this.dataSourceStep0.mainTableList = [
					{
						value: 'engine',
						label: 'engine'
					}
				];
			} else {
				this.dataSourceStep0.mainTableList = [
					{
						value: 'table',
						label: 'table'
					}
				];
			}
		},
		/**
		 * 上一步/下一步
		 * @param {Object} go	是否为下一步 true：下一步 / flase：上一步
		 */
		nextStep(go) {
			//固定数组对象
			let crateEngine = [];
			var idx = this.currentStep;
			var current = go ? idx + 1 : idx - 1;
			this.currentStep = current;
			this.displayList['idx' + idx] = true;
			this.displayList['idx' + current] = false;
			/**
			 * 仅点击下一步时触发
			 * @param {Object} go
			 */
			if (go) {
				//数据源数据组装
				if (idx === 0) {
					var obj0 = this.dataSourceStep0;
					let idx0 = {
						executeTag: obj0.currentMain === 0 ? 'execute' : 'executeChild',
						executeData: {
							tableName: obj0.mainTable,
							alias: obj0.mainTableAlias
						}
					};

					crateEngine.push(idx0);
					/**
					 * 获取子查询列表数据
					 */
					for (var i = 0; i < obj0.items.length; i++) {
						var item = obj0.items[i];
						var selectType = item.joinSelect === 'table';
						if (item.status == '1') {
							let addChild = {
								executeTag: selectType ? 'joinBuild' : 'joinChildBuild',
								executeData: {
									joinTable: selectType ? item.joinTable : null,
									joinAlias: item.joinAlias,
									joinType: item.joinType,
									id: item.id
								}
							};
							let addJoinColunm = {
								executeTag: 'joinColunm',
								executeData: {
									joinTable: item.mainTable,
									joinFrom: item.mainColunm,
									joinTo: item.joinColunm
								}
							};

							crateEngine.push(addChild);
							crateEngine.push(addJoinColunm);

							/**
							 * 获取joinWhere数据
							 */
							var jw = obj0.items[i].joinWhere;
							for (var j = 0; j < jw.length; j++) {
								var jo = jw[j];
								if (jo.status == '1') {
									var pac = jo.patch === '1' ? '@' : jo.patch === '0' ? '@#' : '';
									let jow = {
										executeTag: jo.patch === '3' ? 'joinWhereChild' : 'joinWhere',
										executeData: {
											queryType: jo.queryType,
											table: jo.jwTable,
											/**
											 * patch为0、1代表当前为固定入参模式
											 */
											key: pac + jo.jwKey,
											conditionType: jo.conditionType,
											/**
											 * patch为0代表使用了字段匹配模式
											 */
											value: jo.patch === '0' ? jo.jwToTable + '.' + jo.jwToKey : o.patch === '1' ? jo.value : jo.patch === '3' ? null : jo.jwValue,
											id: jo.jwEngine
										}
									};
									crateEngine.push(jow);
								}
							}
							let addJoinFin = {
								executeTag: 'joinFin',
								executeData: {}
							};

							crateEngine.push(addJoinFin);
						}
					}
				} else if (idx === 2) {
					/**
					 * 分组、查询组装
					 * 		分组查询优先级等同于普通查询
					 */
					var isGroup = this.dataSourceStep1.status;
					/**
					 * list集合
					 */
					var groupList = this.dataSourceStep1.items;
					var selectList = this.dataSourceStep2.items;
					//有且只有isGroup变量为open状态时才会对分组数据进行处理
					if (isGroup === 'open') {
						/**
						 * 分组数据
						 */
						let colList = [];
						for (var i = 0; i < groupList.length; i++) {
							//group分组变量
							let cols = [];
							for (var c = 0; c < groupList[i].colunm.length; c++) {
								let tac = groupList[i].table + '.' + groupList[i].colunm[c];
								//判断当前字段是否已存在
								if (!colList.includes(tac, 0)) {
									cols.push(groupList[i].colunm[c]);
									colList.push(tac);
								}
							}
							//分组字段必须大于0
							if (cols.length > 0) {
								let groupBuild = {
									executeTag: 'groupBuild',
									executeData: {
										groupTable: groupList[i].table,
										groupColumns: cols.toString()
									}
								};
								crateEngine.push(groupBuild);
							}
						}
					}
					//查询数据
					var sel = this.dataSourceStep2.items;
					for (var i = 0; i < sel.length; i++) {
						var jo = sel[i];
						if (jo.status == '1') {
							var pac = jo.patch === '1' ? '@' : jo.patch === '0' ? '@#' : '';
							let jow = {
								executeTag: jo.sType === 'g' ? (jo.patch === '3' ? 'groupHavingChild' : 'groupHaving') : jo.patch === '3' ? 'queryChild' : 'queryBuild',
								executeData: {
									queryType: jo.queryType,
									table: jo.table,
									groupTable: jo.table,
									/**
									 * patch为0、1代表当前为固定入参模式
									 */
									key: pac + jo.colunm,
									conditionType: jo.conditionType,
									/**
									 * patch为0代表使用了字段匹配模式
									 */
									value: jo.patch === '0' ? jo.toTable + '.' + jo.toKey : jo.patch === '1' || jo.patch === '2' ? jo.value : jo.patch === '3' ? null : jo.toValue,
									id: jo.toEngine,
									groupColumn: jo.colunm,
									groupType: jo.sType === 'g' ? jo.groupType : 'DEF',
									exQueryType: jo.sType === 'g' ? jo.groupType : 'DEF'
								}
							};
							crateEngine.push(jow);
						}
					}
				} else if (idx === 3) {
					//case条件
					var cw = this.dataSourceStep3.items;
					if (this.dataSourceStep3.status === 'open') {
						for (var i = 0; i < cw.length; i++) {
							var jo = cw[i];
							if (jo.status == '1') {
								let caseBuild = {
									executeTag: 'caseBuild',
									executeData: {
										caseAlias: jo.value
									}
								};
								crateEngine.push(caseBuild);

								var caseQuery = jo.caseQuery;
								for (var j = 0; j < caseQuery.length; j++) {
									var co = caseQuery[j];
									if (co.status == '1') {
										let caseThen = {
											executeTag: co.ex ? 'caseFin' : 'caseThen',
											executeData: {
												thenValue: co.outValue,
												elseValue: co.outValue
											}
										};
										if (!co.ex) {
											var caseWhere = co.caseWhere;
											for (var z = 0; z < caseWhere.length; z++) {
												var zo = caseWhere[z];
												var pac = zo.patch === '1' ? '@' : zo.patch === '0' ? '@#' : '';
												if (zo.status === 1) {
													let caseWhenQuery = {
														executeTag: 'caseWhenQuery',
														executeData: {
															whenQuery: zo.queryType,
															whenTable: zo.table,
															whenColumn: pac + zo.colunm,
															whenCondition: zo.conditionType,
															exCaseType: zo.groupType,
															whenValue: zo.value
														}
													};
													crateEngine.push(caseWhenQuery);
												}
											}
										}
										crateEngine.push(caseThen);
									}
								}
							}
						}
					}
				} else if (idx === 4) {
					var outFile = this.dataSourceStep4.items;
					if (this.dataSourceStep4.status === 'open') {
						let colList = [];
						for (var i = 0; i < outFile.length; i++) {
							if (outFile[i].status == '1') {
								//group分组变量
								let cols = [];
								for (var c = 0; c < outFile[i].colunm.length; c++) {
									let ex = outFile[i].colunm.length === 1 ? (outFile[i].value === undefined ? '' : '#' + outFile[i].value) : '';
									let tac = outFile[i].table + '.' + outFile[i].colunm[c];
									//判断当前字段是否已存在
									if (!colList.includes(tac, 0)) {
										cols.push(outFile[i].colunm[c] + ex);
										colList.push(tac);
									}
								}
								//分组字段必须大于0
								if (cols.length > 0) {
									let appointColumn = {
										executeTag: 'appointColumn',
										executeData: {
											appointTable: outFile[i].table,
											exAppointType: outFile[i].groupType,
											appointColumns: cols.toString()
										}
									};
									crateEngine.push(appointColumn);
								}
							}
						}
					}
				} else if (idx === 5) {
					var st = this.dataSourceStep5.items;
					if (this.dataSourceStep5.status === 'open') {
						let colList = [];
						for (var i = 0; i < st.length; i++) {
							if (st[i].status == '1') {
								let dataSort = {
									executeTag: 'dataSort',
									executeData: {
										table: st[i].table,
										sortType: st[i].sType,
										key: st[i].colunm
									}
								};
								crateEngine.push(dataSort);
							}
						}
					}
				} else if (idx === 6) {
					var pg = this.dataSourceStep6;
					if (pg.status === 'open') {
						let dataPaging = {
							executeTag: 'dataPaging',
							executeData: {
								pageNo: pg.pageNum + '#当前页',
								pageSize: pg.pageSize + '#每页多少条'
							}
						};
						crateEngine.push(dataPaging);
					}
					let fin = {
						executeTag: 'selectFin',
						executeData: {}
					};
					crateEngine.push(fin);
				}
				//替换数据
				if (this.engineSource.length > idx) {
					if (idx != 1) {
						//将case条件提前至空闲下标1
						this.engineSource.splice(idx === 3 ? 1 : idx, 1, crateEngine);
					}
				} else {
					//case条件直接替换下标1
					if (idx === 3) {
						this.engineSource.splice(1, 1, crateEngine);
						this.engineSource.push({});
					} else {
						this.engineSource.push(crateEngine);
					}
				}
				if (idx === 6) {
					let json = [];
					let obj = this.engineSource;
					for (var i = 0; i < obj.length; i++) {
						var o = obj[i];
						for (var j = 0; j < o.length; j++) {
							json.push(o[j]);
						}
					}
					this.$http.testEngine(JSON.stringify(json), res => {
						console.log(JSON.stringify(res.data));
						this.sel = res.data.execute.select;
					});
				}
			}
		},
		/**
		 * Step1:追加子数据源
		 */
		handleAdd() {
			this.dataSourceStep0.index++;
			this.dataSourceStep0.items.push({
				id: '',
				value: '',
				index: this.dataSourceStep0.index,
				status: 1,
				joinSelect: 'table',
				joinAlias: '',
				joinType: 'R',
				mainTable: '',
				mainColunm: '',
				joinTable: '',
				joinWhere: []
			});
		},
		/**
		 *  Step1:撤销追加的子数据源
		 * @param {Object} index  当前追加子数据源下标
		 */
		handleRemove(index) {
			this.dataSourceStep0.items[index].status = 0;
		},
		/**
		 *  Step4:撤销追加的子数据
		 * @param {Object} index  当前追加子数据源下标
		 */
		handleRemoveFiled(index) {
			this.dataSourceStep4.items[index].status = 0;
		},
		/**
		 *  Step5:撤销追加的子数据
		 * @param {Object} index  当前追加子数据源下标
		 */
		handleRemoveSort(index) {
			this.dataSourceStep5.items[index].status = 0;
		},
		/**
		 * Step1:追加子数据源查询条件
		 */
		handleAddJw(inx) {
			this.dataSourceStep0.items[inx].joinWhere.push({
				value: '',
				index: this.dataSourceStep0.items[inx].joinWhere.length + 1,
				status: 1,
				patch: '1',
				queryType: 'and',
				conditionType: 'EQ'
			});
		},
		/**
		 *  Step1:撤销追加的子数据源查询条件
		 * @param {Object} index  当前追加子数据源查询条件下标
		 */
		handleRemoveJw(inx, index) {
			this.dataSourceStep0.items[inx].joinWhere[index].status = 0;
		},
		/**
		 *  Step2:撤销追加的分组
		 * @param {Object} index  当前追加分组的下标
		 */
		handleRemoveGroup(index) {
			this.dataSourceStep1.items[index].status = 0;
		},
		/**
		 *  Step2:追加分组条件
		 */
		addGroup(val) {
			this.dataSourceStep1.index++;
			this.dataSourceStep1.items.push({
				value: '',
				index: this.dataSourceStep1.index,
				status: 1
			});
		},
		/**
		 *  Step3:撤销追加的条件
		 * @param {Object} index  当前追加条件的下标
		 */
		handleRemoveSelect(index) {
			this.dataSourceStep2.items[index].status = 0;
		},
		/**
		 *  Step3:追加CaseWhere筛选条件
		 * 	ex : 特殊子项,idx
		 */
		handleAddCaseWhere(inx, idx) {
			this.dataSourceStep3.items[inx].caseQuery[idx].caseWhere.push({
				value: '',
				index: this.dataSourceStep3.items[inx].caseQuery[idx].caseWhere.length + 1,
				status: 1,
				patch: '1',
				queryType: 'and',
				conditionType: 'EQ',
				sType: 's',
				groupType: 'DEF'
			});
		},
		/**
		 *  Step3:追加Case筛选条件
		 * 	ex : 特殊子项,else使用
		 */
		handleAddCaseQuery(inx, ex) {
			this.dataSourceStep3.items[inx].caseQuery.push({
				value: '',
				index: this.dataSourceStep3.items[inx].caseQuery.length + 1,
				status: 1,
				ex: ex,
				caseWhere: []
			});
			this.dataSourceStep3.items[inx]['ex'] = ex;
		},
		/**
		 *  Step3:撤销追加的Case条件
		 * @param {Object} index  当前追加条件的下标
		 */
		handleRemoveCaseQuery(inx, index) {
			this.dataSourceStep3.items[inx].caseQuery[index].status = 0;
			/**
			 * 如果当前要移除的节点是特殊的end节点则重置对应属性
			 */
			if (this.dataSourceStep3.items[inx].caseQuery[index].ex) {
				this.dataSourceStep3.items[inx]['ex'] = false;
			}
		},
		/**
		 *  Step3:撤销追加的CaseWhere条件
		 * @param {Object} index  当前追加条件的下标
		 */
		handleRemoveWhereQuery(inx, index, idx) {
			this.dataSourceStep3.items[inx].caseQuery[index].CaseWhere[idx].status = 0;
		},
		/**
		 *  Step3:追加Case筛选条件
		 */
		addCase(val) {
			this.dataSourceStep3.index++;
			this.dataSourceStep3.items.push({
				value: '',
				index: this.dataSourceStep3.index,
				status: 1,
				caseQuery: []
			});
		},
		/**
		 *  Step3:撤销追加的Case条件
		 * @param {Object} index  当前追加条件的下标
		 */
		handleRemoveCase(index) {
			this.dataSourceStep3.items[index].status = 0;
		},
		/**
		 *  Step3:追加查询条件
		 */
		addSelect(val) {
			this.dataSourceStep2.index++;
			this.dataSourceStep2.items.push({
				value: '',
				index: this.dataSourceStep2.index,
				status: 1,
				patch: '1',
				queryType: 'and',
				conditionType: 'EQ',
				sType: 's',
				groupType: 'DEF'
			});
		},
		/**
		 *  Step3:追加Case筛选条件
		 */
		addFiled(val) {
			this.dataSourceStep4.index++;
			this.dataSourceStep4.items.push({
				value: '',
				index: this.dataSourceStep4.index,
				status: 1,
				caseQuery: [],
				sType: 'DEF'
			});
		},
		/**
		 *  Step5:追加Case筛选条件
		 */
		addSort(val) {
			this.dataSourceStep5.index++;
			this.dataSourceStep5.items.push({
				value: '',
				index: this.dataSourceStep5.index,
				status: 1,
				caseQuery: [],
				sType: 'DESC'
			});
		},
		/**
		 * 是否开启分组
		 * @param {Object} val
		 */
		changeGroup(val) {
			var groupList = this.dataSourceStep1.items;
			var selectList = this.dataSourceStep2.items;
			if (val === 'open') {
				this.dataSourceStep2.selectType[1].status = 1;
			} else {
				this.dataSourceStep2.selectType[1].status = 0;
			}
			/**
			 * 数据状态变更
			 */
			for (var i = 0; i < groupList.length; i++) {
				groupList[i]['status'] = val === 'open' ? 1 : 0;
			}
			for (var i = 0; i < selectList.length; i++) {
				if (selectList[i]['sType'] === 'g' || selectList[i]['sType'] === undefined) {
					this.dataSourceStep2.items[i]['status'] = val === 'close' ? 0 : 1;
					this.dataSourceStep2.items[i]['sType'] = 'g';
				}
			}
		},
		/**
		 * 查询条件匹配类型变更
		 * @param {Object} index  关联子表下标
		 * @param {Object} jw	  子表关联查询条件下标
		 * @param {Object} lav	  变动值
		 * @param {Object} type	  指定字段
		 */
		changePatch(index, jw, lav, type) {
			if (type === 2) {
				this.dataSourceStep2.items[index].patch = lav;
			} else if (type === 0) {
				this.dataSourceStep0.items[index].joinWhere[jw - 1].patch = lav;
			} else if (type === 3) {
				this.dataSourceStep3.items[index].caseQuery[jw - 1].patch = lav;
			}
		},
		/**
		 * 别名变更
		 * @param {Object} idx
		 * @param {Object} lav
		 */
		changeAlias(idx, lav) {
			var value = lav.currentTarget.value;
			var inx = idx <= 0 ? 0 : idx;
			var table = '';
			if (idx === 0) {
				// this.dataSourceStep0['mainTableAlias'] = value;
				table = this.dataSourceStep0.mainTable;
				this.dataSourceStep0.selectTable[0].value = value === '' ? (table === undefined ? '' : value) : value;
				this.dataSourceStep0.selectTable[0].label = value === '' ? (table === undefined ? '' : value) : value;
			} else {
				// this.dataSourceStep0.items[inx]['joinAlias'] = value;
				table = this.dataSourceStep0.items[inx-1].joinTable;
				this.dataSourceStep0.selectTable[inx].value = value === '' ? (table === undefined ? '' : value) : value;
				this.dataSourceStep0.selectTable[inx].label = value === '' ? (table === undefined ? '' : value) : value;
			}
		},
		/**
		 * 根据选择的数据创建新的数据集对象
		 * @param {Object} lav option监听的对象
		 */
		createSelect(idx, lav) {
			var obj = this.dataSourceStep0.selectTable;
			if (lav !== undefined) {
				var inx = idx <= 0 ? 0 : idx - 1;
				var val =
					idx === 0
						? this.dataSourceStep0.mainTableAlias !== ''
							? this.dataSourceStep0.mainTableAlias
							: lav.value
						: this.dataSourceStep0.items[inx].joinAlias !== undefined
						? this.dataSourceStep0.items[inx].joinAlias !== ''
							? this.dataSourceStep0.items[inx].joinAlias
							: lav.value
						: lav.value;

				var findAll = obj.filter(t => t.value === val);

				var msInx = findAll === undefined ? '' : findAll.length > 0 ? idx + 1 : '';
				var newSelect = {
					value: lav.value + msInx,
					label: lav.label + msInx,
					index: idx
				};

				/**
				 * id赋值操作
				 */
				if (idx === 0) {
					this.dataSourceStep0.id = lav.value;
				} else {
					this.dataSourceStep0.items[inx].id = lav.value;
				}
				/**
				 * 如果当前数组下标大于指定值则执行替换
				 */
				if (obj.length > idx) {
					obj.splice(idx, 1, newSelect);
				} else {
					obj.push(newSelect);
				}
			}
		},
		/**
		 * Step1:特殊字段追加
		 * @param {Object} val	 特殊字段值
		 */
		handleCreate3(val) {
			this.cityList.push({
				value: val,
				label: val
			});
		},
		handleCreate2(val) {
			this.cityList.push({
				value: val,
				label: val
			});
		}
	}
};
</script>
