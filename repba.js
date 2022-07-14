/* += 
Copyright 2017 Tom Brinkman
http://www.reportbase.com 
*/

const CACHEDEBUG = 0;
const MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const SAFARI = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const FIREFOX = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
const IFRAME = window !== window.parent;
const MFRAME = MOBILE && IFRAME;
const MAXVIRTUALWIDTH = SAFARI?5760:5760*2; 
const DRAWCOUNT = 10;
const CANVASCOUNT = 10;
const SWIPETIME = 60;
const TIMERELOAD = 30000;
const REFRESHEADER = 1000;
const MAXSLIDER = 720;
const POSITYSPACE = 50;
const THUMBLINE = 1;
const THUMBLINEIN = 2.5;
const THUMBLINEOUT = 4.0;
const JULIETIME = 100; 
const GUIDEHEIGHT = 60; 
const DELAY = 10000000;
const HNUB = 9;
const YNUB = 6;
const BNUB = 5;
const THUMBORDER = 16;
const TABWIDTH = 40;
const TABHEIGHT = 40;
const HOST = "Local";
const OPTIONSIZE = 100;
const ALIEXTENT = 60;
const BEKEXTENT = 20;
const NUBEXTENT = 8;
const ARROWBORES = 20;
const NUBCOLOR = "white";
const CYLRADIUS = 65.45;
const VIRTCONST = 0.8;
const DELAYCENTER = 3.926;
const TIMEOBJ = 3926;
const FONTHEIGHT = 16;
const BUTTONHEIGHT = 38; 
const ROWHEIGHT = FONTHEIGHT*2;
const QUALITY = 0.65;
const TIMEMAIN = 18;
const ZOOMADJ = 0.01;
const PINCHRANGE = "0.35-1.1";
const HEIGHTRANGE = "0.10-1.0";
const PANXRANGE = "5-20";
const PANYRANGE = "1.0-6.0";
const CANVASMAX = 30;
const MAXCANVASWIDTH = 32767;
const MAXCANVASIZE = SAFARI?16777216:32777216;
const MAXVIRTUALSIZE = SAFARI?12000000:24000000;
const MENUCOLOR = "rgba(0,0,0,0.50)";
const HEADCOLOR = "rgba(0,0,0,0.40)";
const HEADLIGHT = "rgba(0,0,0,0.50)";
const DARKHEADCOLOR = "rgba(0,0,0,0.8)";
const ARROWSELECT = "rgba(255,125,0,0.5)";
const ARROWBACK = "rgba(0,0,0,0.25)"
const THUMBFILL = "rgba(0,0,0,0.25)"
const THUMBSTROKE = "rgb(255,255,235)"
const SLIDELST = [0,27.5,50,72.5,100];

dropobj = {};
globalobj = {};
localobj = {}

var url = new URL(window.location.href);
url.group = url.searchParams.has("u") ? url.searchParams.get("u") : "reportbase";
url.projects = url.searchParams.has("m") ? url.searchParams.get("m") : "0000";
var filename = url.searchParams.get("p");
filename = filename.split(".");
if (filename.length == 3)
{
    url.path = filename[0];
    url.project = filename[1]; 
    url.extension = filename[2] 
}
else
{
    url.path = filename[0];
    url.project = "0000"; 
    url.extension = "webp"; 
}

url.fullpath = function() { return url.path + "." + projectobj.current().pad(4) + "." + url.extension; }

globalobj.template = url.searchParams.has("t") ? url.searchParams.get("t") : "";
localobj.hide = 0;
localobj.picture = 1;
globalobj.divider = "rgba(0,0,0,0)";
globalobj.timebegin = TIMEOBJ/2;
globalobj.autostart = 0;
globalobj.autopage = 1500;
globalobj.position = 1;
globalobj.cols = 1;
globalobj.rows = 5;
globalobj.vpan = 1;
globalobj.trait = 75;
globalobj.scape = 100;
globalobj.panybegin = 50;
globalobj.panxbegin = 50;
globalobj.pinchbegin = 50;
globalobj.maxheight = 0;
globalobj.zoombegin = MOBILE?60:40;
globalobj.rowreset = 0;
globalobj.rowbegin = window.innerHeight/2;
globalobj.slidecount = TIMEOBJ/window.innerWidth;
globalobj.slidereduce = globalobj.slidecount/300;
if (globalobj.template == "comic")
{
    globalobj.position = 7;
    globalobj.rowbegin = 0;
    globalobj.rowreset = 1;
    globalobj.zoombegin = 60;
}
else if (globalobj.template == "wide")
{
    globalobj.position = 7;
    globalobj.maxheight = 50;
    globalobj.rows = 1;
    globalobj.vpan = 0;
    globalobj.trait = 100;
    globalobj.scape = 100;
    globalobj.zoombegin = 0;
    globalobj.autostart = 1;
    globalobj.autopage = 5000;
}
else if (globalobj.template == "5x1")
{
    globalobj.position = 5;
    globalobj.rows = 5;
    globalobj.cols = 1;
    localobj.hide = 1;
    globalobj.trait = 50;
    globalobj.scape = 100;
}
else if (globalobj.template == "portrait")
{
    globalobj.position = 7;
    globalobj.trait = 75;
    globalobj.scape = 75;
    globalobj.autostart = 1;
    globalobj.autopage = 2000;
    globalobj.autopage = 5000;
}
else if (globalobj.template == "landscape")
{
    globalobj.position = 7;
    globalobj.trait = 100;
    globalobj.scape = 100;
    globalobj.autostart = 1;
    globalobj.autopage = 2000;
    globalobj.autopage = 5000;
}
else if (globalobj.template == "tall")
{
    globalobj.position = 5;
    globalobj.rows = 1;
    globalobj.cols = 1;
    localobj.hide = 0;
    globalobj.autostart = 1;
    globalobj.autopage = 5000;
}
else if (globalobj.template == "1x5")
{
    globalobj.position = 5;
    globalobj.cols = 1;
    globalobj.rows = 5;
    localobj.hide = 1;
    localobj.picture = 0;
    globalobj.trait = 25;
    globalobj.scape = 100;
    globalobj.zoombegin = 0;
    globalobj.autostart = 1;
    globalobj.autopage = 4000;
}

