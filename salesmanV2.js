//====================================================
// HELPER FUNCTIONS
//====================================================
function isWithinCity(userX, userY, cityX, cityY) {
  return (userX > cityX - CITY_DIAMETER / 2 && userX < cityX + CITY_DIAMETER / 2 && 
          userY > cityY - CITY_DIAMETER / 2 && userY < cityY + CITY_DIAMETER / 2);
}

function removeCity(index, coords,cities) {
  coords.splice(index, 1);
  cities.splice(index, 1);
}

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

function perms(input) {
  var data = input.slice();
  var permutations = [];
  var n = data.length;

  if (n === 0) {
    return [
      []
    ];
  } else {
    var first = data.shift();
    var words = perms(data);
    words.forEach(function(word) {
      for (var i = 0; i < n; ++i) {
        var tmp = word.slice();
        tmp.splice(i, 0, first)
        permutations.push(tmp);
      }
    });
  }

  return permutations;
}

function indexOfTupleArray(obj,array){
    for(var i = 0; i<array.length;i++){
        if(obj[0]==array[i][0]){
            if(obj[1]==array[i][1]){
                return i;
            }
        }
    }
    for(var i = 0;i<array.length;i++){
        if(obj[1]==array[i][0]){
            if(obj[0]==array[i][1]){
                return i;
            }
        }
    }
    return -1;
}

//====================================================
// IMPORTS AND CONSTANTS
//====================================================

import P5Behavior from 'p5beh';
import * as Display from 'display';

const pb = new P5Behavior();
const CITY_DIAMETER = 64;
const SPACE_BETWEEN = 100;

// pb.preload = function(p) {}

//====================================================
// SETUP
//====================================================
var img;
var NamesString="ABCDEFGHI";
var citiesnum = Math.floor(Math.random() * 6) + 4;
var oldcitiesnum=citiesnum;
var citiescoords = [];
var abscitiescoords = [];
var cities=[];
var abscities=[];
var bridgesconnect = [];
var curCityIndex = 0;
var x = [];
var w = [];
var bridgesscores=[];
var Score = 0;
var highScore = 4608;
var indexList=[];
var GameEnded=0;
//Next var for DEBUG. REMOVE IN FINAL VERSION!
var test = [];
var distanceArray=createArray(citiesnum,citiesnum);

pb.setup = function(p) {
    for (var i = 0; i<citiesnum; i++){
        cities.push(NamesString[i]);
        abscities.push(NamesString[i]);
        indexList.push(i);
    }
    indexList.splice(0,1);
    for (var i = CITY_DIAMETER; i < 576 - CITY_DIAMETER - 24; i++) {
        x.push(i);
    }
    for (var i = CITY_DIAMETER; i < 576 - CITY_DIAMETER; i++) {
        w.push(i);
    }
    for (var i = 0; i < citiesnum; i++) {
        var a = this.random(w);
        var b = this.random(x);
        var far_enough = true;
        for (var z = 0; z < citiescoords.length; z++) {
            var y = citiescoords[z];
            if (Math.sqrt(Math.pow(a - y[0], 2) + Math.pow(b - y[1], 2)) < SPACE_BETWEEN) {
                far_enough = false;
            }
        }
        while (far_enough == false) {
            a = this.random(w);
            b = this.random(x);
            far_enough = true;
            for (var z = 0; z < citiescoords.length; z++) {
                var y = citiescoords[z];
                if (Math.sqrt(Math.pow(a - y[0], 2) + Math.pow(b - y[1], 2)) < SPACE_BETWEEN) {
                    far_enough = false;
                }
            }
        }
        citiescoords.push([a, b]);
        abscitiescoords.push([a, b]);
        //console.log(citiescoords);
        //console.log(abscitiescoords);
    }
    for (var i = 0; i < citiesnum; i++) {
        for (var j = i + 1; j < citiesnum; j++) {
            bridgesconnect.push([i, j]);
            var placeholdervar=Math.floor(Math.sqrt(Math.pow(citiescoords[i][0] - citiescoords[j][0], 2) + Math.pow(citiescoords[i][1] - citiescoords[j][1], 2)));
            var randomval=Math.random()+0.5;
            console.log(randomval);
            console.log(placeholdervar);
            placeholdervar=Math.floor(placeholdervar*randomval);
            bridgesscores.push(placeholdervar);
            distanceArray[i][j]=placeholdervar;
            distanceArray[j][i]=placeholdervar;
            console.log(distanceArray[i][j]);
        }
    }

    //Solve!
    var thepermutations=perms(indexList);
    var currentScore = 0;
    for(var i = 0; i<thepermutations.length; i++){
        thepermutations[i].splice(0,0,0);
        thepermutations[i].push(0);
    }
    for(var i = 0; i<thepermutations.length; i++){
        for(var j = 1; j<cities.length+1; j++){
            currentScore+=distanceArray[thepermutations[i][j]][thepermutations[i][j-1]];
        }
        //console.log(currentScore);
        if(currentScore<highScore){
            highScore=currentScore;
            test=thepermutations[i].slice();
        }
        currentScore=0;
    }
    console.log(highScore);
    for(var i = 0; i<test.length;i++){
    test[i]=NamesString[test[i]];
    }
    console.log(test);
    //console.log(distanceArray);
    //console.log(bridgesscores);
    //console.log(bridgesconnect);
    img = this.loadImage("https://images.unsplash.com/reserve/AXx3QORhRDKAMrbb8pX4_photo%202.JPG");
}

