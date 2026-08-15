/* =========================
   ÂM THANH
========================= */

const bgm = document.getElementById("bgm");
const musicBtn = document.getElementById("musicBtn");

function toggleMusic(){

    if(bgm.paused){

        bgm.play();
        musicBtn.innerHTML = "🔇";

    }else{

        bgm.pause();
        musicBtn.innerHTML = "🔊";

    }
}


/* =========================
   ĐỔI BACKGROUND
========================= */

let bgIndex = 1;

function changeBackground(){

    bgIndex++;

    if(bgIndex > 4){
        bgIndex = 1;
    }

    document.querySelector(".tank-bg").style.backgroundImage =
        "url('images/bg" + bgIndex + ".jpg')";

    console.log(
        "Đang đổi sang: images/bg" + bgIndex + ".jpg"
    );
}


/* =========================
   ĐỔI NHẠC
========================= */

let musicIndex = 1;

function changeMusic(){

    musicIndex++;

    if(musicIndex > 4){
        musicIndex = 1;
    }

    bgm.src = "s" + musicIndex + ".mp3";

    bgm.play();

    console.log(
        "Đang phát: s" + musicIndex + ".mp3"
    );
}