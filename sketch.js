let canvas, birds, boxes, pipes, pipe1, pipe2, bird_group, pipe_group;

const BIRDAMOUNT = 100;

class Pipe {
    constructor(x) {
            this.x = x;
            this.y = Math.random() * 400;
            this.pipes = new Group();
    }

    generate_groups() {
        this.pipes = new Group();
        this.y = Math.random() * 300;
        this.pipes.add(createSprite(this.x, this.y + 550, 50, 600));
        this.pipes.add(createSprite(this.x, this.y - 250, 50, 600));
        this.pipes.forEach(pipe => pipe.velocity.x = -2);
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
            this.pipes[0].position.y = this.y + 550;
            this.pipes[1].position.y = this.y - 250;
        }
    }
}

class Birb {
    constructor() {
        this.bird = createSprite(20,200,20,20);
        this.bird.velocity.y = 0;
        this.brain = new NN([
            new Layer(4, 8),
            new Layer(8, 16),
            new Layer(16, 16),
            // new Layer(16, 32),
            // new Layer(32, 16),
            new Layer(16, 8),
            new Layer(8, 4),
            new Layer(4, 2)
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
            this.bird.velocity.y -= 5;
        } else {
            this.bird.velocity.y += 0.2;
        }
        // this.bird.velocity.y += this.bird.velocity > 10 ? 0 : 0.2;
        // if(this.bird.position.y >= 600){ this.bird.velocity.y = 0;}
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

function toStart(birb) {
    pipe_group = new Group();
    pipe1 = new Pipe(475);
    pipe2 = new Pipe(250);
    pipes = [pipe1,pipe2];
    pipe1.generate_groups();
    pipe2.generate_groups();
    pipe_group.add(pipe1.pipes[0]);
    pipe_group.add(pipe1.pipes[1]);
    pipe_group.add(pipe2.pipes[0]);
    pipe_group.add(pipe2.pipes[1]);

    if (birb instanceof Birb) {
        console.log("new brains")
        birds.forEach(bird => {
            bird.brain = birb.brain.copy();
            bird.isdead = false;
            bird.bird.position.y = 300;
            bird.bird.velocity.y = 0;
        });
        birds[0].brain = birb.brain;
    } else {
        for ( let i = 0; i < BIRDAMOUNT; i++ ){
            birds.push(new Birb());
        }
    }

}

function setup() {
    c = createCanvas(800,600);
    birds = [];
    toStart(undefined);
    console.log(birds[0].brain.getVisualisationData())
}

function draw() {
    fill(0);
    let closer_pipe = pipe1;
    if(pipe1.pipes[0].position.x > pipe2.pipes[0].position.x) {
        closer_pipe = pipe2;
    }
    birds.filter(x => !x.isdead).forEach(bird => bird.move([
        closer_pipe.pipes[0].position.x,
        closer_pipe.pipes[0].position.y,
    ]));
    for (let i = 0; i < birds.length; i++){
        if (    !birds[i].isdead &&
                (closer_pipe.overlap(birds[i]) ||
                birds[i].bird.position.y > 600 ||
                birds[i].bird.position.y < 0)
                ){

            if (birds.filter(x => x.isdead == false).length == 1) {
                console.log("to start");
                toStart(birds.filter(x => !x.isdead)[0]);
            } else {
                birds[i].isdead = true;
            }
        }
    }
    bird_group = new Group();
    birds.forEach(x => x.toGroup(bird_group));
    pipes.forEach(x => x.move());
    background(255);
    rect(0,0,400,600);


    drawSprites(bird_group);
    drawSprites(pipe_group);


    /*
    Layer visualisation
     */
    let bh = 400; // brain height
    let bw = 300; // brain width
    let thebrain = birds[0].brain;
    let layer_data = thebrain.getVisualisationData()

    rect(400, 0, 800, 600);
    fill(255);

    for (let i = 0; i < layer_data.length; i++){
        let matrix = layer_data[i];

        for (let j = 0; j < matrix.length; j++){
            let vector = matrix[j];

            for (let k = 0; k < vector.length; k++){
                let node = vector[k];

                // set color based on value
                if (node < 0.5) {
                    stroke(node * 255 + 255 / 2, 0, 0);
                } else {
                    stroke(0, node * 255, 0);
                }

                pa = [
                    420 + (bw / layer_data.length) * i,
                    (bh / vector.length) * k + (bh / vector.length) / 2
                ];
                pb = [
                    420 + (bw / layer_data.length) * (i + 1),
                    (bh / matrix.length) * j + (bh / matrix.length) / 2
                ];
                line(pa[0], pa[1], pb[0], pb[1]);
                noStroke();
                ellipse(pa[0], pa[1], 4, 4);
                ellipse(pb[0], pb[1], 4, 4);
                // line(420 + bw * i, bh + bh * k, 420 + bw * (i + 1), bh + bh * j);
                // noStroke();
                // ellipse(420 + bw * i, bh + bh * k, 4, 4);
                // ellipse(420 + bw * (i + 1), bh + bh * j, 4, 4);
            }
        }
    }


    // for (let i = 0; i < wih.length; i++) {
    //     for (let j = 0; j < wih[0].length; j++) {
    //         if(wih[i][j] < 0.5) {
    //             stroke(wih[i][j] * 255 + 255 / 2,0,0);
    //         } else {
    //             stroke(0,wih[i][j] * 255,0);
    //         }
    //         line(420, 2*brain_space+brain_space*j, 500, brain_space+brain_space*i);
    //         noStroke()
    //         ellipse(420, 2*brain_space+brain_space*j, 4, 4);
    //         ellipse(500, brain_space+brain_space*i, 4, 4);
    //     }
    // }
    // for (let i = 0; i < who.length; i++) {
    //     for (let j = 0; j < who[0].length; j++) {
    //         if(who[i][j] < 0.5) {
    //             stroke(who[i][j] * 255 + 255 / 2,0,0);
    //         } else {
    //             stroke(0,who[i][j] * 255,0);
    //         }
    //         line(500, brain_space+brain_space*j, 580, 3*brain_space+brain_space*i);
    //         noStroke()
    //         ellipse(500, brain_space+brain_space*j, 4, 4);
    //         ellipse(580, 3*brain_space+brain_space*i, 4, 4);
    //     }
    // }
}


// function keyPressed() {
//     if(keyCode===32){ bird.bird.velocity.y -= 7;}
// }
