export default (req, _res, next) =>{
  const time = new Date().toLocaleString();
  console.log(`[Custome Log]: ${time}: ${req.method} request to ${req.url}`);
  next();
}