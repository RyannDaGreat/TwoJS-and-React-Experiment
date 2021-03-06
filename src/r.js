//All generalizable functions that don't really fit anywhere else, but that I'd like to reuse for other projects in the future...
const __playSoundElement=new Audio
// noinspection JSUnusedGlobalSymbols JSIgnoredPromiseFromCall
const r={
	timeout(millis=0)
	{
		//This is an async function, even though it doesn't look like one.
		//This is like sleep, except async.
		//By default, we wait for 0 milliseconds because this function might just be used to let
		//	other functions execute for a while (in the same way sleep(0) might be used to allow
		//	better multi-threading)
		//Example usage:
		//	console.log('Hello')
		//	await r.timeout(1000)
		//	console.log('World')
		return new Promise(resolve => setTimeout(resolve, millis));
	},
	async waitUntil(condition,value)
	{
		//'condition' is a non-async boolean function that accepts no arguments
		//'value' is a non-async function that takes no arguments and returns anything.
		//'waitUntil' is an async function that will return the value() after condition() is truthy
		//Example:
		//	l=[]
		//	condition=()=>l.length!==0
		//	console.log(await waitUntil(condition,()=>l[0]))
		//	//Then wait a few seconds in the console. Whenever you're ready, do...
		//	l.push("Hello World!")
		//	And then "Hello World!" should immediately print into the console.
		while(!condition())
			await r.timeout()
		return value()
	},
	refreshPage()
	{
		console.assert(arguments.length===0,'Wrong number of arguments.')
		window.location.reload();
	},
	goToUrl(url)
	{
		console.assert(arguments.length===1,'Wrong number of arguments.')
		window.location.assign(url)
	},
	async doFetch(url,body=undefined)
	{
		//Extremely biased function to suit my simple needs
		//Is a get request by default, unless you specify a body (then it becomes a post)
		//Returns text if 200 else
		console.assert(arguments.length>0)
		//ALWAYS returns a string (NOT an object) (via a promise, so you have to use await to get it)
		//Example usages:
		//  await doFetch('/getNumlike',{method:'GET'})
		//  JSON.parse(await doFetch('/user/info'))
		//  j=JSON.parse(await doFetch('/user/info'))
		// j.content.email
		const response = await fetch(url,{method:body===undefined?'GET':'POST',body})
		const status=response.status
		return await status===200?response.text():status
	},
	weAreInAnIframe()
	{
		console.assert(arguments.length===0,'Wrong number of arguments.')
		return window.location !== window.parent.location
	},
	playSound(url,{newElement=false}={})
	{
		//New element lets you play multiple sounds at once; but it might be worse for ios safari (which requires a user click to play sounds)
		console.assert(arguments.length===1,'Wrong number of arguments.')
		if(newElement)
		{
			// noinspection JSIgnoredPromiseFromCall
			new Audio(url).play()
		}
		else
		{
			__playSoundElement.src=url
			// noinspection JSIgnoredPromiseFromCall
			__playSoundElement.play()
		}
	},
	uniqueFromRight(array)
	{
		console.assert(arguments.length===1,'Wrong number of arguments.')
		//Example: uniqueFromRight([1,2,1,3,3,2,1,2,3,1])
		//Output:  [2, 3, 1]
		const seen=new Set
		const out=[]
		for(const element of [...array].reverse())
			if(!seen.has(element))
			{
				seen.add(element)
				out.unshift(element)
			}
		return out
	},
	getRequest(url,callback=console.log)
	{
		// Example usage: getRequest(url,response=>{console.log(response)})
		console.assert(arguments.length===2,'Wrong number of arguments.')
		var Http = new XMLHttpRequest()
		Http.open("GET", url)
		Http.send()
		Http.onreadystatechange=()=>
		{
			console.assert(Http.status===200,"r.js getRequest error: code "+Http.status+" (should be 200) on url "+r.repr(url))
			callback(Http.responseText)
		}
	},
	print(x)
	{
		console.assert(arguments.length===1,'Wrong number of arguments.')
		console.log(x)//What can I say? I really miss python...console.log is ugly.
	},
	repr(x)
	{
		console.assert(arguments.length===1,'Wrong number of arguments.')
		return JSON.stringify(x)
	},
	sortKeys(object)
	{
		console.assert(arguments.length===1,'Wrong number of arguments.')
		//Recursively reorder the keys alphabetically
		//Intended for use on json-like objects
		//Originally written to normalize djson files' object representations
		//EXAMPLE: sortKeys({3:0,2:0,1:0}) ==== {1:0,2:0,3:0}   (order isn't supposed to matter, but it seems that it IS generally preserved)
		//TODO assert.rightArgumentLength(arguments)
		if(r.isPureObject(object))
		{
			const keys=Object.keys(object)
			keys.sort()
			for(const key of keys)
			{
				const value=object[key]
				delete object[key]
				object[key]=value//Place key on the bottom
				r.sortKeys(object[key])
			}
		}
	},
	badSleep(seconds)
	{
		console.assert(arguments.length===1,'Wrong number of arguments.')
		//Burn CPU for seconds
		const e=new Date().getTime()+(seconds*1000)
		while(new Date().getTime() <= e){}
	},
	randomChance(probability)
	{
		console.assert(arguments.length===1,'Wrong number of arguments.')
		return Math.random()<probability
	},
	allCharsAreUnique(string)
	{
		console.assert(arguments.length===1,'Wrong number of arguments.')
		return string.length===r.numberOfUniqueChars(string)
	},
	numberOfUniqueChars(string)
	{
		console.assert(arguments.length===1,'Wrong number of arguments.')
		// noinspection JSValidateTypes
		return new Set(string.split('')).size
	},
	randomInteger(max)
	{
		console.assert(arguments.length===1,'Wrong number of arguments.')
		return Math.floor(Math.random()*(max+1))
	},
	randomIndex(list)
	{
		console.assert(arguments.length===1,'Wrong number of arguments.')
		return r.randomInteger(list.length-1)
	},
	randomElement(list)
	{
		console.assert(arguments.length===1,'Wrong number of arguments.')
		return list[r.randomIndex(list)]
	},
	charInString(char,string)
	{
		console.assert(arguments.length===2,'Wrong number of arguments.')
		const set=new Set()
		for(const char of string)
			set.push(char)
		return set.has(char)
	},
	currentFunctionName()
	{
		//Returns the name of the function that calls this
		try
		{
			// noinspection ExceptionCaughtLocallyJS
			throw new Error()
		}
		catch(e)
		{
			try
			{
				return e.stack.split('at ')[3].split(' ')[0]
			}
			catch(e)
			{
				return ''
			}
		}
	},
	removeDuplicateCharacters(string)
	{
		console.assert(arguments.length===1,'Wrong number of arguments.')
		//Examples:
		//	'larry' --> 'lary'
		//  'abcda' --> 'abcd'
		//  'babcc' --> 'bac'
		return [...new Set(string)].join('')//Relies on the order of 'set' (the way chrome's v8 engine does things)
	},
	removeNonAlphabeticCharacters(string)
	{
		console.assert(arguments.length===1,'Wrong number of arguments.')
		return string.replace(/[^a-zA-Z]/g, "")
	},
	withoutKey(object,key)
	{
		console.assert(arguments.length===2,'Wrong number of arguments.')
		const out={...object}
		delete out[key]
		return out
	},
	splitOnFirstSpace(string)
	{
		console.assert(arguments.length===1,'Wrong number of arguments.')
		// noinspection JSValidateTypes
		return string.split(/ (.*)/,2)
	},
	splitLines(string)
	{
		// noinspection JSValidateTypes
		return string.split('\n')
	},
	removeEmptyLines(string)
	{
		console.assert(arguments.length===1,'Wrong number of arguments.')
		return r.splitLines(string).filter(x=>x.trim()).join('\n')
	},
	nestedPath(path, value)
	{
		console.assert(arguments.length===2,'Wrong number of arguments.')
		//EXAMPLE: nestedPath([4,3,2,1],0) ==== {4:{3:{2:{1:0}}}}
		//EXAMPLE: nestedPath([],)
		console.assert(path&&Object.getPrototypeOf(path)===Array.prototype,'Path must be a list of keys')
		let out=value
		for(const key of [...path].reverse())
			out={[key]:out}
		return out
	},
	multiplyString(string, number)
	{
		console.assert(arguments.length===2,'Wrong number of arguments.')
		//Like python ("abc"*3=="abcabcabc")
		let out=''
		while(number--)
			out+=string
		return out
	},
	isDefined(x)
	{
		console.assert(arguments.length===1,'Wrong number of arguments.')
		return x!==undefined
	},
	isPurePrototypeOf(x, type)
	{
		//This is like type-checking with 'typeof', or 'instanceof', except that this way of checking is much more precise.
		console.assert(arguments.length===2,'Wrong number of arguments.')
		//TODO assert.defined(type)
		return Boolean(x&&Object.getPrototypeOf(x)===type.prototype)
	},
	isPureObject(x)
	{
		//Returns true IFF x is a pure object, meaning it could have been created with an object literal (no funky prototype chains)
		//For example, r.isPureObject(any delta) is always true (because all deltas should be able to exist from object literals)
		console.assert(arguments.length===1,'Wrong number of arguments.')
		return r.isPurePrototypeOf(x, Object)
	},
	isObject(x)
	{
		//Returns true IFF x is a pure object, meaning it could have been created with an object literal (no funky prototype chains)
		//For example, r.isPureObject(any delta) is always true (because all deltas should be able to exist from object literals)
		console.assert(arguments.length===1,'Wrong number of arguments.')
		return x instanceof Object
	},
	isPureFunction(x)
	{
		console.assert(arguments.length===1,'Wrong number of arguments.')
		return r.isPurePrototypeOf(x, Function)
	},
	isPureSymbol(x)
	{
		console.assert(arguments.length===1,'Wrong number of arguments.')
		return r.isPurePrototypeOf(x, Symbol)
	},
	isPureArray(x)
	{
		console.assert(arguments.length===1,'Wrong number of arguments.')
		return r.isPurePrototypeOf(x, Array)
	},
	isArray(x)
	{
		console.assert(arguments.length===1,'Wrong number of arguments.')
		return x instanceof Array
	},
	isPureString(x)
	{
		console.assert(arguments.length===1,'Wrong number of arguments.')
		return r.isPurePrototypeOf(x, String)
	},
	isString(x)
	{
		return typeof x==='string'
	},
	isPureNumber(x)
	{
		console.assert(arguments.length===1,'Wrong number of arguments.')
		return r.isPurePrototypeOf(x, Number)
	},
	isNumber(x)
	{
		return typeof x==='number'
	},
	arePureObjects(...variables)
	{
		for(const variable of variables)
			if(!r.isPureObject(variable))
				return false
		return true
	},
	numberedLinesString(string, numberToPrefix=i=>i+'\t')
	{
		console.assert(arguments.length>=1,'Wrong number of arguments.')
		//This function is meant for printing out code, with line-numbers on the far left.
		//EXAMPLE:
		//	CODE:
		//		console.log(numberedLinesString('line one\nline two\nline three'))
		//	OUTPUT:
		//		1	line one
		//		2	line two
		//		3	line three
		//Note: This function follows the typical text-editor convention that line-numbers start at 1, not 0
		//	(Think of it this way, when's the last time you ever saw a syntax error at line 0? Never...)
		console.assert(typeof string==='string')
		// noinspection JSValidateTypes
		return Object.entries(string.split('\n')).map((([i,e])=>numberToPrefix(Number(i)+1)+e)).join('\n')
	},
	singleton(get)
	{
		console.assert(arguments.length===1,'Wrong number of arguments.')
		//Makes a singleton out of a simple ()=>value getter function
		let singleton
		return function()
		{
			if(singleton===undefined)
				singleton=get()
			return singleton
		}
	},
	getIndentLevel(line, key={'\t':4})
	{
		console.assert(arguments.length>=1,'Wrong number of arguments.')
		//TODO assert.isString(line)
		//Another possible key: {'\t':4,' ':1} (converts 1 tab = 4 spaces)
		let out=0
		for(const char of line)
			if(char in key)
				out+=key[char]
			else
				break
		return out
	},
	clamp(x,a,b)
	{
		console.assert(arguments.length===3,'Wrong number of arguments.')
		//Clamp x between a and b (doesn't matter if a>b or b<a)
		if(x<Math.min(a,b))
			return Math.min(a,b)
		if(x>Math.max(a,b))
			return Math.max(a,b)
		return x
	},
	smoothAlpha(x)
	{
		//For smooth blending (as opposed to linear, jerky animations)
		console.assert(arguments.length===1,'Wrong number of arguments.')
		return (3*x-x*x*x)/2//https://www.desmos.com/calculator/pfaw67cutk
	},
	blend(x,y,alpha,clamped=false)
	{
		console.assert(arguments.length>=3,'Wrong number of arguments.')
		//If clamp is turned on, then we restrict alpha to reasonable values (between 0 and 1 inclusively)
		if(clamped)
			alpha=r.clamp(alpha,0,1)
		return (1-alpha)*x+alpha*y
	},
	gtoc()
	{
		//toc, like toc in MATLAB
		//gtoc stands for 'global toc'
		//
		//Return remaining time in seconds since 1970
		console.assert(arguments.length===0,'Wrong number of arguments.')
		return new Date().getTime()/1000
	},
	stringIsNumerical(string)
	{
		console.assert(arguments.length===1,'Wrong number of arguments.')
		console.assert(typeof string==='string')
		//EXAMPLES:
		//	r.stringIsNumerical('')   false
		//	r.stringIsNumerical(' ')   false
		//	r.stringIsNumerical('Infinity')   false
		//	r.stringIsNumerical('NaN')   false
		//	r.stringIsNumerical('0')   true
		//	r.stringIsNumerical(' . 2   ')   false
		//	r.stringIsNumerical(' . 2   ')   false
		//	r.stringIsNumerical(' +.2   ')   true
		//	r.stringIsNumerical(' -.2   ')   true
		//	r.stringIsNumerical('+-.2   ')   false
		//	r.stringIsNumerical('123   ')   true
		//	r.stringIsNumerical('1.23   ')   true
		//	r.stringIsNumerical('1.2.3   ')   false
		// noinspection JSUnresolvedFunction
		if(!string.trim())return false//Number('')===Number(' ')===0
		const number=Number(string)
		return JSON.parse(JSON.stringify(number))===number
	},
	parsedSimpleMathFromString(string)
	{
		//Supports ONLY +,-,* and NOT parenthesis etc
		//Can parse strings like '23 +3 - 234'
		//Returns a number or returns undefined upon error
		console.assert(arguments.length===1,'Wrong number of arguments.')
		console.assert(typeof string==='string')
		//EXAMPLES:
		//	r.parsedSimpleMathFromString('  0-01*88') === -88
		//	r.parsedSimpleMathFromString('  0-01')    === -1
		//	r.parsedSimpleMathFromString('  0+0')     === 0
		//	r.parsedSimpleMathFromString(' ')     === undefined
		//	r.parsedSimpleMathFromString(' 0')     === 0
		//	r.parsedSimpleMathFromString(' 0.')     === 0
		//	r.parsedSimpleMathFromString(' .2')     === 0.2
		//	r.parsedSimpleMathFromString(' .2-.1')     === 0.1
		let sum=0
		// noinspection JSUnresolvedFunction
		if(string.trim()[0]==='-')//Handle the edge case where the expression begins with a '-' sign
			string='0'+string
		string=string.replace(/-/,'+-1*')//Replace all subtraction/negation signs with multiplication by -1
		for(const chunk of string.split('+'))
		{
			let product=1
			for(let factor of chunk.split('*'))
			{
				if(!r.stringIsNumerical(factor))
				{
					return undefined
				}
				else
				{
					product*=Number(factor)
				}
			}
			sum+=product
		}
		if(!r.stringIsNumerical(''+sum))//If we have 'NaN' or 'Infinity' etc, don't return a number.
			return undefined
		return sum
	},
	closestPowerOfTwo(n)
	{
		console.assert(arguments.length===1,'Wrong number of arguments.')
		//Round neither up nor down, but instead gets the closest
		//From: https://bocoup.com/blog/find-the-closest-power-of-2-with-javascript
		return Math.pow( 2, Math.round( Math.log( n ) / Math.log( 2 ) ) );
	},
	equalsShallow(a,b)
	{
		console.assert(arguments.length===2,'Wrong number of arguments.')
		//By default, this is a SHALLOW equality check
		//(This avoids possible infinite loops) (it is possible, with memoization, to create a deep equality checker that can handle such infinite loops. I'll make that another day.)
		if(a===b||!a||!b||typeof a!=='object'||typeof b!=='object')return a===b
		for(const [i,e] of Object.entries(a))if(e!==b[i])   return false
		for(const [i,e] of Object.entries(b))if(e!==a[i])   return false
		return true
	},
	containsValueShallow(o,x,equal=r.equalsShallow)
	{
		console.assert(arguments.length>=2,'Wrong number of arguments.')
		for(const value of o)
			if(r.equalsShallow(x,value))
				return true
		return false
	},
	dictProduct(dicts)
	{
		console.assert(arguments.length===1,'Wrong number of arguments.')
		//Takes a set of (dicts of variable length) and returns a set of (dicts of uniform length)
		//Equivalent to returning every permutation of delta-concatenations of these dicts (which has >n! complexity)
		//(Result will be that every dict has same length)
		//EXAMPLE:
		//	(Product of three dicts where keys are indices)
		//	dictProduct([{0:1,1:1,2:1,3:1},{1:2,2:2},{0:3,2:3,3:3}])
		//
		//	1	1	1	1
		//	?	2	2	?
		//	3	?	3	3
		//
		//		  |
		//		  V
		//
		//	1	1	1	1
		//	1	2	2	1
		//	3	1	3	3
		//	3	2	3	3
		//	3	2	2	3
		//
		//This function is part of the secret sauce behind djson's macros
		//
		//To calculate this I use a depth-first search with memoization. The equality functions are bad because I dont want to make hashing algorithms for dicts in JS.
		const seen=[]
		function isSeen(dict)
		{
			if(!r.containsValueShallow(seen,dict))
			{
				seen.push(dict)
				return false
			}
			return true
		}
		function helper(dict)
		{
			if(isSeen(dict))
			{
				return
			}
			for(const key of Object.keys(dicts))
			{
				helper({...dict,...dicts[key]})
			}
		}
		helper({})
		let maxLength=0
		for(const dict of seen)
		{
			const length=Object.keys(dict).length
			if(length>maxLength)
			{
				maxLength=length
			}
		}
		const out=[]
		for(const dict of seen)
		{
			if(Object.keys(dict).length===maxLength)
			{
				out.push(dict)
			}
		}
		return out
	},
	transposed(object)
	{
		//transposed({x:{a:1,b:2,c:3},y:{a:4,b:5,c:6}})   --->   {a:{x:1,y:4},b:{x:2,y:5},c:{x:3,y:6}}
		console.assert(arguments.length===1,'Wrong number of arguments.')

		const out={}
		for(const [key1,value1] of Object.entries(object))
			for(const [key2,value2] of Object.entries(value1))
				if(out[key2]!==undefined)
					out[key2][key1]=value2
				else
					out[key2]={[key1]:value2}
		return out
	},

	//TODO: Move Object-tree functions in to objectTree.js
	transformObjectTreeLeaves(objectTree,leafTransform)
	{
		//Mutates objectTree in-place using leafTransform and returns undefined
		console.assert(arguments.length===2,'Wrong number of arguments.')
		//TODO assert.rightArgumentLength(arguments)
		//TODO assert.isFunction(leafTransform)
		//TODO assert.isPureObject(objectTree)
		for(const [index,value] of Object.entries(objectTree))
			if(r.isPureObject(value))
				r.transformObjectTreeLeaves(value,leafTransform)
			else
				objectTree[index]=leafTransform(value)
	},
	flattenedObjectTreePaths(objectTree,{includeLeaves=true}={})
	{
		//Retuns a list of list of strings followed by a value
		//EXAMPLES:
		// r.flattenedObjectTreePaths({a:5,c:{b:4}})             --->   [['a',5],['c','b',4]]
		// r.flattenedObjectTreePaths({a:5})                     --->   [['a',5]]
		// r.flattenedObjectTreePaths({a:5,b:6,c:{d:7,e:[8]}})                         --->   [['a',5],['b',6],['c','d',7],['c','e',[8]]]
		// r.flattenedObjectTreePaths({a:5,b:6,c:{d:7,e:[8]}},{includeLeaves:false})   --->   [['a'],  ['b'],  ['c','d'],  ['c','e']    ]
		//
		//Notes: If includeLeaves is false, then you can safely deduce that all lists in the output list will contain only strings
		//TODO assert.isPureObject(objectTree)
		console.assert(arguments.length>=1,'Wrong number of arguments.')
		const paths=[]
		function helper(objectTree,path=[])
		{
			for(const [index,value] of Object.entries(objectTree))
			{
				if(!r.isPureObject(value))
				{
					const newPath=[index]
					if(includeLeaves)
						newPath.push(value)
					paths.push(path.concat(newPath))
				}
				else
				{
					helper(value,path.concat([index]))
				}
			}
		}
		helper(objectTree)
		return paths
	},
	containsStructure(object,structure)//ObjectTree function
	{
		console.assert(arguments.length===2,'Wrong number of arguments')
		// r.containsStructure({a:5},{})   --->   true
		// r.containsStructure({a:5},{a:{}})   --->   true
		// r.containsStructure({a:5},{a:{b:{}}})   --->   false
		// r.containsStructure({a:5},{a:{},b:{}})   --->   false
		// r.containsStructure({a:5,b:{c:4}},{a:{},b:{}})   --->   true
		//TODO assert.isPureObject(structure)//5, or {a:5} are not good structures
		for(const key of Object.getOwnPropertyNames(structure))
		{
			if(!(key in object))
			{
				return false
			}
			if(!r.containsStructure(object[key],structure[key]))
			{
				return false
			}
		}
		return true
	},
	sameObjectTreeStructure(a,b)
	{
		//We just care about keys to objects here, not the values of leaves
		//r.sameObjectTreeStructure({a:6,b:{a:3,c:4}},{a:3,b:{c:4,a:45}}) is true
		//r.sameObjectTreeStructure({a:6,b:{a:3,c:4}},{a:3,b:{c:4,}}) is false
		//r.sameObjectTreeStructure({a:6,b:8,c:{}},{a:3,b:4,c:{d:5}}) is false
		//r.sameObjectTreeStructure({a:6,b:8,c:{}},{a:3,b:4,c:{}}) is true
		//r.sameObjectTreeStructure({a:6,b:8},{a:3,b:4}) is true
		//r.sameObjectTreeStructure({a:6},{a:3,b:4}) is false
		//r.sameObjectTreeStructure({a:6},{a:3}) is true
		//r.sameObjectTreeStructure({a:6},{b:3}) is false
		//r.sameObjectTreeStructure({b:6},{b:3}) is true
		//r.sameObjectTreeStructure({b:6},{}) is false
		//r.sameObjectTreeStructure({},{}) is true
		//r.sameObjectTreeStructure({},5) is false
		//r.sameObjectTreeStructure(6,5) is true
		console.assert(arguments.length===2,'Wrong number of arguments.')
		if(r.isPureObject(a)!==r.isPureObject(b))
		{
			return false
		}
		const are_objects=r.isPureObject(a)
		if(!are_objects)
			return true
		for(const key of Object.keys(a))
		{
			if(!(key in b))
				return false
		}
		for(const key of Object.keys(b))
		{
			if(!(key in a))
				return false
		}
		for(const key of Object.keys(a))
		{
			if(!r.sameObjectTreeStructure(a[key],b[key]))
				return false
		}
		return true
	},
	reflexiveDict(array)
	{
		//TODO needs better name
		// reflexiveDict(['A',1,[]])   --->   {'A':'A','1':1,'[]':[]}
		const out={}
		for(const item of array)
			out[item]=item
		return out
	},
	boundingBoxOfThreeObject(threeObject)
	{
		//TODO possibly keep in my npm repo, but remove from specifically r.js and put in a Three.js-specific file (though can still be accessed from the r object, somehow...)
		//Meant for use with a threeJs object
		// noinspection JSUnresolvedVariable,JSUnresolvedFunction
		return new window.THREE.Box3().setFromObject(threeObject)
		//returns something in the form {min:{x,y,z},max:{x,y,z}}, where x,y,z are numbers
	},
	randomCharacters(length,{characters='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'}={})
	{
		//From https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
		var result           = '';
		var charactersLength = characters.length;
		for ( var i = 0; i < length; i++ ) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	},
	isNamespaceable(text)
	{
		//Boolean function
		//Return true iff text is alphanumeric (while also allowing '_')
		//EXAMPLES:
		// isNamespaceable("aosdk")		--->	true
		// isNamespaceable("aosd_k")	--->	true
		// isNamespaceable("aosd_3k")	--->	true
		// isNamespaceable("aosd_3[k")	--->	false
		// isNamespaceable("")			--->	false
		// isNamespaceable("10923")		--->	true
		// isNamespaceable("df923")		--->	true
		// isNamespaceable("dfgfg923")	--->	true
		// isNamespaceable("df_923")	--->	true
		// isNamespaceable("df_92_3")	--->	true
		// isNamespaceable("2df_92_3")	--->	true
		return text.match(/^[A-Za-z0-9_]+$/)!==null
	},
	valueBlend(a,b,alpha,{threshold=0,blend=r.blend}={})
	{
		//Simple blend between two values. Does not blend individual elements.
		//Only numbers can be tweened
		// r.valueBlend('A',1  ,.4)	--->	1
		// r.valueBlend('A',1  ,.0)	--->	1
		// r.valueBlend('A',1  ,0 )	--->	1
		// r.valueBlend(3  ,1  ,0 )	--->	3
		// r.valueBlend(3  ,1  ,1 )	--->	1
		// r.valueBlend(3  ,1  ,.5)	--->	2
		// r.valueBlend(3  ,'A',.5)	--->	"A"
		if(r.isNumber(a)&&r.isNumber(b))
			return blend(a,b,alpha)
		return alpha<threshold?a:b
	},
	objectBlend(a,b,alpha,{blend=r.valueBlend}={})
	{
		//TODO should somehow be lumped with equalsShallow
		//Kind of like deltas.blended, except it's shallow. It isn't recursive.
		//This is a pure function.
		// r.objectBlend({a:5,b:6,c:8}    ,{t:5,c:7      },.9)    --->    {t: 5, c: 7.1    , a: 5, b: 6  }
		// r.objectBlend({a:5,b:6,c:8}    ,{b:5,c:'a'    },.9)    --->    {t: 5, c: "a"    , a: 5, b: 5.1}
		// r.objectBlend({a:5,b:6,c:8}    ,{b:5,c:{d:'a'}},.9)    --->    {t: 5, c: {d:'a'}, a: 5, b: 5.1}
		// r.objectBlend({a:5,b:6,c:{d:2}},{t:5,c:{d:3  }},.2)    --->    {t: 5, c: {d:3  }, a: 5, b: 6  }
		const out={...b,...a}
		for(const key of Object.keys(b))
			out[key]=blend(out[key],b[key],alpha)
		return out
	},
	haveSameKeys(a,b)
	{
		//TODO: Conceptual question, should haveSameKeys(null,{a:4}) return true because we don't know what keys null is supposed to have? Or do we return false, because null has no keys (this is what it currently does)...
		//Summary:
		//	Boolean function that returns true if and only if a has the same keys as b
		//	There are no restrictions on the values of a and b.
		//	This function should run very quickly
		//Properties:
		//	This function has an equality relation:
		//	haveSameKeys(a,b)                        --->   true                //Reflexivity
		//	haveSameKeys(a,b)                        --->   haveSameKeys(b,a)   //Symmetry
		//	haveSameKeys(a,b) && haveSameKeys(b,c)   --->   haveSameKeys(a,c)   //Transitivity
		//Examples:
		//	NOTE: Examples that have -*-> are meant to highlight some edge cases worth checking out
		//	haveSameKeys({a:4},{a:6})         --->   true
		//	haveSameKeys({a:4},{a:{b:4}})     --->   true
		//	haveSameKeys({a:4},{a:1,b:5})     --->   false
		//	haveSameKeys({b:8,a:4},{a:1,b:5}) --->   true
		//	haveSameKeys(3,"")                -*->   true   //Because both have Object.keys(3)====Object.keys("")====[]
		//	haveSameKeys(3,{})                --->   true
		//	haveSameKeys(3,{a:5})             --->   false
		//	haveSameKeys(null,{a:5})          --->   false
		//	haveSameKeys(null,4)              -*->   true   //Object.keys(null) throws an error, but this function treats null and undefined as having no keys, and pretends Object.keys(null)====Object.keys(undefined)====[]
		//	haveSameKeys(null,{})             --->   true
		//	haveSameKeys(undefined,{})        --->   true
		//	haveSameKeys(undefined,null)      --->   true
		//	haveSameKeys({3:5},null)          --->   false
		const aKeys=a===undefined||a===null?[]:Object.keys(a)
		const bKeys=b===undefined||b===null?[]:Object.keys(b)
		//We can assume that all values in these lists are unique, pure strings
		if(aKeys.length!==bKeys.length)return false
		for(const aKey of aKeys)
			if(!(aKey in b))
				return false
		return true
	},
}
window.r=r
export default r