else if (globalobj.template == "7x1" || globalobj.template == "7x1a")
{
    globalobj.position = 7;
    globalobj.cols = 7;
    localobj.hide = 0;
    localobj.picture = 0;
    globalobj.trait = 75;
    globalobj.scape = 35;
    globalobj.autostart = globalobj.template == "7x1" ? 1 : 0;
    globalobj.autopage = 1500;
    globalobj.scape = 100;
    globalobj.autopage = 5000;
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
photo.cached = 0;

var slicelst = [];
var j = 400;
for (var n = 0; n < 1000; n++)
{
    slicelst[n] = {slices: j*100, delay: CYLRADIUS*(60/j)}
    j--;
}

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
     
    this.print = function()
    {
        return (this.current()+1).toFixed(0)  +"-"+ this.length().toFixed(0)
    };

    this.split = function(k,j,size)
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
        var j = this.length();
        this.data_ = lst;
        this.set(k);
        this.begin = begin;
        this.end = end;
    }
   
    this.berp = function () 
    {
        if (this.length() == 1)
            return 0;
        return Math.berp(0,this.length()-1,this.current());
    };
 
    this.lerp = function () 
    {
        if (this.length() == 1)
            return 0;
        return Math.lerp(0,this.length()-1,this.current()/this.length());
    };

    this.rotate = function (factor) 
    { 
        var k = this.current()+factor;
        if (k >= this.length())
            k = k-this.length();
        else if (k < 0)
            k = this.length()+k;
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

    this.sett = function (p) 
    {
        var a = p*this.length();
        this.setcurrent(a); 
        this.setanchor(a); 
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
        
var contextlst = [_1cnvctx,_2cnvctx,_3cnvctx,_4cnvctx,_5cnvctx,_6cnvctx,_7cnvctx,_8cnvctx,_9cnvctx];

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

var Help = function()
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
                        var k = wrap2(context, rect, j[n].clean()); 
                        lst2.push(...k);
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
        context.prevhelp = new rectangle()
        context.nexthelp = new rectangle()
        context.nexthelp2 = new rectangle()
        context.prevhelp2 = new rectangle()
        context.hidehelp = new rectangle()

        var a = new Col([BEKEXTENT,0,BEKEXTENT],
            [
                0,
                new RowA([headcnv.height+BEKEXTENT,ALIEXTENT,0,ALIEXTENT,footcnv.height+BEKEXTENT],
                [
                    0,
                    new Layer(
                    [
                        new Fill("black"),
                        new Rectangle(context.hidehelp),
                        new ColA([ALIEXTENT,0,ALIEXTENT],
                        [
                            0,
                            new Text("white", "center", "middle",0,1,1),
                            new Text("white", "center", "middle",0,1,1),
                        ]), 
                    ]),
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
                    new Layer(
                    [
                        new Fill("black"),
                        new ColA([0,ALIEXTENT,ALIEXTENT,0],
                        [
                            new Layer(
                            [
                                new Text("white", "right", "middle",0,1,1),
                                new Rectangle(context.prevhelp2),
                            ]),
                            new Layer(
                            [
                                new Shrink(new Arrow(270),ARROWBORES,ARROWBORES),
                                new Rectangle(context.prevhelp),
                            ]),
                            new Layer(
                            [
                                new Shrink(new Arrow(90),ARROWBORES,ARROWBORES),
                                new Rectangle(context.nexthelp),
                            ]),
                            new Layer(
                            [
                                new Text("white", "left", "middle",0,1,1),
                                new Rectangle(context.nexthelp2),
                            ]),
                        ])
                    ]),
                    0
                ]),
                0,
            ]);

        a.draw(context, rect, 
            [
                0, 
                [
                    0,
                    "reportbase.com",
                    '\u{2716}'
                ],
                [
                    0, 
                    context.describe, 
                    context.describeobj
                ],
                [
                    (helpobj.current()+1)+"",
                    0,
                    0,
                    (helpobj.length())+"",
                ],
                0
            ],
            time);
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
addressobj.body = function ()
{
    var context = _4cnvctx;
    var out = "&m="+(projectobj.length()-1);
    if (globalobj.template)
        out += "&t="+globalobj.template;
    return out;
}

 addressobj.full = function ()
{
    var out ="https://reportbase.com/home.html?p="+url.fullpath();
    out += addressobj.body();
    return out;
};

CanvasRenderingContext2D.prototype.moveup = function(p)
{
    if (projectobj.length()==1)
        return;

    var context = this;
    var k = rowobj.berp()*100-1;
    var index = SLIDELST.findLastIndex(a=>{return a < k;})
    if (index == -1)
    {
        context.hidehead = context.hidehead?0:1;
        pageresize();
        return;
    }

    var j = (SLIDELST[index]/100)*rowobj.length();
    rowobj.set(j);
    contextobj.reset();
}

CanvasRenderingContext2D.prototype.getx = function(k)
{
    var slice = this.sliceobj.data_[k];
    var time = this.timeobj.getcurrent()/1000;
    var j = time + slice.time;
    var b = Math.tan(j*VIRTCONST);
    return Math.berp(-1, 1, b) * this.virtualpinch-this.virtualeft;
}

CanvasRenderingContext2D.prototype.getslicefirst = function()
{
    let mid, low = 0, high = this.sliceobj.data_.length;
    while (low < high) 
    {
        mid = low + high >>> 1; 
        var x = this.getx(mid);
        if (x > 0) 
            high = mid;
        else 
            low = mid + 1;
    }

    return mid;
}

CanvasRenderingContext2D.prototype.movedown = function(p)
{
    if (projectobj.length()==1)
        return;

    var context = this;
    var k = rowobj.berp()*100;
    var index = SLIDELST.findIndex(a=>{return a > k;})
    if (index == -1)
    {
        context.hidehead = context.hidehead?0:1;
        pageresize();
        return;
    }

    var j = (SLIDELST[index]/100)*rowobj.length();
    rowobj.set(j);
    contextobj.reset();
}

CanvasRenderingContext2D.prototype.movepage = function(j)
{
    _4cnvctx.newimage = j;
    _4cnvctx.swipetype = j == -1 ? "swiperight" : "swipeleft";
    
    clearTimeout(globalobj.move);
    globalobj.move = setTimeout(function()
    {
        if (_4cnvctx.setcolumncomplete)
        {
            delete photo.cached;
            delete photo.image;
            _4cnvctx.slidecomplete = 0;
            _4cnvctx.setcolumncomplete = 0;
            projectobj.rotate(j);
            headobj.getcurrent().draw(headcnvctx, headcnvctx.rect(), 0);
            if (globalobj.rowreset)
                rowobj.set(globalobj.rowbegin);
            _4cnvctx.timeobj.set(globalobj.timebegin);
            var str = addressobj.full();
            history.replaceState(0, document.title, str);
            location.reload();
        }
    }, 100);
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

/*
CanvasRenderingContext2D.prototype.swipehard = function(m)
{
    var j = window.innerWidth/this.virtualwidth;
    var e = (j*this.timeobj.length())/8;
    e *= m?1:-1;
    this.timeobj.rotate(e);
}
*/

CanvasRenderingContext2D.prototype.panimage = function (less,x,y)
{
    this.timeobj.rotate(less ? this.rvalue : -this.rvalue);
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
    ham.get('swipe').set({ velocity: 0.40});//30
	ham.get('swipe').set({ threshold: 10 });//10
	ham.get('press').set({ time: 350 });
	ham.get('pan').set({ threshold: 10 });
	ham.get('pinch').set({ enable: false });	

	ham.on("pinch", function (evt)
	{
		evt.preventDefault();
		var x = evt.center.x;
		var y = evt.center.y;
		if (typeof (ham.panel.pinch) == "function")
			ham.panel.pinch(context, evt.scale);

		context.pinchblock = 1;
		clearTimeout(globalobj.pinch);
		globalobj.pinch = setTimeout(function() { context.pinchblock = 0; }, 400);
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
            ham.panel.swipeleftright(context, new rectangle(0, 0, ham.element.width, ham.element.height), x, y, evt);
    });	
    
    ham.on("swipeup swipedown", function (evt)
    {
        if ((new Date() - ham.panstart) > 200)
            return;
   	    evt.preventDefault();
        var x = evt.center.x - evt.target.offsetLeft;
        var y = evt.center.y - evt.target.offsetTop;
        if (typeof (ham.panel.swipeupdown) == "function")
            ham.panel.swipeupdown(context, new rectangle(0, 0, ham.element.width, ham.element.height), x, y, evt);
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

    ham.element.addEventListener('dblclick', function(evt) 
    {
   	    evt.preventDefault();
        var x = evt.x;
        var y = evt.y;
        if (typeof (ham.panel.dblclick) !== "function")
            return;
        ham.panel.dblclick(context, x, y);
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
_4ham.get('pinch').set({ enable: true });	
_8ham.get('swipe').set({ velocity: 0.80});//30
_8ham.get('swipe').set({ threshold: 30 });//10
_9ham.get("swipe").set({ direction: Hammer.DIRECTION_NONE });

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
        var isthumbrect = thumbobj.current()==0 && (thumb || positobj.getcurrent() == cell);
        if (isthumbrect)
        {
            var obj = heightobj.getcurrent();
            var k = obj.current()+1;
            obj.set(k);
            context.refresh();
        } 
        else
        {
            rowobj.add(-1);
            contextobj.reset();
        }
	},
 	down: function (context, x, y, ctrl, shift)
    {
        var cell = (context.grid? context.grid.hitest(x,y) : -1); 
        var thumb = context.thumbrect && context.thumbrect.hitest(x,y);
        var isthumbrect = thumbobj.current()==0 && (thumb || positobj.getcurrent() == cell);
        if (isthumbrect)
        {
            var obj = heightobj.getcurrent();
            var k = obj.current()-1;
            obj.set(k);
            context.refresh();
        }
        else
        {
            rowobj.add(1);
            contextobj.reset();
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
        if (!localobj.hide && context.isthumbrect)
        {
            var obj = heightobj.getcurrent();
            var data = obj.data_; 
            var k = Math.clamp(data[0], data[data.length-1], scale*context.heightsave);
            var j = Math.berp(data[0], data[data.length-1], k);
            var e = Math.lerp(0,obj.length(),j)/100;
            var f = Math.floor(obj.length()*e); 
            obj.set(f);
        }
        else
        {
            var obj = pinchobj; 
            var k = Math.clamp(obj.begin, obj.end,scale*context.pinchsave);
            var j = Math.berp(obj.begin, obj.end,k);
            var e = Math.lerp(0,obj.length(),j)/100;
            var f = Math.floor(obj.length()*e); 
            obj.set(f);
        }

        context.refresh();
    },
    pinchend: function (context)
    {
        clearTimeout(globalobj.pinch);
        globalobj.pinch = setTimeout(function()
            {
                delete photo.cached;
                context.pinching = 0;  
                context.refresh();
            }, 200);

        context.refresh();
        pageresize();
    }, 
    pinchstart: function (context, rect, x, y) 
    {
        slideoff();
        context.pinching = 1;
        context.isthumbrect = 0;
        if (thumbobj.current() == 0)
        {
            var isthumbrect = context.thumbrect && context.thumbrect.hitest(x,y);
            var n = context.grid ? context.grid.hitest(x,y) : 4; 
            context.isthumbrect = isthumbrect || n == positobj.current();
        }

        context.heightsave = heightobj.getcurrent().getcurrent()
        context.pinchsave = pinchobj.getcurrent()
        pageresize();
        context.refresh();
    },
},
];

var rowobj = new makeoption("ROW", window.innerHeight);
rowobj.set(window.innerHeight/2);
var pinchobj = new makeoption("PINCH", pinchlst);
var panxobj = new makeoption("PANX", OPTIONSIZE); 
var panyobj = new makeoption("PANY", OPTIONSIZE); 
var zoomobj = new makeoption("ZOOM", OPTIONSIZE); 
var traitobj = new makeoption("TRAIT", OPTIONSIZE); 
var scapeobj = new makeoption("SCAPE", OPTIONSIZE); 
var heightobj = new makeoption("HEIGHT", [traitobj,scapeobj]); 

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
    delete photo.cached;
    delete photo.image;
    _4cnvctx.setcolumncomplete = 0;
    globalobj.promptedfile = URL.createObjectURL(files[0]);   
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
	panend: function (context, rect, x, y) { }
},
{
    name: "MENU",
    updown: function (context, rect, x, y, type)
    {
        var j = Math.max(context.virtualheight,rect.height);
        var s = context.timeobj.length()/j;
        var k = 6*s;
        context.timeobj.rotate(type=="pandown" ? k : -k);
	},
 	leftright: function (context, rect, x, y, type) { },
	pan: function (context, rect, x, y, type) { },
    enabled : function() { return 1; },
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

        context.pantype = type;
        if (!globalobj.vpan)
            y = rowobj.getcurrent()

        context.x7 = context.x6;
        context.x6 = context.x5;
        context.x5 = context.x4;
        context.x4 = context.x3;
        context.x3 = context.x2;
        context.x2 = context.x1;
        context.x1 = x;
        context.y7 = context.y6;
        context.y6 = context.y5;
        context.y5 = context.y4;
        context.y4 = context.y3;
        context.y3 = context.y2;
        context.y2 = context.y1;
        context.y1 = y;
        if (!context.x1 || !context.x2 || !context.x3 || 
            !context.x4 || !context.x5 || !context.x6 || !context.x7)
            return;
        var k = 7+6+5+4+3+2+1;
        x = (context.x1*7+context.x2*6+context.x3*5+context.x4*4+context.x5*3+context.x6*2+context.x7*1)/k;
        y = (context.y1*7+context.y2*6+context.y3*5+context.y4*4+context.y5*3+context.y6*2+context.y7*1)/k;

        if (context.isthumbrect)
        {
            context.hithumb(x, globalobj.vpan?y:undefined);
        }
        else if (type == "panleft" || type == "panright")
        {
            context.panimage(type=="panright",x,y);
        }
        else if (type == "panup" || type == "pandown")
        {
            if (globalobj.vpan && zoomobj.getcurrent() > 0)
            {
                var h = rect.height*(1-zoomobj.getcurrent())*panyobj.getcurrent();
                y = (y/rect.height)*h;
                var k = panvert(rowobj, h-y);
                if (k == -1)
                    return;
                if (k == rowobj.anchor())
                    return;
                rowobj.set(k);
                contextobj.reset();
            }
            else
            {
                context.panimage(type=="panup",(x/rect.width)*rect.height,(y/rect.height)*rect.width);
            }
        }
    },
	panstart: function (context, rect, x, y)
	{
        slideoff();
        context.x1 = context.x2 = context.x3 = 
        context.x4 = context.x5 = context.x6 = context.x7 = 
        context.y1 = context.y2 = context.y3 = context.y4 = 
        context.y5 = context.y6 = context.y7 = 0;

        context.hidepicture = 0;
        context.panning = 1;
        context.refresh();
        context.isthumbrect = context.thumbrect && context.thumbrect.hitest(x,y);
    },
    panend: function (context, rect, x, y)
	{
        if (context.drawcount++ > DRAWCOUNT)
            location.reload();
        contextobj.reset();
        context.pantype = 0;
        context.panning = 0;  
        context.refresh();
        delete zoomobj.offset;
        delete rowobj.offset;
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
            helpobj.getcurrent().index = k;
            context.describeobj.set(k);
            context.refresh();
        }
    },
	panstart: function (context, rect, x, y)
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
        if (localobj.hide)
            return;
        var n = context.grid.hitest(x,y); 
        positobj.set(n);
        context.refresh();
    }
},
];
  
var swipelst =
[
{
    name: "DEFAULT",
    swipeleftright: function (context, rect, x, y, evt)
    {    
    },
    swipeupdown: function (context, rect, x, y, evt)
    {
    },
},
{
    name: "MENU",
    swipeleftright: function (context, rect, x, y, evt)
    {    
        context.swipetype = evt.type;
    },
    swipeupdown: function (context, rect, x, y, evt)
    {
        context.swipetype = evt.type;
        context.slideshow = 25;
        context.refresh();
    },
},
{
    name: "BOSS",
    swipeleftright: function (context, rect, x, y, evt)
    {
        setTimeout(function()
        {
            slideoff();
            var isthumbrect = context.thumbrect && context.thumbrect.hitest(x,y);
            if (isthumbrect)
                context.swipetype = evt.type == "swipeleft"?"swiperight":"swipeleft";
            else
                context.swipetype = evt.type;
            evt.preventDefault();
            context.slideshow = globalobj.slidecount;
            context.refresh();
        }, SWIPETIME);
    },

    swipeupdown: function (context, rect, x, y, evt)
    {
        slideoff();
        if (globalobj.vpan && zoomobj.current() > 0)
            return;

        setTimeout(function()
        {
            var isthumbrect = context.thumbrect && context.thumbrect.hitest(x,y);
            if (isthumbrect)
                context.swipetype = evt.type == "swipeup"?"swipeleft":"swiperight";
            else
                context.swipetype = evt.type == "swipeup"?"swiperight":"swipeleft";
            evt.preventDefault();
            context.slideshow = globalobj.slidecount;
            context.refresh();
        }, SWIPETIME);
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
        if (evt.key == "PageUp" || evt.key == "ArrowUp" || evt.key == "k" )
        {
            var k = context.describeobj.current()-1;
            context.describeobj.set(k);
            context.refresh();
            evt.preventDefault();
        }
        else if (evt.key == "PageDown" || evt.key == "ArrowDown" || evt.key == "j" )
        {
            var k = context.describeobj.current()+1;
            context.describeobj.set(k);
            context.refresh();
            evt.preventDefault();
        }
	}
},
{
	name: "BOSS",
	keyup: function (evt)
	{
        _4cnvctx.ctrlhit = 0;
        _4cnvctx.shifthit = 0;
	},
	keydown: function (evt)
	{
		var context = _4cnvctx;
		var rect = context.rect();

        if (evt.ctrlKey)
            context.ctrlhit = 1;
        if (evt.shiftKey)
            context.shifthit = 1;
        
        if (evt.key == "t")
        {
            localobj.picture = localobj.picture?0:1; 
            _4cnvctx.refresh()            
            evt.preventDefault();
        }
        else if (evt.key == "f")
        {
            screenfull.toggle(IFRAME ? _4cnv : 0);
            context.refresh();
            evt.preventDefault();
        }
        else if (evt.key == " ")//space
        {
            localobj.hide = localobj.hide?0:1;
            pageresize();
            context.refresh();
            evt.preventDefault();
        }
        else if (evt.key == "Tab")
        {
            tab();
            evt.preventDefault();
        }
        else if (evt.key == "b")
        {
            promptFile().then(function(files) { dropfiles(files); });
            evt.preventDefault();
        }
        else if (evt.key == "-" || evt.key == "[")
        {
            pageresize();
            zoomobj.add(-5);
            contextobj.reset();
            evt.preventDefault();
        }
        else if (evt.key == "=" || evt.key == "]" || evt.key == "+")
        {
            pageresize();
            zoomobj.add(5);
            contextobj.reset();
            evt.preventDefault();
        }
         else if (evt.key == "ArrowLeft" || evt.key == "h")
        {
            if (context.ctrlhit)
                context.movepage(-1)
            else
                context.timeobj.rotate(context.rvalue);
            evt.preventDefault();
        }
        else if (evt.key == "ArrowRight" || evt.key == "l")
        {
            if (context.ctrlhit)
                context.movepage(1)
            else
                context.timeobj.rotate(-context.rvalue);
            evt.preventDefault();
        }
        else if (evt.key == "ArrowUp" || evt.key == "k")
        {
            if (context.ctrlhit)
                rowobj.set(0);
            else
                rowobj.add(-1);

            contextobj.reset();
            evt.preventDefault();
        }
        else if (evt.key == "ArrowDown" || evt.key == "j" )
        {
            if (context.ctrlhit)
                rowobj.set(rowobj.length()-1);
            else
                rowobj.add(1);

            contextobj.reset();
            evt.preventDefault();
        }
        else if (evt.key == "Backspace")
        {
            context.movepage(-1)
            evt.preventDefault();
        }
        else if (evt.key == "Enter")
        {
            context.movepage(1)
            evt.preventDefault();
        }
        else if (evt.key == "Pageup" || evt.key == "o")
        {
            rowobj.add(-context.thumbselect[0].height);
            contextobj.reset();
            evt.preventDefault();
        }
        else if (evt.key == "Pagedown" || evt.key == "p")
        {
            rowobj.add(context.thumbselect[0].height);
            contextobj.reset();
            evt.preventDefault();
        }
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

		if (evt.key == "ArrowUp" || evt.key == "ArrowDown")
		{
            var s = Math.min(window.innerHeight,context.visibles.length*BUTTONHEIGHT);
            var e = (s/context.virtualheight)*context.timeobj.length();
            var k = e*0.05;
            context.timeobj.rotate(evt.key == "ArrowUp" ? k : -k);
		}
 	}
},
];

CanvasRenderingContext2D.prototype.togglepicture = function()
{
    this.hidehead = 0;
    localobj.picture = localobj.picture?0:1; 
    this.refresh()            
}

CanvasRenderingContext2D.prototype.hithumb = function(x,y)
{
    var rect = this.thumbrect;
    var c = (x-rect.x) % rect.width; 
    var b = c/rect.width;
    var e = this.sliceobj.length();
    var m = (1-b)*e;
    var j = DELAYCENTER/e;
    var time = j*m;
    var k = time % DELAYCENTER;
    var e = this.timeobj.length()*(k/DELAYCENTER);
    this.timeobj.set(e);
    if (typeof y != "undefined")
    {
        var b = (y-rect.y)/rect.height;
        var e = b*rowobj.length();
        rowobj.set(e);
    }

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
        if (
            (context.prevhelp && context.prevhelp.hitest(x,y)) ||
            (context.prevhelp2 && context.prevhelp2.hitest(x,y)) )
        {
            helpobj.rotate(-1);
            context.refresh();
            helpobj.getcurrent().draw(_4cnvctx, _4cnvctx.rect(), 0, 0);
        }
        else if (
            (context.nexthelp && context.nexthelp.hitest(x,y)) ||
            (context.nexthelp2 && context.nexthelp2.hitest(x,y)) )
        {
            helpobj.rotate(1);
            context.refresh();
            helpobj.getcurrent().draw(_4cnvctx, _4cnvctx.rect(), 0, 0);
        }
        else if (context.hidehelp && context.hidehelp.hitest(x,y))
        {
            helpobj.hide();
        }
	}
},
{
	name: "BOSS",
	tap: function (context, rect, x, y, shift, ctrl)
	{
        if (menuvisible())
        {
            menuhide();
            return;
        }
  
        slideoff();
        context.refresh();

        if (context.movetoprect && context.movetoprect.hitest(x,y))
        {
            context.moveup(1);
        }
        else if (context.movebottomrect && context.movebottomrect.hitest(x,y))
        {
            context.movedown(1);
        }
        else if (context.menurect && context.menurect.hitest(x,y))
        {
            menushow(_8cnvctx);
        }
        else if (context.moveprevrect && context.moveprevrect.hitest(x,y))
        {
            context.movepage(-1);
            context.refresh();
        }
        else if (context.movenextrect && context.movenextrect.hitest(x,y))
        {
            context.movepage(1)
            context.refresh();
        }
        else if (context.aboutrect && context.aboutrect.hitest(x,y))
        {
            helpobj.getcurrent().draw(_4cnvctx, _4cnvctx.rect(), 0, 0);
        }
        else if (!SAFARI && context.fullscreen && context.fullscreen.hitest(x,y))
        {
            screenfull.toggle(IFRAME ? _4cnv : 0);
            context.refresh();
        }
        else if (context.thumbrect && context.thumbrect.hitest(x,y))
        {
            context.hithumb(x,y);
            context.refresh();
        }
        else if (context.thumbrect && context.thumbrect.hitest(x,y))
        {
            context.hithumb(x,y);
        }
        else if (context.zoominrect && context.zoominrect.hitest(x,y))
        {
            zoomobj.add(-1);
            contextobj.reset();
        }
        else if (context.zoomoutrect && context.zoomoutrect.hitest(x,y))
        {
            zoomobj.add(1);
            contextobj.reset();
        }
        else if (localobj.hide)
        {
            context.hidehead = context.hidehead?0:1;
            pageresize();
            context.refresh();
        }
        else
        {
        }

        pageresize();
        context.refresh();
    }
},
{
    name: "MENU",
    tap: function (context, rect, x, y)
    {
		var k = getmenufrompoint(context, x, y);
		if (k == -1)
            return;

		var slice = context.sliceobj.data()[k];
		slice.tap = 1;
        context.refresh();
        setTimeout(function () 
        { 
            slice.func(); 
            slice.tap = 0;
            context.refresh();
        }, JULIETIME*5);
    },
},
];

