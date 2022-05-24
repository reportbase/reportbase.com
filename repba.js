/* 
 Copyright 2017 Tom Brinkman
 http://www.reportbase.com
*/

const SAFARI = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const FIREFOX = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
const IFRAME = window !== window.parent;
const MAXVIRTUALWIDTH = 5760; 
const THUMBALPHA = 0.5;
const PANXFACTOR = 120;
const PANYFACTOR = 2;
const CANVASCOUNT = 20;
const PANENDTIME = 750;
const REFRESHEADER = 1000;
const SLICEWIDTH = 1; 
const MAXSLIDER = 720;
const POSITYSPACE = 50;
const THUMBLINE = 1;
const THUMBLINEIN = 2.5;
const THUMBLINEOUT = 4.0;
const JULIETIME = 50;
const GUIDEHEIGHT = 54; 
const DELAY = 10000000;
const THUMBORDER = 16;
const TABWIDTH = 40;
const TABHEIGHT = 40;
const HOST = "Local";
const OPTIONSIZE = 100;
const ALIEXTENT = 60;
const BEKEXTENT = 20;
const NUBEXTENT = 8;
const ARROWBORES = 20;
const NUBHEIGHT = 4;
const NUBWIDTH = 8;
const NUBCOLOR = "white";
const CYLRADIUS = 65.45;
const DELAYCENTER = 3.926;
const TIMEOBJ = 3926;
const VIRTCONST = 0.8;
const FONTHEIGHT = 16;
const BUTTONHEIGHT = 38; 
const ROWHEIGHT = FONTHEIGHT*2;
const QUALITY = 0.65;
const PINCHMIN = 0.25;
const PINCHMAX = 1.50;
const THUMBMAX = 1.00;
const THUMBMIN = 0.00;
const ZOOMADJ = 0.05;
const TIMEMAIN = 12;
const PINCHRANGE =  "0.25-1.1";
const HEIGHTRANGE =  "0.10-1.0";
const CANVASMAX = 30;
const MAXCANVASWIDTH = 32767;
const MAXCANVASIZE = SAFARI?16777216:32777216;
const MAXZOOM = 0.95;
const MAXVIRTUALSIZE = SAFARI?12000000:24000000;
const HEADCOLOR = "rgba(0,0,0,0.15)";
const DARKHEADCOLOR = "rgba(0,0,0,0.6)";
const ARROWSELECT = "rgba(255,125,0,0.5)";
const ARROWBACK = "rgba(0,0,0,0.25)"
const THUMBFILL = "rgba(0,0,0,0.25)"
const THUMBSTROKE = "rgb(255,255,235)"

var opened = new Set();

var url = new URL(window.location.href);
url.group = url.searchParams.has("u") ? url.searchParams.get("u") : "reportbase";
url.filename = url.searchParams.get("p");
var filename = url.filename.split(".");
url.path = filename[0];
url.project = filename[1]; 
url.extension = filename[2] 
url.verbose = url.searchParams.has("verbose") ? url.searchParams.get("verbose") : 0;
url.projectrange = url.searchParams.has("m") ? url.searchParams.get("m") : "0000-0000";
url.thumblines = url.searchParams.has("a") ? Number(url.searchParams.get("a")) : 1;
url.thumbheight = url.searchParams.has("h") ? Number(url.searchParams.get("h")) : 50;
url.thumbwidth = url.searchParams.has("w") ? Number(url.searchParams.get("w")) : 75;
url.thumbindex = url.searchParams.has("g") ? Number(url.searchParams.get("g")) : 1;
url.pinch = url.searchParams.has("b") ? Number(url.searchParams.get("b")) : 50;
url.row = url.searchParams.has("r") ? Number(url.searchParams.get("r")) : 50;
url.zoom = url.searchParams.has("z") ? Number(url.searchParams.get("z")) : 50;
url.movepage = url.searchParams.has("e") ? Number(url.searchParams.get("e")) : url.thumblines?0:1;
url.col = url.searchParams.has("c") ? Number(url.searchParams.get("c")) : (url.movepage?TIMEOBJ/2:0);
url.cols = url.searchParams.has("o") ? Number(url.searchParams.get("o")) : 7;
url.position = url.searchParams.has("v") ? Number(url.searchParams.get("v")) : 4;
url.fullpath = function() { return url.path + "." + url.project + "." + url.extension; }
url.fullproject = function() 
{ 
    if (url.movepage == 0)
    {
        var j = url.projects() * url.cols;
        var col = _4cnvctx.slicemiddle ? _4cnvctx.slicemiddle.col : 0;
        var k = col+(url.project * url.cols)
        return (k+1)+" - "+j;
    }

    return Number(url.project)+1+" - "+url.projects(); 
}

url.projects = function()
{ 
    var k = url.projectrange.split("-");
    var j = k[1]-k[0]; 
    return (j+1)+"";
}

Math.clamp = function (min, max, val)
{
    if (typeof val === "undefined" || Number.isNaN(val) || val == null)
        val = max;
    if (max < min)
        return min;
    return (val < min) ? min : (val > max) ? max : val;
};

var photo = {}
photo.image = 0;

var slicelst = [];
var j = 400;
for (var n = 0; n < 1000; n++)
{
    slicelst[n] = {slices: j*100, delay: CYLRADIUS*(60/j)}
    j--;
}

globalobj = {};

var canvaslst = [];
for (var n = 0; n < CANVASCOUNT; ++n)
    canvaslst[n] = document.createElement("canvas");

var makeoption = function (title, data)
{
    this.title = title.toLowerCase().replace(/\./g, "");
    this.fulltitle = title;
    this.ANCHOR = 0;
    this.CURRENT = 0;
    this.data_ = data;
    this.length = function () { return Array.isArray(this.data()) ? this.data().length : Number(this.data()); };
    this.getanchor = function () { return (this.ANCHOR < this.length() &&
		Array.isArray(this.data())) ? this.data()[this.ANCHOR] : this.anchor(); };
    this.getcurrent = function () { return (this.CURRENT < this.length() &&
		Array.isArray(this.data())) ? this.data()[this.CURRENT] : this.current(); };
    this.data = function () { return this.data_; };
    this.anchor = function () { return this.ANCHOR; };
    this.current = function () { return this.CURRENT; };

    this.rotate = function (p) 
    { 
        var k = this.current()+p;
        if (k > this.length())
            k = 0;
        else if (k < 0)
            k = this.length()-1;
        this.set(k);
    };

    this.setanchor = function (index) 
    { 
        if (typeof index === "undefined" || Number.isNaN(index) || index == null)
            index = 0;
        this.ANCHOR = Math.clamp(0, this.length() - 1, index); 
    };

    this.setdata = function (data) 
    {
        this.data_ = data;
        if (this.current() >= this.length())
            this.setcurrent(this.length()-1);
    };
     
    this.setcurrent = function (index) 
    { 
        if (typeof index === "undefined" || Number.isNaN(index) || index == null)
            index = 0;
        this.CURRENT = Math.clamp(0, this.length() - 1, index); 
    };
       
    this.set = function (index) 
    {
        this.setcurrent(index); 
        this.setanchor(index); 
    };

    this.add = function (index) 
    { 
        this.set(this.current()+index); 
    };

    this.find = function (k)
    {
        var j = this.data_.findIndex(function(a){return a == k;})
        if (j == -1)
            return 0;
        return this.data_[j];
    }
};

var imagesobj = new makeoption("", (url.movepage?1:url.cols)*url.projects());

const opts = {synchronized: true, };
let _1cnv = document.getElementById("_1");
let _1cnvctx = _1cnv.getContext("2d", opts);
let _2cnv = document.getElementById("_2");
let _2cnvctx = _2cnv.getContext("2d", opts);
let _3cnv = document.getElementById("_3");
let _3cnvctx = _3cnv.getContext("2d", opts);
let _4cnv = document.getElementById("_4");
let _4cnvctx = _4cnv.getContext("2d", opts);
let _5cnv = document.getElementById("_5");
let _5cnvctx = _5cnv.getContext("2d", opts);
let _6cnv = document.getElementById("_6");
let _6cnvctx = _6cnv.getContext("2d", opts);
let _7cnv = document.getElementById("_7");
let _7cnvctx = _7cnv.getContext("2d", opts);
let _8cnv = document.getElementById("_8");
let _8cnvctx = _8cnv.getContext("2d", opts);
let _9cnv = document.getElementById("_9");
let _9cnvctx = _9cnv.getContext("2d", opts);
let headcnv = document.getElementById("head");
let headcnvctx = headcnv.getContext("2d", opts);
let footcnv = document.getElementById("foot");
let footcnvctx = footcnv.getContext("2d", opts);

function setPixelDensity(canvas) 
{
    let pixelRatio = window.devicePixelRatio;
    console.log(`Device Pixel Ratio: ${pixelRatio}`);
    let sizeOnScreen = canvas.getBoundingClientRect();
    canvas.width = sizeOnScreen.width * pixelRatio;
    canvas.height = sizeOnScreen.height * pixelRatio;
    canvas.style.width = (canvas.width / pixelRatio) + 'px';
    canvas.style.height = (canvas.height / pixelRatio) + 'px';
    let context = canvas.getContext('2d');
    context.scale(pixelRatio, pixelRatio);
    return context;
}

function releaseCanvas(canvas) 
{
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    ctx && ctx.clearRect(0, 0, 1, 1);
}

function limitSize(size, maximumPixels) 
{
    const { width, height } = size;

    const requiredPixels = width * height;
    if (requiredPixels <= maximumPixels) return { width, height };

    const scalar = Math.sqrt(maximumPixels) / Math.sqrt(requiredPixels);
    return {
        width: Math.floor(width * scalar),
        height: Math.floor(height * scalar),
    };
}

function calculateAspectRatioFit(imgwidth, imgheight, rectwidth, rectheight)
{
	var ratio = Math.min(rectwidth/imgwidth, rectheight/imgheight);
	var imgaspectratio = imgwidth/imgheight;
	var rectaspectratio = rectwidth/rectheight;
	var xstart = 0;
	var ystart = 0;
	var width = imgwidth * ratio;
	var height = imgheight * ratio;
	if (imgaspectratio < rectaspectratio)
	{
		xstart = (rectwidth - width) / 2;
		ytart = 0;
	}
	else if (imgaspectratio > rectaspectratio)
	{
		xstart = 0;
		ystart = (rectheight - height) / 2;
	}

	return new rectangle(xstart, ystart, width, height);
}

function download(filename, text)
{
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}

var colorlst =
[
	"Red", "Green", "Yellow", "Blue", "Orange", "Purple", "Cyan", "Magenta",
    "Pink", "Teal", "Lavender", "Brown", "Beige", "Maroon", "Olive", "Navy", "Grey", "White", "Black",
].sort();

color = {};
color.rgb = function(r,g,b)
{
    return "rgb(" + Math.floor(Math.abs(r)) + "," + 
        Math.floor(Math.abs(g)) + "," + 
            Math.floor(Math.abs(b)) + ")";
}

color.rgba = function(r,g,b,a)
{
    return "rgba(" + Math.floor(Math.abs(r)) + "," +
        Math.floor(Math.abs(g)) + "," +
		Math.floor(Math.abs(b)) + "," + a + ")";
}

color.canvas2rgba = function(color)
{
    if (typeof color === "undefined")
        color = "black";
	var canvas = document.createElement("canvas");
	var context = canvas.getContext('2d');
	canvas.height = 1;
	canvas.width = 1;
    context.fillStyle = color;
    context.fillRect(0, 0, 1, 1);
    return context.getImageData(0, 0, 1, 1).data;
}

color.name2rgba = function (clr, alpha)
{
    if (typeof clr === "undefined")
        clr = "black";
    if (typeof alpha === "undefined")
        alpha = 1.0;
    var k = color.canvas2rgba(clr);
    return "rgba(" + k[0] + "," + k[1] + "," + k[2] + "," + alpha + ")";
};

Math.berp = function (v0, v1, t) { return (t - v0) / (v1 - v0); };
Math.lerp = function (v0, v1, t) { return (1 - t) * v0 + t * v1; };
Math.round5 = function (x) { return (x % 5) >= 2.5 ? parseInt(x / 5) * 5 + 5 : parseInt(x / 5) * 5; }
Math.round2 = function (x) { return (x % 2) >= 1 ? parseInt(x / 2) * 2 + 2 : parseInt(x / 2) * 2; }

Image.prototype.load = function(url)
{
    var thisImg = this;
    var xmlHTTP = new XMLHttpRequest();
    xmlHTTP.open('GET', url, true);
    xmlHTTP.responseType = 'arraybuffer';
    xmlHTTP.onload = function(e) 
    {
        var blob = new Blob([this.response]);
        thisImg.src = window.URL.createObjectURL(blob);
    };

    xmlHTTP.onprogress = function(e) 
    {
        thisImg.completedPercentage = parseInt((e.loaded / e.total) * 100);
    };

    xmlHTTP.onloadstart = function() 
    {
        thisImg.completedPercentage = 0;
    };

    xmlHTTP.send();
};

Image.prototype.completedPercentage = 0;
String.prototype.stripquotes = function() { return this.replace(/(^"|"$)/g, ''); }

String.prototype.clean = function()
{
	var _trimLeft  = /^\s+/,
        _trimRight = /\s+$/,
	    _multiple  = /\s+/g;
	return this.replace(_trimLeft, '').replace(_trimRight, '').replace(_multiple, ' ');
};

Array.prototype.sum = function() 
{
    return this.reduce(function(a,b){return a+b;});
};

Array.prototype.move = function (from, to)
{
    this.splice(to, 0, this.splice(from, 1)[0]);
};

String.prototype.wild = function (e)
{
    var re = new RegExp("^" + e.split("*").join(".*") + "$");
    return re.test(this);
};

var pattern = function ()
{
    this.draw = function (context, rect, user, time)
    {
        const cnv = document.createElement('canvas');
        const ctx = cnv.getContext('2d');
        cnv.width = 50;
        cnv.height = 50;
        ctx.fillStyle = '#fec';
        ctx.fillRect(0, 0, cnv.width, cnv.height);
        ctx.arc(0, 0, 50, 0, .5 * Math.PI);
        ctx.stroke();
        const pattern = context.createPattern(cnv, 'repeat');
        context.fillStyle = pattern;
        context.fillRect(rect.x, rect.y, rect.width, rect.height);
    };
};

var Empty = function()
{
    this.draw = function (context, rect, user, time)
    {
        context.clear();
    }
};

var Describe = function()
{
    this.draw = function (context, rect, user, time)
    {
        var Panel = function ()
        {
            this.draw = function (context, rect, user, time)
            {
                var a = new Layer(
                    [
                        new Shrink(new Text("white", "center", "middle",0,1),10,10),
                        new Rectangle(context.describerect),
                    ]);
                
                a.draw(context, rect, user, 0)
            }
        }

        var Wrap = function ()
        {
            this.draw = function (context, rect, user, time)
            {
                var lst = user;
                var lst2 = [];
                if (!Array.isArray(lst))
                {
                    var j = lst.split("\n");
                    for (var n = 0; n < j.length; ++n)
                    {
                        var k = wrap2(context, rect, j[n]);
                        lst2.push(...k);
                        lst2.push("");
                    }

                    lst = [...lst2];
                }

                context.describeobj.data_ = lst.length;
                var rows = Math.ceil(rect.height/ROWHEIGHT);
                lst = lst.slice(context.describeobj.current());
                var a = new GridA(1, rows, 0, new Panel());
                a.draw(context, rect, lst, time);
            }
        };

        context.describerect = new rectangle();
        context.font = "400 " + FONTHEIGHT + "px Source Code Pro";
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowColor = "black"
        var a = new Col([BEKEXTENT,0,BEKEXTENT],
        [
            0,
            new Row([headcnv.height+BEKEXTENT,0,footcnv.height+BEKEXTENT],
            [
                0,
                new Layer(
                [
                    new Fill(DARKHEADCOLOR),
                    new ColA([12,0,12],
                    [
                        0,
                        new Wrap(),
                        new CurrentVPanel(new Fill("white"), ALIEXTENT),
                    ]),
                ]),
                0
            ]),
            0,
        ]);

        a.draw(context, rect, [0, context.describe, context.describeobj], time);
    }
};

var Fill = function (color)
{
    this.draw = function (context, rect, user, time)
    {
        context.fillStyle = color;
        context.fillRect(rect.x, rect.y, rect.width, rect.height);
    };
};

var StrokeRect = function (color)
{
    this.draw = function (context, rect, user, time)
    {
        context.strokeStyle = color;
        context.strokeRect(rect.x, rect.y, rect.width, rect.height);
    }
}

var Arrow = function (degrees)
{
    this.draw = function (context, rect, user, time)
    {
        context.save();
	    var w = rect.width
        var h = rect.height
        var x = rect.x
        var y = rect.y
        var k = degrees == 270 ? 0 : 0;
        context.shadowOffsetX = 1;
        context.shadowOffsetY = 1;
        context.translate(x+w/2-k, y+h/2);
        context.rotate(degrees*Math.PI/180.0);
        context.translate(-x-w/2, -y-h/2);
	    var path = new Path2D();
		path.moveTo(rect.x+rect.width/2,rect.y);
		path.lineTo(rect.x+rect.width,rect.y+rect.height-3);
		path.lineTo(rect.x,rect.y+rect.height-3);
		context.fillStyle = "white";
		context.fill(path);
        context.restore();
    };
};

function rectangle(x, y, w, h, user)
{
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.user = user;
}

rectangle.prototype.hitest = function (x, y)
{
    return x >= this.x && y >= this.y &&
		x < (this.x + this.width) && y < (this.y + this.height);
};

rectangle.prototype.get = function (x, y, w, h)
{
    return new rectangle(this.x + x, this.y + y, w, h);
};

rectangle.prototype.getindex = function(cols, rows, x, y)
{
    var b = (x-this.x)/this.width;
    var col = Math.floor(b*cols);
    var b = (y-this.y)/this.height;
    var row = Math.floor(b*rows);
    return cols*row+col;
}

rectangle.prototype.shrink = function (x, y)
{
	this.x += x;
	this.y += y;
	this.width -= x*2;
	this.height -= y*2;
};

rectangle.prototype.expand = function (x, y)
{
	this.x -= x;
	this.y -= y;
	this.width += x*2;
	this.height += y*2;
};

var addressobj = {}
addressobj.body = function (l)
{
    var context = _4cnvctx;
    var out = 
        "&r="+context.getrow()+
        "&z="+context.zoomobj.current()+
        "&b="+context.pinchobj.current()+
        "&h="+context.thumbheightobj.current()+
        "&v="+context.positobj.current()+
        "&w="+url.thumbwidth+
        "&o="+url.cols+
        "&g="+thumbobj.current()+
        "&e="+url.movepage+
        "&a="+url.thumblines+
        "&m="+url.projectrange;
    return out;
}

 addressobj.full = function ()
{
    var col = _4cnvctx.slicemiddle ? _4cnvctx.slicemiddle.col : 0;
    var out ="https://reportbase.com/home.html?p="+url.path+"."+url.project+"."+url.extension;
    out += addressobj.body(col);
    out += "&c="+(url.movepage?_4cnvctx.timeobj.current().toFixed(2):col);
    return out;
};

