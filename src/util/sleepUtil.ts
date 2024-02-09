const sleep = (duration: number) => {
    return new Promise((resolve) => {
        setTimeout(() => { resolve(true) }, duration)
    })
}

export default {
    sleep
}