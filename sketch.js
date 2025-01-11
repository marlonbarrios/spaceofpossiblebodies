// In the Space of Possible Bodies
// An exploration of speculative life forms and consciousness
// By [Your Name], 2024

let proxyUrl = "https://crawling-hazel-vertebra.glitch.me/create_n_get/";
let img;
let canvasContainer;
let canvasWidth;
let canvasHeight;
let staticLoadingAngle = 0;
let isGenerating = false;
let isFirstGeneration = true;
let isImageFocused = false;
let focusedImageX = 0;
let focusedImageY = 0;
let focusedImageSize = 0;
let focusedImageRot = 0;
let images = [];
let maxImages = 120;
let currentImageIndex = 0;
let generationInterval;
let showWireframes = true;
let osc;
let env;
let rotationX = 0;
let rotationY = 0;
let targetRotationX = 0;
let targetRotationY = 0;
let isDragging = false;
let previousMouseX = 0;
let previousMouseY = 0;

let subjects = [
  "hyperdimensional organisms", "quantum biological entities", 
  "synthetic DNA architectures", "living crystalline structures",
  "bio-plasma organisms", "membrane-based life forms",
  "protein-folding beings", "symbiotic neural colonies",
  "viral megastructures", "molecular assemblages",
  "organic computation clusters", "living metamaterials"
];

let styles = [
  "biological abstraction", "organic architecture", "cellular patterns", 
  "protein folding geometry", "membrane dynamics", "neural morphogenesis",
  "embryonic development", "evolutionary emergence",
  "biological self-assembly", "morphogenetic fields",
  "organic crystallization", "biological fractals"
];

let elements = [
  "with flowing cytoplasm", "generating biological fields",
  "pulsing with cellular energy", "morphing through developmental stages",
  "radiating morphogenetic waves", "with organic membranes",
  "wrapped in biological matrices", "generating protein structures",
  "with symbiotic networks", "expressing genetic patterns",
  "forming organic lattices", "assembling molecular structures"
];

let colorSchemes = [
  "in bioluminescent patterns", "with cellular gradients",
  "in metabolic pathways", "with protein signatures",
  "in neural activity maps", "with membrane potentials",
  "in genetic expressions", "with molecular bonds",
  "in symbiotic colors", "with organic spectrums",
  "in biological phases", "with living pigments"
];

let environments = [
  "in morphogenetic fields", "in cellular matrices",
  "in protein landscapes", "in neural networks",
  "in biological lattices", "in membrane systems",
  "in genetic spaces", "in molecular dimensions",
  "in symbiotic realms", "in metabolic fields",
  "in organic architectures", "in living geometries"
];

function setup() {
  canvasWidth = windowWidth;
  canvasHeight = windowHeight;
  
  canvasContainer = createDiv('');
  canvasContainer.style('position', 'fixed');
  canvasContainer.style('top', '0');
  canvasContainer.style('left', '0');
  canvasContainer.style('width', '100%');
  canvasContainer.style('height', '100%');
  canvasContainer.style('background-color', '#C0C0C0');
  
  let cnv = createCanvas(canvasWidth, canvasHeight, WEBGL);
  cnv.parent(canvasContainer);
  
  // UI container for prompt input and submit button
  let uiContainer = createDiv('');
  uiContainer.style('position', 'fixed');
  uiContainer.style('bottom', '20px');
  uiContainer.style('right', '20px');
  uiContainer.style('z-index', '1000');
  uiContainer.style('display', 'flex');
  uiContainer.style('gap', '10px');
  uiContainer.style('align-items', 'center');
  
  // Make input box editable
  textInput = createInput('');
  textInput.parent(uiContainer);
  textInput.style('width', '450px');
  textInput.style('padding', '8px');
  textInput.style('border', '2px solid #333');
  textInput.style('border-radius', '4px');
  textInput.style('background-color', 'rgba(255,255,255,0.9)');
  textInput.style('font-family', 'Helvetica, Arial, sans-serif');
  
  // Add submit button
  let submitButton = createButton('Generate');
  submitButton.parent(uiContainer);
  submitButton.style('padding', '8px 16px');
  submitButton.style('border', 'none');
  submitButton.style('border-radius', '4px');
  submitButton.style('background-color', '#333');
  submitButton.style('color', 'white');
  submitButton.style('font-family', 'Helvetica, Arial, sans-serif');
  submitButton.style('cursor', 'pointer');
  submitButton.mousePressed(() => {
    if (textInput.value().trim() !== '') {
      generateCustomImage(textInput.value());
    }
  });

  // Start automated generation every 2 seconds
  generationInterval = setInterval(() => {
    if (images.length < maxImages && !isGenerating) {
      generateImage();
    } else if (images.length >= maxImages) {
      clearInterval(generationInterval);
      console.log("Reached maximum number of images");
    }
  }, 2000);  // Generate every 2 seconds

  // Add hint text for wireframe toggle
  let hintText = createDiv('Press "W" to toggle wireframes');
  hintText.style('position', 'fixed');
  hintText.style('top', '20px');
  hintText.style('right', '20px');
  hintText.style('color', '#333');
  hintText.style('font-family', 'Helvetica, Arial, sans-serif');
  hintText.style('background-color', 'rgba(255,255,255,0.7)');
  hintText.style('padding', '8px');
  hintText.style('border-radius', '4px');
  hintText.style('z-index', '1000');

  // Remove sound file loading and replace with oscillator setup
  osc = new p5.Oscillator('sine');
  env = new p5.Envelope();
  env.setADSR(0.001, 0.1, 0.0, 0.1);
  env.setRange(0.3, 0);
  osc.start();
  osc.amp(0);
}