addressobj.refresh = function()
{
    clearTimeout(globalobj.timetime);
	globalobj.taptime = setTimeout(function() 
    {  
        var str = addressobj.full();
        window.history.replaceState(0, document.title, str);
        window.localStorage.setItem(url.fullpath(), str);
        _4cnvctx.refresh();
    }, 100);
}

CanvasRenderingContext2D.prototype.refresheaders = function()
{
    this.refresh();
    clearTimeout(this.headtime);
    this.headtime = setTimeout(function()
    {
        _4cnvctx.panning = 0;
        _4cnvctx.pantype = 0;
        _4cnvctx.refresh();
        addressobj.refresh();
    }, REFRESHEADER);
}

CanvasRenderingContext2D.prototype.pinchout = function()
{
    var context = this;
    var k = context.pinchobj.current()+5;
    k = Math.clamp(0,context.pinchobj.length()-1,k);
    context.pinchobj.set(k);
    _4cnvctx.refresheaders();
}

CanvasRenderingContext2D.prototype.pinchin = function()
{
    var context = this;
    var k = context.pinchobj.current()-5;
    k = Math.clamp(0,context.pinchobj.length()-1,k);
    context.pinchobj.set(k);
    _4cnvctx.refresheaders();
}

CanvasRenderingContext2D.prototype.movepage = function(j)
{
    var project = url.project;
    var col ;
    if (j==0)
    {
        col = url.cols-1;
        var m = url.projectrange.split("-");
        if (project == m[0])
            project = m[1];
        else
            project = (Number(project)-1).pad(4);
    }
    else
    {
        col = 0;
        var m = url.projectrange.split("-");
        if (project == m[1])
            project = m[0];
        else
            project = (Number(url.project)+1).pad(4);
    }

    var filename = url.path+"."+project+"."+url.extension;
    if (!opened.has(filename))
    {
        this.refresh();
        return;
    }

    url.project = project;
    url.col = url.movepage?TIMEOBJ/2:col;
    _4cnvctx.refresh();
    _4cnvctx.setcolumncomplete = 0;
    contextobj.reset();
}

CanvasRenderingContext2D.prototype.getrow = function()
{
    var obj = this.rowobj;
    if (!obj)
        return 0;
    return (100*(1-Math.berp(0,1,obj.current()/obj.length()))).toFixed(0);
}


CanvasRenderingContext2D.prototype.slice2col = function(col)
{
	var cols = url.cols;
	var k = col/cols;
	var t = this.slicesobj.data_;
	var j = k*t.length;
	return Math.floor(j);
}

CanvasRenderingContext2D.prototype.swipeup = function(h)
{
    this.nextrow(0,0.75);
    this.refresheaders();
}

CanvasRenderingContext2D.prototype.swipedown = function(h)
{
    this.nextrow(1,0.75);
    this.refresheaders();
}

CanvasRenderingContext2D.prototype.panup = function(h)
{
    this.nextrow(0,0.05);
    this.refresheaders();
}

CanvasRenderingContext2D.prototype.pandown = function(h)
{
    this.nextrow(1,0.05);
    this.refresheaders();
}

CanvasRenderingContext2D.prototype.zoommin = function()
{
    this.zoomobj.set(0);
    contextobj.reset();
    addressobj.refresh();
}

CanvasRenderingContext2D.prototype.zoommax = function()
{
    var index = this.zoomobj.length()-1;
    this.zoomobj.set(index);
    contextobj.reset();
    addressobj.refresh();
}

CanvasRenderingContext2D.prototype.movefirst = function()
{
    var slice = _8cnvctx.slicesobj.data()[0];
    slice.func(); 
}

CanvasRenderingContext2D.prototype.movelast = function()
{
    var index = _8cnvctx.slicesobj.length()-1;
    var slice = _8cnvctx.slicesobj.data()[index];
    slice.func(); 
}

CanvasRenderingContext2D.prototype.moveprev = function()
{
    var col = this.slicemiddle ? this.slicemiddle.col : 0;
    if (url.movepage || col == 0)
        this.movepage(0);
    else
        this.prevcolumn();
    this.slicemiddle.col = url.cols-1;
    this.pantype = "panright";
    this.refresh();
}

CanvasRenderingContext2D.prototype.movenext = function()
{
    var col = this.slicemiddle ? this.slicemiddle.col : 0;
    if (url.movepage || col == url.cols-1)
        this.movepage(1)
    else
        this.nextcolumn();
    this.slicemiddle.col = 0;
    this.pantype = "panleft";
    this.refresh();
}

CanvasRenderingContext2D.prototype.prevcolumn = function()
{
    var col = this.slicemiddle ? this.slicemiddle.col : 0;
    col -= 1;
    if (col == -1)
        col = url.cols-1;
    this.setcolumn(col);
}

CanvasRenderingContext2D.prototype.nextcolumn = function()
{
    var col = this.slicemiddle ? this.slicemiddle.col : 0;
    col += 1;
    if (col == url.cols)
        col = 0;
    this.setcolumn(col);
}

CanvasRenderingContext2D.prototype.setcolumn = function(col)
{
    var e = this.slicesobj.data_.length;
	var cols = url.cols;
	var k = e/cols;
	var f = this.visibles;
	var s = this.slice2col(col);
	var j = DELAYCENTER/e;
	var time = this.firsti - s*j;
    if (k < f)
	{
		var b = f - k;
	    time += (b*j)/2;
	}
	else
	{
		var b = k - f;
		time -= (b*j)/2;
	}

    var k = time % DELAYCENTER;
    var e = this.timeobj.length()*(k/DELAYCENTER);
    this.timeobj.set(e);
    addressobj.refresh();
}

CanvasRenderingContext2D.prototype.nextrow = function (back, f)
{
    var e = (f*this.rowobj.length())*(1-this.zoomobj.getcurrent());
    var k = this.rowobj.current()+(back?-e:e);
    this.rowobj.set(k);
    contextobj.reset();
}

CanvasRenderingContext2D.prototype.hide = function ()
{
    if (this.canvas.height == 0 && !this.enable)
        return;
    this.canvas.height = 0;
    this.enabled = 0;
};

CanvasRenderingContext2D.prototype.refresh = function ()
{
    this.lastime = -0.0101010101;
};

CanvasRenderingContext2D.prototype.pantop = function()
{
    this.rowobj.set(this.rect().height-1);
    contextobj.reset();
}

CanvasRenderingContext2D.prototype.panbottom = function()
{
    this.rowobj.set(0);
    contextobj.reset();
}

CanvasRenderingContext2D.prototype.panleft = function()
{
    this.timeobj.rotate(PANXFACTOR*3);
    this.refresh();

}

CanvasRenderingContext2D.prototype.panright = function()
{
    this.timeobj.rotate(-PANXFACTOR*3);
    this.refresh();
}

CanvasRenderingContext2D.prototype.panimage2 = function (less)
{
    var context = this;
    var pan = this.panspeed;
	var p = less ? pan : -pan;
	this.time += p;
}

CanvasRenderingContext2D.prototype.panimage = function (less)
{
    var e = this.visibles / this.slicesobj.data_.length;
    var k = e*this.colwidth*PANXFACTOR;
    this.timeobj.rotate(less ? k : -k);
}

CanvasRenderingContext2D.prototype.show = function (x, y, width, height)
{
	if (this.canvas.style.left != x+"px")
	    this.canvas.style.left = x+"px";
	if (this.canvas.style.top != y+"px");
		this.canvas.style.top = y+"px";
	if (this.canvas.width != width)
	    this.canvas.width = width;
	if (this.canvas.height != height)
	    this.canvas.height = height;
};

CanvasRenderingContext2D.prototype.rect = function ()
{
    return new rectangle(0, 0, this.canvas.width, this.canvas.height);
};

CanvasRenderingContext2D.prototype.clear =
    CanvasRenderingContext2D.prototype.clear || function (rect)
    {
        if (!rect)
            rect = new rectangle(0, 0, this.canvas.width, this.canvas.height);
        this.clearRect(rect.x, rect.y, rect.width, rect.height);
    };

var makehammer = function (context, v)
{
    var canvas = context.canvas;
    var ham = new Hammer(canvas, { domEvents: true });
	context.ham = ham;
    ham.get("pan").set({ direction: Hammer.DIRECTION_ALL });
    ham.get("swipe").set({ direction: Hammer.DIRECTION_ALL });
    //ham.get('swipe').set({ velocity: 0.45});   
	//ham.get('swipe').set({ threshold: 15 });
	ham.get('press').set({ time: 350 });
	//ham.get('pan').set({ threshold: 10 });
	ham.get('pinch').set({ enable: true });	

	ham.on("pinch", function (evt)
	{
		evt.preventDefault();
		var x = evt.center.x;
		var y = evt.center.y;
		if (typeof (ham.panel.pinch) == "function")
			ham.panel.pinch(context, evt.scale);

		context.pinchblock = 1;
		clearTimeout(globalobj.time_050);
		globalobj.time_050 = setTimeout(function() { context.pinchblock = 0; }, 400);
	});

	ham.on("pinchend", function (evt)
	{
		evt.preventDefault();
		if (typeof (ham.panel.pinchend) == "function")
			ham.panel.pinchend(context);
	});

	ham.on("pinchstart", function (evt)
	{
		context.pinchblock = 1;
		evt.preventDefault();
		var x = evt.center.x;
		var y = evt.center.y;
		if (typeof (ham.panel.pinchstart) == "function")
			ham.panel.pinchstart(context,
			    new rectangle(0, 0, ham.element.width, ham.element.height), x, y);
	});

	ham.on("swipeleft swiperight", function (evt)
    {
        if ((new Date() - ham.panstart) > 200)
            return;
   	    evt.preventDefault();
        var x = evt.center.x - evt.target.offsetLeft;
        var y = evt.center.y - evt.target.offsetTop;
        if (typeof (ham.panel.swipeleftright) == "function")
            ham.panel.swipeleftright(context, new rectangle(0, 0, ham.element.width, ham.element.height), x, y, evt.type);
    });	
    
    ham.on("swipeup swipedown", function (evt)
    {
        if ((new Date() - ham.panstart) > 200)
            return;
   	    evt.preventDefault();
        var x = evt.center.x - evt.target.offsetLeft;
        var y = evt.center.y - evt.target.offsetTop;
        if (typeof (ham.panel.swipeupdown) == "function")
            ham.panel.swipeupdown(context, new rectangle(0, 0, ham.element.width, ham.element.height), x, y, evt.type);
    });

    ham.element.addEventListener("dragleave", function (evt)
    {
   	    evt.preventDefault();
    }, false);

    ham.element.addEventListener("dragenter", function (evt)
    {
   	    evt.preventDefault();
    }, false);

    ham.element.addEventListener("dragover", function (evt)
    {
   	    evt.preventDefault();
    }, false);

    ham.element.addEventListener("drop", function (evt)
    {
   	    evt.preventDefault();
        if (typeof (ham.panel.drop) !== "function")
            return;
        ham.panel.drop(context, evt);
    }, false);

    ham.element.addEventListener("mouseout", function (evt)
    {
        if (typeof (ham.panel.mouseout) !== "function")
            return;
        ham.panel.mouseout(context, evt);
    });

    ham.element.addEventListener("mouseenter", function (evt)
    {
        if (typeof (ham.panel.mouseenter) !== "function")
            return;
        ham.panel.mouseenter(context, evt);
    });

    ham.element.addEventListener("mousemove", function (evt)
    {
        var xj = parseInt(canvas.style.left, 10);
        var x = evt.offsetX;
        var y = evt.offsetY;
        if (typeof (ham.panel.mousemove) !== "function")
            return;
        ham.panel.mousemove(context, context.rect(), x, y);
    });

    ham.element.addEventListener("wheel", function (evt)
    {
        var xj = parseInt(canvas.style.left, 10);
        var x = evt.offsetX;
        var y = evt.offsetY;
        evt.preventDefault();
        if (evt.deltaY < 0)
        {
            if (typeof (ham.panel.wheelup) == "function")
                ham.panel.wheelup(context, x, y, evt.ctrlKey, evt.shiftKey);
        }
        else
        {
            if (typeof (ham.panel.wheeldown) == "function")
                ham.panel.wheeldown(context, x, y, evt.ctrlKey, evt.shiftKey);
        }
    });

	ham.on("press", function (evt)
    {
        evt.preventDefault();
        var x = evt.center.x - evt.target.offsetLeft;
        var y = evt.center.y - evt.target.offsetTop;
        if (typeof (ham.panel.press) !== "function")
            return;
        var k = evt.srcEvent;
        ham.panel.press(context,
			new rectangle(0, 0, ham.element.width, ham.element.height), x, y, k.shiftKey, k.ctrlKey);
    });

    ham.on("pressup", function (evt)
    {
        evt.preventDefault();
        var x = evt.center.x - evt.target.offsetLeft;
        var y = evt.center.y - evt.target.offsetTop;
        if (typeof (ham.panel.pressup) !== "function")
            return;
        var k = evt.srcEvent;
        ham.panel.pressup(context,
			new rectangle(0, 0, ham.element.width, ham.element.height), x, y, k.shiftKey, k.ctrlKey);
    });

    ham.on("panmove", function (evt)
    {
  		if (evt.pointers.length >= 2)
			return;
        evt.preventDefault();
        var rect = new rectangle(0, 0, ham.element.width, ham.element.height);
        var x = Math.clamp(0, context.canvas.width - 1, evt.center.x - evt.target.offsetLeft);
        var y = Math.clamp(0, context.canvas.height - 1, evt.center.y - evt.target.offsetTop);
        if (typeof (ham.panel.panmove) == "function")
            ham.panel.panmove(context, rect, x, y);
    });

    ham.on("panend", function (evt)
    {
  		if (evt.pointers.length >= 2)
			return;
        evt.preventDefault();
        var rect = new rectangle(0, 0, ham.element.width, ham.element.height);
        var x = Math.clamp(0, context.canvas.width - 1, evt.center.x - evt.target.offsetLeft);
        var y = Math.clamp(0, context.canvas.height - 1, evt.center.y - evt.target.offsetTop);
        if (typeof (ham.panel.panend) == "function")
            ham.panel.panend(context, rect, x, y);
    });

	ham.on("panstart", function (evt)
    {
   		if (ham.pinchblock || evt.pointers.length >= 2)
			return;
		ham.lastx = 0;
		ham.lasty = 0;
        evt.preventDefault();
        ham.x = evt.center.x;
        ham.y = evt.center.y;
        var rect = new rectangle(0, 0, ham.element.width, ham.element.height);
        var x = Math.clamp(0, context.canvas.width - 1, evt.center.x - evt.target.offsetLeft);
        var y = Math.clamp(0, context.canvas.height - 1, evt.center.y - evt.target.offsetTop);
        if (typeof (ham.panel.panstart) == "function")
            ham.panel.panstart(context, rect, x, y);
	});

    ham.on("panleft panright", function (evt)
    {
        evt.preventDefault();
        var rect = new rectangle(0, 0, ham.element.width, ham.element.height);
        var x = Math.clamp(0, context.canvas.width - 1, evt.center.x - evt.target.offsetLeft);
        var y = Math.clamp(0, context.canvas.height - 1, evt.center.y - evt.target.offsetTop);
        if (typeof (ham.panel.panleftright) == "function")
            ham.panel.panleftright(context, rect, x, y, evt.type);
        else if (evt.type == "panleft" && typeof (ham.panel.panleft) == "function")
            ham.panel.panleft(context, rect, x, y);
        else if (evt.type == "panright" && typeof (ham.panel.panright) == "function")
            ham.panel.panright(context, rect, x, y);
    });

    ham.on("pandown panup", function (evt)
    {
    	evt.preventDefault();
        var rect = new rectangle(0, 0, ham.element.width, ham.element.height);
        var x = Math.clamp(0, ham.element.width - 1, evt.center.x - evt.target.offsetLeft);
        var y = Math.clamp(0, ham.element.height - 1, evt.center.y - evt.target.offsetTop);
     	if (typeof (ham.panel.panupdown) == "function")
            ham.panel.panupdown(context, rect, x, y, evt.type);
        else if (evt.type == "panup" && typeof (ham.panel.panup) == "function")
            ham.panel.panup(context, rect, x, y);
        else if (evt.type == "pandown" && typeof (ham.panel.pandown) == "function")
            ham.panel.pandown(context, rect, x, y);
    });

    ham.on("pan", function (evt)
    {
        evt.preventDefault();
		var x = evt.center.x - evt.target.offsetLeft;
		var y = evt.center.y - evt.target.offsetTop;
		if (x < 0 || x >= ham.element.width)
			return;
		if (y < 0 || y >= ham.element.height)
			return;
		if (typeof (ham.panel.pan) == "function")
			ham.panel.pan(context,
				new rectangle(0, 0, ham.element.width, ham.element.height), x, y, evt.additionalEvent);
    });

	ham.on("tap", function (evt)
    {	
		ham.context = 0;
        evt.preventDefault();
        var x = evt.center.x - evt.target.offsetLeft;
        var y = evt.center.y - evt.target.offsetTop;
        if (x < 0 || x >= ham.element.width)
            return;
        if (y < 0 || y >= ham.element.height)
            return;
		if (typeof (ham.panel.tap) != "function")
			return;
        var k = evt.srcEvent;
		ham.panel.tap(context, new rectangle(0, 0, ham.element.width, ham.element.height), x, y, k.shiftKey, k.ctrlKey);
 	});

	var panel = new function () { this.draw = function () {}; }();
    ham.panel = panel;
    return ham;
};

var _1ham = makehammer(_1cnvctx,0.3);
var _2ham = makehammer(_2cnvctx,0.3);
var _3ham = makehammer(_3cnvctx,0.3);
var _4ham = makehammer(_4cnvctx,0.6);
var _5ham = makehammer(_5cnvctx,0.9);
var _6ham = makehammer(_6cnvctx,0.9);
var _7ham = makehammer(_7cnvctx,0.9);
var _8ham = makehammer(_8cnvctx,0.9);
var _9ham = makehammer(_9cnvctx,0.9);
var headham = makehammer(headcnvctx,0.3);
var footham = makehammer(footcnvctx,0.3);

var wheelst =
[
{
    name: "DEFAULT",
    up: function (context, ctrl, shift) { },
 	down: function (context, ctrl, shift) { },
},
{
    name: "DESCRIBE",
    up: function (context, ctrl, shift) 
    { 
        var k = context.describeobj.current()-1;
        context.describeobj.set(k);
        context.refresh();
    },
 	down: function (context, ctrl, shift) 
    { 
        var k = context.describeobj.current() + 1;
        context.describeobj.set(k);
        context.refresh();
    },
},
{
    name: "BOSS",
    up: function (context, x, y, ctrl, shift)
    {
        var cell = (context.grid? context.grid.hitest(x,y) : -1); 
        var thumb = context.thumbrect && context.thumbrect.hitest(x,y);
        var isthumbrect = thumbobj.current()==0 && (thumb || context.positobj.getcurrent() == cell);
        if (isthumbrect)
        {
            var obj = context.thumbheightobj;
            var k = obj.current()+1;
            obj.set(k);
            context.refresh();
        } 
        else if (ctrl)
        {
            ico.zoomout.hit(0, _4cnvctx.rect(), 0, 0)
        }
        else
        {
            _4cnvctx.nextrow(1,0.05);
        }
	},
 	down: function (context, x, y, ctrl, shift)
    {
        var cell = (context.grid? context.grid.hitest(x,y) : -1); 
        var thumb = context.thumbrect && context.thumbrect.hitest(x,y);
        var isthumbrect = thumbobj.current()==0 && (thumb || context.positobj.getcurrent() == cell);
        if (isthumbrect)
        {
            var obj = context.thumbheightobj;
            var k = obj.current()-1;
            obj.set(k);
            context.refresh();
        }
        else if (ctrl)
        {
            ico.zoomin.hit(0, _4cnvctx.rect(), window.innerWidth, 0)
        }
        else
        {
            _4cnvctx.nextrow(0,0.05);
        }
	},
},
];

