const apiResponseMiddleware = (req,res,next) => {

	res.apiSuccess = function(response){
		res.status(200);
		res.json({
			success: true,
			payload: response
		})
	};

	res.apiError = function(response){
		res.status(200);
		res.json({
			success: false,
			message: response
		})
	};

	res.apiInternalError = function(err) {
		var response = {};
		var validErr = err instanceof Error;

		for(var key in errorProps) {
			if(validErr && err.hasOwnProperty(key)) {
				response[key] = err[key];
			}else if(errorProps.hasOwnProperty(key)) {
				response[key] = errorProps[key];
			}else{
				response[key] = null;
			}
		}

		var statusCode = 500;
		if(validErr && err.hasOwnProperty(statusCodeKey) && typeof err[statusCodeKey] === "number"){
			statusCode = err[statusCodeKey];
		}

		var failed = failCodes.indexOf(statusCode) >= 0;
		response.status = failed ? "fail" : "error";

		res.status(statusCode);
		res.json(response);

	};

	next();
};

module.exports = apiResponseMiddleware;