import fetch from "node-fetch";
import { PowerShell } from "node-powershell";
import ImageDownloader from "image-downloader";

let filePath = process.cwd() + "/img.png"
const subs = ['wallpaper', 'wallpapers']

let redditUrl = RedditURLTo(subs[Math.floor(Math.random() * subs.length)])
console.log(redditUrl)

fetch(redditUrl)
.then(response => response.json())
.then(body => {
    let validPosts = []

    body.data.children.forEach((post) => {
        if(post.data.post_hint == 'image')
            validPosts.push(post.data.url_overridden_by_dest)
    })

    DownloadImage(validPosts[Math.floor(Math.random() * validPosts.length)])
})

function DownloadImage(url) {
    ImageDownloader.image({
        url: url,
        dest: filePath
    })
    .then(() => {
        PowerShell.$`./SetWall.ps1`
    })
}

function RedditURLTo(sub) {
    return `https://www.reddit.com/r/${sub}/.json`
}