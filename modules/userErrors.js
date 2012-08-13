module.exports = userError;


function userError(_code,_msg){
	this.code = _code;
	this.message = _msg;
}