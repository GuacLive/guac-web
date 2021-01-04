function parseEmbedId(url) {
    const match = (/\/(?:c|embed)\/(\w+)(?:|\?.*)?/).exec(url)
    return match ? match[1] : null
}
export default function handler(req, res){
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    const id = parseEmbedId(req.query.url)
    if(!id) res.end(JSON.stringify({}))
    res.end(JSON.stringify({
        title: `Watch ${id} on guac`,
        type: 'video',
        version: '1.0',
        thumbnail_url: '',
        author_name: id,
        provider_url: 'https://guac.live/',
        provider_name: 'guac.live',
        author_url: `https://guac.live/${id}`,
        width: 480,
        height: 270,
        html: `<iframe src='https://guac.live/embed/${id}' width='480' height='270' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>`
    }))
}  