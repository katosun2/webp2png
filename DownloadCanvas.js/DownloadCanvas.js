/**
 * 实现本地SVG和图片下载
 * 
 * Ver 1.0
 * By Ryu
 * 
 * 图片和svg必须为同域，否则因为跨域问题无法处理
 * 支持img和svg的base64模式
 * IE10+, Chrome32+, Firefox49+, Safari7+
 * 
 * 依赖：
 * canvas-toBlob.js - https://github.com/eligrey/canvas-toBlob.js
 * canvg - https://github.com/canvg/canvg
 * FileSaver.js - https://github.com/eligrey/FileSaver.js/
 *
 */

(function(window, undefined) {
	"use strict";

	var DownloadCanvas = function(){
		if(!(this instanceof DownloadCanvas)){
			return new DownloadCanvas(arguments[0]);
		}

		if(!this.isSupport()){
			alert('当前浏览器不支持该功能');
			return null;
		}

		this.setOpt(arguments[0] || {});
		this.filename = this.getFilename();
		this.canvas = this.opt.canvas || document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d');
		this.data = this.opt.data; 

		this.setData();

		return this;
	};

	DownloadCanvas.prototype = {
		/*判断浏览器是否支持*/
		isSupport: function(){
			try {
				var isFileSaverSupported = !!new Blob;
			} catch (e) {}

			return isFileSaverSupported ? true : false;
		},

		setOpt: function(opt){
			/*默认参数*/
			this.opt = {
				canvas: null,
				data: null,
				type: 'png',
				filename: 'canvas_' + (new Date()).getTime(),
				width: null,
				height: null
			};
			for (var property in opt) {
				this.opt[property] = opt[property];
			}
		},

		/*获取文件名称*/
		getFilename: function(){
			return this.opt.filename + '.' + this.opt.type; 
		},

		/*处理数据*/
		setData: function(){

			/**
			 * 普通img, imgBase64
			 * 普通svg, svgBase64
			 */
			var tempData,
				imgBase64 = '',
				svgBase64 = '',
				tagName = '';

			if(Object.prototype.toString.call(this.data) === '[object String]'){
				tempData = this.data.split(',');

				if(/image\/svg\+xml/.test(tempData[0])){
					this._doSVG(tempData[1], true);
				}else{
					this._doIMG(this.data, true);
				}
			}else{
				tagName = this.data.tagName;
				if(tagName === 'IMG'){
					this._doIMG(this.data, false);
				}else{
					this._doSVG(this.data, false);
				}
			}
		},

		/*SVG处理*/
		_doSVG: function(svgData, isBase64){
			var me = this,
				svgStr = '',
				width = me.opt.width || window.innerWidth,
				height = me.opt.height || window.innerHeight;

			if(isBase64){
				svgStr = atob(svgData);
			}else{
				/*通过创建临时变量来实现outerHTML*/
				var popDiv = document.createElement("div");
				popDiv.appendChild(svgData.cloneNode(true));
				svgStr = popDiv.innerHTML;
				popDiv = null;
			}

			/*canvg 需要获取svg的尺寸，不能为100%*/
			svgStr = svgStr.replace(/\s+width="100%"/, ' width="' + width + '"');
			svgStr = svgStr.replace(/\s+height="100%"/, ' height="' + height + '"');

			/*canvg 会根据 svg 尺寸大小变更尺寸*/
			canvg(me.canvas, svgStr, {
				ignoreMouse: true,
				ignoreAnimation: true,
				scaleWidth: width,
				scaleHeight: height
			});
			me.down();
		},

		/*图像处理*/
		_doIMG: function(imgData, isBase64){
			var me = this,
				img = new Image(),
				src;

			/*如果是base64*/
			if(isBase64){
				src = imgData;
			}else{
				src = imgData.src;
			}

			/*重载一次获取图片*/
			img.onload = function(){
				me.canvas.width = me.opt.width || img.width;
				me.canvas.height = me.opt.height || img.height;
				me.ctx.drawImage(img, 0, 0);
				me.down();
			};
			img.src = src;
		},


		/*下载*/
		down: function(){
			var me = this;
			this.canvas.toBlob(function(blob) {
				saveAs(blob, me.filename);
			});
		}
	};

	if (typeof define === 'function' && define.amd) {
		define(function() {
			return DownloadCanvas;
		});
	} else if (typeof module === 'object' && module && typeof module.exports === 'object' && module.exports) {
		module.exports = DownloadCanvas;
	} else {
		window.DownloadCanvas = DownloadCanvas;
	}

})(function() {
	return this || window;
}());
