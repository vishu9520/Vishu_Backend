class ApiError extends Error{
    constructor(
 statusCode,
    message="Something went wrong",
    errors=[],
    statcks=" "
    ){
        super(message)
        this.stackCode=statusCode
        this.data =null
        this.message =message
        this.success=false;
        this.errors =this.errors

        if(statck){
            this.stack=statck
        }else{
            Error.captureStackTrace(this,this.constructor);
        }
    }
   
}