import React, { Component } from 'react';
import Logo from "./components/Logo/Logo";
import Clarifai from 'clarifai';
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Particles from 'react-particles-js';
import './App.css';

// Set up Clarifai API Key
const app = new Clarifai.App({
  apiKey: '5bb2834922eb4676abacaaced2e17d7c'
 });

const particlesOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 500
      }
    }
  }
} 

const initialState = {
  input: "",
  imageUrl: "",
  box: {},
  route: "signin",
  isSignedIn: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: ""
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  // Function to calculate face locations based on Clarifai's response
  calculateFaceLocation = (data) => {
    // Extract face location data from Clarifai response
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);

    // Calculate coordinates for the bounding box around the face
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  // Function to display the bounding box around the detected face
  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  // Function to handle changes in the input field
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  // Function triggered when the 'Detect' button is clicked
  onButtonSubmit = () => {
    // Update the state with the input URL
    this.setState({imageUrl: this.state.input});

    // Use Clarifai's face-detection model to predict faces in the input image
    app.models.predict('face-detection', this.state.input)
      .then(response => {
        console.log('hi', response)
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}))
            })

        }
        // Calculate and display the bounding box around the detected face
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }

  render() {
      const { imageUrl, box } = this.state;
      return (
      <div className="App">
        <Particles className="particles"
            params={particlesOptions}/>
        <Logo />
        <ImageLinkForm 
          onInputChange={this.onInputChange} 
          onButtonSubmit={this.onButtonSubmit}/>
        <FaceRecognition box={box} imageUrl={imageUrl} />
      </div>
    );
  }
}

export default App;
