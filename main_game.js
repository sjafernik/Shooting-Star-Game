var imgArr = ["star.webp", "UFO.gif", "planet.gif", "heart.webp", "meteor.gif", "meteor_death.png"]
var gameOverText = document.querySelector('#gameover-text')
var inputElement = document.querySelector('.input-container')
var highscoreElement = document.querySelector('.high-score-container')
var highscoreList = document.querySelector('#high-score')
var scoreUnder60Popup = document.getElementById('u60')
var scoreAbove60Popup = document.getElementById('u60a')
var scoreAbove200Popup = document.getElementById('extra')
var time = 60
var score = 0
var live = 3
var intervalTimeout = 1800
var minTimeout = 700
var expl
var timeIntervalID
var moveItIntervalID
var x;
var y;


function addToHighScore(obj, key, value, index) {

	// Create a temp object and index variable
	var temp = {};
	var i = 0;

	// Loop through the original object
	for (var prop in obj) {
		if (obj.hasOwnProperty(prop)) {

			// If the indexes match, add the new item
			if (i === index && key && value) {
				temp[key] = value;
			}
			// Add the current item in the loop to the temp obj
			temp[prop] = obj[prop];

			// Increase the count
			i++;
		}
	}
	    // If no index, add to the end
        if (!index && key && value) {
            temp[key] = value;
        }
        return temp;
};


function updateHighScore() {
    // Selecting the input element and get its value
    var inputVal = document.getElementById("input").value;
    inputElement.style.visibility = 'hidden'
    highscoreElement.style.visibility = 'visible'
    scoreUnder60Popup.style.display = 'none'
    scoreAbove60Popup.style.display = 'none'
    scoreAbove200Popup.style.display = 'none'
    gameOverText.innerHTML = 'High Score'

    if(typeof(Storage)!=="undefined") {
        var current = parseInt(score);
        var scores = false;
        if (localStorage["high-scores"]) {
            scores = JSON.parse(localStorage["high-scores"]);

            let index = 0
            for (var [key, val] of Object.entries(scores)) {
                if (current >= val) {
                    scores = addToHighScore(scores, inputVal, current, index)
                    if (index === 4) {
                        delete scores[key]
                    }
                }
                index++
            }
            localStorage["high-scores"] = JSON.stringify(scores);

        } else {
            var scores = {};
            scores['mr. awesome'] = 300;
            scores['savior'] = 250;
            scores['astronaut'] = 100;
            scores['space cadet'] = 50;
            scores['rookie'] = 10;


            let index = 0
            for (var [key, val] of Object.entries(scores)) {
                if (current >= val) {
                    scores = addToHighScore(scores, inputVal, current, index)
                    if (index === 4) {
                        delete scores[key]
                    }
                }
                index++
            }
            localStorage["high-scores"] = JSON.stringify(scores);
        }
    }
        for (var [key, val] of Object.entries(scores)) {
            var s = key;
            var fragment = document.createElement('li');
            fragment.innerHTML = `${key}: ${val}`;
            highscoreList.appendChild(fragment);
        }
}

function Init(){
    
    document.getElementById('score').innerHTML = "Score: " + score;  //score
    document.getElementById('live').innerHTML = "Lives: " + live; //lives
    document.getElementById('timer').innerText = 'Time: ' + time; //time


    // expl =  document.getElementById('explo');
    // expl.style.visibility = 'hidden';

    random_pic = document.getElementById("image"); //getting image from html

    //getting height and width of browser window
    var height = window.innerHeight; 
    var width = window.innerWidth;

    //getting the max and min position of image in the game
    spaceW = height - (random_pic.height*2);
    spaceH = width - (random_pic.width*2);
    
    //set interval of moving image in case the user will not click it
    moveItIntervalID = setInterval(moveIt, intervalTimeout);
    timeIntervalID = setInterval(countDown, 1000);

    //event listener if the user will click the image
    random_pic.addEventListener('click', objectExplosion);

}

function moveIt(){
    //checking if time and lives > 0
    if (time > 0 && live > 0) {  
        // random_pic.style.visibility = 'visible';

        //getting random image from image array and random position for it
        var rand = Math.floor( Math.random() * imgArr.length);
        rnImg = document.getElementById("image").src = imgArr[rand];
        random_pic.style.top = Math.round(Math.random() *  spaceW) + "px";
        random_pic.style.left = Math.round(Math.random() *  spaceH) + "px";
        x = random_pic.style.top;
        y = random_pic.style.left;
    }

    //if time or lives == 0, the game ends, all intervals are stoped
    else if (time == 0 || live == 0){
        random_pic.style.visibility = 'hidden';
        clearInterval(moveItIntervalID);
        clearInterval(timeIntervalID);
        time = 0;
        document.getElementById('timer').innerText = 'Time: ' + time;

        gameOverText.style.visibility = 'visible'
        if (score < 60) {
            toggleEndGamePopup(scoreUnder60Popup, 'block')
        } else if (score > 60 && score < 200) {
            toggleEndGamePopup(scoreAbove60Popup, 'block')
        } else {
            toggleEndGamePopup(scoreAbove200Popup, 'block')
        }
        inputElement.style.visibility = 'visible'
    }
}

function toggleEndGamePopup(popUp, display) {
    popUp.style.display = display
}

//count down the time of game
function countDown() {
    if (time >= 1) {
        time--;
    }
    //stop the interval setting function
    else {
        clearInterval(timeIntervalID)
        time = 0
    }
    document.getElementById('timer').innerText = 'Time: ' + time;

}

//make interval smaller
function resetInterval() {
    clearInterval(moveItIntervalID)
    if (intervalTimeout > minTimeout) {
        intervalTimeout -= 50
    }
    moveItIntervalID = setInterval(moveIt, intervalTimeout);
}


function backgroundMusic(){
    var myAudio = document.getElementById("myAudio"); 
    myAudio.muted = false;
    myAudio.loop = true;
    myAudio.play();
}

function exploMusic(sound){
    var phaserSound = document.getElementById(sound); 
        phaserSound.muted = false;
        phaserSound.play();
}

function objectExplosion(evt){
    // evt.target.style.visibility = 'hidden';
    backgroundMusic();

    //the game ends if you click on meteot_death picture
    if(rnImg == 'meteor_death.png'){
        score-=20;
        time=0;
        exploMusic("death_sound");
        clearInterval(moveItIntervalID);

    // all other picture cases
    }else if(rnImg == 'meteor.gif'){
        score-=5;
        live-=1;
        exploMusic("meteor_sound")

    }else{
        if (rnImg == 'star.webp'){
            score+=5;
        } else if (rnImg == 'planet.gif'){
            score+=15;
        } else if (rnImg == 'UFO.gif'){
            time+=10;
            console.log('time: ' + time)
        } else if (rnImg == 'heart.webp'){
            live+=1;
            console.log('lives: ' + live)
        }   
        exploMusic("phaser")
        resetInterval(); //make interval smaller
    }
    explosion(); //explosion animation
    moveIt();
    // setTimeout(moveIt, 900); //set pause for explosion animation
    document.getElementById('score').innerHTML = "Score: " + score;
    document.getElementById('live').innerHTML = "Lives: " + live;
}


// fucntion that makes explosion animation
function explosion(){
    expl = document.getElementById("explo");
    document.getElementById("explo").src = "explo.webp";
    expl.style.top = x;
    console.log('pos is' + expl.style.top)
    expl.style.left = y;
    // expl.style.visibility = 'visible';
}  