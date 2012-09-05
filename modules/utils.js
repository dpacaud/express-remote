
exports.getKey = function(size){
	charArray = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
				 'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
				 '0','1','2','3','4','5','6','7','8','9'];
	key = "";
	if(!size) size = 25;
	// Lets declare the variable so that it is local to the function
	var i = 0;
	for(i = 0 ; i < size ; i++){

		a = Math.round(Math.random() * 61) ;
		//console.log(a);
		key += charArray[a];
	}
	
	return key;
}
