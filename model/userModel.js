const {user} = require('../entity');

const userModel = (function(){
    return {
        create: async (data) => {

            let newUser = new user(data);

            await newUser.save((err) =>{
                if(err) throw err;
            });
            return newUser;
        },
        update: async (options) => {
            let {data, where} = options;

            let updateResult = await user.findOneAndUpdate(where, data, {new: true, rawResult: true}, (err, result) => {
                if (err) throw err;

                return result;
            });

            return JSON.stringify(updateResult);
        },
        findOne: async(options) => {
            let {where, attributes} = options;

            let findResult =  await user.findOne(where, attributes, (err, result) => {
                if(err) throw err;

                return result;
            });

            return JSON.stringify(findResult);
        },
        findAll: async() => {
            let findResult = await user.find({}, (err, result) => {
                if(err) throw err;
                return result;
            });

            return JSON.stringify(findResult);
        },
        delete: async (options) => {
            let deleteResult =  await user.findOneAndDelete(options);
            return JSON.stringify(deleteResult);
        },
        deleteAll: async () => {
            await user.deleteMany({});

            return null;
        }
    }
})();

module.exports = userModel;