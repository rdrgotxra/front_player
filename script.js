const capaMusica = document.getElementById('capa-musica');
const nameMusica = document.getElementById('nome-musica');
const artistMusica = document.getElementById('artista-musica');

const buttonPlay = document.querySelector('#play');
const buttonPause = document.querySelector('#pause');
const buttonNext = document.querySelector('#next');
const buttonPrevious = document.querySelector('#previous');

const progressBar = document.getElementById("progressBar");
const tempoAtual = document.getElementById("tempoAtual");
const tempoTotal = document.getElementById("tempoTotal");


// localhost: https://github.com/rdrgotxra/api_player
// gitpod: me avisa q eu abro e mando link (81 998019754)
const apiURL = 'http://0.0.0.0:8000/api/music/'


let music // criado por "new Audio()"
let musicIndex = 0
let playing = false


getData() // chama api ao atualizar a página


// chama api e configura o player --------------------------------------------

async function getData(){
  const response = await fetch(apiURL)
  const musicList = await response.json()
  setMusic(musicList, musicIndex)
}

function setMusic(musicList, index) {

  // mantém as músicas em loop
  if (index < 0) {
    musicIndex = musicList.length - 1
  }
  if (index >= musicList.length) {
    musicIndex = 0
  }

  // posição no array != id da música
  const musicID = musicList[musicIndex].id

  // atualiza página com dados da api
  music = new Audio(apiURL+musicID+'/audio')
  capaMusica.setAttribute('src', apiURL+musicID+'/image')
  artistMusica.innerHTML = musicList[musicIndex].artist
  nameMusica.innerHTML = musicList[musicIndex].name
  
  music.addEventListener('loadedmetadata', ()=>{
    tempoTotal.textContent = formatarTempo(music.duration)
  })
  music.addEventListener('ended', ()=>{
    setMusic(++musicIndex)
    play()
  })
}


// operações da música: play e pause -----------------------------------------

function play() {
  console.log('deu play');
  buttonPlay.classList.add('hide')
  buttonPause.classList.remove('hide')
  music.play()
  setInterval(updateMusicTime, 1000)
}

function pause() {
  console.log('pausou');
  buttonPause.classList.add('hide')
  buttonPlay.classList.remove('hide')
  music.pause();
}


// botões de controle --------------------------------------------------------

buttonPlay.addEventListener('click', () => {
  play()
  playing = true
});

buttonPause.addEventListener('click', () => {
  pause()
  playing = false
});

buttonNext.addEventListener('click', () => {
  pause();
  ++musicIndex
  getData().then(()=>{
    if(playing == true){
      play()
    }
  })
});

buttonPrevious.addEventListener('click', () => {
  pause();
  --musicIndex
  getData().then(()=>{
    if(playing == true){
      play()
    }
  })
});


// barra de progresso --------------------------------------------------------

progressBar.addEventListener('click', () => {
  pause()
  music.currentTime = progressBar.value * (music.duration/100)
  if(playing == true) {play()}
})

function formatarTempo(segundos) {
  const min = Math.floor(segundos / 60);
  const seg = Math.floor(segundos % 60);
  return `${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
}

function updateMusicTime() {
  const progresso = (music.currentTime / music.duration) * 100;
  progressBar.value = progresso;
  tempoAtual.textContent = formatarTempo(music.currentTime);
}