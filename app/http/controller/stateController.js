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
          const stateList = await StateModel.find();
          res.render('state-listing',{stateList:stateList});
        }
    }
}

module.exports =stateController