ico = {};

ico.zoomin = new Image();
ico.zoomin.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAADK0lEQVRIS7WXWYiOURjH57VknzIXiiwXKBRXLpSMC9OIEDEhk5KdBs0wzQUxSVlmQskSRU0ulKWIUq4MTYkpe1kKRZIt+zqf3//rvF+fd87yynyn/p2v8yz/5zzvc55zvqjIMzKZTDfEvcBYgwHMGfACXAM3wccoir77/NhkkW0Rwi6sTwSLwDzQ2eH4K+snwFHQQgA/0wbQjhjSYoz3GMIeKR0pAJFvhPxdGpu/iCHti9EVMCqNsUXnKmuTIf8css8RQ6rdXf8P0pirGeLSfyHej/LKgMEn5ApWBecbDZBv8Clkd8xuxzFdAEq1a9xGsB38ApsDmVGVj4f8hstZBGlX47A6sIs6HO0wgVYyNwX0m9Bf6CNWFWs3gz2OfiNbh6N9hniKyZCP+w7C6dg8sSlpx0MRPHJ4UMp0NttALU4OGeJy5otA31wZU6NJjvcsVGBzyUU8G8FJi/A+ayq410DdqhUnDw1xf+YyoMBKgD7TcIuPSmyOu4hVySLIHyJahdFBm1FyjazNZO2MRXdFnKWkTKlezqKNYD1GjSmJl6B32KK7DB+29SIRT8XgvMXoi8nEM5Pqyzi5ZVI9hLkCqFUOBHUWe2VtPjbq5e2GiFXNT1PsrBonuw3xNOZzAZtXyOdg0+wi7o1APXaMx5GO0xqcZGuBYOOq9nG3IizH5o2LuBOCGrAzsIN6nGwxxKuZs2faMXT89qLvbEpxy9RtdBboTLuGzmwD0LneChSwa3xAMBJiPRisI/92UlNXL/Y5DCQlJ37MrxkQ30tDrFfGAbA0rfeAnh4Eu0AjAfxI6iYfAt1RqAe1HUSuotQdvxjyu/k+bU8f7XwuUFPpkzKAb+ipnY526GvHut2yx1HD+tiTgCPTj2kT0JnVDdYT6BGooQJT81ARqVXqflYj0cUxyBPsKWRrCeC5kzg2JgClXw+FYUAXgsZboB3qZZn7fujq+KjyfX71pisLEnuit4og1zU4KWC3oBDEyspLoHvaNY50OLGY2PUsptMe4m2FIpbfY8D25tKtNaIgxGbXqnKR539vHbsqCrIwqY5TTMrVByYA/enTSVDhPYC47Q+jAwjFRbnDLAAAAABJRU5ErkJggg==";

