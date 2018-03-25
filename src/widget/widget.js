var buildfire = require('buildfire');

buildfire.appearance.titlebar.hide();

// This is the entry point of your plugin's widget.
// Feel free to require any local or npm modules you've installed.

buildfire.notifications.vibrate();

function preload(imageArray, index) {
    index = index || 0;
    if (imageArray && imageArray.length > index) {
        var img = new Image();
        img.onload = function () {
            preload(imageArray, index + 1);
        };
        img.src = imageArray[index].front.image;
    }
    /* images is an array with image metadata */

}

function loadData(obj){
    flashcards.cards = obj.data.cards.sort((a,b)=> Math.round( Math.random() *2 ) - 1); ///  shuffled cards
    flashcards.loadCard( flashcards.cards[0] );
    flashcards.loadLogo( obj.data.logoUrl );
}

buildfire.datastore.onUpdate((obj)=>{
    loadData(obj);
});

buildfire.datastore.get((err,obj)=>{

    if(err)
        return console.error(err);
    loadData(obj);
    preload(flashcards.cards,0);
});


const container=document.querySelector(".card-container");
const front = document.querySelector(".front");
const back = document.querySelector(".back");
const logo = document.querySelector(".logo");


function flipCard(){
    //buildfire.notifications.alert({message:"flip card"});
    container.classList.add("flip");

    //setTimeout(()=>{
        back.classList.remove('hidden');
    //},300);
    setTimeout(()=>{
        front.classList.add('hidden');
    },600);

}
if( window.location.protocol.indexOf("http") >= 0 )
    front.onclick = flipCard;
else
    front.ontouchend = flipCard;


function nextCard(){

    //buildfire.notifications.alert({message:"next card"});

    container.classList.add("slideOut");
    front.innerHTML='';
    front.classList.remove("hidden");
    setTimeout(()=>{ // mid animation
        container.classList.remove("flip");
    },300);
    setTimeout(()=>{ //end of animation
        flashcards.loadNextCard();
        container.classList.remove("slideOut");
    },600);

}

if( window.location.protocol.indexOf("http") >= 0 )
    back.onclick = nextCard;
else
    back.ontouchend = nextCard;

let flashcards={
    currentIndex:0
    ,cards:[]
    , loadLogo:(logoUrl) =>{

        if(!logoUrl)return;
        logo.src = buildfire.imageLib.cropImage(logoUrl,{width:150,height:150});
    }
    ,loadNextCard:()=>{

        if(flashcards.currentIndex < flashcards.cards.length-1){
            flashcards.currentIndex++;
            flashcards.loadCard(flashcards.cards[flashcards.currentIndex]);
        }else{
            front.innerHTML="<h1>The End!</h1>";
            front.onclick=front.ontouchstart='';
        }
    }
    ,loadCard:(card)=>{
        front.classList.remove("hidden");
        flashcards.loadSide(front,card.front);
        flashcards.loadSide(back,card.back);
    }
    ,loadSide:(container,cardSide)=>{
        container.innerHTML='';
        if(cardSide.title) {
            let h1 = document.createElement('h1');
            h1.innerHTML = cardSide.title;
            container.appendChild(h1);
        }

        if(cardSide.image) {
            let img = document.createElement('img');
            img.className="heroImage";
            img.src = buildfire.imageLib.cropImage( cardSide.image,{width:window.innerHeight,height:window.innerWidth});
            container.appendChild(img);
        }

        if(cardSide.body) {
            let p = document.createElement('p');
            p.innerHTML = cardSide.body;
            container.appendChild(p);
        }
    }
};

buildfire.messaging.onReceivedMessage =(msg)=>{
    if(msg.cmd=="focus")
        flashcards.loadCard(msg.card);
};