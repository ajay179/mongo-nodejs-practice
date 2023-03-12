const xlsx = require('xlsx');
const ExcelJS = require('exceljs');
const StateModel = require('../../models/StateModel');

function stateController(){
    return{

      // function to view state add pages using excel sheet
        funViewState(req,res){
            res.render('state-insert-form');
        },
      
      // Import state data into database from excel sheet  
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
      
      // Function to state listing page view 
        async funViewStateList(req,res){
          // const stateList = await StateModel.find();
          // res.render('state-listing',{stateList:stateList});

          res.render('state-listing');
        },
      
      // Function to get state data for state datatable 
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



        },

      // Function to export state data using excel js file user normal method
        async exportStateListing(req,res){
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet('My Sheet');

          // Add header row to the worksheet
          worksheet.columns = [
            { header: 'ID', key: 'id', width: 30 },
            { header: 'State Name', key: 'state_name', width: 40 },
            // { header: 'Value', key: 'value', width: 15 }
          ];

          const stateListing = await StateModel.find();

          // Add data rows to the worksheet
          stateListing.forEach((dataRow) => {
            worksheet.addRow(dataRow);
          });

          // Save the workbook to a file
          workbook.xlsx.writeFile('myFile.xlsx')
          .then(function() {
            console.log('Excel file created!');
          });
          res.send('excel created')
        },

        //This fucntion also use to handle large amount of data
         // Function to export state data using xlsx file
         async exportStateListingUseXLSX(req,res){
            
          const stateListing = await StateModel.find().lean();
         
          // const data = [
          //     { id: 1, name: 'John Doe', email: 'john@example.com' },
          //     { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
          //     { id: 3, name: 'Bob Smith', email: 'bob@example.com' }
          //   ];
          // Convert data to worksheet
          const worksheet = xlsx.utils.json_to_sheet(stateListing);
          
          // Add header row to worksheet
          const header = ["id", "State Name"]; // replace with your own column names
          xlsx.utils.sheet_add_aoa(worksheet, [header], { origin: "A1" });
          

          // Create a new workbook and add the worksheet
          const workbook = xlsx.utils.book_new();
          xlsx.utils.book_append_sheet(workbook, worksheet, 'My Sheet');

          // Write the workbook to a file
          xlsx.writeFile(workbook, 'uploads/user-excel/myFile.xlsx');

          res.send('excel created')
        },
    }
}

module.exports =stateController