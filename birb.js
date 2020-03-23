
class Birb {
    constructor() {
        let img = loadImage('assets/birb.png');
        this.bird = createSprite(20,BIRBSTART,20,20);
        this.bird.shapeColor = color(0,255,0);
        this.bird.velocity.y = 0;
        this.brain = new NN([
            new Layer(4, 8),
            new Layer(8, 16),
            // new Layer(16, 32),
            // new Layer(32, 16),
            new Layer(16, 8),
            new Layer(8, 2)
        ]); // bird y.position, y.velocity, 2x (pipe.y, pipe.x)
        this.isdead = false;
    }

    move(input_array) {
        let prediction = this.brain.predict([
            this.bird.position.y / 600 - 0.5,
            this.bird.velocity.y / 10,
            input_array[0] / 400 - 0.5,
            input_array[1] / 600 - 0.5,
        ]);
        if(prediction[0] > prediction[1]){
            this.bird.velocity.y -= 7;
        } else {
            this.bird.velocity.y += 0.3;
        }
    }

    overlap(x) {
        return this.bird.overlap(x);
    }

    toGroup(group) {
        if (!this.isdead){
            group.add(this.bird);
        }
    }
}