function draw() {
  background(0,0,0);
  
  push();
  // Smooth rotation interpolation
  rotationX = lerp(rotationX, targetRotationX, 0.1);
  rotationY = lerp(rotationY, targetRotationY, 0.1);
  
  // Apply the rotation to the entire scene
  rotateX(rotationX);
  rotateY(rotationY);
  
  staticLoadingAngle += 0.002;
  drawMondrianBackground(0.05);
  pop();
}

function drawMondrianBackground(speed) {
  push();
  
  let layers = 3;
  for(let layer = 0; layer < layers; layer++) {
    push();
    // Enhanced layer movement with organic wave patterns
    let layerPulse = sin(staticLoadingAngle * 0.5) * 0.3 + cos(staticLoadingAngle * 0.3) * 0.2;
    let layerOscillation = sin(staticLoadingAngle * 0.2 + layer) * 0.4;
    rotateZ(-staticLoadingAngle * speed * (layer - 1) * (1 + layerPulse + layerOscillation));
    
    let numSquares = 120;
    for(let i = 0; i < numSquares; i++) {
      push();
      
      // Enhanced organic movement patterns
      let time = staticLoadingAngle + i * 0.1;
      
      // Cellular-like pulsing
      let pulseRate = sin(time * 0.2) * 0.5 + 
                     cos(time * 0.3) * 0.3 + 
                     sin(time * 0.7 + layer) * 0.2;
      
      // Bacterial-like trembling
      let trembleFreq = time * 0.5;
      let trembleX = noise(i * 0.1, trembleFreq) * 30 * (1 + sin(time * 0.2) * 0.5);
      let trembleY = noise(i * 0.1, trembleFreq + 1000) * 30 * (1 + cos(time * 0.3) * 0.5);
      
      // Flagella-like movement
      let flagellaWave = sin(time * 3 + i * 0.2) * 15 * (1 + noise(i * 0.1, time) * 0.5);
      
      // Collective swarm behavior
      let swarmX = sin(time * 0.2 + i * TWO_PI / numSquares) * 100;
      let swarmY = cos(time * 0.3 + i * TWO_PI / numSquares) * 100;
      
      // Base spiral movement with varying radius
      let spiralTightness = 1 + sin(time * 0.1) * 0.3;
      let angle = i * TWO_PI / numSquares + staticLoadingAngle * (layer * 0.5 + 1);
      let radius = (175 + layer * 60 + sin(time * 0.5 + i * 0.2) * 125) * spiralTightness;
      
      // Combine all movements with organic interpolation
      let x = cos(angle) * (radius + pulseRate * 50) + 
             trembleX + swarmX + flagellaWave + 
             sin(time * 0.4) * 30;
      
      let y = sin(angle) * (radius + pulseRate * 50) + 
             trembleY + swarmY + flagellaWave + 
             cos(time * 0.3) * 30;
      
      // Add mitosis-like splitting behavior
      let splitPhase = sin(time * 0.1 + i * 0.5);
      if(splitPhase > 0.7) {
        x += cos(angle) * splitPhase * 20;
        y += sin(angle) * splitPhase * 20;
      }
      
      // Enhanced breathing effect
      let breathingEffect = sin(time * 0.5) * 0.2 + 
                           cos(time * 0.7) * 0.1 + 
                           noise(i * 0.1, time) * 0.1;
      
      let baseSize = width * (0.04 + layer * 0.01) * (1 + breathingEffect);
      let size = baseSize + sin(time) * baseSize * 0.3;
      
      // Add organic rotation with multiple frequencies
      let rot = angle * (layer + 1) + 
                time * (0.5 + sin(i * 0.1) * 0.3) +
                sin(time * 2) * 0.2 + 
                cos(time * 3) * 0.1;
      
      translate(x, y);
      rotateZ(rot);
      
      // Add complex scaling behavior
      let scaleVar = map(sin(time * 0.2 + i * 0.3 + layer), -1, 1, 0.8, 1.2);
      scaleVar *= (1 + sin(time * 2) * 0.1 + cos(time * 3) * 0.05);
      scale(scaleVar);
      
      // Draw wireframe or image
      let alpha = map(sin(staticLoadingAngle + i + layer * 2), -1, 1, 200, 255);
      
      // Calculate frame index
      let frameIndex = (i + layer * numSquares);
      
      // Only draw wireframe if showWireframes is true
      if (showWireframes) {
        // Make wireframe more visible while keeping delicate feel
        let wireframeColor = color(
          sin(staticLoadingAngle + i * 0.1) * 127 + 127,
          cos(staticLoadingAngle + i * 0.2) * 127 + 127,
          sin(staticLoadingAngle + i * 0.3) * 127 + 127,
          alpha * 0.45  // Increased from 0.35
        );
        noFill();
        strokeWeight(0.8);  // Increased from 0.5
        stroke(wireframeColor);
        rect(-size/2, -size/2, size, size);
        
        // Make inner lines more visible
        stroke(wireframeColor);
        strokeWeight(0.5);  // Increased from 0.3
        line(-size/4, -size/2, -size/4, size/2);
        line(size/4, -size/2, size/4, size/2);
        line(-size/2, -size/4, size/2, -size/4);
        line(-size/2, size/4, size/2, size/4);
        
        // Diagonal lines with increased presence
        line(-size/2, -size/2, size/2, size/2);
        line(-size/2, size/2, size/2, -size/2);
      }
      
      // If this frame has an image, draw it on top
      if (frameIndex < images.length) {
        push();
        let mouseRelX = mouseX - width/2;
        let mouseRelY = mouseY - height/2;
        let hoverDist = dist(mouseRelX, mouseRelY, x, y);
        
        // Smoother alpha transition
        let targetAlpha = hoverDist < size/2 ? 0 : alpha;
        let currentAlpha = lerp(alpha, targetAlpha, 0.1);
        
        if (hoverDist < size/2) {
          isImageFocused = true;
          focusedImageX = x;
          focusedImageY = y;
          focusedImageSize = 512;
          focusedImageRot = 0;
          focusedImageIndex = frameIndex;
        } else {
          // More stable image rendering
          imageMode(CENTER);
          tint(255, currentAlpha);
          image(images[frameIndex], 0, 0, size, size);
        }
        pop();
      }
      
      // Frame outline more visible
      if (showWireframes) {
        noFill();
        strokeWeight(0.5);  // Increased from 0.3
        stroke(255, alpha * 0.35);  // Increased from 0.25
        rect(-size/2, -size/2, size, size);
      }
      
      pop();
    }
    pop();
  }
  
  // Draw focused image if needed
  if (isImageFocused && images.length > 0) {
    push();
    translate(0, 0);
    rotate(focusedImageRot);
    imageMode(CENTER);
    tint(255);  // Full opacity for focused image
    image(images[focusedImageIndex], 0, 0, focusedImageSize, focusedImageSize);
    noFill();
    strokeWeight(2);
    stroke(0, 128);
    rect(-focusedImageSize/2, -focusedImageSize/2, focusedImageSize, focusedImageSize);
    pop();
  }
  
  pop();
}

