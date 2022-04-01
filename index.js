import fetch from "node-fetch";
import { PowerShell } from "node-powershell";
import ImageDownloader from "image-downloader";
import fs from "fs";

console.log('Starting...')

let filePath = process.cwd() + "/cache"
if (!fs.existsSync(filePath))
    fs.mkdirSync(filePath)

const subs = ['wallpaper', 'wallpapers']

let chosenSub = subs[Math.floor(Math.random() * subs.length)]
console.log(`Chosen sub: r/${chosenSub}`)

let redditUrl = RedditURLTo(chosenSub)

fetch(redditUrl)
.then(response => response.json())
.then(body => {
    let postsURLs = []

    body.data.children.forEach((post) => {
        if(post.data.post_hint == 'image')
            postsURLs.push(post)
    })

    let chosenPost = postsURLs[Math.floor(Math.random() * postsURLs.length)]
    console.log(`Post URL: https://www.reddit.com${chosenPost.data.permalink}`)
    console.log(`Image URL: ${chosenPost.data.url_overridden_by_dest}`)

    DownloadImage(chosenPost.data.url_overridden_by_dest)
    WriteInHistory(chosenPost.data)
})

// Download the image from the chosen post
function DownloadImage(url) {
    console.log('Downloading image...')
    ImageDownloader.image({
        url: url,
        dest: filePath
    })
    .then(({ filename }) => {
        console.log('Setting wallpaper...')
        PowerShell.$`./setWall.ps1 -imgPath ${filename}`
    })
}

// Returns the url to the chosen sub
function RedditURLTo(sub) {
    return `https://www.reddit.com/r/${sub}/.json`
}

// Write url's in history file
function WriteInHistory(post) {
    let path = process.cwd() + '/cache/history.txt'
    let data = `
    [${Date().slice(0,24)}]
    Post URL: https://www.reddit.com${post.permalink}
    Image URL: ${post.url_overridden_by_dest}
    `

    fs.appendFileSync(path, data)
}