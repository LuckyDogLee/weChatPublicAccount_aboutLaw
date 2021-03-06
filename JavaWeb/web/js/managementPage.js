/*
 * 本文件采用 “面向过程” 编程，可思考如何转换为 “面向对象” 编程以及是否有必要
 * window.onload = function()-------页面加载时，生成文章列表页面
 * loadXMLDoc(topicId)--------------向服务器端请求文章的数据
 * createArticleList(topicId)-------生成文章图文列表页面
 * lastPage(topicId)----------------分页效果：上一页
 * nextPage(topicId)----------------分页效果：上一页
 * changeTopic(topicId)-------------修改被选中的navButton的背景颜色, 更换不同主题的文章图文列表
 * newArticlePage()-----------------生成发布新文章的页面
 * addArticleModel()----------------添加文章模块
 * setDisabled(flag)----------------设置文章内容是否可编辑：阅读模式/编辑模式，参数为 bool 类型: true/false
 * getArticleDetail(topicId, id)----生成文章详情的页面，参数为文章所属话题的 id 和文章的 id
 * editor(id)-----------------------文章详情页面编辑文章功能
 * addFun()------------------添加新文章
 * deleteFun(topicId, id)-----------文章详情页面删除文章功能
 * modifyFun(id)----------------------保存修改后的文章
 * /



/* 全局变量: 分页计数器counter */
var counter = 0;

/* 全局变量: 每个分页的文章数量 */
var recordNum = 15;

/* 全局变量: 分页最大页码值 */
var max = 2;

/* 全局变量: 储存文章信息的 jsonObj */
var jsonObj = 
{
	"articles": [
		{ 
			"id":"", 
			"topic":"", 
			"title":"", 
			"summary":"", 
			"content":"", 
			"imgUrl":"" },
		{ 
			"id":"", 
			"topic":"", 
			"title":"", 
			"summary":"", 
			"content":"", 
			"imgUrl":"" }
	]
}

/* 页面加载时，生成文章列表页面 */
window.onload = function(){
	/* 首页默认显示"法制快讯栏目的文章" */
	document.getElementById("topic1").className += " active";
	counter = 1;
	createArticleList(1);
}

