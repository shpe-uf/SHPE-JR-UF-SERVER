const Theme = require('../../models/Theme');

module.exports = {
    Query: {
       async getThemes(){
            try{
                const themes = await Theme.find();
                return themes;
            } catch (err) {
                throw new Error(err);
            }
       }
    }
}