/////////////////////////////////////////////////////////////
//
//  Clock V2.3 (c) 2016 www.atomek.de Jan Schirrmacher
//
//  License: feel free to use this code for your purpose.
//  You are not allowed is to claim ownership of this code.
//
//  Usage:
//
//  - Link the source to you project in the <head>-section:
//    <script src="www.atomek.de/lib/clock.min.js"></script>
//  - Create a <canvas id="clockcanvas">-Element anywhere in
//    your html-page.
//  - Create a clock object, call setup() once and draw()
//    everytime you want to show/update the clock.
//
//  Example for a running clock:
//
//<script>
//
//  window.onload = function() {
//    clock = new Clock();
//    clock.setup(document.getElementById('clockcanvas'));
//    clock.draw();
//    setInterval('clock.draw()', 1000);
//  }
//
//</script>
/////////////////////////////////////////////////////////////

  

// Central clock-object
Clock = function() {
    this.shadowVisible = true;
    this.bodyColor = "hsl(220, 50%, 40%)";
    this.faceColor = "hsl(60, 47%, 90%)";
    this.markColor = "black";
    this.handColor = "black";
    this.secondHandColor = "#cc0000";
    this.bodyVisible = true;
    this.faceVisible = true;
    this.mark5Visible = true;
    this.mark60Visible = true;
    this.secondMarksVisible = true;
    this.hourMinuteHandVisible = true;
    this.secondHandVisible = true;
    this.glassVisible = true;
    this.animated = true;
    this.padding = 0;
    this.oncustomdraw = null; // function(context, metrics)
    this.ondrawhourhand = null;  // function(context, metrics, time)
    this.ondrawminutehand = null;
    this.ondrawsecondhand = null;
    this.time = null; // [hour, min, sec]
  };
  
  // An alternative arm
  Clock.prototype.drawhourhand1 = function(ctx, m) {
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    
    // Base plate
    circle(ctx, 0, 0, m.hw*.75);
    
    // Outer shape
    ctx.moveTo(0, -m.hw/3);
    ctx.lineTo(m.h1-0.12*m.rf, -m.hw/1.5);
    ctx.lineTo(m.h1, 0);
    ctx.lineTo(m.h1-0.12*m.rf, m.hw/1.5);
    ctx.lineTo(0, m.hw/3);
    ctx.lineTo(0, -m.hw/3);
    
    // subtract inner shape
    ctx.moveTo(0, 0);
    ctx.lineTo(m.h1-0.12*m.rf, m.hw/2.5);
    ctx.lineTo(m.h1-m.hw/2, 0);
    ctx.lineTo(m.h1-0.12*m.rf, -m.hw/2.5);
    ctx.lineTo(0, 0);  
    ctx.fill();
  };
  
  // Links a Clock-instance to a canvas.
  // Has to be called before usage of the draw-functions
  // Syntax I:  setup(canvas, x, y, w, h) draws the clock anywhere to the canvas
  // Syntax II: setup(canvas) centers the clock on the canvas
  Clock.prototype.setup = function(canvas, x, y, w, h) {
  
    var m = new Object();
    if (typeof(x)=='undefined') {
      var x = 0;
      var y = 0;
      m.w = canvas.width;
      m.h = canvas.height;
    } else {
      m.w = w;
      m.h = h;
    }
    m.xc = x + m.w/2;
    m.yc = y + m.h/2;
  
    // max r
    if (m.w<h)
      m.rf = m.w/2;
    else
      m.rf = m.h/2;
    m.rf -= this.padding;
    if (this.shadowVisible)
      m.rf -= m.rf/15;
  
    m.rb = m.rf;
    if (this.bodyVisible)
      m.rf *= 0.85;
    
    // Marks
    m.t0 = m.rf*0.97;
    m.t1 = m.rf*0.90;
    m.t2 = m.rf*0.75;  
    
    // Hour
    m.hw = m.rf*0.1;
    m.h0 = -m.rf*0.1;
    m.h1 = m.rf*0.6;
    
    // Minute
    m.mw = m.rf*0.06;
    m.m0 = -m.rf*0.15;
    m.m1 = m.rf*0.90;
    
    // Seconds
    m.sw = m.rf*0.04;
    m.s0 = -m.rf*0.2;
    m.sr = m.rf*0.1;
    m.s1 = m.rf*0.6;
    m.s2 = m.rf*0.94;
    
    this.metrics = m;
    this.context = canvas.getContext("2d");
  };
  
  // Draws the clock, depending on the visible parts, see Clock() 
  // Syntax I: draw(hour, min, sec);
  // Syntax II: draw(date); // Date-object
  // Syntax III: draw(); // current Date
  Clock.prototype.draw = function(time) {
    var t;
    if (typeof(time)=="Date")
      t = [time.getHours(), time.getMinutes(), Math.round((time.valueOf()/60000)%1*60)];    
    else if (typeof(time)=='undefined') {
      var now = new Date();
      t = [now.getHours(), now.getMinutes(), Math.round((now.valueOf()/60000)%1*60)];    
    } else
      t = time;
    this.clearClock();
    if (this.faceVisible)
      this.drawFace(this.context);
    if (this.bodyVisible)
      this.drawBody(this.context);
    if (this.hourMinuteHandVisible) {
      this.drawHourHand(t);
      this.drawMinuteHand(t);
    }
    if (this.secondHandVisible) {
        this.drawSecondHand(t);
    }
    if (this.glassVisible)
      this.drawGlass(this.context);
    this.time = t;
  };
  
  // Draws the clocks corpus 
  Clock.prototype.drawBody = function(ctx) {
    if (typeof(ctx)=='undefined')
      ctx = this.context;
    var m = this.metrics;
  
    // Outer frame
    ctx.save();    
    ctx.fillStyle = this.bodyColor;
    ctx.beginPath();
    circle(ctx, m.xc, m.yc, m.rb);
    circle(ctx, m.xc, m.yc, m.rf, true);
    this.enableShadow(ctx, m.rf/20);  
    ctx.fill();  
    ctx.restore();
    
    var t = m.rb*0.02;
    var d = m.rb*.707;
    ctx.lineWidth = t;
  
    // outer edge
    var grd = ctx.createLinearGradient(m.xc-2*d, m.yc-2*d, m.xc+2*d, m.yc+2*d);
    grd.addColorStop(0, "white");
    grd.addColorStop(0.5, this.bodyColor);
    grd.addColorStop(1, "black");
    ctx.strokeStyle = grd;
    ctx.beginPath();
    ctx.arc(m.xc, m.yc, m.rb-t/2, 1*Math.PI/4, 9*Math.PI/4);
    ctx.stroke();
  
    // inner edge
    grd = ctx.createLinearGradient(m.xc-2*d, m.yc-2*d, m.xc+2*d, m.yc+2*d);
    grd.addColorStop(0, "black");
    grd.addColorStop(0.5, this.bodyColor);
    grd.addColorStop(1, "white");
    ctx.strokeStyle = grd;
    ctx.beginPath();
    ctx.arc(m.xc, m.yc, m.rf+t/2, 1*Math.PI/4, 9*Math.PI/4);
    ctx.stroke();  
  };
  
  Clock.prototype.draw5MinMark = function(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.metrics.t0, 0);
    ctx.lineTo(this.metrics.t2, 0);
    ctx.stroke();
  };
  
  Clock.prototype.drawSecMark = function(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.metrics.t0, 0);
    ctx.lineTo(this.metrics.t1, 0);    
    ctx.stroke();
  };
  
  // draws the clocks face and marks
  Clock.prototype.drawFace = function(ctx) {
    if (typeof(ctx)=='undefined')
      ctx = this.context;
    var m = this.metrics;
    
    ctx.save();
  
    // Clock face
    ctx.fillStyle = this.faceColor;
    ctx.beginPath();
    circle(ctx, m.xc, m.yc, m.rf);
    ctx.fill();
    
    if (this.mark5Visible) {
      // 5-Min marks
      ctx.strokeStyle = this.markColor;
      ctx.lineCap = "butt";
      ctx.translate(m.xc, m.yc);
      ctx.lineWidth = m.rf/18;
      for (var i=0; i<12; i++) {
        ctx.rotate(Math.PI/6);
        this.draw5MinMark(ctx);
      }
    }
    
    // Sec-Marcs
    if (this.mark60Visible) {
      ctx.lineWidth = m.rf/40;
      for (var i=0; i<60; i++) {
        ctx.rotate(Math.PI/30);
        if (!this.mark5Visible || ((i+1)/5)%1!=0)
          this.drawSecMark(ctx);
      }
    }
  
    ctx.restore();
    
    if (this.oncustomdraw!=null) {
      ctx.save();
      this.oncustomdraw(ctx, m);
      ctx.restore();
    }
  };
  
  // Draws the hour hand
  Clock.prototype.drawHourHand = function(t) {
    var c = this.context;
    var m = this.metrics;
    
    c.save();
  
    this.enableShadow(c, m.rf/20);
  
    c.strokeStyle = this.handColor;
    c.lineWidth = m.hw;
    c.lineCap = "butt";
    c.translate(m.xc, m.yc);
    
    var a = t[0]<12?t[0]:t[0]-12;
    c.rotate(((t[1]/3600+t[1]/60+a)-3)/6*Math.PI);
    if (this.ondrawhourhand == null || this.ondrawhourhand(c, m, t)===true) {
      c.beginPath();
      c.moveTo(m.h0, 0);
      c.lineTo(m.h1, 0);
      c.stroke();
    }
    
    c.restore();
  };
  
  // Draws the minutes hand
  Clock.prototype.drawMinuteHand = function(t) {
    var c = this.context;
    var m = this.metrics;
    
    c.save();
  
    this.enableShadow(c, m.rf/20);
  
    c.strokeStyle = this.handColor;
    c.lineWidth = m.mw;
    c.lineCap = "butt";
    c.translate(m.xc, m.yc);
    
    c.rotate((t[2]/60+t[1]-15)/30*Math.PI);
    if (this.ondrawminutehand == null || this.ondrawminutehand(c, m, t)===true) {
      c.beginPath();
      c.moveTo(m.m0, 0);
      c.lineTo(m.m1, 0);
      c.stroke();
    }
    c.restore();
  };
  
  Clock.prototype.drawAnimated = function(t) {
    if (this.time==null)
      this.draw(t);
    else {
      
    }
  };
  
  // Draws the second hand
  Clock.prototype.drawSecondHand = function(t) {
    var c = this.context;
    var m = this.metrics;
    
    c.save();
  
    this.enableShadow(c, m.rf/20);
  
    c.translate(m.xc, m.yc);
    
    c.fillStyle = this.secondHandColor;
    c.rotate((t[2]-15)/30*Math.PI);
    
    if (this.ondrawsecondhand == null || this.ondrawsecondhand(c, m, t)===true) {
      c.beginPath();
      circle(c, 0, 0, m.sw);
      circle(c, m.s1, 0, m.sr);
      circle(c, m.s1, 0, m.sr/2, true);
      c.rect(m.s0, -m.sw/2, m.s1-m.s0-m.sw*1.5, m.sw);
      c.rect(m.s1+m.sw*1.5, -m.sw/3, m.s2-(m.s1+m.sw*1.5), m.sw*2/3);
      c.fill();
    }
  
    c.restore();
  };
  
  // Draws then glass ontop of the clock
  Clock.prototype.drawGlass = function(ctx) {
    if (typeof(ctx)=='undefined')
      ctx = this.context;
    var m = this.metrics;
  
    ctx.save();
    var e = m.rf*.55;
    var grd = ctx.createRadialGradient(m.xc-e, m.yc-e, 0, m.yc, m.xc, m.rf);
    grd.addColorStop(0.0, "hsla(0, 0%, 100%, 0.95)");
    grd.addColorStop(0.1, "hsla(0, 0%, 100%, 0.70)");
    grd.addColorStop(0.5, "hsla(0, 0%, 100%, 0.2)");
    grd.addColorStop(0.7, "hsla(0, 0%, 100%, 0.17)");
    grd.addColorStop(1.0, "hsla(0, 0%, 90%, 0.1)");
    ctx.fillStyle = grd;
    ctx.beginPath();
    circle(ctx, m.xc, m.yc, m.rf);
    ctx.fill();  
    ctx.restore();
  };
  
  // In preparation to redraw the animated hands
  Clock.prototype.clearClock = function() {
    var c = this.context;
    var m = this.metrics;
    c.clearRect(0, 0, m.w, m.h);
  };
  
  
  // checks id shadow rewuired and sets it
  Clock.prototype.enableShadow = function(ctx, size) {
    var m = this.metrics;
    if (this.shadowVisible) {
      ctx.shadowOffsetX = size;
      ctx.shadowOffsetY = size;
      ctx.shadowBlur = size;
      ctx.shadowColor = "#111111";    
    }
  };
  
  // helping function
  Clock.prototype.start = function() {
    var clock = this;
    setInterval(function() {clock.draw()}, 1000);
  };
  
  circle = function(ctx, x, y, r, anticlockwise) {
    ctx.arc(x, y, r, 0, 2*Math.PI, typeof(anticlockwise)=='boolean' && anticlockwise);
  };
  
  hour2rad = function(value) {
    return ((15 - value % 12)/6*Math.PI)%(2*Math.PI);
  };
  
  minute2rad = function(value) {
    return ((75 - value % 60)/30*Math.PI)%(2*Math.PI);
  };
  
  second2rad = function(value) {
    return ((75 - value % 60)/30*Math.PI)%(2*Math.PI);
  };

  var clock = new Clock;      
  var mhandimg = new Image();
  mhandimg.src = "mhand128x32.png";
  var hhandimg = new Image();
  hhandimg.src = "hhand128x32.png";

  // Initialisiet die Uhr nachdem der Canvas geladen wurde
  window.onload = function() {
    clock.setup(document.getElementById('clockcanvas'));
    clock.bodyVisible = false;
    clock.faceVisible = false;
    clock.glassVisible = false;
    clock.ondrawhourhand = function(ctx, m, t) {
      ctx.drawImage(hhandimg, -16, -16);
    };
    clock.ondrawminutehand = function(ctx, m, t){
      ctx.drawImage(mhandimg, -16, -16);
    };
    clock.ondrawsecondhand = function(ctx, m, t) {
      var a = second2rad(t[2]);
      var pi4 = Math.PI/4;
      if (a>pi4 && a<3*pi4 || a>5*pi4 && a<7*pi4)
        var r = Math.abs(m.rf/Math.sin(a));
      else
        var r = Math.abs(m.rf/Math.cos(a));
      m.s1 = r*.8;
      m.s2 = r*1.2;
      return true;
    };
    clock.draw();
    setInterval('clock.draw();', 1000);
  }