export class Transform{
	constructor(_x = 0, _y = 0, _r = 0) {
		this.x = _x;
		this.y = _y;
		this.r = _r;
		this.vx = 0;
		this.vy = 0;
		this.ax = 0;
		this.ay = 0;
		this.dx = 0;
		this.dy = 0;
		this.vr = 0;
		this.ar = 0;
		this.dr = 0;
	}

	setDamping(_damp){
		this.dr = this.dx = this.dy = _damp;
	}

	distance(transform){
		var disX = transform.x - this.x;
		var disY = transform.y - this.y;

		return Math.sqrt(disX * disX + disY * disY);
	}

	update(){
		this.vx+=this.ax;
		this.vy+=this.ay;
		this.vr+=this.ar;

		this.vx*=this.dx;
		this.vy*=this.dy;
		this.vr*=this.dr;

		this.x+=this.vx;
		this.y+=this.vy;
		this.r+=this.vr;
	}
}