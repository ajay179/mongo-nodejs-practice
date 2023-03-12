const StateModel = require('../../models/StateModel');

function cityController() {
    return{
        async funViewAddCity(req,res){
            const stateList = await StateModel.find().limit(100);

            console.log(stateList);

            res.render('add-city-form',{stateList:stateList});
        },

        // async getStateList(req,res){
        //     try {
        //         // Get the user input from the query string
        //         const search = req.query.search;
            
        //         // Search for matching states in the database
        //         const states = await StateModel.find({ name: { $regex: search, $options: 'i' } }).limit(10);
            
        //         // Return the matching states as JSON
        //         res.json(states);
        //       } catch (err) {
        //         console.error(err);
        //         res.status(500).send('Error fetching states');
        //       }
        // },

        // Route for the Select2 AJAX endpoint
        async getStateList(req,res) {
            // Get the requested page number and number of items per page
            const page = req.query.page ||
            1;
            const perPage = req.query.page_limit ||
            10;
        
            // Calculate the offset based on the requested page number and number of items per page
            const offset = (page - 1) * perPage;
        
            // Perform a database query to get the total number of items
            StateModel.countDocuments({}, function(err, totalCount) {
            if (err) {
                console.log(err);
                return res.status(500).send('An error occurred');
            }
        
            // Perform a database query to get the items for the current page
            StateModel.find({})
                .sort('text')
                .skip(offset)
                .limit(perPage)
                .exec(function(err, items) {
                if (err) {
                    console.log(err);
                    return res.status(500).send('An error occurred');
                }
        
                // Calculate the total number of pages
                const totalPages = Math.ceil(totalCount / perPage);
        
                // Send the Select2-compatible response
                res.json({
                    results: items.map(function(item) {
                    return { id: item._id, text: item.state_name };
                    }),
                    pagination: {
                    more: page < totalPages
                    }
                });
                });
            });
        }
    }
}

module.exports = cityController