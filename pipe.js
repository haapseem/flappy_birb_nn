
let pipeup = 225;
let pipedown = 525;

class Pipe {
    constructor(x) {
            this.x = x;
            this.y = Math.random() * 400;
            this.pipes = new Group();
    }

    generate_groups() {
        let img = loadImage('assets/pipe.png');
        this.pipes = new Group();
        this.y = Math.random() * 300;
        this.pipes.add(createSprite(this.x, this.y + pipedown, 40, 600));
        this.pipes.add(createSprite(this.x, this.y - pipeup, 40, 600));
        this.pipes.forEach(pipe => {
            pipe.velocity.x = SPEED;
            pipe.addImage(img);
        }); // SPEED defined in sketch.js
        return this.pipes;
    }

    overlap(x) {
        return x.overlap(this.pipes);
    }

    move() {
        if(this.pipes[0].position.x <= -25){
            this.y = Math.random() * 300;
            this.pipes.map(pipe => {
                pipe.position.x += 450;
                return pipe;
            });
            this.pipes[0].position.y = this.y + pipedown;
            this.pipes[1].position.y = this.y - pipeup;
        }
    }
}
