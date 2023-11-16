const Joi = require("joi");

const notesValidator = Joi.object({

    title : Joi.string().required(),
    content : Joi.string().required(),

})

module.exports = {

     notesValidator,
}