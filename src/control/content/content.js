// This is the entry point of your plugin's content control.
// Feel free to require any local or npm modules you've installed.
//
import buildfire from 'buildfire';

let data = {
    cards: [ ]
    , logoUrl: ""

};

buildfire.datastore.get((err,obj)=>{
   if(obj.data)data = obj.data;
   loadData(data);
});

function loadData(data){
    let dataList=document.getElementById("dataList");
    dataList.innerHTML=`<h1>${data.logoUrl}</h1>`;
    data.cards.forEach((card,i)=>{
       let li = document.createElement('li');
       li.innerHTML = card.front.title + "/" + card.back.title;
       li.onclick = createSetFocusFunc(i);
        dataList.appendChild(li);
    });
}

function createSetFocusFunc(i){
    return ()=>{buildfire.messaging.sendMessageToWidget({cmd:"focus",card: data.cards[i] });};
}

function genCards(){
    data.cards=[];
    for(let i =0 ; i < 10 ; i++){
        data.cards.push({
            front: {
                title: "Flash card " + i + " " + new Date()
                //,body: "<p> This is some <strong>strong</strong> text. This is some long text. This is some long text. This is some long text. This is some long text. This is some long text. This is some long text. "
                ,
                image: "https://picsum.photos/640/320?" + i
            }
            , back: {
                title: "BACK:: Flash card " + i + " " + new Date()
                ,
                body: "<p> This is some <strong>strong</strong> text. This is some long text. This is some long text. This is some long text. This is some long text. This is some long text. This is some long text. "
                //,image: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png"
            }
        });
    }
    data.logoUrl="https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png";
}

document.getElementById('btnSave').onclick=()=>{

    buildfire.datastore.save(data);
};

document.getElementById("btnGenCards").onclick=()=>{
    genCards();
    loadData(data);
};