var pinchlst = 
[
{
    name: "DEFAULT",
    pinch: function (context, scale) { },
    pinchend: function (context) { }, 
    pinchstart: function (context, rect, x, y) { },
},
{
    name: "DESCRIBE",
    pinch: function (context, scale) { },
    pinchend: function (context) { }, 
    pinchstart: function (context, rect, x, y) { },
},
{
    name: "BOSS",
    pinch: function (context, scale)
    {
        if (thumbobj.current() == 0)
        {
            var obj = context.thumbheightobj;
            var data = obj.data_; 
            var k = Math.clamp(data[0], data[data.length-1], scale*context.thumbheightsave);
            var j = Math.berp(data[0], data[data.length-1], k);
            var e = Math.lerp(0,obj.length(),j)/100;
            var f = Math.floor(obj.length()*e); 
            obj.set(f);
        }
        else
        {
            var obj = context.pinchobj; 
            var k = Math.clamp(obj.begin, obj.end,scale*context.pinchsave);
            var j = Math.berp(obj.begin, obj.end,k);
            var e = Math.lerp(0,obj.length(),j)/100;
            var f = Math.floor(obj.length()*e); 
            obj.set(f);
        }

        footham.panel.draw(footcnvctx, footcnvctx.rect(), 0);
        context.refresh();
    },
    pinchend: function (context)
    {
        setTimeout(function()
        {
            _4cnvctx.pinching = 0; 
            _4cnvctx.refresh();
            addressobj.refresh();
        }, 40);
    }, 
    pinchstart: function (context, rect, x, y) 
    {
        context.pinching = 1;
        context.panning = 0;
        context.thumbheightsave = context.thumbheightobj.getcurrent()
        context.pinchsave = context.pinchobj.getcurrent()
        pageresize();
        context.refresh();
    },
},
];

var pinchobj = new makeoption("", pinchlst);

function promptFile() 
{
    var input = document.createElement("input");
    input.type = "file";
    input.multiple = 0;
    input.accept = "image/*";
    return new Promise(function(resolve) 
    {
        document.activeElement.onfocus = function() 
        {
            document.activeElement.onfocus = null;
            setTimeout(resolve, 500);
        };

        input.onchange = function() 
        {
            var files = Array.from(input.files);
            return resolve(files);
        };

        input.click();
    });
}

function dropfiles(files)
{
    if (!files || !files.length)
        return;
    _4cnvctx.setcolumncomplete = 0;
    globalobj.promptedfile = [];
    globalobj.promptedfile[0] = URL.createObjectURL(files[0]);   
    contextobj.reset();
}

var droplst =
[
{
    name: "DEFAULT",
    drop: function (context, evt) { },
},
{
    name: "BOSS",
    drop: function (context, evt) { dropfiles(evt.dataTransfer.files); },
},
];

var panlst =
[
{
    name: "DEFAULT",
    updown: function (context, rect, x, y, type) { },
 	leftright: function (context, rect, x, y, type) { },
	pan: function (context, rect, x, y, type) { },
	panstart: function (context, rect, x, y) { },
    enabled : function() { return 1; },
	panmove: function (context, rect, x, y) { },
	panend: function (context, rect, x, y) { }
},
{
    name: "MENU",
    updown: function (context, rect, x, y, type)
    {
		context.panimage2(type=="pandown");
        context.timeback = (type == "panup") ? 1 : 0;
	},
 	leftright: function (context, rect, x, y, type)
    {
		context.panimage2(type=="panleft");
        context.timeback = (type == "panleft") ? 0 : 1;
	},
	pan: function (context, rect, x, y, type) { },
    enabled : function() { return 1; },
	panmove: function (context, rect, x, y) { },
	panstart: function (context, rect, x, y) { },
	panend: function (context, rect, x, y) { }
},
{
    name: "BOSS",
    updown: function (context, rect, x, y, type) { },
 	leftright: function (context, rect, x, y, type) { },
	pan: function (context, rect, x, y, type)
	{
        if ( context.pinching )
             return;

        context.panning = 1;

        if (context.isthumbrect)
        {
            context.hithumb(x,y);
        }
        else if (type == "panleft" || type == "panright")
        {
            context.panimage(type=="panright");
        }
        else if (type == "panup" || type == "pandown")
        {
            var h = rect.height*(1-context.zoomobj.getcurrent())*PANYFACTOR;
            y = (1-(y/rect.height))*h;
            var k = panvert(context.rowobj, h-y);
            if (k == -1)
                return;
            if (k == context.rowobj.anchor())
                return;
            context.rowobj.set(k);
            contextobj.reset();
        }
        
        context.pantype = 0; 
        clearTimeout(context.panendtime);
    },
	panstart: function (context, rect, x, y)
	{
        context.isthumbrect = context.thumbrect && context.thumbrect.hitest(x,y);
        clearTimeout(context.panendtime);
    },
	panmove: function (context, rect, x, y)
	{
    },	
    panend: function (context, rect, x, y)
	{
        context.refresh();
        addressobj.refresh();
        if (thumbobj.current() == 0)
        {
            clearTimeout(context.panendtime);
            context.panendtime = setTimeout(function()
            {
                context.isthumbrect = 0;
                context.panning = 0;  
                context.refresh();
            }, 2000);
       }

        delete context.zoomobj.offset;
        delete context.rowobj.offset;
   }
},
{
    name: "DESCRIBE",
    updown: function (context, rect, x, y, type) { },
 	leftright: function (context, rect, x, y, type) { },
	pan: function (context, rect, x, y, type)
	{
        if (type == "panup" || type == "pandown")
        {
            var h = context.describerect.height;
            var yy = (y/window.innerHeight)*h;
            var k = panvert(context.describeobj, h-yy);
            if (k == -1)
                return;
            context.describeobj.set(k);
            context.refresh();
        }
    },
	panstart: function (context, rect, x, y)
	{
     },
	panmove: function (context, rect, x, y)
	{
    },	
    panend: function (context, rect, x, y)
	{
        delete context.describeobj.offset;
    }
},
];

var mouselst =
[
{
    name: "DEFAULT",
    down: function (evt) { },
 	out: function (evt) { },
    enter: function (evt) { },
    up: function (evt) { },
	move: function (context, rect, x, y) { },
},
{
    name: "MENU",
    down: function (evt) { },
 	up: function (evt) { },
 	enter: function (evt) { },
	out: function (context, evt) { },
	move: function (context, rect, x, y) { },
},
{
    name: "BOSS",
    down: function (evt)
    {
	},
 	ep: function (evt)
    {
	},
 	enter: function (evt)
    {
	},
	out: function (context, evt)
	{
	},
	move: function (context, rect, x, y)
	{
    }
},
];

var mouseobj = new makeoption("MOUSE", mouselst);

var presslst =
[
{
    name: "DEFAULT",
    pressup: function (context, rect, x, y)
    {
	},

    press: function (context, rect, x, y)
    {
	},
},
{
    name: "BOSS",
    pressup: function (context, rect, x, y)
    {
    },

    press: function (context, rect, x, y)
    {
        var isthumbrect = context.thumbrect && context.thumbrect.hitest(x,y);
        var n = context.grid? context.grid.hitest(x,y) : 4; 
        if (isthumbrect || thumbobj.current() == 1 || n == context.positobj.current())
            thumbobj.toggle();
        context.positobj.set(n);
        context.refresh();
    }
},
];
  
var swipelst =
[
{
    name: "DEFAULT",
    swipeleftright: function (context, rect, x, y, type)
    {    
    },
    swipeupdown: function (context, rect, x, y, type)
    {
    },
},
{
    name: "MENU",
    swipeleftright: function (context, rect, x, y, type)
    {    
    },
    swipeupdown: function (context, rect, x, y, type)
    {
        function accuTime(context)
        {
            context.speed = context.panspeed*3;
            var init = (t) => 
            {
                let timeStart = new Date().getTime();
                setTimeout(function () 
                {
                    if (context.speed > 0)
                    {
                        context.speed -= context.menuswipespeed/10;
                        let fix = (new Date().getTime() - timeStart) - t;
                        init(t - fix);
                    } 
                    else 
                    {
                        context.speed = 0;
                    }
                }, t);
            }

            init(200);
        }

        context.timeback = (type == "swipeup") ? 1 : 0;
        accuTime(context); 
    },
},
{
    name: "BOSS",
    swipeleftright: function (context, rect, x, y, type)
    {
        clearTimeout(context.timeswipe);
        context.timeswipe = setTimeout(function()
        {
            var isthumbrect = context.thumbrect && context.thumbrect.hitest(x,y);
            if (!isthumbrect || url.cols == 1)
            {
                var col = context.slicemiddle ? context.slicemiddle.col : 0;
                if (type == "swipeleft" && col == url.cols-1)
                    context.movepage(1)
                else if (type == "swipeleft")
                    context.nextcolumn();
                else if (type == "swiperight" && col == 0)
                    context.movepage(0)
                else if (type == "swiperight")
                    context.prevcolumn();
            }

        }, JULIETIME);
    },

    swipeupdown: function (context, rect, x, y, type)
    {
        clearTimeout(context.timeswipe);
        context.timeswipe = setTimeout(function()
        {
            if (type == "swipedown")
                context.swipeup();
            else
                context.swipedown();
        }, JULIETIME);
    },
},
];
	
var keylst =
[
{
	name: "DEFAULT",
	keyup: function (evt)
	{
	},
	keydown: function (evt)
	{
	}
},
{
	name: "DESCRIBE",
	keyup: function (evt)
	{
	},
	keydown: function (evt)
	{
        var context = _4cnvctx;
        if (evt.key == "ArrowUp" || evt.key == "k" )
        {
            var k = context.describeobj.current()-1;
            context.describeobj.set(k);
            context.refresh();
            evt.preventDefault();
            return true;
        }
        else if (evt.key == "ArrowDown" || evt.key == "j" )
        {
            var k = context.describeobj.current()+1;
            context.describeobj.set(k);
            context.refresh();
            evt.preventDefault();
            return true;
        }
        else if (evt.key == "a")
        {
            about();
            evt.preventDefault();
            return false;
        }
        else if (evt.key == "s")
        {
            help();
            evt.preventDefault();
            return false;
        }

        return false;
	}
},
{
	name: "BOSS",
	keyup: function (evt)
	{
        evt.stopPropagation();
        evt.preventDefault();
		var context = _4cnvctx;
        context.ctrlhit = 0;
        context.refresh();
        return true;
	},
	keydown: function (evt)
	{
		var context = _4cnvctx;
		var rect = context.rect();

        if(evt.ctrlKey)
            context.ctrlhit = 1;

        if (evt.key != " " && isFinite(evt.key))
        {
            context.setcolumn(evt.key-1);
            context.refresh();
            addressobj.refresh();
            evt.preventDefault();
            return false;
        }
        else if (evt.key == "," || evt.key == "<")
        {
            context.movepage(0);
            addressobj.refresh();
            evt.preventDefault();
            return false;
        }
        else if (evt.key == "`")
        {
            url.verbose = url.verbose ? 0 : 1;
            context.refresh();
            evt.preventDefault();
            return false;
        }
        else if (evt.key == "a")
        {
            about();
            evt.preventDefault();
            return false;
        }
        else if (evt.key == "s")
        {
            help();
            evt.preventDefault();
            return false;
        }
        else if (evt.key == " ")
        {
            thumbobj.toggle();
            addressobj.refresh();
            evt.preventDefault();
            return false;
        }
        else if (evt.key == "." || evt.key == ">")
        {
            context.movepage(1);
           addressobj.refresh();
            evt.preventDefault();
            return false;
        }
        else if (evt.key == "-" || evt.key == "[")
        {
            context.refresheaders();
            ico.zoomout.hit(0, context.rect(), 0, 0)
           addressobj.refresh();
            evt.preventDefault();
            return false;
        }
        else if (evt.key == "=" || evt.key == "]" || evt.key == "+")
        {
            context.refresheaders();
            ico.zoomin.hit(0, context.rect(), window.innerWidth, 0)
           addressobj.refresh();
            evt.preventDefault();
            return false;
        }
        else if (evt.key == "o")
        {
            promptFile().then(function(files) { dropfiles(files); });
            evt.preventDefault();
        }
        else if (evt.key == "q" || evt.key == "Q")
        {
            var k = context.pinchobj.current()+(evt.key == "Q"?5:-5);
            k = Math.clamp(0,context.pinchobj.length()-1,k);
            context.pinchobj.set(k);
            addressobj.refresh();
            context.refresheaders();
            evt.preventDefault();
            return false;
        }
        else if (evt.key == "ArrowLeft" || evt.key == "h")
        {
            context.panning = 1;
            if (context.ctrlhit)
                context.moveprev();
            else
                context.panimage(1);
            context.refresheaders();
            addressobj.refresh();
            evt.preventDefault();
            return false;
        }
        else if (evt.key == "ArrowRight" || evt.key == "l")
        {
            context.panning = 1;
            if (context.ctrlhit)
                context.movenext();
            else
                context.panimage(0);
            context.refresheaders();
            addressobj.refresh();
            evt.preventDefault();
            return false;
        }
        else if (evt.key == "ArrowUp" || evt.key == "k")
        {
            context.panning = 1;
            if (context.ctrlhit)
                context.pantop();
            else
                context.nextrow(0,0.05);

            context.refresheaders();
            addressobj.refresh();
            evt.preventDefault();
            return false;
        }
        else if (evt.key == "ArrowDown" || evt.key == "j" )
        {
            context.panning = 1;
            if (context.ctrlhit)
                context.panbottom();
            else
                context.nextrow(1,0.05);
            context.refresheaders();
            addressobj.refresh();
            evt.preventDefault();
            return false;
        }
        else if (evt.key == "Backspace")
        {
            context.panning = 1;
            if (context.ctrlhit)
            {
                context.rowobj.set(window.innerHeight-1);
                contextobj.reset()
                var col = context.slicemiddle ? context.slicemiddle.col : 0;
                if (col == 0)
                    context.movepage(0)
                else
                    context.prevcolumn();
                context.refresh();
            }
            else
            {
                context.nextrow(0,0.05);
            }
            
            context.refresheaders();
            addressobj.refresh();
            evt.preventDefault();
            return false;
        }
        else if (evt.key == "Enter")
        {
            context.panning = 1;
            if (context.ctrlhit)
            {
                context.rowobj.set(window.innerHeight-1);
                contextobj.reset()
                var col = context.slicemiddle ? context.slicemiddle.col : 0;
                if (col == url.cols-1)
                    context.movepage(1)
                else
                    context.nextcolumn();
            }
            else
            {
                context.nextrow(1,0.05);
            }
            
            context.refresheaders();
            addressobj.refresh();
           evt.preventDefault();
           return false;
        }
        else if (evt.key == "Tab" || 
            evt.key == "PageUp" ||
            evt.key == "PageDown" )
        {
            context.panning = 1;
            var col = context.slicemiddle ? context.slicemiddle.col : 0;
            if (evt.shiftKey || evt.key == "PageUp")
            {
                if (col == 0)
                    context.movepage(0)
                else
                    context.prevcolumn();
            }
            else
            {
                if (col == url.cols-1)
                    context.movepage(1)
                else
                    context.nextcolumn();
            }

            context.refresheaders();
            addressobj.refresh();
            evt.preventDefault();
            return true;
        }
         
        return true;
	}
},
{
	name: "MENU",
	keyup: function (evt)
	{
	},
	keydown: function (evt)
	{
		var context = _7cnvctx.enabled ? _7cnvctx :
			_8cnvctx.enabled ? _8cnvctx : _9cnvctx.enabled ? _9cnvctx : _4cnvctx;

		if (evt.key == "ArrowUp" || evt.key == "ArrowDown" ||
			evt.key == "ArrowLeft" || evt.key == "ArrowRight")
		{
            context.timeback = (evt.key == "ArrowUp" || evt.key == "ArrowLeft") ? 0 : 1;
			context.panimage(evt.key == "ArrowUp" || evt.key == "ArrowLeft");
		}
   		else if (evt.key == " ")
        {
			context.panimage(0);
        }
 	}
},
];

CanvasRenderingContext2D.prototype.hithumb = function(x,y)
{
    var rect = this.thumbrect;
    var c = (x-rect.x) % rect.width; 
    var b = c/rect.width;
    var e = this.slicesobj.data_.length;
    var m = (1-b)*e;
    var j = DELAYCENTER/e;
    var time = j*m;
    var k = time % DELAYCENTER;
    var e = this.timeobj.length()*(k/DELAYCENTER);
    this.timeobj.set(e);
    var b = 1-((y-rect.y)/rect.height);
    var e = b*this.rowobj.length();
    this.rowobj.set(e);
    contextobj.reset();
}

var taplst =
[
{
	name: "DEFAULT",
	tap: function (context, rect, x, y, shift, ctrl)
	{
	}
},
{
	name: "DESCRIBE",
	tap: function (context, rect, x, y, shift, ctrl)
	{
        hidedescribe();
	}
},
{
	name: "BOSS",
	tap: function (context, rect, x, y, shift, ctrl)
	{
        context.panning = 0;  
        context.pinching_ = 0;

        if (menuvisible())
        {
            menuhide();
            return;
        }

        var isthumbrect = context.thumbrect && context.thumbrect.hitest(x,y);
        pageresize();
        context.refresh();

        photo.image.completedPercentage = 0
        headobj.getcurrent().draw(headcnvctx, headcnvctx.rect(), 0);

        if (context.movetoprect && context.movetoprect.hitest(x,y))
        {
            context.panup();
            addressobj.refresh();
            _4cnvctx.refresh();
            _4cnvctx.refresheaders(); 
        }
        else if (context.panleftrect && context.panleftrect.hitest(x,y))
        {
            context.panleft()
        }
        else if (context.panrightrect && context.panrightrect.hitest(x,y))
        {
            context.panright();
        }
        else if (context.movebottomrect && context.movebottomrect.hitest(x,y))
        {
            context.pandown();
            addressobj.refresh();
            _4cnvctx.refresh();
            _4cnvctx.refresheaders(); 
        }
        else if (context.moveprevrect && context.moveprevrect.hitest(x,y))
        {
            context.moveprev();
            addressobj.refresh();
            _4cnvctx.refresh();
            _4cnvctx.refresheaders(); 
        }
        else if (context.movenextrect && context.movenextrect.hitest(x,y))
        {
            context.movenext();
            addressobj.refresh();
            _4cnvctx.refresh();
            _4cnvctx.refresheaders(); 
        }
        else if (context.thumbtogglerect && context.thumbtogglerect.hitest(x,y))
        {
            thumbobj.toggle();
        }
        else if (!SAFARI && context.fullscreen && context.fullscreen.hitest(x,y))
        {
            screenfull.toggle(IFRAME ? _4cnv : 0);
        }
        else if (isthumbrect)
        {
            footobj.set(1);
            context.panning = 0;
            context.pinching = 0;
            context.hithumb(x,y);
            pageresize();
        }
        else
        {
            footobj.set(0);
            pageresize();
            if (x < rect.width/2)
                ico.zoomout.hit(0, _4cnvctx.rect(), window.innerWidth, 0)
            else
                ico.zoomin.hit(0, _4cnvctx.rect(), window.innerWidth, 0)
        }
    }
},
{
    name: "MENU",
    tap: function (context, rect, x, y)
    {
		var k = getmenufrompoint(context, x, y);
		if (k == -1)
            return;

		var slice = context.slicesobj.data()[k];
		slice.tap = 1;
        context.refresh();
        setTimeout(function () 
        { 
            menuhide();
            slice.func(); 
            slice.tap = 0;
        }, JULIETIME*5);
    },
},
];

