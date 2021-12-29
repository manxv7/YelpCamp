//Wrapper Function to implement try catch on all async req handlers

module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}