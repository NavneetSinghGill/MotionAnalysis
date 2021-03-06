var CONSTANTS = {
    ISLOCALENVIRONMENT: true,
    DATABASE: {
        URL_LOCAL: 'mongodb://127.0.0.1:27017',
        URL_PROD: 'mongodb+srv://motionanalysis:motionanalysis123@cluster0-jcham.mongodb.net/Production',
        url: function url() {
            return CONSTANTS.ISLOCALENVIRONMENT ? CONSTANTS.DATABASE.URL_LOCAL : CONSTANTS.DATABASE.URL_PROD;
        },
        DATABASENAME: function DATABASENAME() {
            return CONSTANTS.ISLOCALENVIRONMENT ? 'MotionAnalysisDB' : 'Cluster0';
        }
    }
};
exports.CONSTANTS = CONSTANTS;