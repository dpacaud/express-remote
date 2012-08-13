module.exports = userError;


function userError(_code,_msg){
	this.codigo = _code;
	this.message = _msg;
}