async function generateImage() {
  if (isGenerating) return;
  
  isGenerating = true;
  console.log("Generating image...");
  
  try {
    let subject = random(subjects);
    let style = random(styles);
    let element = random(elements);
    let colorScheme = random(colorSchemes);
    let environment = random(environments);
    
  
    let prompt = ` ${subject} ${ element} ${environment} ${style} ${colorScheme}, realistic organism on a black background
    speculative evolution, extreme biological forms, organic machinery,
    microscopic organisms, bacterial colonies, fungal networks,
    deep sea creatures, extremophile life forms, symbiotic organisms,
    biological metamorphosis, organic architectures, living crystals,
    DNA restructuring, protein folding patterns, membrane systems,
    synthetic biology, engineered organisms, biological computing,
    cross-species hybridization, adaptive evolution, xenobiology,
    biological complexity, organic technology integration,
    scientific macro photography, cellular details, 8k resolution`;
    
    textInput.value(prompt);

    let data = {
      modelURL: "https://api.replicate.com/v1/models/stability-ai/stable-diffusion-3/predictions",
      input: {
        prompt: prompt,
        negative_prompt: "human, humanoid, traditional biological forms, low quality, blurry",
        width: 768,
        height: 768,
        num_inference_steps: 50,
        guidance_scale: 7.5
      },
    };

    let options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    let response = await fetch(proxyUrl, options);
    if (!response.ok) throw new Error('Network response was not ok');
    
    let json = await response.json();
    if (!json.output || !json.output[0]) throw new Error('Invalid response format');
    
    loadImage(json.output[0], 
      // Success callback
      (loadedImg) => {
        images.push(loadedImg);
        isGenerating = false;
        if (isFirstGeneration) {
          isFirstGeneration = false;
        }
        // Play generative pop sound
        playGenerativePop();
        console.log(`Image ${images.length} loaded.`);
      },
      // Error callback
      () => {
        console.error("Failed to load image");
        isGenerating = false;
      }
    );
  } catch (error) {
    console.error("Error generating image:", error);
    isGenerating = false;
  }
}

