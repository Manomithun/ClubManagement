const validate = (schema) =>
(req,res,next)=>{

    try{

        req.body =
        schema.parse(req.body);

        next();

    }catch(err){

        return res.status(400).json({

            success:false,

            errors: err.issues.map(
               (error)=>({

                field:error.path[0],

                message:error.message
            }))
        });
    }
};

export default validate;