import React from 'react'
import r from './r.js'
//The below code was made before PlugWrapper. This is a good example to show it's intent: PlugWrapper generalizes this code beyond two.js
//		function Two(props)
//		{
//			const [two, setTwo]  =React.useState(null)
//			const [elem, setElem]=React.useState(null)//The dom element we're rendering to
//			if(elem && !two)
//			{
//				let params={/*width: 29958, height: 200*/}
//				let newTwo=new window.Two(params)
//				setTwo(newTwo)
//				console.log(elem)
//				newTwo.appendTo(elem)
//			}
//			if(two)
//			{
//				let circle=two.makeCircle(72, 100, 50)
//				let rect  =two.makeRectangle(213, 100, 100, 100)
//
//				// The object returned has many stylable properties:
//				circle.fill     ='#FF8000'
//				circle.stroke   ='orangered' // Accepts all valid css color
//				circle.linewidth=props.width
//
//				rect.fill   ='rgb(0, 200, 255)'
//				rect.opacity=0.75
//				rect.noStroke()
//
//				// Don't forget to tell two to render everything
//				// to the screen
//				two.update()
//			}
//			return <div ref={setElem} {...props}/>
//		}


function PlugWrapper({newPlug,updatePlug})
{
	//TODO update the documentation on this function. Some variable names/meanings have changed.
	//TODO There's gotta be some better name than "plug". When you think a really good descriptive name, change it.
	//Motivation:
	//	I define a 'plug' to be some non-react component that we wish to integrate into react, such as Three.js or jquery etc.
	//	I don't want to use third-party bindings for libraries made by other people, such as react bindings for Three.js.
	//	I want to use three.js like it was originally meant to be, but also with react.
	//	Each time we create a react component, we want to create a new instance of some plug (I.E. keep separate
	//	We also wish to be able to mutate this plug through props, though not exclusively (we also want a plug like Three.js to be able to modify itself)
	//Summary:
	//	This function is a React component meant to hold objects that are not natively compatible with react.
	//	Examples include instances of THREE.js scenes, which have their own state and render to a webgl canvas.
	//	This wrapper is meant to let you easily integrate non-react code in a react-like way. Please see examples.
	//Parameters:
	//	- newPlug is a function that takes no arguments that returns a new instance of the plug.
	//	- updatePlug is a function that takes one argument: the plug instance, and returns nothing.
	//How it works:
	//	Read this function's code from the bottom-up; as this is the true order of when events occur.
	//	First, the ref calls setElem. This results in PlugWrapper being called again, now with elem!==null.
	//	Then, elem
	//Notes:
	//	- If you want to have interactivity through React props such as onClick, wrap PlugWrapper in a div. It's crucially important that this component's div doesn't update, because setElem should only ever be called once (which is called from the ref property on the div this component returns).
	//	- All non-react state data should be stored in your plug somehow. I made two.mydata={} and stored all my variables in there, so they weren't wiped each time we call PlugWrapper.
	//		- Tip: For concision, I used Object.assign(two.mydata={},{circle,rect,group})
	//	- Make sure that you put anything that should be created only once in newPlug, instead of updatePlug. newPlug is kind of like a constructor, and is only called once, whereas updatePlug is called over and over again.
	const [plug,setPlug]=React.useState(null)//Some plugin or something like two.js, that we will put inside a div called 'elem' (short for "element")
	const [elem,setElem]=React.useState(null)//The dom element (a div, to be more specific) that we're putting the plug inside
	if(plug)
	{
		updatePlug(plug)
	}
	else if(elem)
	{
		const _=newPlug()
		setPlug(_)
		_.appendTo(elem)//This should only ever happen once, unless PlugWrapper is written incorrectly
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
		<PlugWrapper {...{newPlug, updatePlug}}/>
	</div>
}


function PropsBlend({alpha,props,target,Component,children})
{
	//<PropBlend alpha    ={.5}
	//           props    ={}
	//           target   ={{prop1:4,prop5:7}}
	//           component={Div}/>
	//
	//<PropsBlend Component={GeneralizedTwo}
	//			alpha    ={w}
	//			target   ={{width: 10}}
	//			props    ={{width: 0, onMouseMove: ()=>sw(w+.1)}}/>
	//
	let objectBlend=r.objectBlend(props, target, alpha)
	window._props=props
	window._target=target
	// console.log(props,target,alpha,objectBlend)
	return <Component {...objectBlend}>
		{children}
	</Component>
}

function PropsLegato({alphaRate,targetProps,Component,children})
{
	//Exponential smoothing on all targetProps whose name is in 'keys'
	//Will only tween numerical properties
	console.assert(r.isNumber(alphaRate)&&alphaRate>=0&&alphaRate<=1,'Bad alphaRate value:',alphaRate)
	const [prevTime ,setPrevTime ]=React.useState(r.gtoc())
	const [prevProps,setPrevProps]=React.useState({})
	const currentTime=r.gtoc()//Time is measured in seconds
	console.assert(prevTime<=currentTime)
	const deltaTime=currentTime-prevTime
	const alpha=1-Math.pow(1-alphaRate,deltaTime)// https://www.desmos.com/calculator/wxlvrbsvjw
	const currentProps=r.objectBlend(prevProps,targetProps,alpha)
	// console.log(currentProps)
	React.useEffect(()=>{
		// const converged=r.equalsShallow(prevProps,currentProps)//If this is true, stop animating to save CPU (blending will have no effect anymore)
		// if(!converged)
		{
			//The !converged check is necessary, otherwise this will loop infinitely (because we're setting the state, which will cause PropsLegato to render again and set the state again etc)
			setPrevProps(currentProps)
			setPrevTime (currentTime )
		}
	})
	return <Component {...currentProps}>
		{children}
	</Component>
}

function App()
{
	const [w,sw]=React.useState(0)
	return <>
		<PropsLegato Component={GeneralizedTwo} targetProps={{onClick: ()=>sw(.5),width:w*5}} alphaRate={.8}>

		</PropsLegato>
		<GeneralizedTwo width={w}
		                onMouseMove={()=>sw(w+.1)} />
		<PropsBlend Component={GeneralizedTwo}
		            alpha    ={w}
		            target   ={{width: 10}}
		            props    ={{width: 0, onMouseMove: ()=>sw(w+.1),onClick: ()=>sw(.5)}}/>
	</>
}

export default App
