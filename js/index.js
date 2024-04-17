let currentSong = new Audio();
let songs;
let currFolder;

function seconds_to_minutes(seconds) {
    // Calculate minutes and remaining seconds
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;

    // Add leading zero if necessary
    var formattedMinutes = (minutes < 10) ? "0" + minutes : minutes;
    var formattedSeconds = (remainingSeconds < 10) ? "0" + remainingSeconds : remainingSeconds;

    // Return formatted time
    return formattedMinutes + ":" + formattedSeconds;
}

async function getSongs(folder) {
    currFolder = folder;
    let fetch_songs = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let respose = await fetch_songs.text()
    // console.log(respose)

    let div = document.createElement('div')
    div.innerHTML = respose

    let anchor_tags = div.getElementsByTagName('a') // as all songs are stored as <a href ="song.mp3">
    // console.log(as)

    songs = []
    for (let i = 0; i < anchor_tags.length; i++) {
        let element = anchor_tags[i]
        // console.log(element)
        if (element.href.endsWith(".mp3")) {
            // console.log(element)
            let song_name = element.href.split(`${folder}/`)[1]
            // let song_name_without_mp3 = song_name.split(".mp3")[0]
            songs.push(song_name)

        }
    }
    // console.log(songs)
    let songUL = document.querySelector(".song_list").getElementsByTagName('ul')[0]
    songUL.innerHTML = ""
    // console.log(songUL)
    for (const song of songs) {
        let decoded_song = decodeURIComponent(song)
       
        songUL.innerHTML = songUL.innerHTML + `<li class="btn">

                                                    <img class="invert" src="images/music.svg" alt="music_logo">
                                                    
                                                    <div class="info">

                                                        <div class="song_name">${decoded_song}</div>
                                                        <div class="artist_name">Artist</div>

                                                    </div>

                                                    <div class="play_now">
                                                        <span>Play now</span>
                                                        <img class="invert" src="images/play_button_logo.svg" alt="play_now_logo">
                                                    </div>

                                            </li>`

    }

    // add an event listener to each song

    let array_of_songs_li = Array.from(document.querySelector(".song_list").getElementsByTagName("li"))
    array_of_songs_li.forEach((songs_name_from_li) => {
        songs_name_from_li.addEventListener("click", element => {
            console.log(songs_name_from_li.querySelector(".info").getElementsByTagName('div')[0].innerHTML.trim())
            playMusic(songs_name_from_li.querySelector(".info").getElementsByTagName('div')[0].innerHTML.trim())
        })

    })

    return songs
}

const playMusic = (track) => {

    currentSong.src = `/${currFolder}/` + track
    currentSong.play()
    if (document.getElementById("play").src = "images/play_button_logo.svg") {
        document.getElementById("play").src = "images/pause_button_logo.svg"
    }

    document.querySelector(".song_name_on_bar").innerHTML = decodeURIComponent(track).split('.mp3')[0]
    document.querySelector(".song_duration_on_bar").innerHTML = "00:00 / 00:00"
    // let current_song_time = currentSong.addEventListener("timeupdate",()=>{
    //     console.log(currentSong.currentTime , currentSong.duration)
    //     let time = seconds_to_minutes(currentSong.currentTime)
    //     let duration = seconds_to_minutes(currentSong.duration)
    //     document.querySelector(".song_duration_on_bar").innerHTML = `${time} / ${duration}`
    // })
    // let current_song_duration = currentSong.addEventListener("durationchange")

    // console.log(current_song_time , current_song_duration)

}

async function displayAlbums() {
    let api = await fetch('http://127.0.0.1:5500/songs/')
    let respose = await api.text()
    let div = document.createElement("div")
    div.innerHTML = respose
    let anchors = div.getElementsByTagName("a")
    // console.log(anchors)
    let cardContainer = document.querySelector(".card_container")
    let folders = []

    // Array.from(anchors).forEach(async e => {
    let array = Array.from(anchors)
    for(let i=0; i<array.length; i++){
        e = array[i]
        if (e.href.includes('/songs/')) {
            // console.log(e)
            // console.log(e.href.split('/').slice(-1))
            let folder = e.href.split('/').slice(-1)
            folders.push(folder)
            // console.log(folders)
            let a2 = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
            let respose2 = await a2.json()
            // console.log(respose2)
            cardContainer.innerHTML += `<div data-folder="${folder}" class="card">
                <svg class="play" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
                    color="#000000" fill="#000">
                    <path
                        d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                        stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                </svg>
                <img src="songs/${folder}/cover.jpg" alt="${respose2.artistName}">
                <h2>${respose2.artistName}</h2>
                <p>${respose2.work}</p>

            </div>`
        }
    }

    // load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        // console.log(e)
        e.addEventListener("click", async item => {
            // console.log(item , item.dataset , item.target.dataset)
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
        })
    })
}

async function main() {

    // getting the list of songs

    await getSongs("songs/zplaylist")
    // console.log(songs)

    // add an event listener to play buttons
    document.getElementById("play").addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            console.log(document.getElementById("play").src)

            document.getElementById("play").src = "images/pause_button_logo.svg"
        }
        else {
            currentSong.pause()
            console.log(document.getElementById("play").src)
            document.getElementById("play").src = "images/play_button_logo.svg"
        }
    })

    // add event listener to update time on playbar
    currentSong.addEventListener("timeupdate", () => {
        let time = seconds_to_minutes(currentSong.currentTime).split('.')[0]
        let duration = seconds_to_minutes(currentSong.duration).split('.')[0]

        document.querySelector(".song_duration_on_bar").innerHTML = `${time} / ${duration}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    })


    // add event listener to seek baar so it can move
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        console.log(e.offsetX, e.target)
        percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100

        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime = ((currentSong.duration) * percent) / 100

    })

    // add event listener to hamburger 
    document.querySelector(".hamburger").addEventListener('click', e => {
        document.querySelector(".left").style.left = "0%"


    })

    document.querySelector(".close").addEventListener('click', e => {
        document.querySelector(".left").style.left = "-120%"

    })

    // add an event listener to play previous song button
    document.querySelector("#previous").addEventListener("click", (e) => {

        let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0])
        console.log(songs[index], index)
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
        else {
            playMusic(songs[songs.length - 1])
        }

    })

    // add an event listener to play next song button
    document.querySelector("#next").addEventListener("click", (e) => {

        let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0])

        console.log(songs)
        console.log(songs[index + 1])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
        else {
            playMusic(songs[0])
        }

    })

    // add event listener to volume bar
    document.querySelector(".volume_bar").addEventListener("change", (e) => {
        console.log(e, e.target, e.target.value)
        let vol = e.target.value
        currentSong.volume = parseInt(vol) / 100
        if (vol == 0) {
            document.querySelector(".volume").getElementsByTagName("img")[0].src = "images/no_volume.svg"
        }
        else {
            document.querySelector(".volume").getElementsByTagName("img")[0].src = "images/volume.svg"
        }
    })



    displayAlbums()


}

main()