ico = {};

ico.thumbin = new Image();
ico.thumbin.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAADK0lEQVRIS7WXWYiOURjH57VknzIXiiwXKBRXLpSMC9OIEDEhk5KdBs0wzQUxSVlmQskSRU0ulKWIUq4MTYkpe1kKRZIt+zqf3//rvF+fd87yynyn/p2v8yz/5zzvc55zvqjIMzKZTDfEvcBYgwHMGfACXAM3wccoir77/NhkkW0Rwi6sTwSLwDzQ2eH4K+snwFHQQgA/0wbQjhjSYoz3GMIeKR0pAJFvhPxdGpu/iCHti9EVMCqNsUXnKmuTIf8css8RQ6rdXf8P0pirGeLSfyHej/LKgMEn5ApWBecbDZBv8Clkd8xuxzFdAEq1a9xGsB38ApsDmVGVj4f8hstZBGlX47A6sIs6HO0wgVYyNwX0m9Bf6CNWFWs3gz2OfiNbh6N9hniKyZCP+w7C6dg8sSlpx0MRPHJ4UMp0NttALU4OGeJy5otA31wZU6NJjvcsVGBzyUU8G8FJi/A+ayq410DdqhUnDw1xf+YyoMBKgD7TcIuPSmyOu4hVySLIHyJahdFBm1FyjazNZO2MRXdFnKWkTKlezqKNYD1GjSmJl6B32KK7DB+29SIRT8XgvMXoi8nEM5Pqyzi5ZVI9hLkCqFUOBHUWe2VtPjbq5e2GiFXNT1PsrBonuw3xNOZzAZtXyOdg0+wi7o1APXaMx5GO0xqcZGuBYOOq9nG3IizH5o2LuBOCGrAzsIN6nGwxxKuZs2faMXT89qLvbEpxy9RtdBboTLuGzmwD0LneChSwa3xAMBJiPRisI/92UlNXL/Y5DCQlJ37MrxkQ30tDrFfGAbA0rfeAnh4Eu0AjAfxI6iYfAt1RqAe1HUSuotQdvxjyu/k+bU8f7XwuUFPpkzKAb+ipnY526GvHut2yx1HD+tiTgCPTj2kT0JnVDdYT6BGooQJT81ARqVXqflYj0cUxyBPsKWRrCeC5kzg2JgClXw+FYUAXgsZboB3qZZn7fujq+KjyfX71pisLEnuit4og1zU4KWC3oBDEyspLoHvaNY50OLGY2PUsptMe4m2FIpbfY8D25tKtNaIgxGbXqnKR539vHbsqCrIwqY5TTMrVByYA/enTSVDhPYC47Q+jAwjFRbnDLAAAAABJRU5ErkJggg==";
ico.thumbin.hit = function(index, rect, x, y)
{
    var context = _4cnvctx;
    var k = Math.floor(context.thumbheightobj.length()*0.04);
    k = Math.clamp(0,100,context.thumbheightobj.current()+k)
    context.thumbheightobj.set(k);
    contextobj.reset();
    addressobj.refresh()
}

ico.zoomin = new Image();
ico.zoomin.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAADK0lEQVRIS7WXWYiOURjH57VknzIXiiwXKBRXLpSMC9OIEDEhk5KdBs0wzQUxSVlmQskSRU0ulKWIUq4MTYkpe1kKRZIt+zqf3//rvF+fd87yynyn/p2v8yz/5zzvc55zvqjIMzKZTDfEvcBYgwHMGfACXAM3wccoir77/NhkkW0Rwi6sTwSLwDzQ2eH4K+snwFHQQgA/0wbQjhjSYoz3GMIeKR0pAJFvhPxdGpu/iCHti9EVMCqNsUXnKmuTIf8css8RQ6rdXf8P0pirGeLSfyHej/LKgMEn5ApWBecbDZBv8Clkd8xuxzFdAEq1a9xGsB38ApsDmVGVj4f8hstZBGlX47A6sIs6HO0wgVYyNwX0m9Bf6CNWFWs3gz2OfiNbh6N9hniKyZCP+w7C6dg8sSlpx0MRPHJ4UMp0NttALU4OGeJy5otA31wZU6NJjvcsVGBzyUU8G8FJi/A+ayq410DdqhUnDw1xf+YyoMBKgD7TcIuPSmyOu4hVySLIHyJahdFBm1FyjazNZO2MRXdFnKWkTKlezqKNYD1GjSmJl6B32KK7DB+29SIRT8XgvMXoi8nEM5Pqyzi5ZVI9hLkCqFUOBHUWe2VtPjbq5e2GiFXNT1PsrBonuw3xNOZzAZtXyOdg0+wi7o1APXaMx5GO0xqcZGuBYOOq9nG3IizH5o2LuBOCGrAzsIN6nGwxxKuZs2faMXT89qLvbEpxy9RtdBboTLuGzmwD0LneChSwa3xAMBJiPRisI/92UlNXL/Y5DCQlJ37MrxkQ30tDrFfGAbA0rfeAnh4Eu0AjAfxI6iYfAt1RqAe1HUSuotQdvxjyu/k+bU8f7XwuUFPpkzKAb+ipnY526GvHut2yx1HD+tiTgCPTj2kT0JnVDdYT6BGooQJT81ARqVXqflYj0cUxyBPsKWRrCeC5kzg2JgClXw+FYUAXgsZboB3qZZn7fujq+KjyfX71pisLEnuit4og1zU4KWC3oBDEyspLoHvaNY50OLGY2PUsptMe4m2FIpbfY8D25tKtNaIgxGbXqnKR539vHbsqCrIwqY5TTMrVByYA/enTSVDhPYC47Q+jAwjFRbnDLAAAAABJRU5ErkJggg==";
ico.zoomin.hit = function(index, rect, x, y)
{
    var context = _4cnvctx;
    var k = Math.floor(context.zoomobj.length()*ZOOMADJ);
    k = Math.clamp(0,100,context.zoomobj.current()+k)
    context.zoomobj.set(k);
    contextobj.reset();
    addressobj.refresh()
}

ico.zoomout = new Image();
ico.zoomout.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAfCAYAAAAfrhY5AAAC5klEQVRIS7WWW4hNYRTHbfdcyiVJIaV4oimEEikphpKIaHJPeZAmGQmlSLkUDx4QphAeRpM4yYtb8kAjXqQYSi4JCRkS2++vc07HPuv7vr3H2av+nbO/dfmvb+9vrW9FXTwSx3EP1L3BODAZjCw+f+T3MbgF3oPvURT99sWydJG1CKnWJ4KlYDUY4Al8H90xcJkE3mRJoIocYhFtAevBoAzB7mG7mwQupfX5hxzi4TieArPSBkjYfeF5BwkcTuNfJod4MA7n/4O4km8NCZwMJfCXHOJu/OwBTSGHDPo6Enjosy+RT8XoGuiXIXjItA3yCV7yYjkdwWhdKFpGfYcOLQmcdvlFkA9E+Q50zxg8jXkL5It85HNRXkkTqRM2+uYLSaDd8tXOd6HY6QisV3cDvABWQ1JXmwbGO/xfs74ccsWoEpGrrlcaul+s7cNxW2jHxLiLzRTD7jNrK4jR6iI/i2KZodSuN+Go1ukVyI9jsNYw+qqNEaPFRa5utNERXS1T9f8KuF67drwX9Ddi6NJpgPyqi1wl5tpdjO4b0CewRPpeQDefJU9ZXAJ5m4t8NAoZ5SE3CTofcvX8KtGBU9a3ga7QWore1gGIt7qCirwrygbQXEtmYumczID8mZNcChIYws8FMLOGCZyBWJtySuWVKuJzYGiNElCN687Y7hqxksPEKoxVelbZdDYnnSfFbScJVUdZrDFKF8F+MCojm1qtgms2SIoa1gbQSgKfSsrkztHpDMYqv82gHoxIkcQdbApgAZjksVebVctWOza7VtmXJOp4UAebDjQ+DwMap9U2nwN1wOvgAQFfYj+b/xdBX08CmnA1550wR+dKx+IY3Yc19QPd+fJRDf8EHQT5kbA/yHNj4G19QF8fJA8EMdUk/ATFmIBvU17kYyF+BHp6EjiUC7kI2b1Ot+rcJY15kuucNIPFBrta77zcyIu7V5keBXMqEtAdr+mmkCt5iZBPoNrXrfkWFEoV8gcT4uXun/9mzwAAAABJRU5ErkJggg==";
ico.zoomout.hit = function(index, rect, x, y)
{
    var context = _4cnvctx;
    var k = Math.floor(context.zoomobj.length()*ZOOMADJ);
    k = Math.clamp(0,100,context.zoomobj.current()-k)
    context.zoomobj.set(k);
    contextobj.reset();
    addressobj.refresh();
}

ico.thumbout = new Image();
ico.thumbout.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAfCAYAAAAfrhY5AAAC5klEQVRIS7WWW4hNYRTHbfdcyiVJIaV4oimEEikphpKIaHJPeZAmGQmlSLkUDx4QphAeRpM4yYtb8kAjXqQYSi4JCRkS2++vc07HPuv7vr3H2av+nbO/dfmvb+9vrW9FXTwSx3EP1L3BODAZjCw+f+T3MbgF3oPvURT99sWydJG1CKnWJ4KlYDUY4Al8H90xcJkE3mRJoIocYhFtAevBoAzB7mG7mwQupfX5hxzi4TieArPSBkjYfeF5BwkcTuNfJod4MA7n/4O4km8NCZwMJfCXHOJu/OwBTSGHDPo6Enjosy+RT8XoGuiXIXjItA3yCV7yYjkdwWhdKFpGfYcOLQmcdvlFkA9E+Q50zxg8jXkL5It85HNRXkkTqRM2+uYLSaDd8tXOd6HY6QisV3cDvABWQ1JXmwbGO/xfs74ccsWoEpGrrlcaul+s7cNxW2jHxLiLzRTD7jNrK4jR6iI/i2KZodSuN+Go1ukVyI9jsNYw+qqNEaPFRa5utNERXS1T9f8KuF67drwX9Ddi6NJpgPyqi1wl5tpdjO4b0CewRPpeQDefJU9ZXAJ5m4t8NAoZ5SE3CTofcvX8KtGBU9a3ga7QWore1gGIt7qCirwrygbQXEtmYumczID8mZNcChIYws8FMLOGCZyBWJtySuWVKuJzYGiNElCN687Y7hqxksPEKoxVelbZdDYnnSfFbScJVUdZrDFKF8F+MCojm1qtgms2SIoa1gbQSgKfSsrkztHpDMYqv82gHoxIkcQdbApgAZjksVebVctWOza7VtmXJOp4UAebDjQ+DwMap9U2nwN1wOvgAQFfYj+b/xdBX08CmnA1550wR+dKx+IY3Yc19QPd+fJRDf8EHQT5kbA/yHNj4G19QF8fJA8EMdUk/ATFmIBvU17kYyF+BHp6EjiUC7kI2b1Ot+rcJY15kuucNIPFBrta77zcyIu7V5keBXMqEtAdr+mmkCt5iZBPoNrXrfkWFEoV8gcT4uXun/9mzwAAAABJRU5ErkJggg==";
ico.thumbout.hit = function(index, rect, x, y)
{
    var context = _4cnvctx;
    var k = Math.floor(context.thumbheightobj.length()*0.04);
    k = Math.clamp(0,100,context.thumbheightobj.current()-k)
    context.thumbheightobj.set(k);
    contextobj.reset();
    addressobj.refresh();
}

var slicesobj = function (title, data, image, hit)
{
    var stitle = title.toLowerCase().replace(/\./g, "");
    this.title = stitle;
    this.fulltitle = title;
    this.ANCHOR = 0;
    this.CURRENT = 0;
    this.image = image;
    this.hit = hit;
    this.data_ = data;
    this.length = function () { return Array.isArray(this.data()) ? this.data().length : Number(this.data()); };
    this.getanchor = function () { return (this.ANCHOR < this.length() && Array.isArray(this.data())) ? this.data()[this.ANCHOR] : this.anchor(); };
    this.getcurrent = function () { return (this.CURRENT < this.length() && Array.isArray(this.data())) ? this.data()[this.CURRENT] : this.current(); };
    this.label = function () { return title; };
    this.data = function () { return this.data_; };
    this.anchor = function () { return this.ANCHOR; };
    this.current = function () { return this.CURRENT; };
    this.setanchor = function (index) 
    { 
        this.ANCHOR = Math.clamp(0, this.length() - 1, index); 
    };
    
    this.setcurrent = function (index) 
    { 
        this.CURRENT = Math.clamp(0, this.length() - 1, index); 
    };

    this.set = function (index)
	{
		this.setcurrent(index);
		this.setanchor(index);
	};

	this.setdata = function (context)
	{
	}
};
    
Number.prototype.inrange = function(a, b) 
{
    var min = Math.min(a, b),
        max = Math.max(a, b);
    return this >= min && this < max;
}

Number.prototype.pad = function(size)
{
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
	    return s;
}

