import React from 'react'
import './App.css'
function Two(props)
{
	const [two ,setTwo ]=React.useState(null)
	const [elem,setElem]=React.useState(null)//The dom element we're rendering to
	if(elem&&!two)
	{
		let params={width: 29958, height: 200}
		let newTwo=new window.Two(params)
		setTwo(newTwo)
		console.log(elem)
		newTwo.appendTo(elem)
	}
	if(two)
	{
		let circle=two.makeCircle(72, 100, 50)
		let rect  =two.makeRectangle(213, 100, 100, 100)

		// The object returned has many stylable properties:
		circle.fill     ='#FF8000'
		circle.stroke   ='orangered' // Accepts all valid css color
		circle.linewidth=props.width

		rect.fill   ='rgb(0, 200, 255)'
		rect.opacity=0.75
		rect.noStroke()

		// Don't forget to tell two to render everything
		// to the screen
		two.update()
	}
	return <div ref={setElem} {...props}/>

}
function Generalized(props)
{
	//TODO: To truly understand the above code, try generaliing it to any generic dom plugin like twojs or threejs
	const [plug,setPlug]=React.useState(null)//Some plugin or something like two.js
	const [elem,setElem]=React.useState(null)//The dom element we're rendering to
	if(elem&&!plug)
	{
		let newPlug=props.newPlug()
		setPlug(newPlug)
		newPlug.appendTo(elem)
	}
	if(plug)
	{
		let circle=plug.makeCircle(72, 100, 50)
		let rect  =plug.makeRectangle(213, 100, 100, 100)

		// The object returned has many stylable properties:
		circle.fill     ='#FF8000'
		circle.stroke   ='orangered' // Accepts all valid css color
		circle.linewidth=props.width

		rect.fill   ='rgb(0, 200, 255)'
		rect.opacity=0.75
		rect.noStroke()

		// Don't forget to tell plug to render everything
		// to the screen
		plug.update()
	}
	return <div ref={setElem} {...props}/>

}
function App()
{
	const [w,sw]=React.useState(0)
	return <>
		<Two width={w} onMouseMove={()=>sw(w+1)}/>
		<Two width={w}/>
	</>
}

export default App
