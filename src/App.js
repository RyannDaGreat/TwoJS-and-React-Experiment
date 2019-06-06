import React from 'react'
// import './App.css'

function setAttributes(domElement,attributes)
{
	for(const [name,value] of Object.entries(attributes))
	{
		domElement.setAttribute(name,value)
	}
}

// function Two(props)
// {
// 	const [two ,setTwo ]=React.useState(null)
// 	const [elem,setElem]=React.useState(null)//The dom element we're rendering to
// 	if(elem&&!two)
// 	{
// 		let params={/*width: 29958, height: 200*/}
// 		let newTwo=new window.Two(params)
// 		setTwo(newTwo)
// 		console.log(elem)
// 		newTwo.appendTo(elem)
// 	}
// 	if(two)
// 	{
// 		let circle=two.makeCircle(72, 100, 50)
// 		let rect  =two.makeRectangle(213, 100, 100, 100)
//
// 		// The object returned has many stylable properties:
// 		circle.fill     ='#FF8000'
// 		circle.stroke   ='orangered' // Accepts all valid css color
// 		circle.linewidth=props.width
//
// 		rect.fill   ='rgb(0, 200, 255)'
// 		rect.opacity=0.75
// 		rect.noStroke()
//
// 		// Don't forget to tell two to render everything
// 		// to the screen
// 		two.update()
// 	}
// 	return <div ref={setElem} {...props}/>
//
// }
function Generalized({newPlug,updatePlug})
{
	//TODO update the documentation on this function. Some variable names/meanings have changed.
	//Summary:
	//	This function is a React component meant to hold objects that are not natively compatible with react.
	//	Examples include instances of THREE.js scenes, which have their own state and render to a webgl canvas.
	//	This wrapper is meant to let you easily integrate non-react code in a react-like way. Please see examples.
	//Parameters:
	//	- newPlug is a function that takes no arguments that returns a new instance of the plug.
	//	- updatePlug is a function that takes one argument: the plug instance, and returns nothing.
	//	- elemProps is optional, and sets the properties of elem (aka the div holding the plug)
	//How it works:
	//	First, the ref calls setElem. This results in Generalized being called again, now with elem!==null.
	//	Then, elem
	//Notes:
	//	- If you want to have interactivity through React props such as onClick, wrap Generalized in a div. It's crucially important that this component's div doesn't update, because setElem should only ever be called once (which is called from the ref property on the div this component returns).
	//	- All non-react state data should be stored in your plug somehow. I made two.mydata={} and stored all my variables in there, so they weren't wiped each time we call Generalized.
	//		- Tip: For concision, I used Object.assign(two.mydata={},{circle,rect,group})
	//	- Make sure that you put anything that should be created only once in newPlug, instead of updatePlug. newPlug is kind of like a constructor, and is only called once, whereas updatePlug is called over and over again.
	const [plug,setPlug]=React.useState(null)//Some plugin or something like two.js
	const [elem,setElem]=React.useState(null)//The dom element we're rendering to
	if(plug)
	{
		updatePlug(plug)
	}
	else if(elem)
	{
		const _=newPlug()
		setPlug(_)
		_.appendTo(elem)//This should only ever happen once
	}
	return	<div ref={setElem}/>
}
function GeneralizedTwo(props)
{
	function newPlug()
	{
		// return
		const two=new window.Two()
		const circle = two.makeCircle(-70, 0, 50)
		const rect = two.makeRectangle(70, 0, 100, 100)
		const group= two.makeGroup(circle, rect)
		Object.assign(two.mydata={},{circle,rect,group})//Store all these v
		// console.log("I MUST BE CALLED FIRST",circle,rect)
		two.bind('update', function(frameCount) {
			// This code is called everytime two.update() is called.
			// Effectively 60 times per second.
			if (group.scale > 0.9999) {
				group.scale = group.rotation = 0
			}
			var t = (1 - group.scale) * 0.125
			group.scale = 1//t
			group.rotation += .1//t * 4 * Math.PI
		}).play()  // Finally, start the animation loop
		rect  .noStroke()
		rect  .fill  ='rgba(0, 200, 255, 0.75)'
		circle.fill  ='#FF8000'
		circle.stroke='orangered' // Accepts all valid css color
		group .scale = 0
		group .translation.set(two.width / 2, two.height / 2)
		return two
	}
	function updatePlug(two)
	{
		var {group,circle,rect}=two.mydata
		circle.linewidth=props.width
	}
	return <div {...props}>
		<Generalized {...{newPlug, updatePlug}}/>
	</div>
}
function App()
{
	const [w,sw]=React.useState(4)
	return <>
		<GeneralizedTwo width={w} onMouseMove={()=>sw(w+1)}/>
	</>
}

export default App
