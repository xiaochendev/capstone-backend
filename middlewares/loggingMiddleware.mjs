export default (req, _res, next) =>{
    console.log(`${req.method} - ${req.url} from ${req.ip}`)
    next()
}