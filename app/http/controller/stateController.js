const xlsx = require('xlsx');
const StateModel = require('../../models/StateModel');

function stateController(){
    return{
        funViewState(req,res){
            res.render('state-insert-form');
        },
        importStateData(req,res){
            
            const file = req.file.path;
            const workbook = xlsx.readFile(file);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const stateDataArr = xlsx.utils.sheet_to_json(sheet);

            // console.log(stateDataArr); // Do something with the data here
            StateModel.insertMany(stateDataArr, (err, docs) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log(docs);
                }
              });
            
            res.send('File uploaded successfully!');
        },
        async funViewStateList(req,res){
          // const stateList = await StateModel.find();
          // res.render('state-listing',{stateList:stateList});

          res.render('state-listing');
        },

        async stateDatatable(req,res){
          // const stateList = await StateModel.find();
          
          // var stateData = stateList.map((stateList, index)=>{
          //   return {...stateList.toObject(),DT_RowIndex: index + 1,actionBtn:'<a href="/delete-state">delete</a>'}
          // });
          
          // res.json({
          //   'data':stateData
          // })

          try {
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
                query['state_name'] = { $regex: searchValue, $options: 'i' };
            }
            let sortOrder = {};
            sortOrder[orderColumn] = (orderDirection === 'asc') ? 1 : -1;
    
            let totalRecords = await StateModel.countDocuments(query).exec();
            let stateList = await StateModel.find(query)
                .sort(sortOrder)
                .skip(start)
                .limit(length)
                .lean()
                .allowDiskUse(true)
                .exec();
            
            var stateData = stateList.map((state, index)=>{
              return {...state,DT_RowIndex: index + 1 + parseInt(start),actionBtn:'<a href="/delete-state">delete</a>'}
            });
            let response = {
                draw: draw,
                recordsTotal: totalRecords,
                recordsFiltered: totalRecords,
                data: stateData
            };
            res.json(response);
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal server error');
        }



        }


    }
}

module.exports =stateController