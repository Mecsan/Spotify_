let countTime = (songs) => {
    let time = 0;
    songs?.forEach(song => {
        time += parseInt(song?.duration)
    });
    const min = Math.floor(time / 60);
    let sec = time % 60;
    sec = sec.toString().padStart(2,'0')
    return `${min}:${sec}`
}

export default countTime