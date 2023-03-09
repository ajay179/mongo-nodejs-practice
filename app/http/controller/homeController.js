const UserModel = require("../../models/UserModel");

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
           const data = await UserModel.find({})
            
            res.send(data);
            
        },

        async orCondition(req,res){
            const useList = await UserModel.find({
                $or:[
                    {email:'shree@gmail.com'},{mobile:'4444444'}
                ]
            }) 
            res.render('home',{useList:useList});
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