//====================================================
// DRAW
//====================================================
var previousBlink=new Date().getTime()-1001;
var blinkTime=new Date().getTime();

pb.draw = function(floor, p) {
    if (GameEnded == 1) {
        this.clear();
        this.background(0,0,0);
        this.fill(255,255,255);
        this.textSize(100);
        this.text("You Win!",144,382);
        return;
    }

    this.clear();
    this.image(img,0,0);
    
    // Display lines
    for (var n = 0; n < bridgesconnect.length; n++) {
        this.stroke(255, 0, 0);
        this.strokeWeight(2);
        if (bridgesconnect[n][0] < citiescoords.length && bridgesconnect[n][1] < citiescoords.length) { 
            this.line(citiescoords[bridgesconnect[n][0]][0] + 10, citiescoords[bridgesconnect[n][0]][1] + 10, citiescoords[bridgesconnect[n][1]][0] + 10, citiescoords[bridgesconnect[n][1]][1] + 10);
            this.line(citiescoords[bridgesconnect[n][0]][0] - 10, citiescoords[bridgesconnect[n][0]][1] - 10, citiescoords[bridgesconnect[n][1]][0] - 10, citiescoords[bridgesconnect[n][1]][1] - 10);
        }
    }
    
    // Display cities
    this.noStroke();
    for (var n = 0; n < citiesnum; n++) {
        if (n == curCityIndex) {
            this.fill(0, 255, 0);
            this.noStroke();
        } else {
            this.fill(255, 255, 255);
            if(new Date().getTime()-previousBlink>4000){
                this.stroke(0,0,0);
                previousBlink=new Date().getTime();
                blinkTime=new Date().getTime();
            }
            else if (new Date().getTime()-blinkTime<2000){
                this.stroke(0,0,0);
            }
        }
        this.rect(citiescoords[n][0] - CITY_DIAMETER / 2, citiescoords[n][1] - CITY_DIAMETER / 2, CITY_DIAMETER, CITY_DIAMETER);
    }
    
    // text
    this.fill(0, 0, 0);
    this.noStroke();
    this.textSize(10);
    for (var n = 0; n < citiesnum; n++) {
        var Num = 0;
        this.text(cities[n], citiescoords[n][0], citiescoords[n][1] - CITY_DIAMETER / 2 + 12);
        for (var m = 0; m < citiesnum; m++) {
            if (m != n) {
                if (m < 5 && n < 5) {
                    this.text(cities[m] + ":" + distanceArray[m][n], citiescoords[n][0] - CITY_DIAMETER / 2, citiescoords[n][1] + 12 * (Num - 1 / 2));
                    Num++;
                } else if (m > 4 && n < 5) {
                    this.text(cities[m] + ":" + distanceArray[m][n], citiescoords[n][0], citiescoords[n][1] + 12 * (Num - 9 / 2));
                    Num++;
                } else if (m < 4 && n > 4) {
                    this.text(cities[m] + ":" + distanceArray[m][n], citiescoords[n][0] - CITY_DIAMETER / 2, citiescoords[n][1] + 12 * (Num - 1 / 2));
                    Num++;
                } else if (m > 3 && n > 4) {
                    this.text(cities[m] + ":" + distanceArray[m][n], citiescoords[n][0], citiescoords[n][1] + 12 * (Num - 9 / 2));
                    Num++;
                }
            }
        }
    }

    //Thus Begins The ScoreKeeping.
    this.stroke(255, 255, 255);
    this.line(0,552, 576,552);
    this.noStroke();
    this.text("Your score is " + Score, 0, 564);
    
    // Traverse cities
    var traveled = false;
    for (var n = 0; n < citiescoords.length && !traveled; n++) {
      if (n != curCityIndex) {
        for (let u of floor.users) {
          if (n < citiescoords.length && isWithinCity(u.x, u.y, citiescoords[n][0], citiescoords[n][1])) {
            // Check if graph has already been traversed
            traveled = true;

            // Calculate score
            var length = -1;
            length = distanceArray[abscities.indexOf(cities[n])][abscities.indexOf(cities[curCityIndex])];
            Score += length;

            // Remove city
            if (curCityIndex != 0) {
              if (n != 0 || (n == 0 && citiescoords.length == 2)) {
                removeCity(curCityIndex, citiescoords,cities);
                if (n > curCityIndex) {
                  curCityIndex = n - 1;
                } else {
                  curCityIndex = n;
                }
                citiesnum--;
              }
            } else {
              curCityIndex = n; 
            }
          }
        }
      }
    }

    if (cities.length == 1) {
        if(highScore<Score){
            console.log(highScore);
            console.log(Score);
            cities = abscities.slice();
            curCityIndex=0;
            console.log("citiescoords and abscitiescoords 0");
            console.log(citiescoords);
            console.log(abscitiescoords);
            citiescoords = abscitiescoords.slice();
            citiesnum=oldcitiesnum;
            console.log("citiescoords and abscitiescoords 1");
            console.log(citiescoords);
            console.log(abscitiescoords);
            Score=0;
        }
        else {
            GameEnded=1;
        }
    }
}

//====================================================
// MAIN
//====================================================
export const behavior = {
    title: "Travelling Salesman",
    init: pb.init.bind(pb),
    frameRate: 'sensors',
    render: pb.render.bind(pb),
}
export default behavior