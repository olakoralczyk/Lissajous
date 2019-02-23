window.requestAnimFrame =
    (function () {
        'use strict';

        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback, element) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

var Lissajous = (function () {
    'use strict';

    var g = {};

    g.getMainCenters = function (x, y, r) {
        var q = [];
        for (var i = 1; i < 12; i = i + 2) {
            q[i - 1] = x + r * Math.cos(2 * Math.PI * (i * 30) / 360);
            q[i] = y + r * Math.sin(2 * Math.PI * (i * 30) / 360);
        }
        return q;
    }

    g.init = function () {
        g.c = document.getElementById("canv");
        g.ctx = g.c.getContext("2d");

        g.c.width = window.innerWidth;
        g.c.height = window.innerHeight;

        g.time = 0;
        g.a = 3; //ω_a
        g.b = 3.3; //ω_b
        g.A = 3.8; //A,(X value)
        g.B = 3.8; //B,(Y value)
        g.phase = Math.PI * 0.33;
        g.multiplier = 0.33; //Phase: Pi *
        g.thickness = 1; //Line thickness
        g.color = 180; //Color change 
        g.speed = 3; //Drawing speed
        g.count = 0;

        g.base = {
            x: g.c.width / 2, //Schema coordinates, center in half of the screen
            y: g.c.height / 2
        };
    };

    g.gui = function () {
        var gui = new dat.GUI();
        gui.add(g, 'A', 0, 10, 0.01).name('A,(X value)').onChange(function () {
            g.x = g.A * 30;
            g.mainPoints = g.getMainCenters(g.x, g.y, g.r);
            g.count = 0;
            g.clear();
        });
        gui.add(g, 'B', 0, 10, 0.01).name('B,(Y value)').onChange(function () {
            g.y = g.B * 30;
            g.mainPoints = g.getMainCenters(g.x, g.y, g.r);
            g.count = 0;
            g.clear();
        });
        gui.add(g, 'a', 0, 10, 0.01).name('ω_a').onChange(function () {
            g.clear();
        });
        gui.add(g, 'b', 0, 10, 0.01).name('ω_b').onChange(function () {
            g.clear();
        });
        gui.add(g, 'multiplier', 0, 2, 0.01).name('Phase: Pi * ').onChange(function () {
            g.phase = Math.PI * g.multiplier;
            g.clear();
        });
        gui.add(g, 'thickness', 1, 3).name('Line thickness').onChange(function () {
            g.count = 0;
            g.clear();
        });
        gui.add(g, 'color', 0, 180).name('Color change speed');
        gui.add(g, 'speed', 0.1, 3).name('Drawing speed');
        gui.add(g, 'clear').name('Clear image!');
    };

    g.clear = function () {
        g.ctx.clearRect(0, 0, g.c.width, g.c.height);
    };

    g.animate = function () {
        requestAnimFrame(g.animate);
        g.draw();
    };

    g.draw = function () {
        g.ctx.beginPath();
        g.ctx.fillStyle = "hsla(" + (g.time * g.color) % 360 + ", 100%, 50%, 1.0)";
        for (var i = 0; i < 10 * g.speed; i++) {
            g.time += 0.0015;
            var x = (g.A * 30) * Math.sin(g.a * g.time + g.phase) + g.base.x;
            var y = (g.B * 30) * Math.sin(g.b * g.time) + g.base.y;
            g.ctx.arc(x, y, g.thickness, 0, Math.PI * 2, true);
        }
        g.ctx.closePath();
        g.ctx.fill();
    };
    return g;
})();
Lissajous.init();
Lissajous.gui();
Lissajous.animate();