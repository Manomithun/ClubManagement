import {STATUS} from "../Constants/httpStatus.js"
const errorHandler=(err,req,res,next)=>{
    const statusCode=err.statusCode || STATUS.INTERNAL_SERVER_ERROR;
    res.status(statusCode);
    switch(statusCode){
        
        case STATUS.VALIDATION_ERROR:
            res.json(errorJSONOBJ(" VALIDATION_ERROR",err.message));
            break;
        case STATUS.UN_AUTHORIZED:
            res.json(errorJSONOBJ("UN_AUTHORIZED",err.message));
            break;
        case STATUS.FORBIDDEN:
            res.json(errorJSONOBJ("FORBIDDEN",err.message))
            break;
        case STATUS.NOT_FOUND:
            res.json(errorJSONOBJ("Not Found",err.message));
            break;
        case STATUS.SERVER_ERROR:
            res.json(errorJSONOBJ("Internal Server Error",err.message));
            break;
        default:
        res.json(
          errorJSONOBJ(
             "Error",
             err.message
          )
   );
    }
};

function errorJSONOBJ(title,message){
    return {
        title,
        message
    }
}
export default errorHandler;