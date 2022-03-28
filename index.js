//Import of modules
import fetch from "node-fetch";
import { PowerShell } from "node-powershell";
import ImageDownloader from "image-downloader";

console.log('Starting...')

//Path to the cache image
let filePath = process.cwd() + "/img.png"

//List of subreddits to search
const subs = ['wallpaper', 'wallpapers']

//Random sub chosen from the list
let chosenSub = subs[Math.floor(Math.random() * subs.length)]
console.log(`Chosen sub: r/${chosenSub}`)

//Picking the url to the chosen sub
let redditUrl = RedditURLTo(chosenSub)

//Magic
fetch(redditUrl)
.then(response => response.json())
.then(body => {
    //List of post with images
    let postsURLs = []

    //Add to the array the url to the posts with images
    body.data.children.forEach((post) => {
        if(post.data.post_hint == 'image')
            postsURLs.push(post)
    })

    //Random post chosen from the list
    let chosenPost = postsURLs[Math.floor(Math.random() * postsURLs.length)]
    console.log(`Post URL: https://www.reddit.com/${chosenPost.data.permalink}`)
    console.log(`Image URL: ${chosenPost.data.url_overridden_by_dest}`)

    //Download the chosen wallpaper
    DownloadImage(chosenPost.data.url_overridden_by_dest)
})

//Function that download the image from the chosen post
function DownloadImage(url) {
    console.log('Downloading image...')
    ImageDownloader.image({
        url: url,
        dest: filePath
    })
    .then(() => {
        console.log('Setting wallpaper...')
        PowerShell.$`./SetWall.ps1`
    })
}

//Function that returns the url to the chosen sub
function RedditURLTo(sub) {
    return `https://www.reddit.com/r/${sub}/.json`
}