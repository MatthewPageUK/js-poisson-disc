"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PoissonDisc = function () {
	function PoissonDisc(w, h, r, k, n) {
		_classCallCheck(this, PoissonDisc);

		this.width = w;
		this.height = h;
		this.r = r;
		this.k = k;
		this.n = n;
		this.cellSize = Math.floor(this.r / Math.sqrt(this.n));
		this.cols = Math.floor(this.width / this.cellSize);
		this.rows = Math.floor(this.height / this.cellSize);
		this.points = [];
		this.active = [];
		this.grid = [];
		this.reset();
	}

	_createClass(PoissonDisc, [{
		key: "reset",
		value: function reset() {
			this.points = [];
			this.active = [];
			this.grid = [];
			this.initialiseGrid();
			this.addPoint(this.getRandom(0, this.width), this.getRandom(0, this.height));
		}
	}, {
		key: "run",
		value: function run() {
			this.reset();
			while (this.active.length > 0) {
				this.step(1);
			}
		}
	}, {
		key: "step",
		value: function step(n) {
			for (var l = 0; l < n; l += 1) {
				if (this.active.length > 0) {
					var randomActive = this.getRandom(0, this.active.length);
					var currentPoint = this.points[this.active[randomActive]];
					var foundNewPoint = false;
					for (var tries = 0; tries < this.k; tries += 1) {
						var pointValid = true;
						var newAngle = tries * (Math.PI * 2 / this.k);
						var newDist = this.getRandom(this.r, this.r * 2);
						var offsetX = Math.cos(newAngle) * newDist;
						var offsetY = Math.sin(newAngle) * newDist;
						var newX = Math.floor(currentPoint.px + offsetX);
						var newY = Math.floor(currentPoint.py + offsetY);
						var newGridX = Math.floor(newX / this.cellSize);
						var newGridY = Math.floor(newY / this.cellSize);
						if (newX > 0 && newX < this.width && newY > 0 && newY < this.height) {
							if (this.grid[newGridY][newGridX] < 0) {
								for (var i = -1; i <= 1; i++) {
									for (var j = -1; j <= 1; j++) {
										var neighbourGridX = newGridX + j;
										var neighbourGridY = newGridY + i;
										if (neighbourGridX >= 0 && neighbourGridY >= 0 && neighbourGridX < this.cols && neighbourGridY < this.rows && (neighbourGridX !== newGridX || neighbourGridY !== newGridY)) {
											if (this.grid[neighbourGridY][neighbourGridX] >= 0) {
												var neighbourIndex = this.grid[neighbourGridY][neighbourGridX];
												var neighbour = this.points[neighbourIndex];
												var dist = Math.sqrt((newX - neighbour.px) * (newX - neighbour.px) + (newY - neighbour.py) * (newY - neighbour.py));
												if (dist < this.r) pointValid = false;
											}
										}
									}
								}
							} else {
								pointValid = false;
							}
						} else {
							pointValid = false;
						}
						if (pointValid) {
							foundNewPoint = true;
							this.addPoint(newX, newY);
						}
					}
					if (!foundNewPoint) {
						this.active.splice(randomActive, 1);
					}
				}
			}
		}
	}, {
		key: "addPoint",
		value: function addPoint(x, y) {
			var point = {
				px: parseInt(x),
				py: parseInt(y),
				gx: Math.floor(parseInt(x) / this.cellSize),
				gy: Math.floor(parseInt(y) / this.cellSize)
			};
			var pointIndex = this.points.length;
			this.points.push(point);
			this.grid[point.gy][point.gx] = pointIndex;
			this.active.push(pointIndex);
		}
	}, {
		key: "initialiseGrid",
		value: function initialiseGrid() {
			for (var y = 0; y <= this.rows; y += 1) {
				this.grid[y] = [];
				for (var x = 0; x <= this.cols; x += 1) {
					this.grid[y][x] = -1;
				}
			}
		}
	}, {
		key: "getRandom",
		value: function getRandom(min, max) {
			return Math.floor(Math.random() * (max - min)) + min;
		}
	}]);

	return PoissonDisc;
}();