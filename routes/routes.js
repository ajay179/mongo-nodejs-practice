const homeController = require('../app/http/controller/homeController')
const authController = require('../app/http/controller/authController')
const stateController = require('../app/http/controller/stateController')
const cityController = require('../app/http/controller/cityController')
const auth = require('../app/http/middleware/verifyJWTToken')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

function routesList(app) {
    
    // app.get('/',auth, homeController().index)
    app.get('/', homeController().index)
    app.get('/user-insert',(req,res)=>{
        res.render('userInsert')
    })
    app.post('/user-submit',homeController().submitForm)
    app.post('/user-update',homeController().updateForm)
    app.get('/delete-user/:id',homeController().deleteUser)
    app.get('/user-listing', homeController().userListingPage)
    app.post('/user-datatable', homeController().getUserDataTable)
    app.get('/export-user-data-use-excelJS', homeController().exportUserListing)
    app.get('/export-user-data-use-xlsx', homeController().exportUserListingUserXLSX)
    
    
    
    // user auth route
    app.post("/user/generateToken", authController().userLogin);
    app.get('/get-jwt-return-data',auth, authController().returnJWTResonseData)
    
    

    //master data route
    app.get('/add-state-form',stateController().funViewState)
    app.post('/upload-state-excel-and-save-data', upload.single('file'),stateController().importStateData)
    app.get('/state-listing',stateController().funViewStateList)
    app.post('/state-datatable',stateController().stateDatatable)
    app.get('/export-state-data-use-excelJS',stateController().exportStateListing)
    app.get('/export-state-data-use-xlsx',stateController().exportStateListingUseXLSX)
    
    // Master city route
    app.get('/add-city-form',cityController().funViewAddCity);
    app.get('/get-statlist-for-add-city',cityController().getStateList);
    
}

module.exports = routesList