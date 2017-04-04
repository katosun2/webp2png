##### 实现本地SVG和图片下载
 
Ver 1.0

支持：``IE10+``, ``Chrome32+``, ``Firefox49+``, ``Safari7+``

依赖：
 - [atob](https://developer.mozilla.org/zh-CN/docs/Web/API/WindowBase64/atob)
 - [canvas-toBlob.js](https://github.com/eligrey/canvas-toBlob.js)
 - [canvg](https://github.com/canvg/canvg)
 - [FileSaver.js](https://github.com/eligrey/FileSaver.js/)

用法：
```html
<script type="text/javascript" src="./canvas-toBlob/canvas-toBlob.js"></script> 
<script type="text/javascript" src="./canvg/rgbcolor.js"></script> 
<script type="text/javascript" src="./canvg/StackBlur.js"></script>
<script type="text/javascript" src="./canvg/canvg.js"></script> 
<script type="text/javascript" src="./FileSaver/FileSaver.js"></script> 
<script type="text/javascript" src="./DownloadCanvas.js"></script> 
```

```js
DownloadCanvas({
	canvas: null, // canvas对象可选
	data: null, // img或svg的对象或base64
	type: 'png', // 下载类型
	filename: 'canvas_' + (new Date()).getTime(), //下载文件名称
	width: null, // 宽
	height: null // 高
});
```
MIT
