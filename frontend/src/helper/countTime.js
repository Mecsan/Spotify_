let countTime = (songs) => {
    let time = 0;
    songs?.forEach(song => {
        time += parseInt(song?.duration)
    });
    return (time / 60).toFixed(2)
}

export default countTime