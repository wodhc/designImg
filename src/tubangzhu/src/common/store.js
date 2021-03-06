import Vue from "vue";
import Vuex from "vuex";
import $ from "jquery";
import eventBus from "@/common/eventBus.js";
import socket from '@/common/socket.js'
import common from '@/common/common.js'
Vue.use(Vuex)
//图帮主状态中心,vuex
const store = new Vuex.Store({
    state: {
        //编辑器状态
        editor: {
            //手机上传推送
            uploadPush: null,
            //上次保存之后,是否进行过编辑
            saveChange: false,
            themeColor: "red",
            color: {},
            colorList: [],
            isDiy: false,
            diyColor: '',
            //上次是否断开
            lastDisconnect: false,
            //tpl_mode
            tpl_mode: 0,
            //是否已载入模板
            tplLoaded: false,

            //锁定编辑(撤销恢复过程中进行错定)
            lock: false,
            //左侧列表是否打开
            isSourceOpen: true,
            //右侧列表是否打开
            isPageOpen: true,
            //右侧表单面板是否打开
            isConfigOpen: true,
            //是否登录
            loginMode: 'visitor',
            //用户UID
            uid: 0,
            username: '',
            userFace: '',
            //自动保存
            autoSave: true,
            //用户桌面DPI
            userDPI: [
                0, 0
            ],
            //商户版信息
            coorpId: undefined,
            coop_allow_download:false,
            coop_download_data:null,
            coorpName: '',
            coorpLinks: null,
            coopAllowDownload: false,
            //开放API信息
            openId: undefined,
            openUrl: '',
            openAccessToken: '',
            open_on_finish: 'insert',
            admin_level: false,
            //拖动图片进入容器
            dragEvent: {
                type: '',
                length: 0,
                index: -1,
                overTarget: '',
                overContain: undefined,
                activeColor: 'rgba(0,0,0,.5)',
                dropContain: {},
                allowDrop: false,
                disallowDrop: false,
                drop: {
                    target: '',
                    x: 0,
                    y: 0
                },
                clipImg: {
                    url: '',
                    width: 0,
                    height: 0
                }
            },
            // 舞台上拖动图片时被激活的container
            stageOverContainer: null,
            //当前正在被编辑的文本元件(现设置为dom对象)
            nowEditText: null,
            //当前正在被编辑的组合文字元件
            nowEditGroupText: null,
            //当前正在编辑的表格
            nowEditTable: null,
            //滑动组件数据
            slide: {
                data: [],
                pos: ''
            },

            // 二维码配置文本
            qrcodeText: '',
            qrcodeTip: '',
            //模态框
            modal: {
                'unit': false,
                'savebox': false,
                'save': false,
                'wait': false,
                'share': false,
                'download': false,
                // 二维码
                'code': false,
                'wechatCode': false,
                //消息模态框
                'alert': false,
                'color': false,
                //预览
                'preview': false,
                //toolbar
                'size': false,
                'slide': false,
                'layer': false,
                'revert': false,
                'align': false,
                //登录注册
                'register': false,
                'login': false,
                'imageFilter': false,
                'coorp': false,
                //表格
                'tableMenu': false,
                //阴影
                'shadow': false,
                'textRadian': false,
                'cropper': false,
                'newPage': false,
                'userset': false,
                'colorset': false,
                //参考线窗口
                'guides': false,
                //添加表单元素
                'formList': false,
                'uploadGroup': false,
                'jianyePreview': false,
                'shanghuPay': false,
                'saleAction':false
            },
            //提示模态集合
            tip: {
                'container': false,
                'lock': false,
                'forbidden': false
            },
            modalOver: false,
            modalIsAlert: true,
            /*消息模态框信息
             *state(ok,danger) ico
             *text 消息文本
             *fn 确认回调
             */
            modalInfo: {
                cls: 'ok',
                text: '',
                fn: null
            },
            //容器编辑模态
            containerEditor: false,
            //是否开启网格
            grid: false,
            guides: {
                moving: false,
                movingItem: null
            },
            printBuyUrl:''
        },
        //编辑器舞台状态,大部分编辑器功能的状态都在这里
        stage: {
            stageStyle: {
                left: 0,
                right: 0
            },
            //当前舞台缩放比例(百分比)
            zoom: 100,
            zoomType: 0, //{0:点击缩放，1：滚轮缩放}
            //鼠标相关信息
            mouse: {
                //当前坐标
                x: 0,
                y: 0,
                //移动向量
                vectorX: 0,
                vectorY: 0,
                //是否按下
                isDown: false,
                //鼠标按下时所在位置
                downX: 0,
                downY: 0,
                //是否正在选择selection的操作点
                controlPoint: '',
                //鼠标按下时,相对于当前物体的坐标(在元素内的坐标)
                parentX: 0,
                parentY: 0
            },
            //正在被单选的元素
            selectedItem: null,
            //正在被框选的元素数组以及其他属性
            selectionBox: {
                //当前选中的对象数组
                items: [],
                show: false,
                start: false,
                //矩形选择框
                left: 0,
                top: 0,
                width: 0,
                height: 0
            },
            //待复制数据(注意深复制)
            copyData: [],
            //文档快照记录表(用于撤销恢复)
            docSnap: [],
            //最近两次的整个文档快照记录,用于获取oldData
            docSnap2: [],
            //文档快照指针位置
            docSnapIndex: 0,
            groupId: 0,

            //团队颜色
            groupColor: ['#e60012', '#91cce8', '#644498']
        },
        //当前正在编辑文档的信息
        docData: {
            //文档基本信息 文档ID
            id: '',
            //标题
            title: '未命名文档',
            //模板类型
            product: "",
            //是否是自定义创建的模板
            is_diy: 0,
            // 是否可打印
            printable: 1,
            edit_config: {
                //舞台尺寸
                width: 1,
                height: 1,
                //单位(毫米mm|像素px)
                unit: 'px',
                //出血(单位:像素)
                bleed: 0,
                //模板DPI
                dpi: 300,
                //是否可修改大小
                sizeAble: true,
                //是否允许增加页面
                pageAddable: true,
                //用户���示器DPI(备用)
                userDPI: [
                    0, 0
                ],
                //分割辅助线(水平切分页面生成辅助线,用于三折页等印刷品)
                splitSubline: 0,
                //使用过的颜色
                usedColor: [],
                //使用过的背景颜色
                usedBgColor: [],
                //文本快速编辑
                quick_design: false,
                //参考线颜色
                guidesColor: '#BABABA'
            },
            //文档每个页面的数据
            page: [{
                id: 'page_1',
                tpl_id: '0',
                edit_config: {
                    backgroundID: '',
                    backgroundColor: '#ffffff',
                    customBackgroundUrl: ''
                },
                //页面数据
                data: [],
                //生成的svg代码结果
                svg: '',
                //被删除的元素列表(用于手动保存) deleteElements:[],
                index: 0
            }],
            //editor临时数据存储,传入后端请删除
            editor: {
                //当前正在编辑的页索引
                nowPage: 0
            }
        }
    },
    getters: {
        selectedItem: (state) => {
            return state.stage.selectedItem;
        }
    },
    mutations: {
        setProduct(state, val) {
            state.docData.product = val;
        },
        //提交主题色
        themeColor(state, payload) {
            state.editor = {
                ...state.editor,
                ...payload
            };
        },
        //提交color蔟
        initColor(state, payload) {
            state.editor.color = payload
        },
        //更改docData
        setDocData(state, val) {
            state.docData = val;
        },
        //添加新页面
        addpage(state, val) {
            state
                .docData
                .page
                .push(val);
        },

        delPage(state, index) {
            state
                .docData
                .page
                .splice(index, 1)
        },
        copyPage(state, val) {
            state
                .docData
                .page
                .splice(val.index, 0, val.page)
        },
        //设置当前stage的鼠标状态
        setStageMouse(state, val) {
            for (var item in val) {
                state.stage.mouse[val[item].name] = val[item].val;
            }
        },
        //设置正在被单选的元素
        setSelected(state, val) {
            state.stage.selected = val;
        },
        //设置选择框的相关参数
        setSelectionBox(state, val) {
            for (var item in val) {
                state.stage.selectionBox[val[item].name] = val[item].val;
            }
        },
        //设置用户桌面显示的DPI
        setUserDPI(state, val) {
            state.editor.userDPI = val;
            state.docData.edit_config.userDPI = val;

        },
        //更新当前正在被单选的元素
        setselectedItem(state, val) {
            state.stage.selectedItem = val;
        },
        //更新多选选择框相关属性
        setSelectedItems(state, val) {
            if (val.items != undefined) {
                state.selectedItems.items = val.items
            }
            if (val.left != undefined) {
                state.selectedItems.left = val.left
            }
            if (val.top != undefined) {
                state.selectedItems.top = val.top
            }
            if (val.width != undefined) {
                state.selectedItems.width = val.width
            }
            if (val.height != undefined) {
                state.selectedItems.height = val.height
            }
        },
        //打开关闭左侧资源列表
        setSourceOpen(state) {
            state.editor.isSourceOpen = !state.editor.isSourceOpen;
        },
        //打开关闭左侧资源列表
        setPageOpen(state) {
            state.editor.isPageOpen = !state.editor.isPageOpen;
        },
        setConfigOpen(state, val) {
            state.editor.isConfigOpen = val;
        },
        //设置当前正在编辑的页
        setNowEditPage(state, val) {
            state.docData.editor.nowPage = val;
        },
        //添加元素到当前页,elementObj
        addElementToStage(state, val) {
            if (val.isBackground == false) {
                //普通元素
                state
                    .docData
                    .page[state.docData.editor.nowPage]
                    .data
                    .push(val.obj);
            } else {
                //删除旧的
                var oldBgID = state.docData.page[state.docData.editor.nowPage].edit_config.backgroundID;
                var data = state.docData.page[state.docData.editor.nowPage].data;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].id == oldBgID) {
                        eventBus.$emit('elementChange', {
                            type: 'remove',
                            targets: [state.docData.page[state.docData.editor.nowPage].data[i]],
                            step: false
                        });
                        state
                            .docData
                            .page[state.docData.editor.nowPage]
                            .data
                            .splice(i, 1);
                        break;
                    }
                }
                state.docData.page[state.docData.editor.nowPage].edit_config.backgroundID = val.obj.id;

                //添加新背景
                state
                    .docData
                    .page[state.docData.editor.nowPage]
                    .data
                    .unshift(val.obj);
            }
            //刷新当前页面index
            var nowPageData = state.docData.page[state.docData.editor.nowPage].data;
            for (var i = 0; i < nowPageData.length; i++) {
                nowPageData.index = i;
            }
            // if(val.isBackground){ 	//提交本页面所有的元素数据,更新他们的index 	var tempPageData =
            // JSON.parse(JSON.stringify(nowPageData)); 	var tempArr = [];
            //
            // 	for(var i =0;i<tempPageData.length;i++){ 		delete tempPageData.edit_config;
            // 		delete tempPageData.edit_data; 	} 	var params = { 		elements:tempArr,
            // 		tpl_id:state.docData.id, 		uid:0 	};
            // 	socket.editorEmit('elementSave',params); }
        },
        //添加最近使用的颜色
        addUsedColor(state, val) {
            //判断是否存在改颜色
            var searched = false;

            var colorArr = state.docData.edit_config.usedColor;
            //	console.log('colorArr',colorArr);
            for (var i = 0; i < colorArr.length; i++) {
                if (colorArr[i].toLowerCase() == val.toLowerCase()) {
                    searched = true;
                    break;
                }
            }
            if (searched == false) {
                state
                    .docData
                    .edit_config
                    .usedColor
                    .splice(0, 0, val.toLowerCase());
                //eventBus.$emit('stageChange','info');
                eventBus.$emit('infoChange', {
                    type: 'usedColor'
                });
            }
        },
        //添加最近使用的背景颜色
        addUsedBgColor(state, val) {
            //判断是否存在改颜色
            var searched = false;
            var colorArr = state.docData.edit_config.usedBgColor;
            for (var i = 0; i < colorArr.length; i++) {
                if (colorArr[i].toLowerCase() == val.toLowerCase()) {
                    searched = true;
                    break;
                }
            }
            if (searched == false) {
                state
                    .docData
                    .edit_config
                    .usedBgColor
                    .splice(0, 0, val.toLowerCase());
                //eventBus.$emit('stageChange','info');
                eventBus.$emit('infoChange', {
                    type: 'usedColor'
                });
            }

        },
        //设置待复制数据
        setCopyData(state, copyArr) {
            //深复制(粘贴的时候注意转换回obj)

            state.stage.copyData = copyArr;
        },
        //建立文档快照(用于撤销)
        addDocSnap(state, data) {
            //创建最近两次的快照
            state
                .stage
                .docSnap2
                .push(JSON.parse(JSON.stringify(state.docData)));
            if (state.stage.docSnap2.length > 2) {
                state
                    .stage
                    .docSnap2
                    .splice(0, 1);
            }
            //如果当前的指针不是length-1,则删除从当前的index开始往后的所有步骤
            if (state.stage.docSnap.length > 0 && state.stage.docSnap.length - 1 != state.stage.docSnapIndex) {
                //计算需要执行删除的次数
                var removeNum = (state.stage.docSnap.length - 1) - state.stage.docSnapIndex;
                for (var i = 0; i < removeNum; i++) {
                    state
                        .stage
                        .docSnap
                        .splice(state.stage.docSnapIndex + 1, 1);
                }
            }
            if (data.step == undefined) {
                data.step = true;
            }

            //添加记录
            if (data.name == 'elementChange') {
                //创建元素更新快照
                var targetsSnap = [];
                for (var i in data.targets) {
                    //获取更新后的元素数据
                    var newData = data.targets[i];
                    //获取更新前的元素数据(在docSnap2[0]查找该元素的上一次的数据)
                    var oldData = null;
                    for (var p in state.stage.docSnap2[0].page) {
                        if (newData.page_id == state.stage.docSnap2[0].page[p].id) {
                            for (var e in state.stage.docSnap2[0].page[p].data) {
                                if (newData.id == state.stage.docSnap2[0].page[p].data[e].id) {
                                    oldData = JSON.parse(JSON.stringify(state.stage.docSnap2[0].page[p].data[e]));
                                    break;
                                }
                            }
                        }
                    }

                    targetsSnap.push({
                        newData: JSON.stringify(newData),
                        oldData: JSON.stringify(oldData)
                    })

                }
                //获取更新后的页面ID列表
                var newList = [];
                var pageData = state.docData.page[state.docData.editor.nowPage].data
                for (var p in pageData) {
                    newList.push(pageData[p].id);
                }
                var oldList = [];
                var pageData = state.stage.docSnap2[0].page[state.stage.docSnap2[0].editor.nowPage].data
                for (var p in pageData) {
                    oldList.push(pageData[p].id);
                }

                var snapItem = {
                    name: data.name,
                    type: data.type,
                    step: data.step,
                    targets: targetsSnap,
                    newList: newList,
                    oldList: oldList,
                    // oldState:JSON.stringify(state.stage.docSnap2[0].editor),
                    // newState:JSON.stringify(state.docData.editor)
                };
                state
                    .stage
                    .docSnap
                    .push(snapItem);

            } else if (data.name == 'pageChange') {
                //创建元素更新快照
                var targetsSnap = [];
                for (var i in data.targets) {
                    //获取更新后的元素数据
                    var newData = JSON.parse(JSON.stringify(data.targets[i]));
                    //					console.log('newData',newData); 获取更新前的元素数据(在docSnap2[0]查找该元素的上一次的数据)
                    var oldData = null;

                    for (var p = 0; p < state.stage.docSnap2[0].page.length; p++) {

                        if (newData.id == state.stage.docSnap2[0].page[p].id) {
                            oldData = JSON.parse(JSON.stringify(state.stage.docSnap2[0].page[p]));
                        }
                    }
                    // console.log('***newData', newData, 'oldData', oldData, 'docSnap',
                    // state.stage.docSnap2[0].page);

                    targetsSnap.push({
                        newData: JSON.stringify(newData),
                        oldData: JSON.stringify(oldData)
                    })
                }
                //获取更新后的页面ID列表
                var newList = [];
                var pageData = state.docData.page;
                for (var p in pageData) {
                    newList.push(pageData[p].id);
                }
                var oldList = [];
                var pageData = state.stage.docSnap2[0].page;
                for (var p in pageData) {
                    oldList.push(pageData[p].id);
                }
                var snapItem = {
                    name: data.name,
                    type: data.type,
                    step: data.step,
                    targets: targetsSnap,
                    newList: newList,
                    oldList: oldList,
                    // oldState:JSON.stringify(state.stage.docSnap2[0].editor),
                    // newState:JSON.stringify(state.docData.editor)
                };
                state
                    .stage
                    .docSnap
                    .push(snapItem);

            } else if (data.name == 'stateChange') {
                if (data.type == 'ready') {
                    //获取更新后的页面ID列表
                    var newList = [];
                    var pageData = state.docData.page[state.docData.editor.nowPage].data
                    for (var p in pageData) {
                        newList.push(pageData[p].id);
                    }
                    //获取page页面列表
                    var pageList = [];
                    for (var p in state.docData.page) {
                        pageList.push(state.docData.page[p].id);
                    }
                    state
                        .stage
                        .docSnap
                        .push({
                            name: 'head',
                            data: {
                                pageList: pageList,
                                elements: newList
                            },
                            step: true
                        });
                } else if (data.type == 'loadPage') {
                    state
                        .stage
                        .docSnap
                        .push({
                            name: data.name,
                            type: data.type,
                            oldIndex: data.data,
                            newIndex: state.stage.docSnap2[0].editor.nowPage,
                            step: data.step
                        });
                }

            } else if (data.name == 'infoChange') {
                state
                    .stage
                    .docSnap
                    .push({
                        name: data.name,
                        step: data.step,
                        newData: JSON.stringify({
                            edit_config: state.docData.edit_config,
                            title: state.docData.title
                        }),
                        oldData: JSON.stringify({
                            edit_config: state.stage.docSnap2[0].edit_config,
                            title: state.stage.docSnap2[0].title
                        })
                    });
            }

            //只保留最近30次的操作记录
            if (state.stage.docSnap.length > 30) {
                state
                    .stage
                    .docSnap
                    .splice(0, 1);
            }
            //将指针移动到最后一次
            state.stage.docSnapIndex = state.stage.docSnap.length - 1;
            // 			console.log('docSnap',state.stage.docSnap,'docSnapIndex',state.stage.docSn
            // a pIndex );

        },
        //撤销
        undo(state) {
            //取消所有选择
            state.stage.selectedItem = null;
            state.stage.selectionBox.items = [];

            let undoStep = true;
            while (undoStep) {

                undoStep = undoAction();
            }

            function undoAction() {
                //执行撤销
                if (state.stage.docSnapIndex > 0) {
                    var snapItem = state.stage.docSnap[state.stage.docSnapIndex];
                    console.log('撤销', snapItem);
                    var eventTargets = [];
                    var eventType = '';
                    if (snapItem.name == "elementChange") {
                        //遍历目标
                        var pageIndex
                        for (var i = 0; i < snapItem.targets.length; i++) {

                            //获取快照内的元素对象
                            var snapTarget = snapItem.targets[i];
                            //获取该元素在docData内的引用
                            var target = null;
                            var targetIndex = -1;
                            var newData = JSON.parse(snapTarget.newData);

                            // pageIndex = -1;

                            for (var p = 0; p < state.docData.page.length; p++) {

                                for (var e = 0; e < state.docData.page[p].data.length; e++) {

                                    if (newData.id == state.docData.page[p].data[e].id) {
                                        target = state.docData.page[p].data[e];
                                        targetIndex = e;
                                        pageIndex = p;
                                        break;
                                    }
                                }
                            }

                            var newData = JSON.parse(snapTarget.newData);

                            pageIndex = -1;
                            state
                                .docData
                                .page
                                .forEach((item, index) => {
                                    if (newData.page_id == item.id) {
                                        pageIndex = index;
                                        console.log('找到pageIndex', index);
                                    }
                                })

                            if (snapItem.type == 'add') {

                                eventTargets.push(state.docData.page[pageIndex].data[targetIndex]);
                                state
                                    .docData
                                    .page[pageIndex]
                                    .data
                                    .splice(targetIndex, 1);

                                for (var a = 0; a < state.docData.page[pageIndex].data.length; a++) {
                                    state.docData.page[pageIndex].data[a].index = a;
                                }
                                eventBus.$emit('updateItemHtml', target)

                                eventType = 'remove';
                            } else if (snapItem.type == 'remove') {

                                console.log('恢复target', snapItem, newData, pageIndex);

                                state
                                    .docData
                                    .page[pageIndex]
                                    .data
                                    .push(newData);
                                for (var a = 0; a < state.docData.page[pageIndex].data.length; a++) {
                                    state.docData.page[pageIndex].data[a].index = a;
                                }
                                eventBus.$emit('updateItemHtml', newData)
                                eventTargets.push(newData);
                                eventType = 'add';
                            } else if (snapItem.type == 'update') {
                                var oldData = JSON.parse(snapTarget.oldData);
                                if (target == null) {
                                    console.error('出现错误,target没有找到', snapTarget);
                                }
                                target.edit_config = oldData.edit_config;
                                target.edit_data = oldData.edit_data;

                                //							console.log('设置',target.id,'edit_config',oldData.edit_config);
                                eventBus.$emit('updateItemHtml', target)
                                eventTargets.push(target);
                                eventType = 'update';
                                for (var a = 0; a < state.docData.page[pageIndex].data.length; a++) {
                                    state.docData.page[pageIndex].data[a].index = a;
                                }
                            }

                        }
                        //state.docData.editor = JSON.parse(snapTarget.oldState); 发送事件
                        eventBus.$emit('elementChange', {
                            type: eventType,
                            targets: eventTargets,
                            snap: false
                        });
                        state.docData.page[pageIndex].data = common.sortArrayByList(state.docData.page[pageIndex].data, snapItem.oldList);
                    } else if (snapItem.name == "pageChange") {
                        //遍历目标
                        var targetIndex = -1;
                        var eventTargets = [];
                        var eventType = '';
                        for (var i = 0; i < snapItem.targets.length; i++) {
                            //获取快照内的元素对象
                            var snapTarget = snapItem.targets[i];
                            //获取该元素在docData内的引用
                            var target = null;

                            var newData = JSON.parse(snapTarget.newData);

                            console.log('准备搜索页面对象', state.docData.page);
                            for (var p = 0; p < state.docData.page.length; p++) {
                                console.log('   我要找的ID', newData.id);
                                console.log('   当前页面ID', );
                                if (newData.id == state.docData.page[p].id || newData.id == state.docData.page[p].front_id) {
                                    target = state.docData.page[p];
                                    targetIndex = p
                                    break;
                                }
                            }
                            if (snapItem.type == 'add') {

                                eventTargets.push(state.docData.page[targetIndex]);

                                state
                                    .docData
                                    .page
                                    .splice(targetIndex, 1);

                                eventType = 'remove';
                            } else if (snapItem.type == 'remove') {

                                state
                                    .docData
                                    .page
                                    .push(newData);
                                eventTargets.push(newData);
                                eventType = 'add';
                            } else if (snapItem.type == 'update') {
                                console.log
                                var oldData = JSON.parse(snapTarget.oldData);
                                target = oldData;
                                eventTargets.push(target);
                                eventType = 'update';
                            }
                        }

                        state.docData.page = common.sortArrayByList(state.docData.page, snapItem.oldList);

                        eventBus.$emit('pageChange', {
                            type: eventType,
                            targets: eventTargets,
                            snap: false
                        });
                    } else if (snapItem.name == "infoChange") {
                        state.docData.edit_config = JSON
                            .parse(snapItem.oldData)
                            .edit_config
                        state.docData.title = JSON
                            .parse(snapItem.oldData)
                            .title
                    } else if (snapItem.name == "stateChange") {
                        if (snapItem.type == 'loadPage') {
                            state.docData.editor.nowPage = snapItem.newIndex;
                        }
                    }

                    state.stage.docSnapIndex = state.stage.docSnapIndex - 1;
                    //指针移动完成,判断step是否为false,如果为false,返回true,以便于继续进行撤销
                    if (state.stage.docSnap[state.stage.docSnapIndex].step == false) {
                        return true;
                    }

                }
                return false;
            }
        },
        //恢复
        redo(state) {
            //取消所有选择
            state.stage.selectedItem = null;
            state.stage.selectionBox.items = [];

            let redoStep = redoAction();
            while (redoStep) {

                redoStep = redoAction();
            }

            function redoAction() {

                //执行撤销
                if (state.stage.docSnapIndex < state.stage.docSnap.length - 1) {
                    state.stage.docSnapIndex = state.stage.docSnapIndex + 1;
                    var snapItem = state.stage.docSnap[state.stage.docSnapIndex];
                    console.log('恢复', snapItem);
                    if (snapItem.name == "elementChange") {
                        var eventTargets = [];
                        var eventType = '';
                        //遍历目标
                        var pageIndex
                        for (var i in snapItem.targets) {
                            //获取快照内的元素对象
                            var snapTarget = snapItem.targets[i];
                            //获取该元素在docData内的引用
                            var target = null;
                            var targetIndex = -1;
                            pageIndex = -1;
                            for (var p in state.docData.page) {
                                var newData = JSON.parse(snapTarget.newData);
                                if (newData.page_id == state.docData.page[p].id) {
                                    pageIndex = p;
                                    for (var e in state.docData.page[p].data) {
                                        if (newData.id == state.docData.page[p].data[e].id) {
                                            target = state.docData.page[p].data[e];
                                            targetIndex = e;
                                            break;
                                        }
                                    }
                                }
                            }
                            var newData = JSON.parse(snapTarget.newData);
                            if (snapItem.type == 'add') {
                                state
                                    .docData
                                    .page[pageIndex]
                                    .data
                                    .push(newData);
                                for (var a = 0; a < state.docData.page[pageIndex].data.length; a++) {
                                    state.docData.page[pageIndex].data[a].index = a;
                                }
                                eventBus.$emit('updateItemHtml', newData)
                                eventTargets.push(newData);

                                eventType = 'add';
                            } else if (snapItem.type == 'remove') {
                                eventTargets.push(state.docData.page[pageIndex].data[targetIndex]);
                                eventType = 'remove';
                                state
                                    .docData
                                    .page[pageIndex]
                                    .data
                                    .splice(targetIndex, 1);
                                for (var a = 0; a < state.docData.page[pageIndex].data.length; a++) {
                                    state.docData.page[pageIndex].data[a].index = a;
                                }
                                eventBus.$emit('updateItemHtml', target)

                            } else if (snapItem.type == 'update') {

                                target.edit_config = newData.edit_config;
                                target.edit_data = newData.edit_data;
                                for (var a = 0; a < state.docData.page[pageIndex].data.length; a++) {
                                    state.docData.page[pageIndex].data[a].index = a;
                                }
                                eventBus.$emit('updateItemHtml', target)

                                eventTargets.push(target);
                                eventType = 'update';
                            }
                        }
                        eventBus.$emit('elementChange', {
                            type: eventType,
                            targets: eventTargets,
                            snap: false
                        });

                        state.docData.page[pageIndex].data = common.sortArrayByList(state.docData.page[pageIndex].data, snapItem.newList);
                        //state.docData.editor = JSON.parse(snapTarget.newState);
                    } else if (snapItem.name == "pageChange") {
                        //遍历目标
                        var pageIndex
                        var eventTargets = [];
                        var eventType = '';
                        for (var i in snapItem.targets) {
                            //获取快照内的元素对象
                            var snapTarget = snapItem.targets[i];
                            //获取该元素在docData内的引用
                            var target = null;
                            var targetIndex = -1;
                            var newData = JSON.parse(snapTarget.newData);
                            for (var p in state.docData.page) {

                                if (newData.id == state.docData.page[p].id) {
                                    target = state.docData.page[p];
                                    targetIndex = p;
                                }
                            }
                            if (snapItem.type == 'add') {
                                var newData = JSON.parse(snapTarget.newData);
                                state
                                    .docData
                                    .page
                                    .push(newData);
                                eventTargets.push(newData);
                                eventType = 'add';
                            } else if (snapItem.type == 'remove') {
                                eventTargets.push(state.docData.page[targetIndex]);
                                eventType = 'remove';
                                state
                                    .docData
                                    .page
                                    .splice(targetIndex, 1);
                            } else if (snapItem.type == 'update') {
                                var newData = JSON.parse(snapTarget.newData);
                                target = newData;
                                eventTargets.push(target);
                                eventType = 'update';
                            }
                        }
                        //state.docData.editor = JSON.parse(snapTarget.newState);
                        state.docData.page = common.sortArrayByList(state.docData.page, snapItem.newList);
                        eventBus.$emit('pageChange', {
                            type: eventType,
                            targets: eventTargets,
                            snap: false
                        });
                    } else if (snapItem.name == "infoChange") {
                        state.docData.edit_config = JSON
                            .parse(snapItem.newData)
                            .edit_config
                        state.docData.title = JSON
                            .parse(snapItem.newData)
                            .title
                    } else if (snapItem.name == "stateChange") {
                        if (snapItem.type == 'loadPage') {

                            state.docData.editor.nowPage = snapItem.oldIndex;
                        }
                    }
                    //在当前docSnap上+1,判断step
                    return !snapItem.step;
                } else {
                    return false;
                }

            }
        },
        //修改缩放比例
        setZoom(state, val) {

            eventBus.$emit('stopAllEdit');

            //eventBus.$emit('stageChange','zoom');???
            if (val.type == 'zoomIn') {
                //放大
                state.stage.zoom = state.stage.zoom + 5 - state.stage.zoom % 5;
                if (state.stage.zoom > 500) {
                    state.stage.zoom = 500;
                }
            } else if (val.type == 'zoomOut') {
                //缩小
                if (state.stage.zoom % 5) {
                    state.stage.zoom = state.stage.zoom - state.stage.zoom % 5;
                } else {
                    state.stage.zoom = state.stage.zoom - 5;
                }
                if (state.stage.zoom < 5) {
                    state.stage.zoom = 5;
                }
            } else if (val.type == 'normal') {
                //100%缩放
                state.stage.zoom = 100;
            } else if (val.type == 'custom') {
                //自定义缩放值(相对于舞台尺寸)
                var stageSize = {
                    width: 0,
                    height: 0
                };
                if (state.docData.edit_config.unit == "px") {
                    //像素
                    stageSize.width = state.docData.edit_config.width;
                    stageSize.height = state.docData.edit_config.height;
                } else if (state.docData.edit_config.unit == "mm") {
                    //毫米
                    stageSize.width = (state.docData.edit_config.width * state.docData.edit_config.dpi / 25.4);
                    stageSize.height = (state.docData.edit_config.height * state.docData.edit_config.dpi / 25.4);
                }
                //全画布平铺
                var areaWidth = parseFloat($('#stageArea').width());
                var areaHeight = parseFloat($('#stageArea').height());

                var zoomA = (areaWidth / stageSize.width);
                var zoomB = (areaHeight / stageSize.height);
                if (zoomA > zoomB) {
                    var zoom = zoomB;
                } else {
                    var zoom = zoomA;
                }

                state.stage.zoom = parseInt(zoom * val.val);
            } else if (val.type == 'canvas_custom') {
                //相对于画布的原生缩放
                state.stage.zoom = val.val;
                console.log('相对于画布的原生缩放23333', val.val);
            }
            val.zoomType && (state.stage.zoomType = val.zoomType);
            eventBus.$emit('stateChange', {
                type: 'zoom'
            });
        },
        //设置文档尺寸,并自动缩放
        setDocSize(state, payload) {

            state.docData.edit_config = {
                ...state.docData.edit_config,
                ...payload
            }
            /*//计算新宽度和高度差别比例
			var zoomX = val.width / oldWidth;
			var zoomY = val.height / oldHeight;

			console.log('宽度:',val.width,'高度:',val.height);
			//修改left top width height rotateX rotateY
			var pageData = state.docData.page;
			for(var i = 0;i<pageData.length;i++){
				for(var a = 0;a<pageData[i].data.length;a++){
					var eleObj = pageData[i].data[a];
					eleObj.left = eleObj.left*zoomX;
					eleObj.top = eleObj.top*zoomY;
					eleObj.width = eleObj.width*zoomX;
					eleObj.height = eleObj.height*zoomY;
					eleObj.rotateX = eleObj.rotateX*zoomX;
					eleObj.rotateY = eleObj.rotateY*zoomY;
				}
			}
			state.docData.page = pageData;*/
            //eventBus.$emit('stageChange','stageResize');
            eventBus.$emit('infoChange', {
                type: 'stageSize'
            });
        },
        //更新当前页面的svg
        setNowPageSvg(state, val) {
            state.docData.page[state.docData.editor.nowPage].svg = val;
        },
        //设置文档文件名
        setDocTitle(state, val) {
            state.docData.title = val;
            //eventBus.$emit('stageChange','info');
            eventBus.$emit('infoChange', {
                type: 'title'
            });
        },
        /*请求模态框
         *不带参数，请求关闭模态框
         *必要参数type（模态框类型）,modalOver（是否需要全屏）
         *如果type==alert,则需要参数cls(消息框图标)和text（消息框内容）
         */
        callModal(state, data) {
            if (data == undefined) {
                for (var i in state.editor.modal) {
                    state.editor.modal[i] = false;
                }
                state.editor.modalOver = false;

            } else {
                state.editor.modal[data.type] = true;
                state.editor.modalOver = data.modalOver;
                if (data.type == 'alert') {
                    state.editor.modalInfo.cls = data.cls;
                    state.editor.modalInfo.text = data.text;
                    state.editor.modalInfo.fn = data.fn;
                    state.editor.modalInfo.fx = data.fx;
                }
                if (data.notAlert) {
                    state.editor.modalIsAlert = false;
                }
            }
        },
        setNowEditText(state, data) {
            state.editor.nowEditText = data;
        },
        setNowEditTable(state, data) {
            state.editor.nowEditTable = data;
        },
        setNowEditGroupText(state, data) {
            state.editor.nowEditGroupText = data;
        },
        //更新page的index
        updatePageIndex(state) {
            for (var i = 0; i < state.docData.page.length; i++) {
                if (state.docData.page[i] != undefined) {
                    //更新index
                    state.docData.page[i].index = i;
                    //更新tpl_id
                    state.docData.page.tpl_id = state.docData.id;
                }
            }
        }
    }
});
export default store


// WEBPACK FOOTER //
// ./src/common/store.js