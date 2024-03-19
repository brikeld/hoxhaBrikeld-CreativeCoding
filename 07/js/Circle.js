// la définition de la classe Circle c'est comme définir une function mais sans les parenthèses
// la fonction par défaul est le constructor
// on peut passer des paramètres au constructor
// dans une class on n'écrit pas "function" pour TOUTES les fonctions
// une variable globale de class s'écrit avec "this."
class Circle {
  constructor(x, y, rayon, context) {
    this.x = x;
    this.y = y;
    this.origin = { x: x, y: y };
    this.target = { x: x, y: y };

    this.speed = 1;
    this.uniteDeTemps = 0;
    this.uniteDeTemps1 = 0;

    this.rayon = rayon;
    this.rayonOrigin = { rayon: rayon };
    this.rayonFinal = { rayon: rayon };

    this.context = context;
    // on initialise une couleur au bol
    this.color = "white";
    this.rotation = 0;
    this.angle = 0;
    this.state = "water";
  }

  changeColor(r, g, b) {
    // on affect une couleur aléatoire
    this.color = `rgb(${Math.random() * 255},${Math.random() * 255},${
      Math.random() * 255
    })`;

    // this.color = `rgb(${r},${g},${b})`;

    //on change la taille du rayon
    // this.rayon = Math.random() * 100;
  }

  changeRadius(pourcentage) {
    this.rayon = this.rayonOrigin.rayon * pourcentage;
  }

  isInMe(mouseX, mouseY) {
    // on calcule la distance entre la souris et le centre
    let d = this.dist(mouseX, mouseY, this.x, this.y);
    // on compare cette distance au rayon
    if (d < this.rayon) {
      return true;
    } else {
      return false;
    }
  }

  checkLine(lineX,lineY,intens,zone){
    if(this.x == lineX || lineY == this.y){
      this.color = "red";
    }
    else
    {
      this.color = `rgb(${intens},${intens},${intens})`;
    }
  }

  draw() {
    //pour préparer la rotation
    this.context.save();
    //on translate le contexte au centre du cercle
    this.context.translate(this.x, this.y);
    //on fait la rotation
    this.context.rotate(this.rotation);
    //on dessine le cercle
    this.context.fillStyle = this.color;
    Zones.forEach(z => {
      if(z.nom == zoneActuel){
        if(this.x >= z.minX && this.x <= z.maxX && this.y >= z.minY && this.y <= z.maxY){
          if(this.state == "terrain")
          {
            this.context.fillStyle = "blue";
          }
        }
      }
    });
    this.context.beginPath();
    this.context.arc(0, 0, this.rayon, 0, 2 * Math.PI, true);
    // this.context.rect(0, 0, this.rayon * 2, this.rayon * 2);
    this.context.fill();
    this.context.closePath();

    this.context.restore();



    // this.rapetisser();
  }

  dist(x1, y1, x2, y2) {
    // calcule la distance entre deux points
    // pythagore power
    let d = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    return d;
  }

  definirDestination(x, y) {
    this.target = { x: x, y: y };
    this.uniteDeTemps = 0;
  }

  definirRayonAleatoire() {
    this.rayonFinal.rayon = Math.random() * 200 + 50;
    this.uniteDeTemps1 = 0;
  }


  rapetisser() {
    let differenceRayon2 = this.rayonFinal.rayon - this.rayon;
    // console.log(differenceRayon2);
    if (Math.abs(differenceRayon2) < 0.01) {
      this.rayonOrigin = { rayon: this.rayonFinal.rayon };
      return;
    }

    const easing = Easing.elasticOut(this.uniteDeTemps1);
    this.uniteDeTemps1 += 0.01;
    let differenceRayon = this.rayonFinal.rayon - this.rayonOrigin.rayon;
    this.rayon = this.rayonOrigin.rayon + differenceRayon * easing;
  }
}
