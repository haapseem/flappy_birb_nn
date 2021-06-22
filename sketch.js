let canvas, birds, boxes, pipes, bird_group, pipe_group, mr;

const BIRDAMOUNT = 50;
const BIRBSTART = 300;
const SPEED = -3;
let movements = 0;
let generation = 0;


class GameGenerator {
    static createPipes() {
        pipe_group = new Group();
        pipes = [
            new Pipe(350),
            new Pipe(575)
        ];
        pipes.forEach(pipe => {
            pipe.generate_groups();
            pipe.pipes.forEach(x => {
                pipe_group.add(x);
            });
        });
    }

    static createBirds(master_brain) {
        if (master_brain instanceof Birb) {
            generation++;
            console.table(master_brain.brain)
            birds[0].brain.layers = master_brain.brain.layers.map(x => {
                let layer = new Layer(x.input_nodes, x.output_nodes);
                layer.weights = Matrix.add(x.weights, 0);
                layer.bias = Matrix.add(x.bias, 0);
                return layer;
            });
            birds.slice(1, birds.length).forEach(bird => bird.brain = birds[0].brain.copy(mr));
            birds.forEach(bird => {
                bird.isdead = false;
                bird.bird.position.y = BIRBSTART;
                bird.bird.velocity.y = 0;
            });
        } else {
            for ( let i = 0; i < BIRDAMOUNT; i++ ){
                birds.push(new Birb());
            }
            birds[0].bird.shapeColor = color(0,255,255);

        } movements = 0;
    }

    static toStart(bird) {
        GameGenerator.createPipes();
        GameGenerator.createBirds(bird)
    }
}

function setup() {
    c = createCanvas(800,600);
    birds = [];
    GameGenerator.toStart(undefined);
    // console.log(birds[0].brain.getVisualisationData())
}

function draw() {
    mr = 1 / (movements / 100);
    movements++;
    fill(0);
    let closer_pipe = pipes[0];
    if(pipes[0].pipes[0].position.x > pipes[1].pipes[0].position.x) {
        closer_pipe = pipes[1];
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
                GameGenerator.toStart(birds.filter(x => !x.isdead)[0]);
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

    stroke(255);
    text('GEN: ' + generation, 10, 30);
    text('Mutation: ' + (mr > 1 ? 1 : mr), 10, 10);

    let minium_node = min(layer_data.map(x => min(x.map(y => min(y)))));
    let maximum_node = max(layer_data.map(x => max(x.map(y => max(y)))));

    let middlepoint = (minium_node + maximum_node) / 2;
    let multiplier = 255 / (maximum_node - middlepoint);

    for (let i = 0; i < layer_data.length; i++){
        let matrix = layer_data[i];

        for (let j = 0; j < matrix.length; j++){
            let vector = matrix[j];

            for (let k = 0; k < vector.length; k++){
                let node = vector[k];

                // set color based on value
                stroke((node - middlepoint) * multiplier, (node - middlepoint) * -multiplier, 0)

                pa = [420 + (bw / layer_data.length) * i,(bh / vector.length) * k + (bh / vector.length) / 2];
                pb = [420 + (bw / layer_data.length) * (i + 1),(bh / matrix.length) * j + (bh / matrix.length) / 2];
                line(pa[0], pa[1], pb[0], pb[1]);
                noStroke();
                ellipse(pa[0], pa[1], 4, 4);
                ellipse(pb[0], pb[1], 4, 4);
            }
        }
    }
}

function keyPressed() {
    if (keyCode===32) {
        movements = 1000000000;
        let birb = birds.filter(x => !x.isdead)[0];
        GameGenerator.toStart(birb);
    }
}
