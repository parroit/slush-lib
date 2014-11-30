

/**
 * [Prompts for module sub-generator]
 * @return {Object} [return Object containing all prompts]
 */
module.exports = function(){
    var questions = {
        name: {
            type:'input',
            name: 'name',
            message: 'What is the name of this module?',
            default: 'Api'
        },
        path: {
          type: 'input',
          name: 'path',
          message: 'Where should I put this module?',
          default: './lib'
        },
        pattern: {
            type:'list',
            name: 'pattern',
            message: 'What type of pattern is this module?',
            choices:[
                {value:'class', name:'Class', default:true},
                {value:'module', name:'Module'},
                {value:'singleton', name:'Singleton'}
            ]
        },
        private: {
            type:'input',
            name: 'private',
            message: 'Private Methods?',
            default:'filter,configure'
        },
        public : {
            type:'input',
            name: 'public',
            message: 'Public Methods?',
            default:'read,update'
        }
    }
    return questions;
}