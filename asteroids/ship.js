class Ship {
    constructor(x, y, id) {
        this.x = x;
        this.y = y;
		this.id = id;
        this.heading = 0;
        this.velocity = 0;
        this.size = 20;
        this.rockets = [];
        this.maxRockets = 10;
        this.maxRocketAge = 5;
        this.maxVelocity = 50;
        this.minVelocity = -25;
    }
    
    fireRocket() {
       let youngestRocketAge = this.rockets.length > 0 ? this.rockets[this.rockets.length - 1].age : Infinity;

        if (this.rockets.length < this.maxRockets && youngestRocketAge > 0.4) {
            this.rockets.push(new Rocket(this._getTipPos().x, this._getTipPos().y, this.heading));
        }
    }
    
    accelerate() {
        if (this.velocity < this.maxVelocity) {
            this.velocity += 5;
        }
    }
    
    brake() {
        if (this.velocity > this.minVelocity) {
            this.velocity -= 5;
        }
    }
    
    turnLeft() {
        this.heading <= 0 ? this.heading = 359 : this.heading -= 5;
    }
    
    turnRight() {
        this.heading >= 360 ? this.heading = 1 : this.heading += 5;
    }
    
    render() {
        this._renderShip()
        this._renderRockets()
    }
    
    _renderShip() {
        let x = this._getTipPos().x;
        let y = this._getTipPos().y
        
        game.ctx.beginPath();
        let opposite = this.heading <= 180 ? this.heading + 180 : this.heading - 180;
        let startAngle = Helpers.toRadians(opposite - 22.5);
        let endAngle = Helpers.toRadians(opposite + 22.5);
        game.ctx.arc(x, y, this.size, startAngle, endAngle);
        game.ctx.lineTo(x, y);
        game.ctx.closePath();
        game.ctx.lineWidth = 2;
        game.ctx.strokeStyle = '#77ffff';
        game.ctx.stroke();
    }
    
    _getTipPos() {
        return {
            x: this.x + Helpers.dXFromAngleAndHypot(this.heading, this.size / 2),
            y: this.y + Helpers.dYFromAngleAndHypot(this.heading, this.size / 2)
        };
    }
    
    _renderRockets() {
        for (let rocket of this.rockets) {
            rocket.render();
        }
    }

	toJson() {
		const rocketArr = [];
		for (let rocket of this.rockets) {
			rocketArr.push({
				x: rocket.x,
				y: rocket.y,
				heading: rocket.heading,
				velocity: rocket.velocity,
				size: rocket.size,
				xage: rocket.age,
			});
		}

		return {
			x: this.x,
			y: this.y,
			heading: this.heading,
			velocity: this.velocity,
			size: this.size,
			rockets: rocketArr,
			maxRockets: this.maxRockets,
			maxRocketAge: this.maxRocketAge,
			maxVelocity: this.maxVelocity,
			minVelocity: this.minVelocity
		};
	}
}

module.exports.Ship = Ship;