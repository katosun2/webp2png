/*!
 *  通过canvas 将 webp 转换 png 格式
 *  webp 仅支持在 chrome 浏览器下
 *  By Ryu
 */

/ *检测是否支持File API */
if (window.File && window.FileReader && window.FileList && window.Blob) {
	//  支持
} else {
	alert('当前浏览器不支持该功能');
}

/*定义绑定方法*/
var addEvent = function(type, element, fun) {
	if (element.addEventListener) {
		addEvent = function(type, element, fun) {
			element.addEventListener(type, fun, false);
		};
	} else if (element.attachEvent) {
		addEvent = function(type, element, fun) {
			element.attachEvent('on' + type, fun);
		};
	} else {
		addEvent = function(type, element, fun) {
			element['on' + type] = fun;
		};
	}
	return addEvent(type, element, fun);
};


/* 定义变量 */
var dc = document,
	upFile = dc.getElementById('up_file'),
	dropZone = dc.getElementById('drop_zone');

var changeCls = function(obj, cls) {
	obj.className = cls;
};

/*通过 reader file api 读取*/
var downPNG = function(file) {
	var filename = file.name,
		reader = new FileReader(),
		img = new Image();

	/* 渲染文件 */
	reader.onload = function(arg) {
		img.onload = function(){
			DownloadCanvas({
				data: img,
				type: 'png',
				filename: filename,
				width: img.width,
				height: img.height
			});
		};
		img.src = arg.target.result;
	};
	/* 读取文件 */
	reader.readAsDataURL(file);
};


/* 处理上传图片文件 */
var handleFileSelect = function (evt) {
	var files = [];

	try{
		/*拖拽上传*/
		files = evt.dataTransfer.files;
	}catch(e){
		/*普通上传*/
		files = evt.target.files;
	}

	for (var i = 0, len = files.length; i < len; i++) {
		var file = files[i];

		/* 只选择图片文件 */
		if (!file.type.match('image.*')) {
			alert('当前浏览器不支持：' + file.name + ' 的图片格式');
			continue;
		}

		/* 下载 */
		downPNG(file);
	}

	evt.stopPropagation();
	evt.preventDefault();

	changeCls(dropZone, 'drop_zone');
};

var handleDragOver = function (evt) {
	evt.stopPropagation();
	evt.preventDefault();
	evt.dataTransfer.dropEffect = 'copy';

	changeCls(dropZone, 'drop_zone drop_zone_hover');
};

/*绑定*/
addEvent('drop', dropZone, handleFileSelect);
addEvent('dragover', dropZone, handleDragOver);
addEvent('dragleave', dropZone, function(){
	changeCls(dropZone, 'drop_zone');
});

addEvent('change', upFile, handleFileSelect);
