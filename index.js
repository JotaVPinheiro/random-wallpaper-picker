//Import of modules
import fetch from "node-fetch";
import { PowerShell } from "node-powershell";
import ImageDownloader from "image-downloader";

//Path to the cache image
let filePath = process.cwd() + "/img.png"

//List of subreddits to search
const subs = ['wallpaper', 'wallpapers']

//Picking the url to a random sub on the list
let redditUrl = RedditURLTo(subs[Math.floor(Math.random() * subs.length)])

//Magic
fetch(redditUrl)
.then(response => response.json())
.then(body => {
    //List of urls to the wallpapers
    let imagesUrls = []

    //Add to the array the url to the image of each post that is an actual image
    body.data.children.forEach((post) => {
        if(post.data.post_hint == 'image')
            imagesUrls.push(post.data.url_overridden_by_dest)
    })

    //Download the chosen wallpaper
    DownloadImage(imagesUrls[Math.floor(Math.random() * imagesUrls.length)])
})

//Function that download the image from the chosen post
function DownloadImage(url) {
    ImageDownloader.image({
        url: url,
        dest: filePath
    })
    .then(() => {
        PowerShell.$`./SetWall.ps1`
    })
}

//Function that returns the url to the chosen sub
function RedditURLTo(sub) {
    return `https://www.reddit.com/r/${sub}/.json`
}