var thumblst =
[
{
    name: "BOSS",
    draw: function (context, rect, user, time)
    {
        context.save();
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        var col = context.slicemiddle ? context.slicemiddle.col : 0;
        if (photo.image.width > photo.image.height)
        {
            var tw = context.thumbheightobj.getcurrent();
            var th = url.thumbwidth/100;
        }
        else
        {
            var th = context.thumbheightobj.getcurrent();
            var tw = url.thumbwidth/100;
        }

        var headers = IFRAME?0:ALIEXTENT*2; 
        var thumbord = THUMBORDER;
        var b = IFRAME?ALIEXTENT:0;
        var width = rect.width-thumbord*2-b*2;
        var height = rect.height-headers-thumbord*2;
        var r = calculateAspectRatioFit(photo.image.width, photo.image.height, width*tw, height*th); 
        var h = r.height;
        var w = r.width;
        var a = IFRAME?0:ALIEXTENT;
        var pos = context.positobj.current();
        if (pos == 0)
        {
            var x = thumbord+b;
            var y = a+thumbord;
        }
        else if (pos == 1)
        {
            var x = (context.canvas.width-w)/2;
            var y = a+thumbord;
        }
        else if (pos == 2)
        {
            var x = context.canvas.width-w-thumbord-b;
            var y = a+thumbord;
        }
        else if (pos == 3)
        {
            var x = thumbord+b;
            var y = (context.canvas.height-h)/2;
        }
        else if (pos == 5)
        {
            var x = context.canvas.width-w-thumbord-b;
            var y = (context.canvas.height-h)/2;
        }
        else if (pos == 6)
        {
            var x = thumbord+b;
            var y = context.canvas.height-h-a-thumbord;
        }
        else if (pos == 7)
        {
            var x = (context.canvas.width-w)/2;
            var y = context.canvas.height-h-a-thumbord;
        }
        else if (pos == 8)
        {
            var x = context.canvas.width-w-thumbord-b;
            var y = context.canvas.height-h-a-thumbord;
        }
        else
        {
            var x = (context.canvas.width-w)/2;
            var y = (context.canvas.height-h)/2;
        }
    
        context.thumbrect = new rectangle(x,y,w,h);
        if (!context.panning && IFRAME)
        {
            context.moveprevrect = new rectangle(0,0,ALIEXTENT,rect.height);
            context.movenextrect = new rectangle(rect.width-ALIEXTENT,0,ALIEXTENT,rect.height);
            var j = pos == 0 || pos == 1 || pos == 2;
            var a = new Row([ALIEXTENT,0,ALIEXTENT],
            [
                j?0:new Text("white", "center", "middle",0,1,1),
                0,
                j?new Text("white", "center", "middle",0,1,1):0,
            ]);
            
            a.draw(context, rect, url.fullproject(), 0);
        }
     
        if (context.pinching)
        {
        }
        else if (context.panning)
        {
            context.globalAlpha  =  THUMBALPHA;
            context.drawImage(photo.image, 0, 0, photo.image.width, photo.image.height, x, y, w, h);
        }
        else
        {
            context.globalAlpha  =  1.0;
            context.drawImage(photo.image, 0, 0, photo.image.width, photo.image.height, x, y, w, h);
        }

        context.globalAlpha  =  1.0;
        var berp = Math.berp(0,photo.image.height,context.nuby); 
        var lerp = Math.lerp(0,h,berp);
        var yy = lerp;
        var wwww = w/url.cols; 
        var xxxx = x+wwww*col;
        var s = context.slicesobj.data_.length;
        var e = context.slicefirst/s;
        var k = context.visibles/s; 
        var j = e*w;
        var wwwww = k*w;
        var xxxxx = x+j;
        var s = xxxxx+wwwww;
        var t = x+w;
        var c = 0;
        var split = s>t;
        if (split)
        {
            var c = s-t;
            var d = wwwww-c;
            wwwww=d;
        }
        
        context.lineWidth = THUMBLINEOUT;
        var whiterect = new StrokeRect(THUMBSTROKE);
        var blackrect = new Fill(THUMBFILL);
        whiterect.draw(context, context.thumbrect, 0, 0);
        if (context.moveprevrect)
        {
            var a = new Col([ALIEXTENT,0,ALIEXTENT],
            [
                new Layer(
                [
                    new Fill(ARROWBACK), 
                    new Row([0,ALIEXTENT,0],
                    [
                        0,
                        new Shrink(new Arrow(270),ARROWBORES,ARROWBORES),
                        0,
                    ]),
                    new Rectangle(context.moveprevrect)
                ]),
                0,
                new Layer(
                [
                    new Fill(ARROWBACK), 
                    new Row([0,ALIEXTENT,0],
                    [
                        0,
                        new Shrink(new Arrow(90),ARROWBORES,ARROWBORES),
                        0,
                    ]),
                    new Rectangle(context.movenextrect)
                ])
            ]);
            
            a.draw(context, rect, 0, 0);
        }

        if (url.thumblines)
        {
            context.beginPath();
            var r = w/url.cols;
            for (var n = 1; n < url.cols; ++n)
            {
                context.moveTo(x+r*n, y+THUMBLINEOUT);
                context.lineTo(x+r*n, y+h-THUMBLINEOUT);
            }

            context.stroke();
        }

        var berp = Math.berp(0,photo.image.height,context.imageheight); 
        var lerp = Math.lerp(0,h,berp);
        var hh = lerp;

        y += yy+1;
        hh -= 2;
        context.thumbselect[0] = new rectangle(xxxxx,y,wwwww,hh);
        context.thumbselectwidth = wwwww;
       
        var kx = context.thumbselect[0].x - context.thumbrect.x;
        var k = kx/context.thumbrect.width;
        var ki = Math.floor(k*context.slicesobj.length());
        context.slicesobj.set(ki);

        context.lineWidth = THUMBLINEIN;
        blackrect.draw(context, context.thumbselect[0], 0, 0);
        whiterect.draw(context, context.thumbselect[0], 0, 0);

        if (s > t)
        { 
            xxxxx = x;
            wwwww = c;
            context.thumbselect[1] = new rectangle(xxxxx,y,wwwww,hh);
            blackrect.draw(context, context.thumbselect[1], 0, 0);
            whiterect.draw(context, context.thumbselect[1], 0, 0);
            context.thumbselectwidth += wwwww;
        }

        context.thumbselwidthrat = context.thumbselectwidth/context.thumbrect.width;
        context.restore();
    },
},
{
    name: "GUIDE",
    draw: function (context, rect, user, time)
    {
        if (rect.height < 320)
            return;
        if (context.panning)
            return;
        context.shadowColor = "black"
        context.moveprevrect = new rectangle();
        context.movetoprect = new rectangle();
        context.movenextrect = new rectangle();
        context.movebottomrect = new rectangle();
        context.panleftrect = new rectangle();
        context.panrightrect = new rectangle();
        context.thumbtogglerect = new rectangle();
        context.fullscreen = new rectangle();
        var w = window.devicePixelRatio>=2?GUIDEHEIGHT*1.15: GUIDEHEIGHT;
        var w2 = w*3;

        var a = 
        new ColA([ALIEXTENT,0,ALIEXTENT],
        [
            new Layer(
            [
                new Fill(ARROWBACK),
                new Row([ALIEXTENT,0,ALIEXTENT,0,ALIEXTENT],
                [
                    new Text("white", "center", "middle",0,1),
                    0,
                    new Shrink(new Arrow(270),ARROWBORES,ARROWBORES),
                    0,
                    0,
                ]),
                new Rectangle(context.moveprevrect),
            ]),
            new RowA([ALIEXTENT,0,w2,0,ALIEXTENT],
            [
                new ColA([20,ALIEXTENT,0,ALIEXTENT,20],
                [
                    0,
                    new Text("white", "left", "middle",0,1,1),
                    new Text("white", "center", "middle",0,1,1),
                    new Text("white", "right", "middle",0,1,1),
                    0,
                ]),
                0,
                new Col([0,w2,0],
                [
                    0,
                    new Row([0,0,0],
                    [
                        new Col([0,0,0],
                        [
                            0,
                            new Layer(
                            [
                                new Shrink(new Arrow(0),ARROWBORES,ARROWBORES),
                                new Rectangle(context.movetoprect),
                            ]),
                            0,
                        ]),
                        new Col([0,0,0],
                        [
                            new Layer(
                            [
                                new Shrink(new Arrow(270),ARROWBORES,ARROWBORES),
                                new Rectangle(context.panleftrect),
                            ]),
                            new Layer(
                            [
                                SAFARI?0:new Shrink(new Circle("white"),ARROWBORES,ARROWBORES),
                                new Rectangle(context.fullscreen),
                            ]),
                            new Layer(
                            [
                                new Shrink(new Arrow(90),ARROWBORES,ARROWBORES),
                                new Rectangle(context.panrightrect),
                            ]),
                        ]),
                        new Col([0,0,0],
                        [
                            0,
                            new Layer(
                            [
                                new Shrink(new Arrow(180),ARROWBORES,ARROWBORES),
                                new Rectangle(context.movebottomrect),
                            ]),
                            0,
                        ]),
                    ]),
                    0,
                ]),
                0,
                new ColA([20,ALIEXTENT,0,ALIEXTENT,20],
                [
                    0,
                    new Text("white", "left", "middle",0,1,1),
                    new Col([0,50,0],[0,
                        new Layer(
                        [
                            new Rectangle(context.thumbtogglerect),
                            new DotsA(3,25, new Circle("white")),
                        ]),0]),
                    new Text("white", "right", "middle",0,1,1),
                    0,
                ]),
            ]),
            new Layer(
            [
                new Fill(ARROWBACK),
                new Row([ALIEXTENT,0,ALIEXTENT,0,ALIEXTENT],
                [
                    new Text("white", "center", "middle",0,1,1),
                    0,
                    new Shrink(new Arrow(90),ARROWBORES,ARROWBORES),
                    0,
                    0,
                ]),
                new Rectangle(context.movenextrect),
            ]),
        ]);
        
        var vextent = context.virtualwidth.toFixed(0) + "x" + context.virtualheight.toFixed(0) + " (" + context.virtualaspect.toFixed(2) + ")";
        var vsize = ((context.virtualwidth * context.virtualheight)/1000000).toFixed(1) + "MP";
        var scale = window.devicePixelRatio.toFixed(2) + "";
        var scale = window.visualViewport.scale.toFixed(2) + "";
        var k = _4cnvctx.setcolumncomplete?url.fullproject().split("-"):0;
        var project = k?k[0]:"";
        var projects = k?k[1]:"";

        if (url.verbose)
        {
            a.draw(context, rect, 
            [
                scale,
                [
                    [
                        0,
                        vextent,
                        url.fullproject(),
                        vsize, 
                        0,
                    ],
                    0,
                    0,
                    0,
                    [
                        0,
                      photo.image.extent,
                      "",  
                      photo.image.size,
                        0,
                    ],
                ],
                Number(context.zoomobj.getcurrent()).toFixed(2),
            ], 0, 0);
        }
        else
        {
            a.draw(context, rect, 
            [
                0,
                [
                    [
                        0,
                        0,
                        url.fullproject(),
                        0, 
                        0,
                    ],
                    0,
                    0,
                    0,
                    [
                        0,
                      0,
                      "",  
                      0,
                        0,
                    ],
                ],
                "",
            ], 0, 0);
        }
    }
},
];

var thumbobj = new makeoption("", thumblst);
thumbobj.set(url.thumbindex);
thumbobj.toggle = function()
{
    _4cnvctx.panning = 0;
    hidedescribe(); 
    var k = thumbobj.current()?0:1; 
    thumbobj.set(k);
    pageresize();
    addressobj.refresh();
    _4cnvctx.refresh();
}

function splitrange(obj,k,j,size)
{
    var s = j.split("-");
    var begin = Number(s[0]);
    var end = Number(s[1]);
    var mn = begin;
    var mx = end;
    var ad = (mx-mn)/size;
    if (mx == mn)
        size = 1;
    var lst = [];
    for (var n = 0; n < size; ++n, mn+=ad)
        lst.push(mn.toFixed(4));
    if (obj)
    {
        obj.data_ = lst;
    }
    else
    {
        obj = new makeoption("", lst);
        obj.set(k);
    }

    obj.begin = begin;
    obj.end = end;
    return obj;
}

var drawlst = [
{
    name: "DEFAULT",
    draw: 0,
},
{
    name: "MENU",
    draw: function (unused, rect, user, time)
    {
        var context = this;
   		var w = context.fillwidth;
		if (w > rect.width)
			w = rect.width;     
        rect.left = Math.floor((rect.width - w)/2);
        rect.width = w;
        rect.width -= 40;
        rect.height -= 40;
        var xt = -rect.width / 2;
        var yt = -rect.height / 2;
        context.translate(xt, yt);
        if (rect.width > rect.height)
            rect = calculateAspectRatioFit(rect.width, FONTHEIGHT, rect.width, rect.height);
        else
            rect = calculateAspectRatioFit(rect.width, FONTHEIGHT, rect.width, rect.height);
        user.fitwidth = rect.width;
        user.fitheight = rect.height;
        var fillcolor = "black";
        var fillselectcolor = "orange";
        var fillmovecolor = "blue";
        var filltapcolor = "orange"  
        var fillstrokewidth = 2;
        var strokewidth = 2;
        context.fillStyle = "white";
        var clr = fillcolor;
        var fclr = "white"
        var tap = "rgba(0,0,255,0.75)";
        var select = "rgba(0,0,150,0.75)";
        var select2 = "rgba(139,0,139,0.75)";
        var cols = url.cols;
        var str = user.title;
        
        if (user.tap) 
        {
            clr = tap;
        }
        else
        {
            if (user.path == "PROJECT")
            {
                var j = Number(url.project)*url.cols+url.col;
                if (url.movepage)
                    j = url.project;
                if (user.index == j)
                    clr = select;
            }
            else if (user.path == "FULLSCREEN")
            {
                if (screenfull.isFullscreen)
                    clr = select;
            }
        }

        var h = FONTHEIGHT+8;
        var j = rect.width-20;
        var f = 1;
        var a = new Layer(
        [
            new Expand(new Rounded(clr, 2, "white", 8, 8), 0, 18),
            new Shrink(new WrapsPanel(fclr, h, 0), 20, 0),
        ]); 
     
        a.draw(context, rect, str+"", time);
    }
},
{
    name: "BOSS",
    draw: function (unused, rect, user, time)
    {
	}
},
];

function resetcanvas()
{
    var canvas = _4cnv;
    var context = _4cnvctx;

    window.aspect = window.innerWidth/window.innerHeight;
    var zoomrange = [0];

    for (var n = 0; n < 1.0; n+=0.01)
    {
        var zoom = 1-n;
        var imageheight = photo.image.height;
        imageheight *= zoom;
        var imageaspect = photo.image.width/imageheight;
        var virtualheight = context.canvas.height;
        var virtualwidth = virtualheight * imageaspect;
        var virtualaspect = virtualwidth / virtualheight;
        if (Math.abs(virtualaspect < window.aspect))
            continue;
        zoomrange[0] = n;
        break;
    }

    zoomrange[1] = MAXZOOM;
    context.zoomobj = splitrange(context.zoomobj, url.zoom, zoomrange.join("-"), OPTIONSIZE);
    for (var n = 0; n < context.zoomobj.length(); ++n)
    {
        var k = context.zoomobj.data()[n];
        var z = 1-k;
        var h = photo.image.height;
        h *= z;
        var j = photo.image.width/h;
        var vh = context.canvas.height;
        var vw = vh * j;
        if (vw*vh < MAXVIRTUALSIZE)
            continue;
        context.zoomobj.data_.length = n+1;
        break;
    }

    if (context.zoomobj.current() >= context.zoomobj.length())
        context.zoomobj.set(Math.floor(context.zoomobj.length()/2));
   
    var zoom = 1-context.zoomobj.getcurrent();
    context.imageheight = photo.image.height;
    context.imageheight *= zoom;
    var imageaspect = photo.image.width/context.imageheight;
    context.virtualheight = context.canvas.height;
    context.virtualwidth = context.virtualheight * imageaspect;
    context.virtualaspect = context.virtualwidth / context.virtualheight;

    if (!context.rowobj)
    {
        context.pinchobj = splitrange(context.pinchobj, url.pinch, PINCHRANGE, OPTIONSIZE);
        context.thumbheightobj = splitrange(context.thumbheightobj, url.thumbheight, HEIGHTRANGE, OPTIONSIZE);
        var f = window.innerHeight; 
        var j = Math.floor((url.row/100)*window.innerHeight) 
        context.rowobj = new makeoption("", window.innerHeight);
        context.rowobj.set(context.rowobj.length()-j);
    }

    var b = (1-(context.rowobj.getcurrent()/context.rowobj.length()));
    var y = context.canvas.height*b;
    context.nuby = Math.nub(y, context.canvas.height, context.imageheight, photo.image.height);  

    var ks = 0;
    for (var n = 0; n < slicelst.length; ++n)
    {
        var k = slicelst[n];
        var fw = context.virtualwidth / k.slices;
        if (fw < SLICEWIDTH)
            continue;
        ks = n;
        break;
    }

    var canvaslen = Math.ceil(context.virtualwidth/MAXVIRTUALWIDTH);
    var e = slicelst[ks];
    var delay = e.delay;
    var slices = Math.ceil(e.slices/canvaslen);
    context.delayinterval = delay/100000;
    context.delay = e;
    var gwidth = photo.image.width/canvaslen;
    context.bwidth = context.virtualwidth/canvaslen;
    context.colwidth = context.bwidth/slices;
    var slice = 0;
    context.slicesobj.data_ = []

    for (var n = 0; n < canvaslst.length; ++n)
        releaseCanvas(canvaslst[n]);

    for (var n = 0; n < canvaslen; ++n)
    {
        var cnv = canvaslst[n];
        if (cnv.height != context.canvas.height)
            cnv.height = context.canvas.height;
        if (cnv.width != context.bwidth)
            cnv.width = context.bwidth;
        
        var ctx = cnv.getContext('2d');
        ctx.drawImage(photo.image, 
            n*gwidth, context.nuby, gwidth, context.imageheight, 
            0, 0, context.bwidth, context.canvas.height);

        for (var col = 0; col < slices; ++col)
        {
            var k = {};
            k.x = col*context.colwidth;
            k.isleft = 0;
            k.canvas = cnv;
            k.ismiddle = 0;
            k.isright = 0;
            k.col = -1;
            slice++;
            context.slicesobj.data_.push(k);
        }
    }

    var slice = context.slicesobj.data_;
    var cols = gridToRect(url.cols, 1, 0, context.slicesobj.data_.length, 1)
    for (var n = 0; n < cols.length; ++n)
    {
        var col = cols[n]
        for (var e = col.x; e < col.x+col.width; ++e)
            slice[e].col = n;
        
        var m = col.x;
        if (m < 0 || m >= slice.length)
            continue;

        slice[m].isleft = 1;
        slice[m+col.width-1].isright = 1;
        slice[m+Math.floor(col.width/2)].ismiddle = 1;
    }

    context.refresh();
}

var eventlst = 
[ 
    {name: "_1cnvctx", mouse: "DEFAULT", guide: "DEFAULT", thumb: "DEFAULT", tap: "DEFAULT", pan: "DEFAULT", swipe: "DEFAULT", draw: "DEFAULT", wheel: "DEFAULT", drop: "DEFAULT", key: "DEFAULT", press: "DEFAULT", pinch: "DEFAULT", fillwidth: 0},
    {name: "_2cnvctx", mouse: "DEFAULT", guide: "DEFAULT", thumb: "DEFAULT", tap: "DEFAULT", pan: "DEFAULT", swipe: "DEFAULT", draw: "DEFAULT", wheel: "DEFAULT", drop: "DEFAULT", key: "DEFAULT", press: "DEFAULT", pinch: "DEFAULT", fillwidth: 0}, 
    {name: "_3cnvctx", mouse: "DEFAULT", guide: "DEFAULT", thumb: "DEFAULT", tap: "MENU", pan: "MENU", swipe: "MENU", draw: "MENU", wheel: "DEFAULT", drop: "DEFAULT", key: "DEFAULT", press: "DEFAULT", pinch: "DEFAULT", fillwidth: 210},
    {name: "_4cnvctx", mouse: "BOSS", guide: "GUIDE", thumb: "BOSS",  tap: "BOSS", pan: "BOSS", swipe: "BOSS", draw: "BOSS", wheel: "BOSS", drop: "BOSS", key: "BOSS", press: "BOSS", pinch: "BOSS", fillwidth: 0}, 
    {name: "_5cnvctx", mouse: "MENU", guide: "DEFAULT", thumb: "DEFAULT", tap: "MENU", pan: "MENU", swipe: "MENU", draw: "MENU", wheel: "DEFAULT", drop: "DEFAULT", key: "DEFAULT", press: "DEFAULT", pinch: "DEFAULT", fillwidth: 210},
    {name: "_6cnvctx", mouse: "MENU", guide: "DEFAULT", thumb: "DEFAULT", tap: "MENU", pan: "MENU", swipe: "MENU", draw: "MENU", wheel: "DEFAULT", drop: "DEFAULT", key: "MENU", press: "DEFAULT", pinch: "DEFAULT", fillwidth: 210}, 
    {name: "_7cnvctx", mouse: "MENU", guide: "DEFAULT", thumb: "DEFAULT", tap: "MENU", pan: "MENU", swipe: "MENU", draw: "MENU", wheel: "DEFAULT", drop: "DEFAULT", key: "MENU", press: "DEFAULT", pinch: "DEFAULT", fillwidth: 210},
    {name: "_8cnvctx", mouse: "MENU", guide: "DEFAULT", thumb: "DEFAULT", tap: "MENU", pan: "MENU", swipe: "MENU", draw: "MENU", wheel: "DEFAULT", drop: "DEFAULT", key: "MENU", press: "DEFAULT", pinch: "DEFAULT", fillwidth: 240}, 
    {name: "_9cnvctx", mouse: "MENU", guide: "DEFAULT", thumb: "DEFAULT", tap: "MENU", pan: "MENU", swipe: "MENU", draw: "MENU", wheel: "DEFAULT", drop: "DEFAULT", key: "MENU", press: "DEFAULT", pinch: "DEFAULT", fillwidth: 360}, 
    {name: "describe", mouse: "DEFAULT", guide: "DEFAULT", thumb: "DEFAULT", tap: "DESCRIBE", pan: "DESCRIBE", swipe: "DEFAULT", draw: "DEFAULT", wheel: "DESCRIBE", drop: "DEFAULT", key: "DESCRIBE", press: "DEFAULT", pinch: "DESCRIBE", fillwidth: 0},
];

function seteventspanel(panel)
{
    _1ham.panel = panel;
    _2ham.panel = panel;
    _3ham.panel = panel;
    _4ham.panel = panel;
    _5ham.panel = panel;
    _6ham.panel = panel;
    _7ham.panel = panel;
    _8ham.panel = panel;
    _9ham.panel = panel;
}

function setevents(context, obj)
{
    var k = pinchlst.findIndex(function (a) { return a.name == obj.pinch });
    k = pinchlst[k];
    context.pinch_ = k.pinch;
    context.pinchstart_ = k.pinchstart;
    context.pinchend_ = k.pinchend;

    var k = droplst.findIndex(function (a) { return a.name == obj.drop });
    k = droplst[k];
    context.drop = k.drop;

    var k = keylst.findIndex(function (a) { return a.name == obj.key });
    k = keylst[k];
    context.keyup_ = k.keyup;
    context.keydown_ = k.keydown;

    var k = wheelst.findIndex(function (a) { return a.name == obj.wheel });
    k = wheelst[k];
    context.wheelup_ = k.up;
    context.wheeldown_ = k.down;

    var k = mouselst.findIndex(function (a) { return a.name == obj.mouse });
    k = mouselst[k];
    context.mouse = k;

    var k = presslst.findIndex(function (a) { return a.name == obj.press });
    k = presslst[k];
    context.pressup_ = k.pressup;
    context.press_ = k.press;

    var k = swipelst.findIndex(function (a) { return a.name == obj.swipe });
    k = swipelst[k];
    context.swipeleftright_ = k.swipeleftright;
    context.swipeupdown_ = k.swipeupdown;

    var k = drawlst.findIndex(function (a) { return a.name == obj.draw });
    k = drawlst[k];
    context.draw = k.draw;
    
    var k = taplst.findIndex(function (a) { return a.name == obj.tap });
    k = taplst[k];
    context.tap_ = k.tap;

    var k = panlst.findIndex(function (a) { return a.name == obj.pan });
    k = panlst[k];
    context.panstart_ = k.panstart;
    context.pan_ = k.pan;
    context.panupdown_ = k.updown;
    context.panleftright_ = k.leftright;
    context.panmove_ = k.panmove;
    context.panend_ = k.panend;
            
    context.fillwidth = obj.fillwidth;
}

