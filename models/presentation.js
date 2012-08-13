module.exports = presentation;


function presentation(user, name, content, type){
	this.user_id = user._id;
	this.name = name;
	this.content = content;
	this.type = type;
}

