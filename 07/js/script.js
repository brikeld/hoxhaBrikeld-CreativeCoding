// largeur totale de l'écran
var width = window.innerWidth;
// hauteur totale de l'écran
var height = window.innerHeight;
// contexte 2D
var context;
// image fixed
var image = null;
// largeur et hauteur par default de l'image ou de la video
var largeur = 1920;
var hauteur = 1440;
// tableau pour stocker la grille de cercles
var grille = [];
// variable pour stocker les pixels de l'image video
var video = null;
// une variable pour définir si on utilise la webcam ou l'image fixe
var webcam = true;

const backBlur = document.querySelector(".blur");
const FullScreenImage = document.querySelector(".FullScreenImage");
console.log(FullScreenImage);

let zoneActuel = "";
let zoneActuelIndex = "";



// fonction pour créer un canvas
function createCanvas(w, h) {
  var canvas = document.createElement("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  context = canvas.getContext("2d");
  document.body.appendChild(canvas);
}

// if x <= 680 && y <= 580 -> Amérique du Nord
// if x <= 680 && y > 580 -> Amérique du Sud
// if x > 680 && x <= 1000 && y <= 450 -> Europe
// if x > 680 && x <= 1050 && y > 450 -> Afrique
// if x > 1000 && y < 700 -> Asie
// if x > 1230 && y > 700 -> Océanie

let Zones = [
  {
    nom:"amerique",
    index:0,
    minX:0,
    maxX:680,
    minY:0,
    maxY:window.innerHeight,
    banqueimg: [
      'image/amerique/cactus.jpg',
      '../image/amerique/canyon.jpeg',
      '../image/amerique/croco.jpg',
      '../image/amerique/neige.jpg',
      '../image/amerique/ville.jpg'
    ]
  },
  {
    nom:"europe",
    index:1,
    minX:680,
    maxX:1050,
    minY:0,
    maxY:440,
    banqueimg: [
      '../image/europe/grece.jpg',
      '../image/europe/grenouille.jpg',
      '../image/europe/montagne.jpeg',
      '../image/europe/paris.jpeg',
      '../image/europe/village.jpeg'
      
    ]
    
  },
  {
    nom:"afrique",
    index:2,
    minX:680,
    maxX:1050,
    minY:440,
    maxY:window.innerHeight,
    banqueimg: [
      '../image/afrique/antiloppe.jpg',
      '../image/afrique/arbre.jpg',
      '../image/afrique/hutes.jpeg',
      '../image/afrique/lycaon.jpg',
      '../image/afrique/zebre.jpg'
      
    ]
  },
  {
    nom:"asie",
    index:3,
    minX:1050,
    maxX:window.innerWidth,
    minY:0,
    maxY:700,
    banqueimg: [
      '../image/asie/cerisier.jpeg',
      '../image/asie/russie.jpeg',
      '../image/asie/satue.jpg',
      '../image/asie/singe.jpg',
      '../image/asie/tokyo.jpg'
    ]
  },
  {
    nom:"oceanie",
    index:4,
    minX:1230,
    maxX:window.innerWidth,
    minY:700,
    maxY:window.innerHeight,
    banqueimg: [
      '../image/oceanie/cailloux.jpg',
      '../image/oceanie/kakao.JPG',
      '../image/oceanie/lac.jpeg',
      '../image/oceanie/palmier.jpg',
      '../image/oceanie/sydney.jpg'
      
      
    ]
  }
];

let midi;

async function setup() {
  console.log("setup");
  createCanvas(width, height);
  // on active la gestion de la souris
  document.addEventListener("mousedown", mousePressed);


  const api = new Api();
  
  // const index = ["0,1,2,3,4,5"]
  const allCountries = ["us","fr", "ar", "ru","au","ma"];
  /*let index =
  const result = await api.getNews(allCountries[index]);
  console.log(result);*/

  midi = new MidiConnection();

  // pour l'exemple avec la webcam , on initialise la caméra
  /*
  if (webcam) {
    initialiserCamera();
  } else {
    // pour l'exemple avec l'image fixe
    image = new Image();
    // on attend que l'image soit chargée avant de l'afficher
    image.onload = () => {
      //on peut récupèrer la largeur et la hauteur de l'image
      largeur = image.width;
      hauteur = image.height;
    };
    // on définit la source de l'image
    image.src = "image/WorldMap.jpg";
  }*/

  // pour l'exemple avec l'image fixe
  image = new Image();
  // on attend que l'image soit chargée avant de l'afficher
  image.onload = () => {
    //on peut récupèrer la largeur et la hauteur de l'image
    largeur = image.width;
    hauteur = image.height;
  };

  // on définit la source de l'image
  image.src = "image/WorldMap.jpg";
  
  //on créé une grille de cercles
  // pour une grille de 1000x1000
  for (let j = 0; j < 1440; j += 10) {
    for (let i = 0; i < 1920; i += 10) {
      let circle = new Circle(i, j, 5, context);
      // on affecte un angle incrémenteal à chaque cercle
      circle.angle = i * 0.2;
      // on stock le cercle dans le tableau
      grille.push(circle);
    }
  }
  draw();

midi.addEventListener("midi", (e) => {
  console.log(e)
  if(e[3] == 16){
    let mapped = map(e[4],0,127,0,990);
    let val = Math.ceil(mapped/10)*10
    lineY = val;
  }
  if(e[3] == 0){
    lineX = e[4] * 10;
    let mapped = map(e[4],0,127,0,width - 10);
    let val = Math.ceil(mapped/10)*10
    lineX = val;
  }
  if(e[3] == 41){
    console.log("OKAY")
    backBlur.style.backdropFilter = "blur(10px)";
    FullScreenImage.style.display = "block";
    //zoneActuelIndex
    FullScreenImage.src = Zones[zoneActuelIndex].banqueimg[getRandomInt(4)];
  }

  if(e[3] == 42){
    backBlur.style.backdropFilter = "blur(0px)"; 
    FullScreenImage.style.display = "none";
  }

  console.log(lineX,lineY);
});

}

function map(val,min,max,newMin,newMax){
  return newMin + (newMax - newMin) * (val-min) / (max-min)
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}




let lineX = 0;
let lineY = 0;


function draw() {
  // on analyse les pixels de l'image
  detectPixels();
  //on efface tout l'écran en noir
  context.fillStyle = "black";
  context.fillRect(0, 0, width, height);
  // on dessine les cercles

  Zones.forEach(z => {
    if(lineX >= z.minX && lineX <= z.maxX && lineY >= z.minY && lineY <= z.maxY){
      console.log(z.nom);
      zoneActuel = z.nom;
      zoneActuelIndex = z.index;
    }
  });

  grille.forEach((circle) => {
    circle.draw();
    // le mouvment de chaque cercle est géré dans la fonction draw de la class Circle
  });
  requestAnimationFrame(draw);
}

let intensity ;

function detectPixels() {
  // on prépare une variable pour stocker les pixels
  let pixels = null;
  // on dessine l'image dans le contexte
  // attention si on veut l'image static, il faut remplacer video par image
  /*if (webcam) {
    context.drawImage(video, 0, 0);
  } else {
    context.drawImage(image, 0, 0);
  }*/
  context.drawImage(image, 0, 0);
  // on récupère les pixels de l'image
  pixels = context.getImageData(0, 0, largeur, hauteur);

  // on parcours tous les cercles
  grille.forEach((circle, i) => {
    //récupérer la couleur du pixel par l'index
    let index = ((circle.origin.y * largeur  + circle.origin.x) * 4);
    // on récupère les valeurs de rouge, vert et bleu
    let r = pixels.data[index];
    let g = pixels.data[index + 1];
    let b = pixels.data[index + 2];
    // on calcule l'intensité de la couleur

    if(r >= 250 && g >= 250 && b >= 250)
    {
      intensity = 0;
      circle.state = "water"
    }
    else
    {
      intensity = 255;
      circle.state = "terrain"
    }

    circle.checkLine(lineX,lineY,intensity);

    // circle.changeColor(r, g, b);
    // on change le rayon du cercle en fonction de l'intensité (pourcentage de 0 à 1)

  });
}

/*function initialiserCamera() {
  video = document.createElement("video");
  navigator.getMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

  navigator.getMedia(
    {
      video: { width: largeur, height: hauteur },
      audio: false,
    },
    (stream) => {
      video.srcObject = stream;
      video.play();
    },
    (error) => {
      console.log(error);
    }
  );
}*/

function mousePressed(e) {}

window.onload = function () {
  console.log("on est pret");
  setup();
};