var ContextObj = (function ()
{
    function init()
    {
        this.ANCHOR = 0;
        this.CURRENT = 0;
		this.active_ = 0;
        var lst = [_1cnvctx,_2cnvctx,_3cnvctx,_4cnvctx,_5cnvctx,_6cnvctx,_7cnvctx,_8cnvctx,_9cnvctx];
		for (var n = 0; n < lst.length; ++n)
		{
            context = lst[n];
			context.index = n;
			context.id = n == 0 ? "" : "_" + (n+1);
            context.imageSmoothingEnabled = false;
            context.imageSmoothingQuality = "low";
			context.slicesobj = new slicesobj("", []);
		    context.xlst = [];
		    context.ylst = [];
		    context.enabled = 0;
			context.canvas.width = 1;
			context.canvas.height = 1;
            var time = localStorage.getItem(url.path+context.id+".time");
			context.time = time?Number(time):0;
			context.font = "400 100px Russo One";
			context.fillText("  ", 0, 0);
			context.font = "400 100px Archivo Black";
			context.fillText("  ", 0, 0);
			context.font = "400 100px Source Code Pro";
			context.fillText("  ", 0, 0);
			context.lastime = 0;
            context.timeobj = new makeoption("", TIMEOBJ);
            context.describeobj = new makeoption("", 0);
            context.positobj = new makeoption("", 9);
            context.positobj.set(url.position);
            setevents(context, eventlst[n]);
	    }

        var slices = _8cnvctx.slicesobj;
        slices.data_= [];
        for (var n = 0; n < imagesobj.length(); ++n)
            slices.data_.push({index:n, title:(n+1)+"", path: "PROJECT", func: project})
        
        _8cnvctx.delayintervaly = 5.23296 / slices.data_.length;
        _8cnvctx.virtualheight = slices.data_.length*BUTTONHEIGHT;
        _8cnvctx.panspeed = (window.innerHeight/_8cnvctx.virtualheight)*0.05;

        var slices = _9cnvctx.slicesobj;
        slices.data_= [];
        slices.data_.push({title:"Help", path: "HELP", func: help})
        slices.data_.push({title:"About", path: "ABOUT", func: about})
        slices.data_.push({title:"Open...", path: "LOAD", func: load})
        slices.data_.push({title:"Original", path: "ORIGINAL", func: original})
        if (!SAFARI)
            slices.data_.push({title:"Fullscreen", path: "FULLSCREEN", func: fullscreen})

        _9cnvctx.delayintervaly = 5.23296 / slices.data_.length;
        _9cnvctx.virtualheight = slices.data_.length*BUTTONHEIGHT;
        _9cnvctx.panspeed = 0.04;
    }

    init.prototype =
	{
        anchor: function () { return this.ANCHOR; },
        current: function () { return this.CURRENT; },
        label: function () { return ""; },
        length: function () { return this.data().length; },
        enabled: function () { return 0; },
        setanchor: function (index) { this.ANCHOR = Math.clamp(0, this.length() - 1, index); },
        setcurrent: function (index) { this.CURRENT = Math.clamp(0, this.length() - 1, index); },
        getcurrent: function () { return this.data()[this.current()]; },
        name: function () { return this.CURRENT.toString(); },
        title: function () { return this.CURRENT.toString(); },

		resize: function (context)
       	{
			var canvas = context.canvas;

			var top = 0;
			var left = 0;
			if (!context.enabled)
			{
				context.enabled = 0
				canvas.height = 0;
				return;
			}

            var h = window.innerHeight;
            var w2 = window.innerWidth;
            w2 = w2+4*2;
            var l = Math.floor((window.innerWidth-w2)/2);
            var t = Math.floor((window.innerHeight-h)/2);

			if (context.index == 3)//boss
            {
				context.show(l, t, w2, h);
            }
            else
            {   
                w = Math.min(_4cnv.width-ALIEXTENT*2-10,context.fillwidth);
                l = Math.floor((window.innerWidth-w)/2);
				context.show(l, 0, w, _4cnv.height);
			}
        },

		reset: function ()
       	{
            contextobj.resetcontext4(_4cnvctx);
            setTimeout(function()
            {
                var lst = [_1cnvctx, _2cnvctx, _3cnvctx,  _5cnvctx,
                    _6cnvctx, _7cnvctx, _8cnvctx, _9cnvctx];
                for (var n = 0; n < lst.length; n++)
                {
                    var context = lst[n];
                    contextobj.resetcontext(context);
                }
            }, JULIETIME);
		},

        resetcontext4: function (context)
       	{
            context.refresh();
		    context.slicesobj.data_.push({});

            if (photo.image && _4cnvctx.setcolumncomplete )
            {
                contextobj.resize(context);
                resetcanvas(context);
            }
            else if (url.path)
            {
                var filename = url.path + "." + url.project + "." + url.extension;
                var path = "https://reportbase.com/data/" + filename;
                if (HOST == "Image.Vision")
                    var path = "https://d.img.vision/" + url.group + '/' + filename;
                else if (globalobj.promptedfile)
                    path = globalobj.promptedfile[0];   
               
                context.panning = 0;
                seteventspanel(new Empty());
                photo.image = new Image();
                photo.image.original = path;
                photo.image.load(path);
                photo.image.onload = function()
                {
                    var filename = url.path + "." + url.project + "." + url.extension;
                    opened.add(filename);
                    this.aspect = this.width/this.height; 
                    this.size = ((this.width * this.height)/1000000).toFixed(1) + "MP";
                    this.extent = this.width + "x" + this.height + " (" + this.aspect.toFixed(2) + ")" ;
                    this.extentonly = this.width + "x" + this.height;
                    document.title = url.fullpath()+" ("+this.extentonly+")" 
                    
                    contextobj.resize(context);
                    resetcanvas(context);
                    seteventspanel(new YollPanel());
                    setTimeout(function()
                    {
                        _4cnvctx.refresh();
                        parent.postMessage( 
                        { 
                            title: document.title,
                            extent: photo.image.extent,
                            aspect: photo.image.aspect,
                            originalpath: photo.image.original,
                            project: url.project,
                            extension: url.extension,
                            movepage: url.movepage,
                            cols: url.cols,
                            path: url.path,
                            projects: url.projects(),
                            body: addressobj.body(),
                            address: url.href,
                        },"*");
                    }, 100);

                    clearTimeout(context.panendtime);

                    var p = Number(url.project);
                    var j = Number(url.projects());
                    var lst = [p-2,p-1,p+1,p+2,p+3];
                    var k = url.projectrange.split("-");
                    var start = Number(k[0]);
                    var end = Number(k[1]);
                    for (var n = 0; n < lst.length; n++)
                    {
                        var b = lst[n];
                        if (b > end)
                            b = start;
                        else if (b < start)
                            b = end;
                        var filename = url.path + "." + b.pad(4) + "." + url.extension;
                        var path = "https://reportbase.com/data/" + filename;
                        if (HOST == "Image.Vision")
                            path = "https://d.img.vision/" + url.group + '/' + filename;
                        var img = new Image();
                        img.src = path;
                        img.onload = function()
                        {
                            var u = new URL(this.src).pathname;
                            var filename = u.split("/");
                            filename = filename[filename.length-1];
                            opened.add(filename);
                        } 
                    }
               }
			}

			return 1;
    	},
		resetcontext: function (context)
       	{
			contextobj.resize(context);
            return 1;
    	},
	};

	return init;
})();

var contextobj = new ContextObj();

function gridToRect(cols, rows, margin, width, height)
{
    var rects = [];
    var iheight = height + margin;
    var rwidth = width + margin;
    var ww = parseInt(rwidth / cols);
    var hh = parseInt(iheight / rows);
    var xadj = rwidth - (cols * ww);
    var yadj = iheight - (rows * hh);
    var y = 0;

    var n = 0;
    for (var row = 0; row < rows; ++row)
    {
        var h = hh - margin;
        if (yadj-- >= 1)
            h++;
        var x = 0;
        for (var col = 0; col < cols; ++col, ++n)
        {
            var w = ww - margin;
            if (col >= (cols - xadj))
                w++;
            rects[n] = new rectangle(x, y, w, h);
            rects[n].row = row;
            rects[n].col = col;
            x += w + margin;
        }

        y += h + margin;
    }

    return rects;
}

function gridToGridB(k, extent)
{
    var e = k.slice(0);
    var empty_slots = 0;
    var aextent = 0;
    for (var n = 0; n < e.length; ++n)
    {
        if (e[n] == -1)
            continue;
        if (e[n] < 1)
            e[n] = extent * Math.abs(e[n]);
        aextent += e[n];
        empty_slots += e[n] == 0 ? 1 : 0;
    }

    if (empty_slots == 0)
        return e;

    var balance = extent - aextent;
    if (balance <= 0)
        return e;

    var slot_extent = Math.floor(balance / empty_slots);
    var remainder = balance - (empty_slots * slot_extent);

    for (n = e.length - 1; n >= 0; --n)
    {
        if (e[n])
            continue;

        var d = slot_extent;
        if (remainder-- >= 1)
            d++;
        e[n] = d;
    }

    return e;
}

Array.prototype.sum = function ()
{
    return this.reduce(function (a, b) { return a + b; });
};

Array.prototype.hitest = function (x, y)
{
    var n = 0;
    for (; n < this.length; ++n)
    {
        var rect = this[n];
        if (!rect || !rect.hitest || !rect.hitest(x, y))
            continue;
        break;
    }

    return n;
};

Math.getPans = function (size, extent, factor)
{
    var j = size < extent ? 1 : Math.lerp(0.01, size / extent, factor);
    if (size > 200)
        size = size / 2;
    size = Math.clamp(0, Math.max(size, 10), extent);
    var lst = [];
    for (var n = 0; n < extent; ++n)
    {
        var k = Math.lerp(0, size * j, n / extent);
        lst.push(Math.floor(k));
    }

    return lst;
};

var panhorz = function (obj, x)
{
    if (typeof obj.offset === "undefined")
    {
        obj.offset = obj.anchor() - x;
        return -1;
    }
    else
    {
        return x + obj.offset;
    }
};

var panvert = function (obj, y)
{
    if (typeof obj.offset === "undefined")
    {
        obj.offset = obj.anchor() - y;
        return -1;
    }
    else
    {
        return y + obj.offset;
    }
};

var Rectangle = function (r)
{
    this.draw = function (context, rect, user, time)
    {
        r.x  = rect.x;
        r.y  = rect.y;
        r.width  = rect.width;
        r.height  = rect.height;
    }
}

var Rects = function (rects)
{
    this.draw = function (context, rect, user, time)
    {
        rects.push(rect);
    }
}

var DotsA = function (cols,j,panel)
{
     this.draw = function (context, rect, user, time)
     {
        var a = 
                new Row( [j,0,j],
                [
                    0,
                    new Grid(cols,1,0,panel),
                    0,
                ]);

        context.save();
        context.shadowOffsetX = 1;
        context.shadowOffsetY = 1;
        context.shadowColor = "black"
        a.draw(context, rect, user, time);
        context.restore();
    };
};

var Circle = function (color, scolor, width)
{
    this.draw = function (context, rect, user, time)
    {
        var radius = rect.height / 2;
	    if (radius <= 0)
            return;
	    context.save();
    	context.beginPath();
        context.arc(rect.x + rect.width / 2, rect.y + rect.height / 2, radius, 0, 2 * Math.PI, false);
        context.fillStyle = color;
        context.shadowOffsetX = 1;
        context.shadowOffsetY = 1;
        context.fill();
        if (width)
        {
		    context.strokeStyle = scolor;
            context.lineWidth = width;
			context.stroke();
        }

		context.restore();
    };
};

var CircleA = function (color, scolor)
{
    this.draw = function (context, rect, user, time)
    {
        var radius = rect.height / 2;
	    context.save();
    	context.beginPath();
        context.arc(rect.x + rect.width / 2, rect.y + rect.height / 2, radius, 0, 2 * Math.PI, false);
        var col = _4cnvctx.slicemiddle ? _4cnvctx.slicemiddle.col : 0;
        context.fillStyle = col == user ? scolor : color;
        context.fill();
		context.restore();
    };
};

var Text = function (color,  align="center", baseline="middle", reverse=0, noclip=0, shadow=0)
{
    this.draw = function (context, rect, user, time)
    {
		if (typeof (user) !== "string")
            return;
        
        if (rect.width < 0)
            return;
        var n = user.length;
        if (n <= 0)
            return;

        if (reverse)
            user = user.split("").reverse().join("");

//        context.save();
        var fh = FONTHEIGHT;
        context.font = fh + "px Archivo Black";
        context.textAlign = align;
        context.textBaseline = baseline;
        context.fillStyle = color;
        context.shadowOffsetX = shadow?shadow:0;
        context.shadowOffsetY = shadow?shadow:0;
        context.shadowColor = "black"
 
        var metrics;
        var str;
       
        if (!noclip)
        {
            do
            {
                str = user.substr(0, n);
                metrics = context.measureText(str);
                n--;
            }
            while (n >= 0 && metrics.width > rect.width);
        }
        else
        {
            str = user;
        }

        var x = rect.x;
        if (align == "center")
            x = rect.x + rect.width / 2;
        else if (align == "right")
            x = rect.x + rect.width - 1;

        var y = rect.y + Math.floor(rect.height/2) + 1;

        if (reverse)
            str = str.split("").reverse().join("");

		if (context.linewidth)
			context.strokeText(str, x, y);

        context.fillText(str, x, y);
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
    };
};

var Row = function (e, panel)
{
    this.draw = function (context, rect, user, time)
    {
        if (!e.length)
            e = new Array(panel.length).fill(0);
        var j = gridToGridB(e, rect.height);

        var y = 0;
        for (var n = 0; n < panel.length; ++n)
        {
            if (j[n] == -1)
                continue;

            var r = rect.get(0, y, rect.width, j[n]);
            y += j[n];
            if (typeof (panel[n]) != "object")
                continue;
            r.id = n;
            panel[n].draw(context, r, user, time);
        }
    };
};

var Col = function (e, panel)
{
    this.draw = function (context, rect, user, time)
    {
        if (!e.length)
            e = new Array(panel.length).fill(0);
        var j = gridToGridB(e, rect.width);
        var x = 0;
        for (var n = 0; n < panel.length; ++n)
        {
            if (j[n] == -1)
                continue;
            var r = rect.get(x, 0, j[n], rect.height);
            x += j[n];
            if (typeof (panel[n]) != "object")
                continue;
            r.id = n;
            panel[n].draw(context, r, user, time);
        }
    };
};

var RowA = function (e, panel)
{
    this.draw = function (context, rect, user, time)
    {
        var j = gridToGridB(e, rect.height);
        var y = 0;
        for (var n = 0; n < panel.length; ++n)
        {
            if (j[n] == -1)
                continue;
            var r = rect.get(0, y, rect.width, j[n]);
            y += j[n];
            if (typeof (panel[n]) != "object")
                continue;
            panel[n].draw(context, r, user[n], time);
        }
    };
};

var ColA = function (e, panel)
{
    this.draw = function (context, rect, user, time)
    {
        var j = gridToGridB(e, rect.width);
        var x = 0;
        for (var n = 0; n < panel.length; ++n)
        {
            if (j[n] == -1)
                continue;
            var r = rect.get(x, 0, j[n], rect.height);
            x += j[n];
            if (typeof (panel[n]) != "object")
                continue;
            panel[n].draw(context, r, user[n], time);
        }
    };
};

var Grid = function (cols, rows, margin, panel)
{
    this.draw = function (context, rect, user, time)
    {
        var rects = new gridToRect(cols, rows, margin, rect.width, rect.height);
        for (var n = 0; n < cols*rows; ++n)
        {
            var r = rect.get(rects[n].x, rects[n].y,
                rects[n].width, rects[n].height);
            panel.draw(context, r, n, time);
        }
    };
};

var GridA = function (cols, rows, margin, panel)
{
    this.draw = function (context, rect, user, time)
    {
        var rects = new gridToRect(cols, rows, margin, rect.width, rect.height);
        for (var n = 0; n < cols*rows; ++n)
        {
            var r = rect.get(rects[n].x, rects[n].y,
                rects[n].width, rects[n].height);
            panel.draw(context, r, user[n], time);
        }
    };
};

var Expand = function (panel, extentw, extenth)
{
    this.draw = function (context, rect, user, time)
    {
		return panel.draw(context, new rectangle(
			rect.x-extentw,
			rect.y-extenth,
			rect.width+extentw*2,
			rect.height+extenth*2),
				user, time);
    };
};

var Shrink = function (panel, extentw, extenth)
{
    this.draw = function (context, rect, user, time)
    {
		return panel.draw(context, new rectangle(
			rect.x+extentw,
			rect.y+extenth,
			rect.width-extentw*2,
			rect.height-extenth*2),
				user, time);
    };
};

var Rounded = function (color, linewidth, strokecolor, radiustop, radiusbot)
{
    this.draw = function (context, rect, user, time)
    {
        var x = rect.x;
        var y = rect.y;
        var width = rect.width;
        var height = rect.height;
        context.fillStyle = color;
        context.beginPath();
        context.moveTo(x, y + radiustop);
        context.lineTo(x, y + height - radiusbot);
        context.arcTo(x, y + height, x + radiusbot, y + height, radiusbot);
        context.lineTo(x + width - radiusbot, y + height);
        context.arcTo(x + width, y + height, x + width, y + height - radiusbot, radiusbot);
        context.lineTo(x + width, y + radiustop);
        context.arcTo(x + width, y, x + width - radiustop, y, radiustop);
        context.lineTo(x + radiustop, y);
        context.arcTo(x, y, x, y + radiustop, radiustop);
        context.fill();
		if (linewidth)
		{
			context.lineWidth = linewidth;
			context.strokeStyle = strokecolor;
			context.stroke();
		}
    };
};

var Layer = function (panels)
{
    this.draw = function (context, rect, user, time)
    {
        for (var n = 0; n < panels.length; ++n)
        {
            if (typeof (panels[n]) == "object")
                panels[n].draw(context, rect, user, time);
        }
    };
};

var LayerA = function (panels)
{
    this.draw = function (context, rect, user, time)
    {
        for (var n = 0; n < panels.length; ++n)
        {
            if (typeof (panels[n]) == "object")
                panels[n].draw(context, rect, user[n], time);
        }
    };
};

var ImagePanel = function (shrink)
{
    this.draw = function (context, rect, user, time)
    {
        var w = user.width*(shrink?shrink:1)
        var h = user.height*(shrink?shrink:1);
        var x = Math.floor(rect.x + (rect.width - w) / 2);
        var y = Math.floor(rect.y + (rect.height - h) / 2);
    
        context.save();
        if (user.degrees)
        {
            context.translate(x+w/2, y+h/2);
            context.rotate(user.degrees*Math.PI/180.0);
            context.translate(-x-w/2, -y-h/2);
        }

        context.drawImage(user, x, y, w, h);
        context.restore();
	};
};

var CurrentHPanel = function (panel, extent)
{
    this.draw = function (context, rect, user, time)
    {
	    var current = typeof (user.current) == "function" ? user.current() : user.current;
        var length = typeof (user.length) == "function" ? user.length() : user.length;
        var nub = Math.nub(current, length, extent, rect.width);
        var r = new rectangle(rect.x + nub, rect.y, extent, rect.height);
        panel.draw(context, r, 0, time);
    };
};