/* 向服务器端请求文章的数据 */
function loadXMLDoc(topicId)
{
	//counter++;

	var xmlhttp;

	if (window.XMLHttpRequest){
		// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}else{
		// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}

	xmlhttp.open("GET","http://localhost:8080/Last/article/searching?counter=" + counter + "&recordNum="
		+ recordNum + "&topic=" + topicId , false);
	xmlhttp.send();
	var jsonStr = xmlhttp.responseText;
	var jsonObj = eval ("(" + jsonStr + ")");

	//console.log(jsonObj);

	return jsonObj;
}

/* 生成文章图文列表页面 */
function createArticleList(topicId)
{
	jsonObj = loadXMLDoc(topicId);

	/* 文章图文列表模块 */
	var articleUl = document.createElement("ul");
	var str1 = "";
	for(var i = 0; i < recordNum; i++){

		//jsonObj.articles[0].id = i;
		//jsonObj.articles[0].topic = topicId;
		//jsonObj.articles[0].title = "我是topic " + topicId + " 第" + i + "篇文章的标题";
		//jsonObj.articles[0].imgUrl = "../img/" + topicId + ".jpg";

		str1 += "<li class='articleBox' id='" + i + "' onclick='getArticleDetail(" + topicId +", " + i + ")'>"
		+"<img class='articleImg' src='" + jsonObj.articles[i].imgUrl + "'>"
		+"<div class='articleWord'>"
				+"<div class='articleTitle'>"
					+jsonObj.articles[i].title
				+"</div>"
			+"</div>"
		+"</li>";
	}
	articleUl.innerHTML = str1;
	articleUl.id = 'articleUl';


	/* 底部分页导航栏 */
	var bottomBar = document.createElement("div");
	var str2
				="<div id='bottomNav'>"
				+ 	"<button id='newArticle' class='bottomNavItem' href='' onclick='newArticlePage()'>发布新文章</button>"
				+ 		"<button id='last' class='bottomNavItem' onclick='lastPage(" + topicId + ")'>上一页</button>"
				+ 		"<a id='now' class='bottomNavItem'>" + counter + "/" + max + "</a>"
				+		"<button id='next' class='bottomNavItem' href='' onclick='nextPage(" + topicId + ")'>下一页</button>"
				+ "</div>";

	bottomBar.innerHTML = str2;
	bottomBar.id = 'bottomBar';

	/* 将新创建的两个新节点添加到right元素中 */
	var right = document.getElementById("right");
	right.innerHTML = "";
	right.appendChild(articleUl);
	right.appendChild(bottomBar);
}

/* 分页效果：上一页 */
function lastPage(topicId)
{
	counter--;
	if (counter >= 1) {
		createArticleList(topicId)
	}else{

	}
}

/* 分页效果：下一页 */
function nextPage(topicId)
{
	counter++;
	if (counter <= max) {
		createArticleList(topicId)
	}else{

	}
}

/* 修改被选中的navButton的背景颜色, 更换不同主题的文章图文列表 */
function changeTopic(topicId)
{
	for(var i=1; i <= 4; i++){
		document.getElementById("topic" + i).className = "nav";
	}
	document.getElementById("topic" + topicId).className += " active";
	counter = 1;
	createArticleList(topicId);
}


/* 生成发布新文章的页面 */
function newArticlePage()
{
	addArticleModel();
	var tr1 = document.getElementsByTagName("table")[0].insertRow(0);
	var tr2 = document.getElementsByTagName("table")[0].insertRow(6);
	tr1.innerHTML = "<th colspan='2' align='center'>发布新文章</th>";
	tr2.innerHTML = "<td colspan='2' align='center'><input id='newArticleBtn' type='button' onclick='addFun()' value='发布' /></td>";
}

/* 添加文章模块 */
function addArticleModel()
{
	var right = document.getElementById('right');
	right.innerHTML = "";
	var parent = document.createElement('div');
	var child = document.createElement('div');
	var table = document.createElement('table');
	right.appendChild(parent);
	parent.appendChild(child);
	child.appendChild(table);
	parent.id = 'parent';
	child.id = 'child';
	table.innerHTML = "<table>"
		+ "<tr><td>文章标题</td><td><input id='title' type='text'/></td></tr>"
		+ "<tr><td>文章类型</td><td><input id='topic' type='text'/></td></tr>"
	+ "<tr><td>文章图片</td><td><input id='img' type='text'/></td></tr>"
	+ "<tr><td>文章概要</td><td><input id='summary'type='text'/></td></tr>"
	+ "<tr><td>文章内容</td><td><textarea id='content' type='text'/></textarea></td></tr>"
	+ "</table>"
}

/* 设置文章内容是否可编辑：阅读模式/编辑模式，参数为 bool 类型: true/false */
function setDisabled(flag)
{
	var inputItems = document.getElementsByTagName("input");
	for (var i = inputItems.length - 1; i >= 0; i--) {
		inputItems[i].disabled = flag;
	};

	document.getElementsByTagName("textarea")[0].disabled = flag;
}

/* 生成文章详情的页面，参数为文章所属话题的 id 和文章的 id */
function getArticleDetail(topicId, id)
{
	addArticleModel();
	var tr1 = document.getElementsByTagName("table")[0].insertRow(0);
	tr1.innerHTML = "<div id='imgBtn'><img class='imgItem' src='../img/editor.png' onclick='editor(" + id + ")'>"
	+ "<img class='imgItem' src='../img/delete.png' onclick='deleteFun(" + topicId + ", " + id + ")'></div>";
	
	// var jsonObj = loadXMLDoc(topicId);
	//jsonObj.articles[0].id = id;
	//jsonObj.articles[0].topic = topicId;
	//jsonObj.articles[0].title = "Topic " + topicId + " 第" + id + "篇文章的标题";
	//jsonObj.articles[0].summary = "Topic " + topicId + " 第" + id + "篇文章的概要";
	//jsonObj.articles[0].content = "Topic " + topicId + " 第" + id + "篇文章的内容";
	//jsonObj.articles[0].imgUrl = "Topic " + topicId + " 第" + id + "篇文章的图片";

	document.getElementById("title").value = jsonObj.articles[id].title;
	document.getElementById("topic").value = jsonObj.articles[id].topic;
	document.getElementById("img").value = jsonObj.articles[id].imgUrl;
	document.getElementById("summary").value = jsonObj.articles[id].summary;
	document.getElementById("content").value = jsonObj.articles[id].content;

	/* 设置文章为“不可编辑”：阅读模式 */
	setDisabled(true);
}

/* 文章详情页面编辑文章功能 */
function editor(id)
{
	/* 设置文章为“可编辑”模式：编辑模式 */
	setDisabled(false);

	/* 添加“保存”按钮 */
	var tableRow = document.getElementsByTagName("table")[0].insertRow(6);
	var flag = document.getElementById("saveBtn");
	if (flag == null) {
		tableRow.innerHTML = "<td colspan='2' align='center'><input id='saveBtn' type='button' onclick='modifyFun(" + id + ")' value='保存' /></td>"
	};
}

/* 添加新文章 */
function addFun()
{
	var title, topic, img, summary, content;

	title = document.getElementById("title").value;
	topic = document.getElementById("topic").value;
	img = document.getElementById("img").value;
	summary = document.getElementById("summary").value;
	content = document.getElementById("content").value;

	var aJsonObj = {
		"id":"",
		"topic":topic,
		"title":title,
		"summary":summary,
		"content":content,
		"imgUrl":img
	};

	var jsonStr = "{ ";
	for(var item in aJsonObj){
		jsonStr += '"' +item+ '":"' +aJsonObj[item]+ '",';
	}
	var jsonStr = jsonStr +  " }";

	var xmlhttp;
	if (window.XMLHttpRequest)
	{// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else
	{// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}

	xmlhttp.open("GET","../article/adding?jsonStr=" + jsonStr, false);
	xmlhttp.send();

	var msg =xmlhttp.responseText;
	alert(msg);
}

/* 文章详情页面删除文章功能 */
function deleteFun(topicId, id)
{
	/* 删除数据库中对应 id 的文章: articleRemoving(id) */
	//var id = document.getElementById("idRemove").value;
	var id = jsonObj.articles[id].id;

	var xmlhttp;
	if (window.XMLHttpRequest)
	{// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else
	{// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}

	xmlhttp.open("GET","../article/removing?id=" + id, false);
	xmlhttp.send();

	//var msg =xmlhttp.responseText;
	//alert(msg);

	/* 返回(生成)相对应 topic 的文章列表页 */
	counter = 1;
	createArticleList(topicId);
}

/* 保存修改后的文章 */
function modifyFun(id)
{
	/* 获取修改后的文章内容：getArticleContent() */
	var realId, title, topic, img, summary, content;

	title = document.getElementById("title").value;
	topic = document.getElementById("topic").value;
	img = document.getElementById("img").value;
	summary = document.getElementById("summary").value;
	content = document.getElementById("content").value;
	realId = jsonObj.articles[id].id;
	//console.log(topic);

	var mJsonObj = {
		"id":realId,
		"topic":topic,
		"title":title,
		"summary":summary,
		"content":content,
		"imgUrl":img
	};

	var jsonStr = "{ ";
	for(var item in mJsonObj){
		jsonStr += '"' +item+ '":"' +mJsonObj[item]+ '",';
	}
	var jsonStr = jsonStr +  " }";



	/* 同步数据库中对应文章的内容: articleModifying(id) */
	var xmlhttp;
	if (window.XMLHttpRequest)
	{// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else
	{// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}

	//xmlhttp.open("POST","../article/modifying", false);
	//xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	//xmlhttp.send("jsonStr=" + jsonStr);

	xmlhttp.open("GET","../article/modifying?jsonStr=" + jsonStr, false);
	xmlhttp.send();
	var msg = xmlhttp.responseText;


	/* 设置文章为“不可编辑”：阅读模式 */
	setDisabled(true);

	/* 删除“保存”按钮 */
	document.getElementsByTagName("table")[0].deleteRow(6);
	alert(msg);
}