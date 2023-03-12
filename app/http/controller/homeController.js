const UserModel = require("../../models/UserModel");
const ExcelJS = require('exceljs');
const xlsx = require('xlsx');

function homeController() {
    return{
        async index(req,res){
            const useList = await UserModel.find({
                // $and:[
                //     {email:'shree@gmail.com'},{mobile:'4444444'}
                // ]
            }) 
            res.render('home',{useList:useList});
        },

        async userListingPage(req,res){
            const userListing = await UserModel.find()
            res.render('user-listing',{userListing:userListing})
        },

        async getUserDataTable(req,res){
        //    const users = await UserModel.find({})
            
            // res.send(data);

            // var data = [];

            // users.forEach(function(user, index) {
            //     data.push({
            //         DT_RowIndex: index + 1, // Add DT_RowIndex property with row index
            //         username: user.username,
            //         email: user.email,
            //         mobile: user.mobile
            //     });
            // });

            // var data = users.map((user, index)=>{
            //     return {...user.toObject(),DT_RowIndex: index + 1}
            // });

            // res.json({
            //     "data": data
            //   });



            // Data table generated
            try{    
                 // Get the Datatable parameters from the request
                let draw = req.body.draw;
                let start = req.body.start;
                let length = req.body.length;
                let searchValue = req.body.search.value;
                let orderColumn = req.body.columns[req.body.order[0].column].data;
                let orderDirection = req.body.order[0].dir;
        
                // Set up the Mongoose query to retrieve the data for the current page
                let query = {};
                if (searchValue) {
                    query['username','email','mobile'] = { $regex: searchValue, $options: 'i' };
                }
                let sortOrder = {};
                sortOrder[orderColumn] = (orderDirection === 'asc') ? 1 : -1;
        
                let totalRecords = await UserModel.countDocuments(query).exec();
                let userList = await UserModel.find(query)
                    .sort(sortOrder)
                    .skip(start)
                    .limit(length)
                    .lean()
                    .allowDiskUse(true)
                    .exec();
                
                var userData = userList.map((user, index)=>{
                return {...user,DT_RowIndex: index + 1 + parseInt(start),actionBtn:'<a href="/delete-state">delete</a>'}
                });
                let response = {
                    draw: draw,
                    recordsTotal: totalRecords,
                    recordsFiltered: totalRecords,
                    data: userData
                };
                res.json(response);

            }catch(error){
                console.error(error);
                res.status(500).send('Internal server error');
            }
            
        },

        async orCondition(req,res){
            const useList = await UserModel.find({
                $or:[
                    {email:'shree@gmail.com'},{mobile:'4444444'}
                ]
            }) 
            res.render('home',{useList:useList});
        },

        // Function to export state data using excel js file
        async exportUserListing(req,res){
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('My Sheet');
  
            // Add header row to the worksheet
            worksheet.columns = [
              { header: 'ID', key: 'id', width: 30 },
              { header: 'State Name', key: 'username', width: 40 },
              // { header: 'Value', key: 'value', width: 15 }
            ];
  
            const userListing = await UserModel.find();
  
            // Add data rows to the worksheet
            userListing.forEach((dataRow) => {
              worksheet.addRow(dataRow);
            });
  
            // Save the workbook to a file
            workbook.xlsx.writeFile('uploads/user-excel/myFile.xlsx')
            .then(function() {
              console.log('Excel file created!');
            });
            res.send('excel created')
          },

        // Function to export user data using xlsx file
        async exportUserListingUserXLSX(req,res){
            
            const userListing = await UserModel.find().lean();

            // const data = [
            //     { id: 1, name: 'John Doe', email: 'john@example.com' },
            //     { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
            //     { id: 3, name: 'Bob Smith', email: 'bob@example.com' }
            //   ];
            // Convert data to worksheet
            const worksheet = xlsx.utils.json_to_sheet(userListing);
            
            // Add header row to worksheet
            const header = ["id", "username"]; // replace with your own column names
            xlsx.utils.sheet_add_aoa(worksheet, [header], { origin: "A1" });
            

            // Create a new workbook and add the worksheet
            const workbook = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(workbook, worksheet, 'My Sheet');

            // Write the workbook to a file
            xlsx.writeFile(workbook, 'uploads/user-excel/myFile.xlsx');
  
            res.send('excel created')
          },

        //insert data in model
        submitForm(req,res){
            let error = true;
            if(req.body.username == ''){
                req.flash('error', 'Please enter user name');
                error = false;
            }
            if(req.body.email == ''){
                req.flash('error', 'Please enter email');
                error = false;
            }
            if(req.body.mobile == ''){
                req.flash('error', 'Please enter mobile');
                error = false;
            }

            if(error == true){
                // const userModel = new UserModel({
                    // username:req.body.username,
                    // email:req.body.email,
                    // mobile:req.body.mobile,
                    // address:req.body.address
                // })
                // userModel.save().then((result)=>{
                    // req.flash('success','data insert successfuly');
                    // return res.redirect('/user-insert');
                   
                // }).catch(err=>{
                    // req.flash('error','data not saved');
                    // return res.redirect('/user-insert');
                // })

                UserModel.create({
                    username:req.body.username,
                    email:req.body.email,
                    mobile:req.body.mobile,
                    address:req.body.address
                },(err,small)=>{
                    if(err){
                        req.flash('error','data not saved');
                        return res.redirect('/user-insert');
                    }else{
                        req.flash('success','data insert successfuly');
                        return res.redirect('/user-insert');
                    }
                    
                })

            }else{
                return res.redirect('user-insert');
            }
        },

        // update user data using id
        updateForm(req,res){
            let error = true;
            if(req.body.username == ''){
                req.flash('error', 'Please enter user name');
                error = false;
            }
            if(req.body.email == ''){
                req.flash('error', 'Please enter email');
                error = false;
            }
            if(req.body.mobile == ''){
                req.flash('error', 'Please enter mobile');
                error = false;
            }

            if(error == true){
                UserModel.updateOne({username:'shree'},{
                    username:req.body.username,
                    email:req.body.email,
                    mobile:req.body.mobile,
                    address:req.body.address
                },(err,small)=>{
                    if(err){
                        req.flash('error','data not saved');
                        return res.redirect('/user-insert');
                    }else{
                        req.flash('success','data insert successfuly');
                        return res.redirect('/user-insert');
                    }
                    
                })

            }else{
                return res.redirect('user-insert');
            }
        },

        //Delete user form
        deleteUser(req,res){
            UserModel.deleteOne({ id: req.params.id }, function (err) {
                if (err) return handleError(err);
                req.flash('success','data has been deleted');
                return res.redirect('/');
            });
        }
    }
}

module.exports = homeController