var CurrentVPanel = function (panel, extent)
{
    this.draw = function (context, rect, user, time)
    {
        var current = typeof (user.current) == "function" ? user.current() : user.current;
        var length = typeof (user.length) == "function" ? user.length() : user.length;
        var nub = Math.nub(current, length, extent, rect.height);
        var r = new rectangle(rect.x, rect.y + nub, rect.width, extent);
        panel.draw(context, r, 0, time);
    };
};

//Math.nub(99,100,100,1000) = 900
//Math.nub(0,100,100,1000) = 0
Math.nub = function (n, size, nubextent, extent)
{
    var m = (n+1)/size;
    var k = extent/size;
    var j = nubextent;
    var t = nubextent / extent;
    var e = ((n+1)/size)*(j);
    return n == 0 ? 0 : ((k*(n+1)) - e);
};

function rotate(pointX, pointY, originX, originY, angle)
{
	angle = angle * Math.PI / 180.0;
	var k = {
		x: Math.cos(angle) * (pointX - originX) - Math.sin(angle) * (pointY - originY) + originX,
		y: Math.sin(angle) * (pointX - originX) + Math.cos(angle) * (pointY - originY) + originY
	};

	return k;
}

var getmenufrompoint = function (context, x, y)
{
	var lst = context.slicesobj.data();
    
	var k;
    for (k = 0; k < lst.length; k++)
    {
		var hit = lst[k];
		if (!hit.fitwidth || !hit.fitheight)
			continue;
		var w = hit.fitwidth + 20*2;
		var h = hit.fitheight + 18*2;
		var x1 = hit.center.x - w / 2;
		var y1 = hit.center.y - h / 2;
		var x2 = x1 + w;
		var y2 = y1 + h;
		if (x >= x1 && x < x2 &&
			y >= y1 && y < y2)
			break;
    }

	return k<lst.length?k:-1;
}

var selectrotated = function (context, x, y)
{
	var t = context.slicesobj.data()[0];
	var lst = Array.isArray(t[0]) ? t[0] : t;

	var k;
    for (k = lst.length - 1; k >= 0; --k)
    {
		var hit = lst[k];
		if (!hit.fitscale || !hit.fitwidth || !hit.fitheight)
			continue;

		var w = hit.fitscale * hit.fitwidth;
		var h = hit.fitscale * hit.fitheight;
		var x1 = hit.center.x - w / 2;
		var y1 = hit.center.y - h / 2;
		var x2 = x1 + w;
		var y2 = y1 + h;

		var rt = 0;
		var pt1 = rotate(x1, y1, hit.center.x, hit.center.y, rt);
		var pt2 = rotate(x2, y1, hit.center.x, hit.center.y, rt);
		var pt3 = rotate(x2, y2, hit.center.x, hit.center.y, rt);
		var pt4 = rotate(x1, y2, hit.center.x, hit.center.y, rt);
		var path = new Path2D();
		path.moveTo(pt1.x, pt1.y);
		path.lineTo(pt2.x, pt2.y);
		path.lineTo(pt3.x, pt3.y);
		path.lineTo(pt4.x, pt4.y);
		path.closePath();
		if (context.isPointInPath(path, x, y))
			break;
    }

	return k>=0?k:-1;
}

function menuvisible()
{
    var k = _5cnv.height || _6cnv.height || _7cnv.height ||
        _8cnv.height || _9cnv.height;
    return k;
}

function menuhide()
{
    var k = menuvisible();
    _3cnvctx.enabled = 0;
    _5cnvctx.enabled = 0;
    _6cnvctx.enabled = 0;
    _7cnvctx.enabled = 0;
    _8cnvctx.enabled = 0;
    _9cnvctx.enabled = 0;
    _3cnvctx.hide();
    _5cnvctx.hide();
    _6cnvctx.hide();
    _7cnvctx.hide();
    _8cnvctx.hide();
    _9cnvctx.hide();
    _4cnvctx.refresh();
    return k; 
}

function resize()
{
    escape();
    function foo()
    {
        pageresize();
        contextobj.reset();
    }

    foo();
    setTimeout(foo,50);
    setTimeout(foo,100);
    setTimeout(foo,200);
    setTimeout(foo,500);
}

window.addEventListener("load", function (evt) 
{ 
    seteventspanel(new YollPanel());
    _4cnvctx.enabled = 1;
    _1ham.panel.draw(_1cnvctx, _1cnvctx.rect(), 0);
    pageresize();
    contextobj.reset();
});

window.addEventListener("focus", (evt) => 
{ 
});

window.addEventListener("blur", (evt) => 
{ 
});

window.addEventListener("resize", (evt) => 
{ 
    resize();
});

window.addEventListener("screenorientation", (evt) => 
{ 
    resize();
});

window.addEventListener("unload", (evt) => 
{
    for (var n = 0; n < canvaslst.length; ++n)
        releaseCanvas(canvaslst[n]);
});

window.addEventListener("beforeunload", (evt) => 
{
});

function escape() 
{
    delete _4cnvctx.describe;
    var n = eventlst.findIndex(function(a){return a.name == "_4cnvctx";})
    setevents(_4cnvctx, eventlst[n])
    _4cnvctx.refresh();
    contextobj.reset();
}

var YollPanel = function ()
{
    this.draw = function (context, rc, user, unused)
    {
       	function yoll()
        {
            if (!photo.image.complete || 
                photo.image.naturalHeight == 0)
                return;

            for (var n = 0; n < 1; n++)
            {
				var context = _4cnvctx;
                
                var time = context.timeobj.getcurrent()/1000;
                if (context.lastime == context.timeobj.current())
                    continue;
                else
                    context.lastime = context.timeobj.current();

                if (photo.image.completedPercentage == 100)
                {
                    photo.image.completedPercentage = 0
                    headobj.getcurrent().draw(headcnvctx, headcnvctx.rect(), 0);
                    footham.panel.draw(footcnvctx, footcnvctx.rect(), 0);
                }
                
                var pinchobj = context.pinchobj;
                var rect = context.rect();
                var first = 0;
                context.firstx = DELAY;
                context.visibles = 0;  
                var slicesobj = context.slicesobj.data_;
                var r = calculateAspectRatioFit(context.colwidth,
                    rect.height, context.canvas.width, rect.height);
                var xt = -rect.width / 2;
                var yt = -rect.height / 2;
                let y = rect.height*0.5;
                var width = context.canvas.width;
                var height = context.canvas.height;
                var kv = context.virtualwidth*pinchobj.getcurrent();
                var borderleft = (kv-width)/2;
                context.save();
                context.translate(xt, 0);
                var lx = 0;
                for (var m = 0; m < slicesobj.length; ++m)
                {
                    var slice = slicesobj[m];
                    slice.time = time + (m*context.delayinterval);
                    var b = Math.tan(slice.time*VIRTCONST);
                    let x = Math.berp(-1, 1, b) * kv - borderleft;
                    var pinchwidth = x+context.colwidth-lx; 
                    lx = x;
                    slice.nx = x;
                    slice.ny = y;
                    slice.center = {x:x, y:y};
                    if (x > (rect.width/2)*0.99 && x < (rect.width/2)*1.01)
                        context.slicemiddle = slice;

                    slice.fitscale = 0;
                    slice.fitwidth = 0;
                    slice.fitheight = 0;

                    if (!first)
                        first = x;
                        
                    if (x >= width && 
                        (first < 0 || (first >= width && x < first)))
                        break;

                    if (x < 0 || x >= width)
                        continue;

                    context.visibles++;
                    context.slicelast = m;
                    context.lastx = x;
                    if (x < context.firstx)
                    {
                        context.firstx = x;
                        context.slicefirst = m;
                        context.firsti = slice.time;
                    }

                    slice.fitwidth = r.width;
                    slice.fitheight = height;
                    if (context.setcolumncomplete && 
                        height)
                    {
                        context.drawImage(slice.canvas, slice.x,0,context.colwidth, height,
                            x+r.x,0,context.colwidth*pinchwidth, height);
                    }
                }

                context.restore();
                context.save();
                if (!context.setcolumncomplete)
                {
                    context.setcolumncomplete = 1;
                    if (url.movepage)
                        context.timeobj.set(url.col);
                    else
                        context.setcolumn(url.col);
                    continue;
                }

                context.thumbselect = [];
                context.grid = [];
                delete context.moveprevrect;
                delete context.movetoprect;
                delete context.movenextrect;
                delete context.movebottomrect;
                delete context.panleftrect;
                delete context.panrightrect;
                delete context.thumbtogglerect;
                delete context.fullscreen;
                delete context.thumbrect;
                delete context.describerect;
 
                if (context.describe)
                {
                    for (var m = 0; m < slicesobj.length; ++m)
                    {
                        var hit = slicesobj[m];
                        if (hit.isleft && hit.col == context.slicemiddle.col)
                        {
                            var a = new Describe();
                            a.draw(context, rect, context.describe, 0);
                        }
                    }
                } 
               
                if (!context.panning && headcnv.height)
                {
                    headobj.getcurrent().draw(headcnvctx, headcnvctx.rect(), 0);
                    footobj.getcurrent().draw(footcnvctx, footcnvctx.rect(), 0);
                }
                else
                {
                    headcnvctx.clear();
                    footcnvctx.clear();
                }

                if (!context.describe)
                {
                    var a =  new Grid(3,3,0,new Rects(context.grid));
                    a.draw(context, rect, 0, 0);

                    thumbobj.getcurrent().draw(context, rect, 0, 0);

                    if (IFRAME)
                    {
                        parent.postMessage( 
                        { 
                            title: document.title,
                            fullproject: _4cnvctx.setcolumncomplete?url.fullproject():"",
                            address: addressobj.full(),
                        }, "*");
                    }
                }
            }
            
            var data = [_3cnvctx,  _5cnvctx, _6cnvctx, _7cnvctx, _8cnvctx, _9cnvctx, ];
            for (var n = 0; n < data.length; n++)
            {
				var context = data[n];
				if (!context.enabled)
					continue;
				if (!context.canvas.height)
					continue;
                
                if (context.speed)
				{
					context.time += (context.timeback == 1) ? -context.speed : context.speed;
				}
                else if ((context.lastime.toFixed(8) == context.time.toFixed(8)))
                {
                    continue;
                }
                else
                {
                    context.lastime = Number(context.time.toFixed(8));
                    context.time = context.lastime;
                }

			    var slicesobj = context.slicesobj;
				var slices = slicesobj.data();
				var delayinterval = context.delayinterval;
				var delayintervaly = context.delayintervaly;
                context.visibles = 0 
				var r = context.rect();
				var w = r.width;
				var h = r.height;
				var first = 0;
				var firstx = DELAY;
                context.clear();
                context.fillStyle = HEADCOLOR;
                context.fillRect(0, 0, context.canvas.width, context.canvas.height);
			    var time = context.time;

				for (var m = 0; m < slices.length; ++m)
				{
					var slice = slices[m];
                    slice.index = m;
					var jtime = time + (m*context.delayintervaly);
					var virtualheight = context.virtualheight;

                    function foo(context, rect, m, n, virtualheight, width, 
                        height, jtime)
                    {
                        var stime = jtime;
                        var e = (virtualheight-rect.height)/2;
                        var bos = {y: Math.tan(stime * 0.6)};
                        let x = Math.berp(-1, 1, Math.sin(0)) * width;
                        let y = Math.berp(-1, 1, bos.y) * virtualheight;
                        var j = { x: x, y: y };
                        j.y -= e;
                        return {stime: stime, j: j, bos: bos};
                    }

					var vals = foo(context, r, m, n, virtualheight, w, h, jtime);
					var stime = vals.stime;
					var j = vals.j;
					slice.center = j;
					slice.fitscale = 0;
					slice.fitwidth = 0;
					slice.fitheight = 0;

                    context.save();
					context.translate(j.x, j.y);

					if (j.x < firstx)
					{
						firstx = j.x;
						context.slicefirst = m;
					}
                   
                    if (j.y >= 0 && j.y < window.innerHeight)
                        context.visibles++;

					var ktime = stime * context.delay;
					context.draw(context, context.rect(), slice, ktime);
					context.restore();
				}
            }
        }

        yoll();
        clearInterval(globalobj.timemain);
        globalobj.timemain = setInterval(function () { yoll(); }, TIMEMAIN);
    };

	this.tap = function (context, rect, x, y, shift, ctrl)
    {
        if (context.tap_)
    		context.tap_(context, rect, x, y, shift, ctrl);
	};

    this.wheeldown = function (context, x, y, ctrl, shift)
    {
		if (context.wheeldown_)
      		context.wheeldown_(context, x, y, ctrl, shift);
   	};

    this.wheelup = function (context, x, y, ctrl, shift)
    {
		if (context.wheelup_)
      		context.wheelup_(context, x, y, ctrl, shift);
   	};

    this.drop = function (context, evt)
    {
		if (context.drop)
      		context.drop(context, evt);
   	};

    this.mouseout = function (context, evt)
    {
		if (context.mouse && context.mouse.out)
      		context.mouse.out(context, evt);
   	};

    this.mouseenter = function (context, evt)
    {
		if (context.mouse && context.mouse.enter)
      		context.mouse.enter(evt);
   	};

    this.mousemove = function (context, rect, x, y)
    {
		if (context.mouse && context.mouse.move)
      		context.mouse.move(context, rect, x, y);
   	};

	this.pan = function (context, rect, x, y, type)
	{
		context.pan_(context, rect, x, y, type);
	};

	this.panmove = function (context, rect, x, y)
    {
      	context.panmove_(context, rect, x, y);
   	};

	this.panend = function (context, rect, x, y)
    {
      	context.panend_(context, rect, x, y);
   	};

	this.panleftright = function (context, rect, x, y, type)
    {
       	context.panleftright_(context, rect, x, y, type);
    };

	this.panupdown = function (context, rect, x, y, type)
    {
   		context.panupdown_(context, rect, x, y, type);
    };

	this.panstart = function (context, rect, x, y, type)
    {
       	context.panstart_(context, rect, x, y);
	};

    this.swipeleftright = function (context, rect, x, y, type)
    {
   		if (context.swipeleftright_)
        	context.swipeleftright_(context, rect, x, y, type);
	};

    this.swipeupdown = function (context, rect, x, y, type)
    {
   		if (context.swipeupdown_)
        	context.swipeupdown_(context, rect, x, y, type);
	};

    this.pinch = function (context, scale)
    {
   		if (context.pinch_)
        	context.pinch_(context, scale);
	};

    this.pinchend = function(context)
	{
   		if (context.pinchend_)
        	context.pinchend_(context);
	}

    this.pinchstart = function(context, rect, x, y)
	{
   		if (context.pinchstart_)
        	context.pinchstart_(context, rect, x, y);
	}

	this.pressup = function(context)
	{
   		if (context.pressup_)
        	context.pressup_(context);
	}

	this.press = function(context, rect, x, y, shift, ctrl)
	{
		if (context.press_)
        	context.press_(context, rect, x, y, shift, ctrl);
	}

	this.rightclick = function(context, rect, x, y)
	{
   		if (context.rightclick_)
        	context.rightclick_(context, rect, x, y);
	}
};

var linkobj = new makeoption("Links", []);

function getyollplst(k)
{
    var lst = function (k)
    {
		return [
        ];
    };

    var a1 = lst("");
    var a2 = lst("_2");
    var a3 = lst("_3");
    var a4 = lst("_4");
    var a5 = lst("_5");
    var a6 = lst("_6");
    var a7 = lst("_7");
    var a8 = lst("_8");
    var a9 = lst("_9");
    return [...a1,...a2,...a3,...a4,...a5,...a6,...a7,...a8,...a9];
}

var headlst =
[
	new function ()
	{
        this.height = ALIEXTENT;
        this.swipeleftright = function (context, rect, x, y, type)
        {
        };

		this.press = function (context, rect, x, y)
        {
            headobj.set(headobj.current()==0?1:0);
            pageresize();
            _4cnvctx.refresh();
        };

		this.tap = function (context, rect, x, y)
		{
            clearTimeout(_4cnvctx.headtime);

            if (context.page.hitest(x,y))
                menushow(_8cnvctx);
            else if (context.prevpage2.hitest(x,y) ||
                context.prevpage.hitest(x,y))
            {
                _4cnvctx.moveprev();
            }
            else if (context.nextpage2.hitest(x,y) ||
                    context.nextpage.hitest(x,y))
            {
                _4cnvctx.movenext();
            }
            else if (context.option.hitest(x,y))
            {
                menushow(_9cnvctx);
            }
            else if (context.thumbnail.hitest(x,y))
            {
            }

            pageresize();
            _4cnvctx.refresh();
            _4cnvctx.refresheaders();
            addressobj.refresh();
		};

		this.draw = function (context, rect, user, time)
		{
            context.clear()
            context.save()
            context.shadowOffsetX = 1;
            context.shadowOffsetY = 1;
            context.shadowColor = "black"
            var str = url.fullproject();

            context.page = new rectangle()
            context.option = new rectangle()
            context.prevpage = new rectangle()
            context.nextpage = new rectangle()
            context.thumbnail = new rectangle()
            context.prevpage2 = new rectangle()
            context.nextpage2 = new rectangle()

            var k = url.fullproject().split("-");
            var project = k[0];
            var projects = k[1];

            var a = new Layer(
            [
                new Fill(HEADCOLOR),
                new ColA([ALIEXTENT,0,ALIEXTENT,ALIEXTENT,0,ALIEXTENT],
                [
                    new Layer(
                    [
                        new PagePanel(_8cnvctx.enabled?0.125:0.1),
                        new Rectangle(context.page),
                    ]),
                    new Layer(
                    [
                        new Rectangle(context.prevpage2),
                        new Text("white", "right", "middle",0,1,1),
                    ]),
                    new Layer(
                    [
                        new Shrink(new Arrow(270),ARROWBORES,ARROWBORES),
                        new Rectangle(context.prevpage),
                    ]),
                    new Layer(
                    [
                        new Shrink(new Arrow(90),ARROWBORES,ARROWBORES),
                        new Rectangle(context.nextpage),
                    ]),
                    new Layer(
                    [
                        new Rectangle(context.nextpage2),
                        new Text("white", "left", "middle",0,1,1),
                    ]),
                    new Layer(
                    [
                        new OptionPanel(_9cnvctx.enabled?0.125:0.1),
                        new Rectangle(context.option),
                    ])
                ])
           ]);

           a.draw(context, rect, [0,project,0,0,projects,0], time);
           context.restore()
		};
	},
	new function ()
	{
        this.height = ALIEXTENT;
        this.swipeleftright = function (context, rect, x, y, type)
        {
        };

		this.press = function (context, rect, x, y)
        {
            headobj.set(headobj.current()==0?1:0);
            pageresize();
            _4cnvctx.refresh();
        };

		this.tap = function (context, rect, x, y)
		{
            clearTimeout(_4cnvctx.headtime);
            _4cnvctx.refresh();
            addressobj.refresh();
            var n = context.rects.hitest(x,y); 
            if (n != context.rects.length)
            {
                _4cnvctx.setcolumn(n);
                _4cnvctx.refresh();
                _4cnvctx.refresheaders();
            }
            else if (context.prevpage.hitest(x,y) || context.prevpage2.hitest(x,y))
            {
                _4cnvctx.moveprev();
            }
             else if (context.nextpage.hitest(x,y) || context.nextpage2.hitest(x,y))
            {
                _4cnvctx.movenext();
            }
		};

		this.draw = function (context, rect, user, time)
		{
            context.clear()
            context.shadowOffsetX = 1;
            context.shadowOffsetY = 1;
            context.shadowColor = "black"

            context.rects = [];
            context.prevpage = new rectangle()
            context.nextpage = new rectangle()
            context.prevpage2 = new rectangle()
            context.nextpage2 = new rectangle()

            var k = url.fullproject().split("-");
            var project = k[0];
            var projects = k[1];
            var j = Math.max(ALIEXTENT*1.5,23*url.cols);
            var a = new Layer(
            [
                new Fill(HEADCOLOR),
                new ColA([0,6,60,j,60,6,0],
                [
                    new Layer(
                    [
                        new Rectangle(context.prevpage2),
                        new Text("white", "right", "middle",0,1),
                    ]),
                    0,
                    new Layer(
                    [
                        new Shrink(new Arrow(270),ARROWBORES,ARROWBORES),
                        new Rectangle(context.prevpage),
                    ]),
                    new Layer(
                    [
                        0?    
                        new Text("white", "center", "middle",0,1,1):
                            new Col([5,0,5],
                            [
                                0,
                                new DotsA(url.cols,24,
                                    new Layer
                                    ([
                                        new Expand(new Rects(context.rects),0,20),
                                        new CircleA("white","orange"),
                                    ])),
                               0,
                            ]),
                    ]),
                    new Layer(
                    [
                        new Shrink(new Arrow(90),ARROWBORES,ARROWBORES),
                        new Rectangle(context.nextpage),
                    ]),
                    0,
                    new Layer(
                    [
                        new Rectangle(context.nextpage2),
                        new Text("white", "left", "middle",0,1),
                    ]),
                ]),
           ]);

           a.draw(context, rect, [project,0,0,0,0,0,projects], time);
		};
	},
];