ico.zoomout = new Image();
ico.zoomout.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAfCAYAAAAfrhY5AAAC5klEQVRIS7WWW4hNYRTHbfdcyiVJIaV4oimEEikphpKIaHJPeZAmGQmlSLkUDx4QphAeRpM4yYtb8kAjXqQYSi4JCRkS2++vc07HPuv7vr3H2av+nbO/dfmvb+9vrW9FXTwSx3EP1L3BODAZjCw+f+T3MbgF3oPvURT99sWydJG1CKnWJ4KlYDUY4Al8H90xcJkE3mRJoIocYhFtAevBoAzB7mG7mwQupfX5hxzi4TieArPSBkjYfeF5BwkcTuNfJod4MA7n/4O4km8NCZwMJfCXHOJu/OwBTSGHDPo6Enjosy+RT8XoGuiXIXjItA3yCV7yYjkdwWhdKFpGfYcOLQmcdvlFkA9E+Q50zxg8jXkL5It85HNRXkkTqRM2+uYLSaDd8tXOd6HY6QisV3cDvABWQ1JXmwbGO/xfs74ccsWoEpGrrlcaul+s7cNxW2jHxLiLzRTD7jNrK4jR6iI/i2KZodSuN+Go1ukVyI9jsNYw+qqNEaPFRa5utNERXS1T9f8KuF67drwX9Ddi6NJpgPyqi1wl5tpdjO4b0CewRPpeQDefJU9ZXAJ5m4t8NAoZ5SE3CTofcvX8KtGBU9a3ga7QWore1gGIt7qCirwrygbQXEtmYumczID8mZNcChIYws8FMLOGCZyBWJtySuWVKuJzYGiNElCN687Y7hqxksPEKoxVelbZdDYnnSfFbScJVUdZrDFKF8F+MCojm1qtgms2SIoa1gbQSgKfSsrkztHpDMYqv82gHoxIkcQdbApgAZjksVebVctWOza7VtmXJOp4UAebDjQ+DwMap9U2nwN1wOvgAQFfYj+b/xdBX08CmnA1550wR+dKx+IY3Yc19QPd+fJRDf8EHQT5kbA/yHNj4G19QF8fJA8EMdUk/ATFmIBvU17kYyF+BHp6EjiUC7kI2b1Ot+rcJY15kuucNIPFBrta77zcyIu7V5keBXMqEtAdr+mmkCt5iZBPoNrXrfkWFEoV8gcT4uXun/9mzwAAAABJRU5ErkJggg==";

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
        var th = heightobj.getcurrent().getcurrent();
        var headers = MFRAME?0:ALIEXTENT*2; 
        var width = rect.width-THUMBORDER*2;
        var height = rect.height-headers-THUMBORDER*2;
        if (globalobj.maxheight)
            height *= globalobj.maxheight/100;
        var r = calculateAspectRatioFit(photo.image.width, photo.image.height, width*th, height*th); 
        var h = r.height;
        var w = r.width;
        var a = MFRAME?0:ALIEXTENT;
        var pos = positobj.current();
        if (pos == 0)
        {
            var x = THUMBORDER;
            var y = a+THUMBORDER;
        }
        else if (pos == 1)
        {
            var x = (context.canvas.width-w)/2;
            var y = a+THUMBORDER;
        }
        else if (pos == 2)
        {
            var x = context.canvas.width-w-THUMBORDER;
            var y = a+THUMBORDER;
        }
        else if (pos == 3)
        {
            var x = THUMBORDER;
            var y = (context.canvas.height-h)/2;
        }
        else if (pos == 5)
        {
            var x = context.canvas.width-w-THUMBORDER;
            var y = (context.canvas.height-h)/2;
        }
        else if (pos == 6)
        {
            var x = THUMBORDER;
            var y = context.canvas.height-h-a-THUMBORDER;
        }
        else if (pos == 7)
        {
            var x = (context.canvas.width-w)/2;
            var y = context.canvas.height-h-a-THUMBORDER;
        }
        else if (pos == 8)
        {
            var x = context.canvas.width-w-THUMBORDER;
            var y = context.canvas.height-h-a-THUMBORDER;
        }
        else
        {
            var x = (context.canvas.width-w)/2;
            var y = (context.canvas.height-h)/2;
        }
    
        context.lineWidth = THUMBLINEOUT;
        var whiterect = new StrokeRect(THUMBSTROKE);
        var blackrect = new Fill(THUMBFILL);

        context.globalAlpha  =  1;
        context.thumbrect = new rectangle(x,y,w,h);
        if (context.pinching || !localobj.picture || context.hidepicture)
        {
            blackrect.draw(context, context.thumbrect, 0, 0);
        }
        else if (photo.cached)
        {
            context.drawImage(photo.cached, x, y, w, h);
        }
        else
        {
            context.drawImage(photo.image, 0, 0, photo.image.width, photo.image.height, x, y, w, h);
            photo.cached = new Image();
            var c = document.createElement('canvas');
            var o = c.getContext('2d');
            c.width=w;
            c.height=h; 
            o.drawImage(photo.image, 0, 0, w, h);
            photo.cached.src = o.canvas.toDataURL();
        }

        whiterect.draw(context, context.thumbrect, 0, 0);
        
        var berp = Math.berp(0,photo.image.height,context.nuby); 
        var yy = Math.lerp(0,h,berp);
        var s = context.sliceobj.data_.length;
        var e = context.slicefirst/s;
        var k = context.count/s; 
        var wwwww = k*w;
        var xxxxx = x+e*w;
        var s = xxxxx+wwwww;
        var t = x+w;
        var c = 0;
        if (s > t)
        {
            c = s-t;
            wwwww-=c;
        }

        var berp = Math.berp(0,photo.image.height,context.imageheight); 
        var hh = Math.lerp(0,h,berp);

        y += yy;
        context.thumbselect[0] = new rectangle(xxxxx,y,wwwww,hh);
        context.thumbselectwidth = wwwww;
       
        var kx = context.thumbselect[0].x - context.thumbrect.x;
        var k = kx/context.thumbrect.width;
        var ki = Math.floor(k*context.sliceobj.length());
        context.sliceobj.set(ki);

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
    },
},
];

