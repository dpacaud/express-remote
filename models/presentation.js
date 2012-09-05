module.exports = presentation;


function presentation(user, name, content, type, key){
	this.user_id = user._id;
	this.name = name;
	this.content = content;
	this.type = type;
	this.key = key
}