var headobj = new makeoption("", headlst);

var footlst =
[
	new function ()
	{
        this.height = ALIEXTENT;
	    this.panstart = function (context, rect, x, y)
	    {
        };

        this.panend = function (context, rect, x, y)
	    {
            _4cnvctx.panning = 0; 
            _4cnvctx.refresh();
            delete _4cnvctx.zoomobj.offset;
            addressobj.refresh()
        };
 	
        this.pan = function (context, rect, x, y, type)
        {
            if (!context.slider.hitest(x,y))
                return;
        
            var b = Math.berp(0,context.slider.width,x);
            var l = Math.lerp(0,_4cnvctx.zoomobj.length(),b);
            var k = panhorz(_4cnvctx.zoomobj, l);
            if (k == -1)
                return;
            if (k == _4cnvctx.zoomobj.anchor())
                return;
            _4cnvctx.zoomobj.set(Math.floor(k));
            contextobj.reset();
        };

		this.press = function (context, rect, x, y)
        {
            pageresize();
            _4cnvctx.refresh();
        };

        this.tap = function (context, rect, x, y)
		{   
            if (context.zoomout.hitest(x,y))
            {
                ico.zoomout.hit(0, _4cnvctx.rect(), window.innerWidth, 0)
            }
            else if (context.zoomin.hitest(x,y))
            {
                ico.zoomin.hit(0, _4cnvctx.rect(), window.innerWidth, 0)
            }
            else if (context.slider.hitest(x,y))
            {
                x = x - context.slider.x
                var zoom = Math.floor(_4cnvctx.zoomobj.length()*(x/context.slider.width))
                _4cnvctx.zoomobj.set(zoom);
                contextobj.reset();
            }

           _4cnvctx.refresh();
            addressobj.refresh()
        };

		this.draw = function (context, rect, user, time)
		{
            context.clear()
            context.shadowOffsetX = 1;
            context.shadowOffsetY = 1;
            context.shadowColor = "black"
            var j = -1;
            if (rect.width > MAXSLIDER)
                j = (rect.width-MAXSLIDER)/2;
            context.zoomout =  new rectangle();
            context.zoomin =  new rectangle();
            context.slider =  new rectangle();
            var we = _4cnvctx.thumbselwidthrat*window.innerWidth;

            var a = new LayerA(
            [
                new Fill(HEADCOLOR),
                new Row([0,NUBHEIGHT],
                [
                    0,
                ]),
                new ColA([j,ALIEXTENT,0,ALIEXTENT,j],
                [
                    0,
                    new Layer(
                    [
                        new ImagePanel(),
                        new Rectangle(context.zoomout)
                    ]),
                    new Col([BEKEXTENT,0,BEKEXTENT],
                    [
                        0,
                        new Row([0,NUBEXTENT,0],
                        [
                            0,
                            new Layer(
                            [
                                new Fill("black"),
                                new CurrentHPanel(new Fill(NUBCOLOR),ALIEXTENT*1.5),
                                new Expand(new Rectangle(context.slider),0,20),
                            ]),
                            0,
                        ]),
                        0
                    ]),
                    new Layer(
                    [
                        new ImagePanel(),
                        new Rectangle(context.zoomin)
                    ]),
                    0,
                ])
            ]);

            a.draw(context, rect, 
            [
                0,
                _4cnvctx.slicesobj,
                [
                    0,
                    ico.zoomout,
                    _4cnvctx.zoomobj,
                    ico.zoomin,
                    0,
                ]
             ], time);
		};
	},
	new function ()
	{
        this.height = ALIEXTENT;
	    this.panstart = function (context, rect, x, y)
	    {
        };

        this.panend = function (context, rect, x, y)
	    {
            _4cnvctx.refresh();
            delete _4cnvctx.thumbheightobj.offset;
            addressobj.refresh()
        };
 	
        this.pan = function (context, rect, x, y, type)
        {
           if (!context.slider.hitest(x,y))
                return;

            x = Math.round5(x-context.slider.x);
            var b = Math.berp(0,context.slider.width,x);
            var l = Math.lerp(0,_4cnvctx.thumbheightobj.length(),b);
            var k = panhorz(_4cnvctx.thumbheightobj, l);
            if (k == -1)
                return;
            if (k == _4cnvctx.thumbheightobj.anchor())
                return;
            _4cnvctx.thumbheightobj.set(Math.floor(k));
            _4cnvctx.refresh();
        };

		this.press = function (context, rect, x, y)
        {
            pageresize();
            _4cnvctx.refresh();
        };

        this.tap = function (context, rect, x, y)
		{  
            if (context.thumbout.hitest(x,y))
            {
                ico.thumbout.hit(0, _4cnvctx.rect(), window.innerWidth, 0)
            }
            else if (context.thumbin.hitest(x,y))
            {
                ico.thumbin.hit(0, _4cnvctx.rect(), window.innerWidth, 0)
            }
            else if (context.slider.hitest(x,y))
            {
                x = x - context.slider.x
                var thumb = Math.floor(_4cnvctx.thumbheightobj.length()*(x/context.slider.width))
                _4cnvctx.thumbheightobj.set(thumb);
                contextobj.reset();
            }
 
            _4cnvctx.refresh();
            addressobj.refresh();
        };

		this.draw = function (context, rect, user, time)
		{
            context.clear()
            context.shadowOffsetX = 1;
            context.shadowOffsetY = 1;
            context.shadowColor = "black"
            var j = -1;
            if (rect.width > MAXSLIDER)
                j = (rect.width-MAXSLIDER)/2;
            context.thumbout =  new rectangle();
            context.thumbin =  new rectangle();
            context.slider =  new rectangle();
            var we = _4cnvctx.thumbselwidthrat*window.innerWidth;

            var a = new LayerA(
            [
                new Fill(HEADCOLOR),
                new Row([0,NUBHEIGHT],
                [
                    0,
                ]),
                    new ColA([j,ALIEXTENT,0,ALIEXTENT,j],
                [
                    0,
                    new Layer(
                    [
                        new ImagePanel(),
                        new Rectangle(context.thumbout)
                    ]),
                    new Col([BEKEXTENT,0,BEKEXTENT],
                    [
                        0,
                        new Row([0,NUBEXTENT,0],
                        [
                            0,
                            new Layer(
                            [
                                new Fill("black"),
                                new CurrentHPanel(new Fill(NUBCOLOR),ALIEXTENT*1.5),
                                new Expand(new Rectangle(context.slider),0,20),
                            ]),
                            0,
                        ]),
                        0
                    ]),
                    new Layer(
                    [
                        new ImagePanel(),
                        new Rectangle(context.thumbin)
                    ]),
                    0,
                ])
            ]);

            a.draw(context, rect, 
            [
                0,
                _4cnvctx.slicesobj,
                [
                    0,
                    ico.thumbout,
                    _4cnvctx.thumbheightobj,
                    ico.thumbin,
                    0,
                ]
            ], time);
		};
	},
];

var footobj = new makeoption("", footlst);
 
function menushow(context)
{
    var enabled = context.enabled;
    _3cnvctx.hide();
    _5cnvctx.hide();
    _6cnvctx.hide();
    _7cnvctx.hide();
    _8cnvctx.hide();
    _9cnvctx.hide();
    context.refresh();
    if (enabled)
        return;

    context.enabled = 1;
    if (context.complete)
    {
        contextobj.resize(context);
    }
    else
    {
        contextobj.resetcontext(context);
        context.complete = 1;
    }
			
    context.refresh();
}

var PagePanel = function (size)
{
    this.draw = function (context, rect, user, time)
    {
        context.save()
        context.shadowOffsetX = 1;
        context.shadowOffsetY = 1;
        context.shadowColor = "black"
        var j = rect.width*size;
        var k = j/2;
        var a = new Layer(
        [
            _8cnvctx.enabled?new Fill("rgba(0,0,0,0.5)"):0,
            new Row( [0, rect.height*0.5, 0],
            [
                0,
                new Col ([0,j,k,j,k,j,0], 
                [ 
                    0, 
                    new Fill("white",1), 
                    0, 
                    new Fill("white",1), 
                    0, 
                    new Fill("white",1), 
                    0, 
                ]),
                0,
            ]),
        ])

        a.draw(context, rect, user, time);
        context.restore()
    }
};

var OptionPanel = function (size)
{
    this.draw = function (context, rect, user, time)
    {
        context.save()
        context.shadowOffsetX = 1;
        context.shadowOffsetY = 1;
        context.shadowColor = "black"
        var j = rect.width*size;
        var k = j/2;
        var a = new Layer(
        [
            _9cnvctx.enabled?new Fill("rgba(0,0,0,0.5)"):0,
            new Col( [0,rect.height*0.5,0],
            [
                0,
                new Row( [0,j,k,j,k,j,0],
                [
                    0, 
                    new Fill("white",1),
                    0, 
                    new Fill("white",1),
                    0, 
                    new Fill("white",1),
                    0
                ]),
                0,
            ]),
        ]);

        a.draw(context, rect, user, time);
        context.restore()
    }
};

window.addEventListener("touchend", function (evt) { });

window.addEventListener("keyup", function (evt)
{
	if (evt.key == "Escape")
	{
        escape();
        evt.preventDefault(); 
        return true;
	}
	else
	{
		var context = _7cnvctx.enabled ? _7cnvctx :
			_8cnvctx.enabled ? _8cnvctx : _9cnvctx.enabled ? _9cnvctx :
				_4cnv.height ? _4cnvctx : _1cnvctx;
		if (context.keyup_)
			return context.keyup_(evt);
	}
});

window.addEventListener("keydown", function (evt)
{
    var context = _7cnvctx.enabled ? _7cnvctx :
        _8cnvctx.enabled ? _8cnvctx : _9cnvctx.enabled ? _9cnvctx :
            _4cnv.height ? _4cnvctx : _1cnvctx;
    if (context.keydown_)
        return context.keydown_(evt);
}, false);

window.addEventListener('message', function(evt)
{
    if (evt.data == "fullscreen")
        screenfull.toggle(IFRAME ? _4cnv : 0);
    else if (evt.data == "help")
        help();
    else if (evt.data == "pantop")
        _4cnvctx.pantop();
    else if (evt.data == "panbottom")
        _4cnvctx.panbottom();
    else if (evt.data == "about")
        about();
    else if (evt.data == "moveprev")
        _4cnvctx.moveprev();
    else if (evt.data == "pinchout")
        _4cnvctx.pinchout();
    else if (evt.data == "pinchin")
        _4cnvctx.pinchin();
    else if (evt.data == "zoommin")
        _4cnvctx.zoommin();
    else if (evt.data == "zoommax")
        _4cnvctx.zoommax();
    else if (evt.data == "movefirst")
        _4cnvctx.movefirst();
    else if (evt.data == "movenext")
        _4cnvctx.movenext();
    else if (evt.data == "movelast")
        _4cnvctx.movelast();
    else if (evt.data == "zoomout")
        ico.zoomout.hit(0, _4cnvctx.rect(), window.innerWidth, 0)
    else if (evt.data == "zoomin")
        ico.zoomin.hit(0, _4cnvctx.rect(), window.innerWidth, 0)
    else if (evt.data == "thumbnail")
        thumbobj.toggle();
    else if (evt.data == "panleft")
        _4cnvctx.panleft();
    else if (evt.data == "panright")
        _4cnvctx.panright();  
    else if (evt.data == "panup")
        _4cnvctx.panup();
    else if (evt.data == "pandown")
        _4cnvctx.pandown();
    else if (evt.data == "swipeup")
        _4cnvctx.swipeup();
    else if (evt.data == "swipedown")
        _4cnvctx.swipedown();

    return true;
});

document.addEventListener('touchmove', function (event) 
{ 
    event.preventDefault(); 
}, { passive: false });

function pageresize()
{
    var h = (thumbobj.current()==1||IFRAME)?0:headobj.getcurrent().height;
    headcnvctx.show(0,0,window.innerWidth, h);
    headham.panel = headobj.getcurrent();
    var h = (thumbobj.current()==1||IFRAME)?0:footobj.getcurrent().height;
    footcnvctx.show(0,window.innerHeight-ALIEXTENT, window.innerWidth, h);
    footham.panel = footobj.getcurrent();
}

var WrapsPanel = function(style, lineheight)
{
    this.draw = function(context, rect, user, time) 
    {
        var k = user.split("\n");
        var yt = lineheight/2;
        for (var n = 0; n < k.length; ++n)
        {
            var a = new WrapPanel("rgba(0,0,0,0.0)", lineheight, yt);
            yt += a.draw(context, rect, k[n], time);
        }

        for (var n = 0; n < k.length; ++n)
        {
            var a = new WrapPanel(style, lineheight, yt);
            rect.y += a.draw(context, rect, k[n], time);
        }

        return k.length*yt;
    }
}

function wrap2(context, rect, str)
{
    var words = str.split(' ');
    var line = '';
    var lines = [];
    for (var n = 0; n < words.length; n++) 
    {
        var test = line + words[n] + ' ';
        var metrics = context.measureText(test);
        if (metrics.width > rect.width) 
        {
            lines.push(line);
            line = words[n] + ' ';
        }
        else 
        {
            line = test;
        }
    }

    lines.push(line);
    return lines;
}

function wrap(context, rect, str)
{
    var words = str.split(' ');
    var line = '';
    var lines = [];
    for (var n = 0; n < words.length; n++) 
    {
        var test = line + words[n] + ' ';
        var metrics = context.measureText(test);
        if (metrics.width > rect.width) 
        {
            lines.push(line);
            line = words[n] + ' ';
        }
        else 
        {
            line = test;
        }
    }

    lines.push(line);
    return lines;
}

var WrapPanel = function(style, lineheight, yt)
{
    this.draw = function(context, rect, user, time) 
    {
        context.font = FONTHEIGHT + "px Archivo Black";
        context.fillStyle = style;
        context.textAlign = "start";
        context.textBaseline = "top";
        var y = rect.y + Math.round((rect.height-yt)/2);
        y += lineheight/2;
        var lines = wrap(context, rect, user);
        for (var n = 0; n < lines.length; n++) 
        {
            var line = lines[n];
            var metrics = context.measureText(line);
            var x = rect.x + (rect.width - metrics.width) / 2;
            context.fillText(line, x, y);
            y += lineheight;
        }

        return lines.length*lineheight;
    }
}

window.onerror = function(message, source, lineno, colno, error) 
{ 
    //window.alert( error+","+lineno+","+console.trace());
};

function help()
{
    var context = _4cnvctx;
    var n = eventlst.findIndex(function(a){return a.name == "describe";})
    setevents(context, eventlst[n])

    context.describe =
  `Reportbase.com is a high-resolution image viewer for full-screen panoramas. It can be integrated into existing applications or viewed stand-alone. 
  Reportbase.com is a flexible image browsing platform.  It is suitable for the most demanding high-resolution tasks, including: topographic maps, drone and satellite photos, maps, action photography, digital art, panoramas, comics and cartoons, portraits, landscapes, cityscapes, infographics, real estate, automobiles, and vintage paintings.  We are building a community of image enthusiasts.  Contact us if your an artist or photographer and interested in creating compelling image viewing experiences.  
  Contact the developers at repba@proton.me. 
        Press or pinch the thumbnail to move or resize it. Pan or tap the thumbnail to rotate the underlying image. Long press anywhere to show/hide the thumbnail (space).  Tap off the thumbnail to zoom in or out.  Pan the image to rotate it any direction. Swipe left or right to move to the next image. Load images from the local computer with drag and drop.`
    context.time = 0;
    context.describeobj.set(0);
    context.refresh()
}

function about()
{
    var context = _4cnvctx;
    var n = eventlst.findIndex(function(a){return a.name == "describe";})
    setevents(context, eventlst[n])
    context.describe =
        [
            "Reportbase.com",
            window.innerWidth > 420 ?  "High Resolution Image Viewer":"Image Viewer",
            "Interactive Panoramas",
            "Fullscreen Slideshows",
            "",
            "Developer",
            "Tom Brinkman",
            "",
            "Contact",
            "repba@proton.me",
            "",
            "Website",
            "https://reportbase.com",
            "",
            "Codepen",
            "https://tiny.one/bondb",
        ];

    context.time = 0;
    context.describeobj.set(0);
    context.refresh()
}

function hidedescribe()
{
    var context = _4cnvctx;
    delete context.describe;
    var n = eventlst.findIndex(function(a){return a.name == "_4cnvctx";})
    setevents(context, eventlst[n])
    context.refresh();
}

function load()
{
    promptFile().then(function(files) { dropfiles(files); });
}

function original()
{
    var path = photo.image.original;
    window.open(path, '_blank');
}

function screenshot()
{
    var k = document.createElement('canvas');
    var link = document.createElement("a");
    link.href = _4cnvctx.canvas.toDataURL('image/jpg');
    link.download = url.project + ".jpg";
    link.click();
}

function fullscreen()
{
    screenfull.toggle(IFRAME ? _4cnv : 0);
}

function project()
{
    var slice = this; 
    var j = url.movepage?slice.index:Math.floor(slice.index/url.cols) 
    url.project = j.pad(4);
    _4cnvctx.slicemiddle.col = url.movepage?url.col:slice.index%url.cols
    var s = addressobj.full();
    window.open(s,"_self");
}

var scale = 'scale(1)';
document.body.style.webkitTransform =  scale;    // Chrome, Opera, Safari
 document.body.style.msTransform =   scale;       // IE 9
 document.body.style.transform = scale;     // General
