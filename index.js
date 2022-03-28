import fetch from "node-fetch";
import { PowerShell } from "node-powershell";
import ImageDownloader from "image-downloader";

let redditUrl = "https://www.reddit.com/r/wallpapers/.json"
let filePath = process.cwd() + "/img.png"

fetch(redditUrl)
.then(response => response.json())
.then(body => {
    for(let i = 0; i < body.data.children.length; i++) {
        if(body.data.children[i].data.post_hint == 'image') {
            DownloadImage(body.data.children[i].data.url_overridden_by_dest)
            break
        }
    }
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