var positobj = new makeoption("POSITION", 9);
var thumbobj = new makeoption("THUMB", thumblst);
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
        var str = user.title;
        
        if (user.tap) 
        {
            clr = tap;
        }
        else
        {
            if (user.path == "PROJECT")
            {
                if (user.index == projectobj.current())
                    clr = select;
            }
            else if (user.path == "THUMBNAIL")
            {
                if (thumbobj.current() == 0 && localobj.picture)
                    clr = select;
                else if (thumbobj.current() == 0 && !localobj.picture)
                    clr = select2;
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

var projectobj = new makeoption("", Number(url.projects)+1);
projectobj.set(Number(url.project));

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
        if (Math.abs(virtualaspect < window.aspect*1.20))
            continue;
        zoomrange[0] = n;
        break;
    }

    zoomrange[1] = 0.925;
    zoomobj.split(zoomobj.current(), zoomrange.join("-"), OPTIONSIZE);

   /* AAPL 
    for (var n = 0; n < zoomobj.length(); ++n)
    {
        var k = zoomobj.data()[n];
        var z = 1-k;
        var h = photo.image.height;
        h *= z;
        var j = photo.image.width/h;
        var vh = context.canvas.height;
        var vw = vh * j;
        if (vw*vh < MAXVIRTUALSIZE)
            continue;
        zoomobj.data_.length = n+1;
        zoomobj.set(Math.floor(n/2));
        break;
    }
    */

    var zoom = 1-zoomobj.getcurrent();
    context.imageheight = photo.image.height*zoom;
    var imageaspect = photo.image.width/context.imageheight;
    context.imagewidth = context.imageheight*imageaspect;
    context.virtualheight = context.canvas.height;
    context.virtualwidth = context.virtualheight * imageaspect;
    context.virtualaspect = context.virtualwidth / context.virtualheight;
      
    var slicewidth = 1.0;//Math.lerp(1.0,2.0,zoomobj.berp());
    var y = Math.clamp(0,context.canvas.height-1,context.canvas.height*rowobj.berp());
    context.nuby = Math.nub(y, context.canvas.height, context.imageheight, photo.image.height);  
    var ks = 0;
    for (var n = 0; n < slicelst.length; ++n)
    {
        var k = slicelst[n];
        var fw = context.virtualwidth / k.slices;
        if (fw < slicewidth)
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
    context.sliceobj.data_ = []

    if (SAFARI)
        for (var n = 0; n < canvaslst.length; ++n)
            releaseCanvas(canvaslst[n]);

    var j = 0;
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
            0, 0, context.bwidth, cnv.height);

        for (var e = 0; e < slices; ++e)
        {
            var k = {};
            k.x = e*context.colwidth;
            k.time = j;
            k.canvas = cnv;
            k.isleft = 0;
            k.ismiddle = 0;
            k.isright = 0;
            k.col = -1;
            slice++;
            context.sliceobj.data_.push(k);
            j += context.delayinterval;
        }
    }

    var slices = context.sliceobj.data_;
    var cols = gridToRect(globalobj.cols, 1, 0, context.sliceobj.data_.length, 1)
    for (var n = 0; n < cols.length; ++n)
    {
        var col = cols[n]
        for (var e = col.x; e < col.x+col.width; ++e)
            slices[e].col = n;
        
        var m = col.x;
        slices[m].isleft = 1;
        slices[m+col.width-1].isright = 1;
        slices[m+Math.floor(col.width/2)].ismiddle = 1;
    }

    var p = panxobj.getcurrent();
    var s = context.timeobj.length()/context.virtualwidth;
    context.rvalue = p*s;

    var k = window.innerHeight > window.innerWidth?0:1;
    heightobj.set(k);
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
		for (var n = 0; n < contextlst.length; ++n)
		{
            context = contextlst[n];
			context.index = n;
			context.id = n == 0 ? "" : "_" + (n+1);
            context.imageSmoothingEnabled = false;
            context.imageSmoothingQuality = "low";
		    context.enabled = 0;
			context.canvas.width = 1;
			context.canvas.height = 1;
			context.font = "400 100px Russo One";
			context.fillText("  ", 0, 0);
			context.font = "400 100px Archivo Black";
			context.fillText("  ", 0, 0);
			context.font = "400 100px Source Code Pro";
			context.fillText("  ", 0, 0);
            context.drawcount = 0;  
			context.lastime = 0;
            setevents(context, eventlst[n]);
			context.swipetype = "swipeleft"
            context.sliceobj = new makeoption("", []);
            context.timeobj = new makeoption("", TIMEOBJ);
            context.describeobj = new makeoption("", 0);
            context.columnobj = new makeoption("", globalobj.cols);
            context.debugobj = new makeoption("", [projectobj, context.timeobj,  context.sliceobj, context.columnobj ]);
        }

        _4cnvctx.timeobj.set(url.time);
        var slices = _8cnvctx.sliceobj;
        slices.data_= [];
        var items = projectobj.length();
        for (var n = 0; n < items; ++n)
        {
            var b = Math.floor(n);
            slices.data_.push({index:b, title:(b+1)+"", path: "PROJECT", func: project})
        }
        
        _8cnvctx.delayinterval = DELAYCENTER / slices.data_.length;
        _8cnvctx.virtualheight = slices.data_.length*BUTTONHEIGHT;

        var slices = _9cnvctx.sliceobj;
        slices.data_= [];
        slices.data_.push({title:"Refresh (F5)", path: "REFRESH", func: function(){savelocal(); location.reload()}})
        slices.data_.push({title:"Thumbnail (T)", path: "THUMBNAIL", func: function(){localobj.picture=localobj.picture?0:1; _4cnvctx.refresh()}})
        slices.data_.push({title:"Help", path: "HELP", func: function(){menuhide(); helpobj.getcurrent().draw(_4cnvctx, _4cnvctx.rect(), 0, 0);} })
        slices.data_.push({title:"Open... (O)", path: "LOAD", func: function(){promptFile().then(function(files) { dropfiles(files); })}})
        slices.data_.push({title:"Screenshot", path: "SCREENSHOT", func: screenshot})
        slices.data_.push({title:"Original", path: "ORIGINAL", func: function(){window.open(photo.image.original, '_blank');}})
        if (!SAFARI)
            slices.data_.push({title:"Fullscreen (F)", path: "FULLSCREEN", func: fullscreen})

        if (CACHEDEBUG)
        {
            slices.data_.push({title:"Delete Caches", path: "DELCACH", func: function()
            {
                 caches.keys().then(function(names) 
                 {
                     for (let name of names)
                         caches.delete(name);
                 });
            }});
            
            slices.data_.push({title:"Delete Service Workers", path: "DELSERVWORK", func: function()
            {
                navigator.serviceWorker.getRegistrations().then(function(registrations) 
                {
                    for (let registration of registrations) 
                    {
                        registration.unregister()
                    } 
                })
            }});
            
            slices.data_.push({title:"Delete Service Workers", path: "DELSERVWORK", func: function()
            {
                navigator.serviceWorker.getRegistration('/').then(function(registration) 
                {
                    registration.update();
                });
             
            }});
            
            slices.data_.push({title:"List Cache", path: "LISTCACHE", func: function()
            {
                function cacheList(Items)
                {   
                    for(var i = 0; i < Items.length; i++)
                    {
                        console.log('Items: '+Items[i]);
                    }
                }

                var url = [];
                caches.open('cache-v3').then(function (cache)
                {
                    cache.keys().then(function(keys){
                        return Promise.all(
                                keys.map(function(k){url.push(k.url); return k.url} )
                            )
                    }).then(function(u){ cacheList(url);})
                })
            }});
        }

        _9cnvctx.delayinterval = DELAYCENTER / slices.data_.length;
        _9cnvctx.virtualheight = slices.data_.length*BUTTONHEIGHT;
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
            if (photo.image)
            {
                contextobj.resize(context);
                resetcanvas(context);
            }
            else if (url.path)
            {
                var path = "https://reportbase.com/data/" + url.fullpath();
                if (HOST == "Image.Vision")
                    path = "https://d.img.vision/" + url.group + '/' + url.fullpath();
                else if (globalobj.promptedfile)
                    path = globalobj.promptedfile;   
              
                seteventspanel(new Empty());
                delete globalobj.promptedfile;
                photo.image = new Image();
                photo.image.original = path;
                photo.image.load(path);

                photo.image.onerror = 
                    photo.image.onabort = function()
                {
                    _4cnvctx.setcolumncomplete = 1;
                    _4cnvctx.movepage(-1);
                    seteventspanel(new YollPanel());
                    this.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAADK0lEQVRIS7WXWYiOURjH57VknzIXiiwXKBRXLpSMC9OIEDEhk5KdBs0wzQUxSVlmQskSRU0ulKWIUq4MTYkpe1kKRZIt+zqf3//rvF+fd87yynyn/p2v8yz/5zzvc55zvqjIMzKZTDfEvcBYgwHMGfACXAM3wccoir77/NhkkW0Rwi6sTwSLwDzQ2eH4K+snwFHQQgA/0wbQjhjSYoz3GMIeKR0pAJFvhPxdGpu/iCHti9EVMCqNsUXnKmuTIf8css8RQ6rdXf8P0pirGeLSfyHej/LKgMEn5ApWBecbDZBv8Clkd8xuxzFdAEq1a9xGsB38ApsDmVGVj4f8hstZBGlX47A6sIs6HO0wgVYyNwX0m9Bf6CNWFWs3gz2OfiNbh6N9hniKyZCP+w7C6dg8sSlpx0MRPHJ4UMp0NttALU4OGeJy5otA31wZU6NJjvcsVGBzyUU8G8FJi/A+ayq410DdqhUnDw1xf+YyoMBKgD7TcIuPSmyOu4hVySLIHyJahdFBm1FyjazNZO2MRXdFnKWkTKlezqKNYD1GjSmJl6B32KK7DB+29SIRT8XgvMXoi8nEM5Pqyzi5ZVI9hLkCqFUOBHUWe2VtPjbq5e2GiFXNT1PsrBonuw3xNOZzAZtXyOdg0+wi7o1APXaMx5GO0xqcZGuBYOOq9nG3IizH5o2LuBOCGrAzsIN6nGwxxKuZs2faMXT89qLvbEpxy9RtdBboTLuGzmwD0LneChSwa3xAMBJiPRisI/92UlNXL/Y5DCQlJ37MrxkQ30tDrFfGAbA0rfeAnh4Eu0AjAfxI6iYfAt1RqAe1HUSuotQdvxjyu/k+bU8f7XwuUFPpkzKAb+ipnY526GvHut2yx1HD+tiTgCPTj2kT0JnVDdYT6BGooQJT81ARqVXqflYj0cUxyBPsKWRrCeC5kzg2JgClXw+FYUAXgsZboB3qZZn7fujq+KjyfX71pisLEnuit4og1zU4KWC3oBDEyspLoHvaNY50OLGY2PUsptMe4m2FIpbfY8D25tKtNaIgxGbXqnKR539vHbsqCrIwqY5TTMrVByYA/enTSVDhPYC47Q+jAwjFRbnDLAAAAABJRU5ErkJggg==";
                    resetcanvas(context);
                    contextobj.resize(context);
                    context.refresh();
                    seteventspanel(new YollPanel());
                }

                photo.image.onload = function()
                {
                    this.aspect = this.width/this.height; 
                    this.size = ((this.width * this.height)/1000000).toFixed(1) + "MP";
                    this.extent = this.width + "x" + this.height + " (" + this.aspect.toFixed(2) + ")" ;
                    this.extentonly = this.width + "x" + this.height;
                    document.title = url.fullpath()+" ("+this.extentonly+")" 
                    
                    contextobj.resize(context);
                    resetcanvas(context);
                    context.refresh();

                    if (globalobj.autostart)
                        slideon();
                    tab();

                    var k = projectobj.current();
                    projectobj.rotate(_4cnvctx.swipetype=="swiperight"?-1:1);
                    var path = "https://reportbase.com/data/" + url.fullpath();
                    if (HOST == "Image.Vision")
                        path = "https://d.img.vision/" + url.group + '/' + url.fullpath();
                    var img = new Image();
                    img.src = path;
                    projectobj.set(k);
                    
                    seteventspanel(new YollPanel());
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

        context.save();
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
        context.fillText(str, x, y);
        context.restore();
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
    var b = Math.berp(0,size-1,n);
    var e = b*nubextent;
    var f = b*extent;
    return f - e;
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
	var lst = context.sliceobj.data();
    
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
	var t = context.sliceobj.data()[0];
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

function reset()
{
    contextobj.reset()
    setTimeout(contextobj.reset,50);
    setTimeout(contextobj.reset,100);
    setTimeout(contextobj.reset,200);
    setTimeout(contextobj.reset,500);
    setTimeout(contextobj.reset,1000);
}

function resize()
{
    menuhide();
    delete photo.cached;
    delete _4cnvctx.describe;
    var n = eventlst.findIndex(function(a){return a.name == "_4cnvctx";})
    setevents(_4cnvctx, eventlst[n])
    _4cnvctx.refresh();
    pageresize();
    reset();
}

window.addEventListener("focus", (evt) => 
{ 
});

window.addEventListener("blur", (evt) => 
{ 
    escape();
});

window.addEventListener("resize", (evt) => 
{ 
    resize();
});

window.addEventListener("screenorientation", (evt) => 
{ 
    resize();
});

function escape() 
{
    menuhide();
    delete _4cnvctx.describe;
    var n = eventlst.findIndex(function(a){return a.name == "_4cnvctx";})
    setevents(_4cnvctx, eventlst[n])
    _4cnvctx.setcolumncomplete = 0;
    contextobj.reset();
}

function yoll()
{
    if (!photo.image.complete || 
        photo.image.naturalHeight == 0)
        return;
    for (var n = 0; n < 1; n++)
    {
        var context = _4cnvctx;
        var width = context.canvas.width;
        if (width == 1)
            continue;
        if (context.lastime == context.timeobj.current())
            continue;
        else
            context.lastime = context.timeobj.current();

        if (context.slideshow > 0)
        {
            var k = (context.swipetype == "swipeleft")?-1:1;
            context.timeobj.rotate(k*context.slideshow);
            context.slideshow -= globalobj.slidereduce;
        }

        context.virtualpinch = context.virtualwidth*pinchobj.getcurrent();
        context.virtualeft = (context.virtualpinch-window.innerWidth)/2;
        var time = context.timeobj.getcurrent()/1000;
        var rect = context.rect();
        var sliceobj = context.sliceobj.data_;
        var slice = sliceobj[0];
        if (!slice)
            continue;
        var r = calculateAspectRatioFit(context.colwidth,
            rect.height, context.canvas.width, rect.height);
        var xt = -rect.width / 2;
        let y = rect.height*0.5;
        context.save();
        context.translate(xt, 0);
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        var m = context.getslicefirst()
        var msave = m;
        var j = time + slice.time;
        var b = Math.tan(j*VIRTCONST);
        var first = Math.berp(-1, 1, b) * context.virtualpinch - context.virtualeft;
        var firstx = DELAY;
        var count = 0;
        context.visibles1 = [];
        context.visibles2 = [];
        for (; m < sliceobj.length; ++m, ++count)
        {
            var slice = sliceobj[m];
            var j = time + slice.time;
            var b = Math.tan(j*VIRTCONST);
            var x = Math.berp(-1, 1, b) * context.virtualpinch - context.virtualeft;

            if (first < 0 && x >= width)
                break;
            if (first >= width && x >= width && x < first)
                break;

            if (x < 0)
                continue;
            else if (x >= width)
                continue;

            context.visibles2.push({slice, x}); 
            if (x < firstx)
            {
                firstx = x;
                context.slicefirst = m;
            }
        }
     
        if (m == sliceobj.length)
        {
            var m = 0; 
            var first = 0;
            var firstx = DELAY;
            var count = 0;
            for (; m < msave; ++m, ++count)
            {
                var slice = sliceobj[m];
                var j = time + slice.time;
                var b = Math.tan(j*VIRTCONST);
                var x = Math.berp(-1, 1, b) * context.virtualpinch - context.virtualeft;

                if (first < 0 && x >= width)
                    break;
                if (first >= width && x >= width && x < first)
                    break;

                if (x < 0)
                    continue;
                else if (x >= width)
                    continue;
                
                context.visibles1.push({slice, x}); 
            }
        }

        context.count = context.visibles1.length + context.visibles2.length;
        for (var m = 0; m < context.visibles1.length; ++m)
        {
            var j = context.visibles1[m]; 
            var slice = j.slice;
            var x = j.x;
            let pinchwidth = Math.max(context.visibles1[m+1]?context.visibles1[m+1].x-x:1,1); 
            context.drawImage(slice.canvas, slice.x, 0, context.colwidth, context.canvas.height,
                x+r.x, 0, context.colwidth*pinchwidth, context.canvas.height);
        }

        for (var m = 0; m < context.visibles2.length; ++m)
        {
            var j = context.visibles2[m]; 
            var slice = j.slice;
            var x = j.x;
            let pinchwidth = Math.max(context.visibles2[m+1]?context.visibles2[m+1].x-x:1,1); 
            context.drawImage(slice.canvas, slice.x, 0, context.colwidth, context.canvas.height,
                x+r.x, 0, context.colwidth*pinchwidth, context.canvas.height);
        }

        context.restore();
        context.save();
        context.thumbselect = [];
        context.grid = [];
        delete context.menurect;
        delete context.moveprevrect;
        delete context.movetoprect;
        delete context.movenextrect;
        delete context.nohit;
        delete context.movebottomrect;
        delete context.aboutrect;
        delete context.fullscreen;
        delete context.zoominrect;
        delete context.zoomoutrect;
        delete context.thumbrect;
        delete context.describerect;
        delete context.prevhelp;
        delete context.nexthelp;
        delete context.prevhelp2;
        delete context.hidehelp;
        delete context.nexthelp2;

        if (context.describe)
        {
            for (var m = 0; m < sliceobj.length; ++m)
            {
                var hit = sliceobj[m];
                if (hit.isleft && hit.col == 0)
                {
                    var a = new Help();
                    a.draw(context, rect, context.describe, 0);
                }
            }
        } 
       
        if ( headcnv.height )
            headobj.getcurrent().draw(headcnvctx, headcnvctx.rect(), 0);
        if ( footcnv.height )
            footobj.getcurrent().draw(footcnvctx, footcnvctx.rect(), 0);

        var a = new Grid(3,3,0,new Rects(context.grid));
        a.draw(context, rect, 0, 0);

        if (!context.describe && !localobj.hide && !context.screenshot)
            thumbobj.getcurrent().draw(context, rect, 0, 0);
        
        if (!context.setcolumncomplete)
        {
            context.setcolumncomplete = 1;
            context.newimage = 0;
        }

        if (!context.screenshot)
        {
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;
            var a = new Fill("black");
            a.draw(context, new rectangle(rect.width-HNUB,0,HNUB,rect.height), 0, 0);
            var a = new CurrentVPanel(new Fill("white"),ALIEXTENT*2);
            a.draw(context, new rectangle(rect.width-HNUB,YNUB,HNUB,rect.height-YNUB), rowobj, 0);
            var s = context.sliceobj.data_.length;
            var e = context.slicefirst/s;
            var k = context.count/s; 
            var j = e*rect.width;
            var xxxxx = j;
            var wwwww = k*rect.width;
            var a = new Fill("black");
            a.draw(context, new rectangle(0,0,rect.width,BNUB), 0, 0);
            var s = xxxxx+wwwww;
            var c = 0;
            if (s > rect.width)
            {
                c = s-rect.width;
                var d = wwwww-c;
                wwwww=d;
            }

            var a = new Fill("white");
            a.draw(context, new rectangle(xxxxx,0,wwwww,BNUB), 0, 0);
            if (s > rect.width)
                a.draw(context, new rectangle(0,0,c,BNUB), 0, 0);
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
        var time = context.timeobj.getcurrent()/1000;
        if ((context.lastime.toFixed(8) == time.toFixed(8)))
            continue;
        else
            context.lastime = Number(time.toFixed(8));

        if (context.slideshow > 0)
        {
            var k = (context.swipetype == "swipeup")?-1:1;
            context.timeobj.rotate(k*context.slideshow);
            context.slideshow--;
        }

        var sliceobj = context.sliceobj;
        var slices = sliceobj.data();
        var r = context.rect();
        var w = r.width;
        var h = r.height;
        var firstx = DELAY;
        context.clear();
        context.fillStyle = MENUCOLOR;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        context.visibles = [];

        for (var m = 0; m < slices.length; ++m)
        {
            var slice = slices[m];
            slice.time = time + (m*context.delayinterval);
            var e = (context.virtualheight-r.height)/2;
            var bos = Math.tan(slice.time * VIRTCONST);
            let y = Math.berp(-1, 1, bos) * context.virtualheight;
            y -= e;
            var x =  w/2;
            if (y < 0 || y >= window.innerHeight)
                continue;
            context.visibles.push({slice: slice, x:x, y:y});
            if (context.visibles.length*BUTTONHEIGHT > window.innnerHeight)
                break;
        }
        
        for (var m = 0; m < context.visibles.length; ++m)
        {
            var j = context.visibles[m]; 
            j.slice.center = {x: j.x, y: j.y};
            j.slice.fitscale = 0;
            j.slice.fitwidth = 0;
            j.slice.fitheight = 0;
            context.save();
            context.translate(j.x, j.y);
            context.draw(context, context.rect(), j.slice, 0);
            context.restore();
        }
    }
}

var YollPanel = function ()
{
    this.draw = function (context, rect, user, time)
    {
    };

	this.tap = function (context, rect, x, y, shift, ctrl)
    {
        if (context.tap_)
    		context.tap_(context, rect, x, y, shift, ctrl);
	};

	this.dblclick = function (context, x, y)
    {
        var thumb = context.thumbrect && context.thumbrect.hitest(x,y);
        if (thumb)
        {
            context.togglepicture();
            return;
        }
        
        context.hidehead = 0;
        localobj.hide = localobj.hide?0:1;
        pageresize();
        _4cnvctx.refresh();
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
        this.panend = function (context, rect, x, y)
        {
            delete _4cnvctx.timeobj.offset;
        };

        this.pan = function (context, rect, x, y, type)
        {
            var k = panhorz(_4cnvctx.timeobj, x);
            if (k == -1)
                return;
            if (k == _4cnvctx.timeobj.anchor())
                return;
            _4cnvctx.timeobj.set(k);
            _4cnvctx.refresh();
        };

        this.press = function (context, rect, x, y)
        {
            _4cnvctx.debugobj.rotate(1);
            headobj.getcurrent().draw(headcnvctx, headcnvctx.rect(), 0);
        };

		this.tap = function (context, rect, x, y)
		{
            if (context.page.hitest(x,y))
            {
                var time = parseFloat(localStorage.getItem(url.path+_8cnvctx.id+".time"));
                _8cnvctx.timeobj.set(time);
                menushow(_8cnvctx);
            }
            else if (context.prevpage2.hitest(x,y) ||
                context.prevpage.hitest(x,y))
            {
                _4cnvctx.movepage(-1);
            }
            else if (context.reload.hitest(x,y))
            {
                localobj.hide = localobj.hide?0:1;
                pageresize();
                _4cnvctx.refresh();
            }
            else if (context.nextpage2.hitest(x,y) ||
                    context.nextpage.hitest(x,y))
            {
                _4cnvctx.movepage(1);
            }
            else if (context.option.hitest(x,y))
            {
                menushow(_9cnvctx);
            }
            else if (context.thumbnail.hitest(x,y))
            {
            }
		};

		this.draw = function (context, rect, user, time)
		{
            context.clear()
            context.save()
            context.shadowOffsetX = 1;
            context.shadowOffsetY = 1;
            context.shadowColor = "black"

            context.page = new rectangle()
            context.option = new rectangle()
            context.prevpage = new rectangle()
            context.nextpage = new rectangle()
            context.thumbnail = new rectangle()
            context.prevpage2 = new rectangle()
            context.nextpage2 = new rectangle()
            context.reload = new rectangle()

            var columnobj = _4cnvctx.columnobj;
            var timeobj = _4cnvctx.timeobj;
            var sliceobj = _4cnvctx.sliceobj;
            var a = timeobj.current() / timeobj.length();
            columnobj.sett(a);
            sliceobj.set(_4cnvctx.count);

            var str = _4cnvctx.debugobj.getcurrent().print();
            var k = str.split("-");
            var project = k[0];
            var projects = k[1];

            var a = new Layer(
            [
                //new Fill(HEADCOLOR),
                new ColA([ALIEXTENT,0,ALIEXTENT,90,ALIEXTENT,0,ALIEXTENT],
                [
                    (localobj.hide || projectobj.length() < 2) ? 0:new Layer(
                    [
                        new PagePanel(_8cnvctx.enabled?0.125:0.1),
                        new Rectangle(context.page),
                    ]),
                    new Layer(
                    [
                        //new Rectangle(context.prevpage2),
                    ]),
                    new Row([BNUB,0,BNUB],
                    [
                        0,
                        new Layer(
                        [
                            (_4cnvctx.newimage == -1) ? new Fill(ARROWSELECT):new Fill(HEADCOLOR),
                            new Shrink(new Arrow(270),ARROWBORES,ARROWBORES-BNUB),
                            new Rectangle(context.prevpage),
                        ]),
                        0,
                    ]),
                    new Row([BNUB,0,BNUB],
                    [
                        0,
                        new Layer(
                        [
                            new Fill(localobj.hide?HEADCOLOR:ARROWSELECT),
                            new Rectangle(context.reload),
                            new Text("white", "center", "middle",0,1,1),
                        ]),
                        0,
                    ]),
                    new Row([BNUB,0,BNUB],
                    [
                        0,
                        new Layer(
                        [
                            (_4cnvctx.newimage == 1) ? new Fill(ARROWSELECT):new Fill(HEADCOLOR),
                            new Shrink(new Arrow(90),ARROWBORES,ARROWBORES-BNUB),
                            new Rectangle(context.nextpage),
                        ]),
                        0,
                    ]),
                    new Layer(
                    [
                        //new Rectangle(context.nextpage2),
                    ]),
                    localobj.hide?0:new Layer(
                    [
                        new OptionPanel(_9cnvctx.enabled?0.125:0.1),
                        new Rectangle(context.option),
                    ])
                ])
           ]);

           a.draw(context, rect, 
               [
                   0,
                   0,
                   0,
                   project,
                   0,
                   0,
                   0
               ]
           , time);
           context.restore()
		};
	},
	new function ()
	{
		this.draw = function (context, rect, user, time)
		{
            context.clear();
            var a = new Layer(
            [
                new Fill(HEADCOLOR),
                new Text("white", "center", "middle",0,1,1),
           ]);

           var k = projectobj.print().split("-");
           var project = k[0];//+"-"+k[1];

           a.draw(context, rect, project, time);
           context.restore()
		};
	},
];

var headobj = new makeoption("", headlst);

var Footer = function ()
{
    this.height = ALIEXTENT;
    this.panstart = function (context, rect, x, y)
    {
    };

    this.panend = function (context, rect, x, y)
    {
        _4cnvctx.refresh();
        delete zoomobj.offset;
    };

    this.pan = function (context, rect, x, y, type)
    {
        var b = Math.berp(0,context.slider.width,x);
        var l = Math.lerp(0,zoomobj.length(),b);
        var k = panhorz(zoomobj, l);
        if (k == -1)
            return;
        if (k == zoomobj.anchor())
            return;
        zoomobj.set(Math.floor(k));
        contextobj.reset();
    };

    this.tap = function (context, rect, x, y)
    {   
        _4cnvctx.panning = 1;  
        clearTimeout(globalobj.tap);
        globalobj.tap = setTimeout(function()
            {
                _4cnvctx.panning = 0;  
            }, 1000);

        if (context.thumbout.hitest(x,y))
        {
            zoomobj.add(-1);
            contextobj.reset();
        }
        else if (context.thumbin.hitest(x,y))
        {
            zoomobj.add(1);
            contextobj.reset();
        }
        else if (context.slider.hitest(x,y))
        {
            x = x - context.slider.x
            var k = Math.floor(zoomobj.length()*(x/context.slider.width))
            zoomobj.set(k);
            contextobj.reset();
        }

        _4cnvctx.refresh();
    };

    this.draw = function (context, rect, user, time)
    {
        context.clear()
        context.save();
        context.shadowOffsetX = 1;
        context.shadowOffsetY = 1;
        context.shadowColor = "black"
        var j = -1;
        if (rect.width > MAXSLIDER)
            j = (rect.width-MAXSLIDER)/2;
        context.thumbout =  new rectangle();
        context.thumbin =  new rectangle();
        context.slider =  new rectangle();

        var a = new Layer(
        [
            //new Fill(HEADCOLOR),
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
                ico.zoomout,
                zoomobj,
                ico.zoomin,
                0,
            ]
         , time);

        context.restore()
    };
};

var footlst =
[
    new Footer(),
    new function()
    {
        this.draw = function (context, rect, user, time)
        {
            context.clear();
            context.save()
            var a = new Layer(
            [
                new Fill(HEADCOLOR),
                new Text("white", "center", "middle",0,1,1),
            ]);

            a.draw(context, rect, "", time);
            context.restore()
        };
    }
];

var footobj = new makeoption("", footlst);
 
function menushow(context)
{
     slideoff();
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

function pageresize()
{
    var h = (_4cnvctx.hidehead||MFRAME)?0:ALIEXTENT;
    var y = 0;
    headcnvctx.show(0,y,window.innerWidth,h);
    headobj.set(0);
    headham.panel = headobj.getcurrent();
    var h = (localobj.hide||MFRAME)?0:ALIEXTENT;
    footcnvctx.show(0,window.innerHeight-ALIEXTENT, window.innerWidth, h);
    footobj.set(0);
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

var helplst = 
[
{
    name: "INTRO",
    draw: function (context, rect, user, time)
    {
    var n = eventlst.findIndex(function(a){return a.name == "describe";})
    setevents(context, eventlst[n])

        context.describe =
           `High Resolution Image Viewer
            Interactive Panoramas

            Topographic maps, drone and satellite photos, maps, action photography, digital art, panoramas, comics and cartoons, portraits, landscapes, cityscapes, infographics, real estate, automobiles, and vintage paintings

            Contact the developers at repba@proton.me

            Mauris non auctor nibh, nec convallis metus. Nullam eu gravida nunc. Nulla pellentesque augue feugiat elit interdum, ac ornare eros sodales. Vivamus sed ante velit. Mauris non turpis sit amet nunc auctor accumsan eget mattis turpis. Nunc hendrerit suscipit tellus, eget rhoncus augue varius vitae. Proin vel purus malesuada, vehicula nunc et, ullamcorper purus. Integer gravida quam iaculis urna hendrerit, ut fringilla erat dignissim. Cras eget lacus mattis, convallis nisi eget, facilisis massa. Nulla vel libero eu elit venenatis egestas commodo ac ligula.

            Donec varius est id mauris commodo, ut imperdiet ipsum molestie. Curabitur condimentum felis non lacus accumsan tincidunt eget vitae velit. Donec viverra felis a lectus maximus vehicula ut quis sem. Vivamus eu neque non risus rutrum pharetra sed vitae dui. Etiam consectetur sem neque, in lacinia enim tristique eu. Praesent bibendum ullamcorper vulputate. Sed commodo sagittis blandit. Vivamus vel porta nisl. Aliquam nibh lorem, aliquam eu tincidunt et, fringilla placerat augue. Donec convallis laoreet condimentum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Cras fermentum non velit in tristique. Sed nunc nulla, tristique vestibulum pulvinar quis, maximus at leo.

            Nam elementum ante non libero mollis, sed vestibulum dolor mattis. In quis tortor euismod, pharetra odio vitae, fringilla sem. Donec a mi urna. Nullam dictum tristique volutpat. Sed lacinia risus at enim lobortis dapibus. Vivamus quis pulvinar nunc. Donec sapien quam, auctor a sem quis, elementum luctus risus.

            Suspendisse in efficitur ante. Aliquam eget diam a enim suscipit accumsan. Curabitur faucibus ipsum sed ex interdum, vel faucibus libero gravida. Sed nisi sem, ultricies eu tortor eget, tincidunt ultrices neque. Vivamus congue nunc hendrerit, auctor mi eu, malesuada quam. Maecenas efficitur ante ipsum. Vestibulum fermentum fermentum semper. Sed fringilla dapibus tortor non auctor. Fusce commodo arcu orci, ac dapibus magna rutrum et. Aliquam a sem finibus, vulputate enim sit amet, ultrices lacus. Donec convallis vitae leo ac consectetur. Proin leo lorem, facilisis eget sollicitudin eu, dapibus non libero. Mauris dignissim, lectus et efficitur lobortis, turpis felis rutrum mi, in eleifend eros nisi sed purus. Ut quis faucibus sapien, sed sollicitudin diam. Phasellus quis ligula leo.

            In efficitur massa lorem, vitae aliquet tellus eleifend id. Mauris eu turpis sapien. Etiam euismod urna sodales, finibus metus vel, vulputate risus. Aliquam in ultrices ex. Curabitur sed velit quis odio tristique mattis. Nullam congue rutrum felis, sollicitudin commodo mi aliquet porttitor. Phasellus vitae magna maximus, fermentum ipsum sed, semper dui. Etiam et leo libero. Curabitur a arcu quis est rutrum imperdiet. Mauris non sapien ut orci congue sagittis. Maecenas non sem elit. Pellentesque bibendum nisi ante, eget convallis est pharetra dapibus. Mauris ullamcorper ultricies ex, a blandit enim vulputate vel. Phasellus nec ultricies ipsum, nec bibendum magna. Fusce scelerisque justo enim.

            Etiam laoreet placerat dapibus. Nulla sollicitudin, ante sed facilisis ultricies, mauris justo laoreet nibh, sed volutpat est mi vel ipsum. Etiam facilisis nibh id lorem tincidunt tempus. Nunc luctus, nulla ac pellentesque blandit, mauris eros aliquam metus, et viverra ex lacus eget nisi. Donec eros est, aliquam at euismod sit amet, scelerisque volutpat justo. Nulla vel rhoncus sem, vitae bibendum mauris. Vestibulum non ipsum nisl. Nam id aliquet sem, et molestie tortor. Phasellus dignissim congue nunc, in congue arcu pulvinar sit amet. Ut eget varius leo, eget cursus libero.

            Aliquam ornare lorem risus, sit amet ornare diam cursus a. Quisque faucibus dui eu cursus faucibus. Nam lacinia varius tempus. Etiam quis mauris sodales, facilisis eros sed, malesuada ex. Vestibulum ullamcorper iaculis sollicitudin. Nam tristique ac erat ut viverra. In sollicitudin varius ultrices. Fusce nec mi nec massa mollis aliquam. Fusce eget metus sed justo suscipit tincidunt.

            Etiam mollis, lectus vitae euismod pharetra, mauris tellus tincidunt orci, non elementum nunc erat eu lorem. Morbi convallis nisi sollicitudin risus ultrices pharetra quis aliquet diam. Phasellus fringilla nisl et magna faucibus pharetra. Etiam sed varius libero. Nullam posuere, neque ac efficitur consequat, tortor elit convallis ipsum, eu hendrerit nisi velit sit amet massa. Maecenas iaculis, orci a pretium pellentesque, risus est rutrum augue, ac vestibulum erat tellus mattis justo. Suspendisse sed blandit orci. Proin quis elementum ligula. Sed lobortis convallis ultricies. Sed ornare lectus eu massa commodo semper id dictum ex. In elit dolor, volutpat efficitur augue at, dapibus aliquet urna.

            In sodales condimentum mattis. Nam eget tellus odio. Maecenas eget purus pharetra, pharetra mauris eget, rutrum nunc. Curabitur tempus felis id orci semper tempus. Phasellus semper eget turpis eu pretium. Aliquam consectetur augue pellentesque, feugiat neque in, hendrerit ligula. Vivamus tincidunt metus luctus nisl egestas porttitor. Integer volutpat libero leo, id tempus nulla efficitur sit amet.

            Cras dictum, est sed accumsan commodo, quam eros tristique dolor, id eleifend ante enim quis justo. Aliquam erat volutpat. Quisque odio eros, aliquet vitae placerat nec, ullamcorper a ipsum. Pellentesque ut pellentesque ante, sed convallis purus. Pellentesque eget nunc vel lorem maximus eleifend. Donec auctor magna nisi, at mattis metus sollicitudin quis. Maecenas sed porttitor odio. Curabitur sed ligula feugiat, iaculis risus eget, molestie diam. Nullam placerat lacus vel est bibendum, non pulvinar sem scelerisque. Nullam placerat magna ut tortor dapibus, id sollicitudin metus placerat. Nam ut urna tellus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Curabitur at tortor faucibus, blandit sapien et, placerat enim. Etiam in pharetra quam. Phasellus convallis pellentesque convallis. Donec semper vel justo nec tincidunt.`

        var k = helpobj.getcurrent().index?helpobj.getcurrent().index:0;
        context.describeobj.set(k);
        context.refresh()
    }
},
{
    name: "ABOUT",
    draw: function (context, rect, user, time)
    {
        var n = eventlst.findIndex(function(a){return a.name == "describe";})
        setevents(context, eventlst[n])
        context.describe =
           `Developer\nTom Brinkman
            Contact\nrepba@proton.me
            Website\nhttps://reportbase.com
                
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec porttitor dapibus tellus nec bibendum. Vivamus a lorem at arcu tristique dignissim. Aliquam eu lorem dapibus est placerat commodo vel vel risus. Nam mattis faucibus lectus, at luctus libero mattis gravida. Suspendisse tempus mauris ac neque placerat fringilla ut nec leo. Cras placerat nulla id eros suscipit, vel accumsan purus dapibus. Morbi vitae lorem faucibus erat convallis sollicitudin ultrices vel tortor. In hac habitasse platea dictumst. Duis vel lorem diam. Mauris consectetur ac turpis suscipit faucibus.

            Ut blandit leo a luctus elementum. Maecenas nec nulla id lectus vulputate vulputate. Ut auctor tellus sed ultricies efficitur. Donec sodales velit non massa suscipit ullamcorper. Vestibulum nunc diam, ultricies ut eros vitae, consectetur venenatis quam. Aliquam ultrices est ipsum, sed bibendum mauris rhoncus sit amet. Nam eleifend eros purus, at posuere massa ornare nec. Duis tempor turpis ut sem accumsan maximus. Aliquam augue quam, vulputate in tristique et, consectetur in lectus. In varius purus nisi, ac placerat orci euismod eget. Etiam at ligula dignissim, malesuada felis a, accumsan dolor. Integer eu porta purus. Quisque euismod leo sit amet tellus pellentesque, eget condimentum nibh scelerisque. Nulla ac nisl eget nisi congue pulvinar ac at mi.

            Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nunc a quam lorem. Etiam elementum luctus suscipit. Aenean sed orci non enim congue euismod euismod et ante. Curabitur sed commodo neque, pellentesque dignissim erat. Nullam massa erat, molestie nec tempor varius, consectetur in arcu. Cras gravida, felis a interdum ullamcorper, lacus mi consequat nibh, eu cursus nunc justo sed nisi. In blandit sem in purus laoreet, vel facilisis risus ullamcorper. Duis sed sem quis dui egestas vehicula.

            In pharetra risus vitae nisi eleifend, id dictum risus molestie. Suspendisse varius tellus vitae lorem facilisis vulputate. Maecenas ac ex arcu. In mollis risus vitae odio bibendum tempus. Phasellus tempus magna a erat fringilla tincidunt. Aenean et mauris at leo imperdiet feugiat. Ut ut pretium lectus. Fusce ut mollis justo.

            Sed eget odio id augue molestie placerat. Sed eget fermentum lacus, at pretium libero. Praesent fermentum ante lorem, et egestas diam condimentum quis. Nullam quis tellus in lorem malesuada consectetur. Morbi et ex diam. Morbi quis tellus eu velit suscipit aliquet at et ex. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed suscipit condimentum diam, et pretium tellus facilisis in. Integer sit amet faucibus massa. Proin augue lectus, ornare in justo at, iaculis laoreet urna. Mauris libero ex, ullamcorper id elit non, interdum auctor sem.
            `
        var k = helpobj.getcurrent().index?helpobj.getcurrent().index:0;
        context.describeobj.set(k);
        context.refresh()
    }
},
{
    name: "MISC",
    draw: function (context, rect, user, time)
    {
        var n = eventlst.findIndex(function(a){return a.name == "describe";})
        setevents(context, eventlst[n])
        context.describe =
           `Miscellaneous

            Gallery\n${url.path}\n
            Image\n${projectobj.current().pad(4)}\n
            Extension\n${url.extension}\n
            Photo Width\n${photo.image.width}\n
            Photo Height\n${photo.image.height}\n
            Photo Aspect\n${photo.image.aspect.toFixed(2)}\n
            Virtual Width\n${context.virtualwidth.toFixed(2)}\n
            Virtual Height\n${context.virtualheight}\n
            Virtual Aspect\n${context.virtualaspect.toFixed(2)}\n
            Window Width\n${window.innerWidth}\n
            Window Height\n${window.innerHeight}\n
            Window Aspect\n${(window.innerWidth/window.innerHeight).toFixed(2)}\n
            `;

        var k = helpobj.getcurrent().index?helpobj.getcurrent().index:0;
        context.describeobj.set(k);
        context.refresh()
    }
},
];

var helpobj = new makeoption("", helplst);
helpobj.hide = function()
{
    var context = _4cnvctx;
    delete context.describe;
    var n = eventlst.findIndex(function(a){return a.name == "_4cnvctx";})
    setevents(context, eventlst[n])
    context.refresh();
}

function tab()
{
    _4cnvctx.swipetype = _4cnvctx.shifthit ? "swiperight" : "swipeleft";
    _4cnvctx.slideshow = globalobj.slidecount;
    _4cnvctx.refresh();
}

function slideon()
{
    menuhide();
    clearInterval(globalobj.auto)
    globalobj.auto = setInterval(function()
    {
        if (_4cnvctx.panning)
            return;
        _4cnvctx.movepage(_4cnvctx.swipetype == "swipeleft" ? 1 : -1);
    }, globalobj.autopage);
}

function slideoff()
{
    _4cnvctx.slideshow = 0;
    clearInterval(globalobj.auto)
    globalobj.auto = 0;
}

function screenshot()
{
    _4cnvctx.refresh()
    _4cnvctx.screenshot = 1;
    setTimeout(function()
    {
        var k = document.createElement('canvas');
        var link = document.createElement("a");
        link.href = _4cnvctx.canvas.toDataURL('image/jpg');
        link.download = projectobj.current().pad(4) + ".jpg";
        link.click();
        _4cnvctx.screenshot = 0;
        _4cnvctx.refresh()
    }, 1000);
}

function fullscreen()
{
    screenfull.toggle(IFRAME ? _4cnv : 0);
}

function project()
{
    var k = _8cnvctx.timeobj.current();
    localStorage.setItem(url.path+_8cnvctx.id+".time", k);
    projectobj.set(this.index);
    var s = addressobj.full();
    window.open(s,"_self");
}

document.addEventListener('touchmove', function (evt) 
{ 
    evt.preventDefault(); 
}, { passive: false });

window.addEventListener("load", async () => 
{
    try
    {
//todo: release mode
//        if ("serviceWorker" in navigator)
//            await navigator.serviceWorker.register("sw.js");
    }
    catch(error)
    {
    }

    seteventspanel(new YollPanel());
    _4cnvctx.enabled = 1;
    globalobj.main = setInterval(function () { yoll(); }, TIMEMAIN);

    try
    {
        var obj = JSON.parse(localStorage.getItem(url.path));
        if (obj)
        {
            localobj = {...localobj, ...obj};
        }

        if (typeof localobj.current === "undefined")
            localobj.current = {} 
        if (typeof localobj.timers === "undefined")
            localobj.timers = []
        for (var n = 0; n < localst.length; ++n)
        {
              var j = localst[n];
              if (!localobj.current[j.obj.title])
                localobj.current[j.obj.title] = j.def;
            var b =localobj.current[j.obj.title];
            j.obj.set(b);
        }

        for (var n = 0; n < contextlst.length; ++n)
        {
            var j = contextlst[n];
            var k = localobj.timers[n]?localobj.timers[n]:TIMEOBJ/2;
            j.timeobj.set(k);
            localobj.timers[n] = k;
        }
            
        pinchobj.split(Number(localobj.current.pinch), PINCHRANGE, OPTIONSIZE);
        panxobj.split(Number(localobj.current.panx), PANXRANGE, OPTIONSIZE);
        panyobj.split(Number(localobj.current.pany), PANYRANGE, OPTIONSIZE);
        traitobj.split(Number(localobj.current.trait), HEIGHTRANGE, OPTIONSIZE);
        scapeobj.split(Number(localobj.current.scape), HEIGHTRANGE, OPTIONSIZE);
    }
    catch(error)
    {
    }

    pageresize(); 
    reset();
    _4cnvctx.refresh()
});

var localst = 
[
    {obj:thumbobj,def:0},
    {obj:positobj,def:globalobj.position},
    {obj:pinchobj,def:globalobj.pinchbegin},
    {obj:panyobj,def:globalobj.panybegin},
    {obj:panxobj,def:globalobj.panxbegin},
    {obj:traitobj,def:globalobj.trait},
    {obj:scapeobj,def:globalobj.scape},
    {obj:zoomobj,def:globalobj.zoombegin},
    {obj:rowobj,def:globalobj.rowbegin},
];

function savelocal()
{
    localobj.current = {};
    localobj.timers = [];
    for (var n = 0; n < localst.length; ++n)
    {
        var j = localst[n].obj;
        localobj.current[j.title] = j.current()
    }
        
    for (var n = 0; n < contextlst.length; ++n)
    {
        var j = contextlst[n];
        localobj.timers.push(j.timeobj.current());
    }
    
    localStorage.setItem(url.path, JSON.stringify(localobj));
}

window.addEventListener("unload", (evt) => 
{
    savelocal();
});

window.addEventListener("visibilitychange", (evt) => 
{
    if (document.visibilityState === 'hidden') 
    {
        for (var n = 0; n < canvaslst.length; ++n)
            releaseCanvas(canvaslst[n]);
        savelocal();
        clearInterval(globalobj.main);
    }
    else
    {
        globalobj.main = setInterval(function () { yoll(); }, TIMEMAIN);
        if (globalobj.autostart)
            slideon()
        contextobj.reset();
        pageresize();
        _4cnvctx.refresh();
    }
});