function gotImage(results) {
  img = results;
  isGenerating = false;
  if (isFirstGeneration) {
    isFirstGeneration = false;
  }
  console.log("Image loaded.");
}

function windowResized() {
  canvasWidth = windowWidth;
  canvasHeight = windowHeight;
  resizeCanvas(canvasWidth, canvasHeight);
  textInput.style('width', min(450, windowWidth - 100) + 'px');
}

// Add mouseMoved function to handle focus reset
function mouseMoved() {
  if (!isDragging) {  // Only check for image focus when not dragging
    let mouseRelX = mouseX - width/2;
    let mouseRelY = mouseY - height/2;
    let foundHover = false;
    
    if (!foundHover) {
      isImageFocused = false;
    }
  }
}

// Add mousePressed function to trigger new generation
function mousePressed() {
  if (!isImageFocused && mouseY < height - 100) {  // Don't initiate rotation near UI elements
    isDragging = true;
    previousMouseX = mouseX;
    previousMouseY = mouseY;
  } else {
    generateImage();
  }
}

function mouseReleased() {
  isDragging = false;
}

function mouseDragged() {
  if (isDragging) {
    // Calculate rotation based on mouse movement with increased sensitivity
    let deltaX = mouseX - previousMouseX;
    let deltaY = mouseY - previousMouseY;
    
    // Update target rotation with better scaling
    targetRotationY += deltaX * 0.01;  // Adjusted sensitivity
    targetRotationX += deltaY * 0.01;  // Adjusted sensitivity
    
    // Limit the vertical rotation to avoid flipping
    targetRotationX = constrain(targetRotationX, -PI/2, PI/2);
    
    previousMouseX = mouseX;
    previousMouseY = mouseY;
    
    return false; // Prevent default
  }
}

// Add this new function for custom prompt generation
async function generateCustomImage(customPrompt) {
  if (isGenerating) return;
  
  isGenerating = true;
  console.log("Generating custom image...");
  
  try {
    let data = {
      modelURL: "https://api.replicate.com/v1/models/stability-ai/stable-diffusion-3/predictions",
      input: {
        prompt: customPrompt,
      },
    };

    let options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    let response = await fetch(proxyUrl, options);
    if (!response.ok) throw new Error('Network response was not ok');
    
    let json = await response.json();
    if (!json.output || !json.output[0]) throw new Error('Invalid response format');
    
    loadImage(json.output[0], 
      // Success callback
      (loadedImg) => {
        gotImage(loadedImg);
        isGenerating = false;
      },
      // Error callback
      () => {
        console.error("Failed to load image");
        isGenerating = false;
        isLoading = false;
      }
    );
  } catch (error) {
    console.error("Error generating image:", error);
    isGenerating = false;
    isLoading = false;
  }
}

// Add keyPressed function to handle 'w' key
function keyPressed() {
  if (key === 'w' || key === 'W') {
    showWireframes = !showWireframes;
  }
}

// Add this new function for the generative pop sound
function playGenerativePop() {
  // Random frequency between 200-600 Hz for variety
  osc.freq(random(200, 600));
  env.play(osc);
}

// Add a function to reset rotation
function doubleClicked() {
  // Reset rotation to initial position
  targetRotationX = 0;
  targetRotationY = 0;
}