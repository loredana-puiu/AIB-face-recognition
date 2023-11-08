import React from "react";
import "./ImageLinkForm.css";

//This component is responsible for accepting an image URL and triggering the face detection process

const ImageLinkForm = ({ onInputChange, onButtonSubmit }) => {
	return (
		<div>
			<div className="white f3">
				{`WELCOME TO OUR PROJECT`} <br/>
				{`Artificial Intelligence for Business`}
			</div>
			<p className="f3">
				{"This Magic Brain will detect faces in your pictures. Give it a try."}
			</p>
			<div className="center">
				<div className="form center pa4 br3 shadow-5">
					<input className="f4 pa2 w-70 center" type="text" onChange={onInputChange}/>
					<button 
						className="w-30 grow f4 link ph3 pv2 dib white bg-light-purple"
						onClick={onButtonSubmit}>
						Detect
					</button>
				</div>
			</div>	
		</div>
		);
}

export default ImageLinkForm;