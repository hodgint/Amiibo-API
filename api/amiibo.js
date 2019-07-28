const router = require('express').Router();

const amiiboSchema = {
    name: {required: true},
    series: {required: true},
    released: {required: false},
    image: {required: false},
    nfcTag: {required: false}
}
/*
 * MySQL query that fetch the total number of Amiibo.
 * Returns a promise that resolves to this count.
 */
function getAmiiboCount(mysqlPool){
    return new Promise((resolve, reject) => {
        mysqlPool.query('SELECT COUNT(*) AS count FROM amiibo', function(err, results){
            if(err) {
                reject(err);
            }else{
                resolve(results[0].count);
            }
        });
    });
}

/*
 * MySQL query to return a single page of Amiibo.
 * Returns a promise that resolves to an array containing the fetched page of Amiibo.
 * Gives 10 amiibo a page.
 */
function getAmiiboPage(page, totalCount, mysqlPool){
    return new Promise((resolve, reject)=>{
        const numPerPage = 10;
        const lastPage = Math.max(Math.ceil(totalCount / numPerPage), 1);
        page = page < 1 ? 1: page;
        pae = page > lastPage ? lastPage : page;
        const offset = (page - 1) * numPerPage;

        mysqlPool.query(
            'SELECT * FROM amiibo ORDER BY id LIMIT ?, ?',
            [offset, numPerPage],
            function(err, results){
                if(err){
                    reject(err);
                }else{
                    resolve({
                        amiibo: results,
                        pageNumber: page,
                        totalPages: lastPage,
                        pageSize: numPerPage,
                        totalount: totalCount
                    });
                }
            }
        );
    });
}

/*
 * MySQL query to return Amiibo
 * Returns a promise that resolves to  Amiibo
 */

function getAmiibo(mysqlPool){
    return new Promise((resolve, reject) => {
        mysqlPool.query('SELECT * FROM amiibo', function(err, results){
            if(err){
                reject(err);
            }else{
                resolve(results[0]);
            }
        });
    });
}


function getAmiiboByID(id, mysqlPool){
    return new Promise((resolve, reject) => {
        mysqlPool.query('SELECT * FROM amiibo WHERE id = ?', [id], function(err, results){
            if(err){
                reject(err);
            }else{
                resolve(results[0]);
            }
        });
    });
}


function deleteAmiiboByID(amiiboID, mysqlPool){
    return new Promise((resolve, reject)=>{
        mysqlPool.query('DELETE FROM amiibo WHERE id = ?', [ amiiboID ], function(err, result){
            if(err){
                reject(err);
            }else{
                resolve(result.affectedRows > 0);
            }
        });
    });
}

/*
 * MySQL query to return Amiibo of specified name 
 * Returns a promise that resolves to specified Amiibo
 */
function getAmiiboByName(name, mysqlPool){
    return new Promise((resolve, reject) => {
        mysqlPool.query('SELECT * FROM amiibo WHERE name = ?', [name], function(err, results){
            if(err){
                reject(err);
            }else{
                resolve(results[0]);
            }
        });
    });
}

/*
 * MySQL query to return Amiibo of specified series 
 * Returns a promise that resolves to specified Amiibo
 */
function getAmiiboBySeries(series, mysqlPool){
    return new Promise((resolve, reject) => {
        mysqlPool.query('SELECT * FROM amiibo WHERE series = ?', [series], function(err, results){
            if(err){
                reject(err);
            }else{
                resolve(results[0]);
            }
        });
    });
}


router.get('/', function(req, res){
    const mysqlPool = req.app.locals.mysqlPool;
    getAmiiboCount(mysqlPool)
    .then((count) => {
        return getAmiiboPage(parseInt(req.query.page) || 1, count, mysqlPool);
    })
    .then((amiiboPageInfo)=>{
        amiiboPageInfo.links = {};
        let {links, pageNumber, totalPages} = amiiboPageInfo;
        if(pageNumber < totalPages){
            links.nextPage = '/amiibo?page=${pageNumber+1}';
            links.lastPage = '/amiibo?page=${totalPages}';
        }
        if(pageNumber > 1){
            links.prevPage = '/amiibo?page=${pageNumber - 1}';
            links.firstPage = 'amiibo?page=1';
        }
        res.status(200).json(amiiboPageInfo);
    })
    .catch((err) =>{
        console.log(err);
        res.status(500).json({
            error: "Error fetching amiibo list. Please try again later."
        });
    });
});


router.get('/:id', function(req, res){
    const mysqlPool = req.app.locals.mysqlPool;
    const id = parseInt(req.params.id);
    getAmiiboByID(id, mysqlPool)
    .then((amiibo) => {
        if(amiibo){
            res.status(200).json(amiibo);
        }else{
            next();
        }
    })
    .catch((err) =>{
        res.status(500).json({
            error: "Unable to fetch Amiibo by ID. Please try again later."
        });
    });
});

router.get('/name/:name', function(req, res){
    const mysqlPool = req.app.locals.mysqlPool;
    const name = toString(req.params.name);
    getAmiiboByName(name, mysqlPool)
    .then((amiibo) => {
        if(amiibo){
            res.status(200).json(amiibo);
        }else{
            next();
        }
    })
    .catch((err) =>{
        res.status(500).json({
            error: "Unable to fetch Amiibo by Name. Please try again later.",
            err: err
        });
    });
});

router.get('/series/:series', function(req, res){
    const mysqlPool = req.app.locals.mysqlPool;
    const series = toString(req.params.series);
    getAmiiboBySeries(series, mysqlPool)
    .then((amiibo) => {
        if(amiibo){
            res.status(200).json(amiibo);
        }else{
            next();
        }
    })
    .catch((err) =>{
        res.status(500).json({
            error: "Unable to fetch Amiibo by Series. Please try again later.",
            err: err
        });
    });
});

router.delete('/:id', function(req, res, next){
    const mysqlPool = req.app.locals.mysqlPool;
    const id = parseInt(req.params.id);
    deleteAmiiboByID(id, mysqlPool)
    .then((deleteSuccessful)=>{
        if(deleteSuccessful){
            res.status(204).end();
        }else{
            next();
        }
    })
    .catch((err) => {
        res.status(500).json({
            error: "Unable to delete amiibo. Please try again later.",
            err: err
        });
    });
});

/*
* Gets amiibo with given list of ids.
* Used to get owned amiibo of a user.
*/
function getUserAmiiboByList(idList, mysqlPool){

    return new Promise((resolve, reject) => {
        var tokens = new Array(idList.length).fill('?').join(',');
        var query = 'SELECT * FROM amiibo WHERE id IN (' + tokens + ')';
        mysqlPool.query(
            query, Array.from(idList),
            function(err, results){
                if(err){
                    reject(err);
                }else{
                    resolve(results);
                }
            }
        );
    });
}

exports.router = router;
exports.getUserAmiiboByList = getUserAmiiboByList;