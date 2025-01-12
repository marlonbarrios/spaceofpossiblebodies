// In the Space of Possible Bodies
// An exploration of speculative life forms and consciousness
// By [Your Name], 2024

let proxyUrl = "https://replicate-api-proxy.glitch.me/create_n_get/";
//let proxyUrl = "https://opposite-mud-glasses.glitch.me/create_n_get/";
//let proxyUrl = "https://proxy-replicate-stablediffusion-api.glitch.me/create_n_get/";




let img;
let canvasContainer;
let canvasWidth;
let canvasHeight;
let staticLoadingAngle = 0;
let isGenerating = false;
let isFirstGeneration = true;
let images = [];
let maxImages = 120;
let currentImageIndex = 0;
let generationInterval;
let showWireframes = true;
let osc;
let env;
let focusedImageIndex = -1;  // -1 means no image is focused
let focusedImagePosition = { x: 0, y: 0, rot: 0, size: 0 };
let hoveredImageIndex = -1;
let hoveredImageScale = 1;
let hoveredImageZ = 0;
const HOVER_SCALE = 1.5;
const HOVER_Z = 200;
let lastHoveredIndex = -1;  // To track when hover changes
let hoverIndicatorAlpha = 0;  // For smooth fade of hover indicator
let autonomousStimulation = 0;
let stimulationPoints = [];
const MAX_STIMULATION_POINTS = 3;
const STIMULATION_DECAY = 0.95;
let autonomousInteractions = [];
const MAX_AUTONOMOUS_INTERACTIONS = 1;  // Only one at a time
const INTERACTION_DURATION = 30;  // Shorter duration for more dynamic feel
let soundEnabled = false;  // Sound starts disabled
let soundButtonStyle = {
  on: {
    backgroundColor: '#00AA00',  // Green for on
    text: '🔊 Sound ON',
    hoverColor: '#008800'
  },
  off: {
    backgroundColor: '#AA0000',  // Red for off
    text: '🔇 Sound OFF',
    hoverColor: '#880000'
  }
};

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

let elasticPoints = [];
const NUM_ELASTIC_POINTS = 8;
const ELASTIC_TENSION = 0.3;
const ELASTIC_DAMPING = 0.5;

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
  
  // Modify the start button to be a toggle
  let startButton = createButton('Start Generation');
  startButton.parent(uiContainer);
  startButton.style('padding', '8px 16px');
  startButton.style('border', 'none');
  startButton.style('border-radius', '4px');
  startButton.style('background-color', '#333');
  startButton.style('color', 'white');
  startButton.style('font-family', 'Helvetica, Arial, sans-serif');
  startButton.style('cursor', 'pointer');
  startButton.style('margin-right', '10px');
  startButton.mousePressed(() => toggleGeneration(startButton));

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

  // Create sound toggle button with enhanced styling
  let soundButton = createButton(soundButtonStyle.off.text);
  soundButton.parent(uiContainer);
  soundButton.style('padding', '8px 16px');
  soundButton.style('border', 'none');
  soundButton.style('border-radius', '4px');
  soundButton.style('background-color', soundButtonStyle.off.backgroundColor);
  soundButton.style('color', 'white');
  soundButton.style('font-family', 'Helvetica, Arial, sans-serif');
  soundButton.style('cursor', 'pointer');
  soundButton.style('margin-right', '10px');
  soundButton.style('font-weight', 'bold');
  soundButton.style('transition', 'all 0.3s ease');
  
  // Add hover effects
  soundButton.mouseOver(() => {
    soundButton.style('background-color', 
      soundEnabled ? soundButtonStyle.on.hoverColor : soundButtonStyle.off.hoverColor);
  });
  
  soundButton.mouseOut(() => {
    soundButton.style('background-color', 
      soundEnabled ? soundButtonStyle.on.backgroundColor : soundButtonStyle.off.backgroundColor);
  });
  
  soundButton.mousePressed(() => {
    soundEnabled = !soundEnabled;
    
    // Update button appearance
    soundButton.html(soundEnabled ? soundButtonStyle.on.text : soundButtonStyle.off.text);
    soundButton.style('background-color', 
      soundEnabled ? soundButtonStyle.on.backgroundColor : soundButtonStyle.off.backgroundColor);
    
    // Play test sound when enabled
    if (soundEnabled) {
      // Clear, distinct activation sound
      osc.freq(880);  // A5 note
      env.setADSR(0.001, 0.1, 0.1, 0.1);
      env.setRange(0.3, 0);
      env.play(osc);
    }
  });
}

function draw() {
  background(0,0,0);
  
  // Random chance to create new autonomous interaction
  if (random(1) < 0.01 && autonomousInteractions.length < MAX_AUTONOMOUS_INTERACTIONS) {  // 1% chance
    // Pick a random image
    let randomLayer = floor(random(3));
    let randomIndex = floor(random(120));
    let frameIndex = floor(abs(randomIndex - 60) + (randomLayer * 40));
    
    if (frameIndex < images.length) {
      autonomousInteractions.push({
        imageIndex: frameIndex % images.length,
        duration: INTERACTION_DURATION,
        scale: 1
      });
      
      // Distinct autonomous pop sound
      osc.freq(random(200, 400));  // Lower frequency for autonomous
      env.setADSR(0.001, 0.2, 0.1, 0.2);  // Longer, more dramatic sound
      env.setRange(0.4, 0);  // Slightly louder
      env.play(osc);
    }
  }
  
  // Update and remove finished interactions
  for (let i = autonomousInteractions.length - 1; i >= 0; i--) {
    autonomousInteractions[i].duration--;
    if (autonomousInteractions[i].duration <= 0) {
      autonomousInteractions.splice(i, 1);
    }
  }
  
  // Update autonomous stimulation
  if (random(1) < 0.01) {  // 1% chance each frame to add new stimulation
    addStimulationPoint();
  }
  
  // Update stimulation points
  for (let i = stimulationPoints.length - 1; i >= 0; i--) {
    stimulationPoints[i].intensity *= STIMULATION_DECAY;
    if (stimulationPoints[i].intensity < 0.05) {
      stimulationPoints.splice(i, 1);
    }
  }
  
  push();
  staticLoadingAngle += 0.002;
  drawMondrianBackground(0.05);
  pop();
}

function drawMondrianBackground(speed) {
  push();
  
  let layers = 3;
  for(let layer = 0; layer < layers; layer++) {
    push();
    // Modify rotation direction for counterclockwise movement
    let layerPulse = sin(staticLoadingAngle * 0.5) * 0.3 + 
                     noise(layer, staticLoadingAngle * 0.1) * 0.5 +
                     cos(staticLoadingAngle * 0.3) * 0.2;
    let layerOscillation = sin(staticLoadingAngle * 0.2 + layer) * 0.4 +
                          noise(layer + 1000, staticLoadingAngle * 0.2) * 0.6;
    
    // Change the sign to make it rotate counterclockwise
    rotateZ(staticLoadingAngle * speed * (layer - 1) * (1 + layerPulse + layerOscillation));
    
    let numSquares = 120;
    for(let i = 0; i < numSquares; i++) {
      push();
      
      let time = staticLoadingAngle + i * 0.1;
      
      // Enhanced organic pulsing with noise
      let pulseRate = sin(time * 0.2) * 0.5 + 
                     cos(time * 0.3) * 0.3 + 
                     sin(time * 0.7 + layer) * 0.2 +
                     noise(i * 0.1, time * 0.3) * 0.8;
      
      // More chaotic trembling
      let trembleFreq = time * 0.5;
      let trembleX = noise(i * 0.1, trembleFreq) * 50 * (1 + sin(time * 0.2) * 0.8);
      let trembleY = noise(i * 0.1, trembleFreq + 1000) * 50 * (1 + cos(time * 0.3) * 0.8);
      
      // Enhanced fibrillation movement
      let fibrilX = sin(time * 5 + noise(i, time) * 10) * 20;
      let fibrilY = cos(time * 4 + noise(i + 1000, time) * 10) * 20;
      
      // Irregular swarm behavior
      let swarmX = sin(time * 0.2 + i * TWO_PI / numSquares) * 100 * 
                   (1 + noise(i, time * 0.1) * 0.8);
      let swarmY = cos(time * 0.3 + i * TWO_PI / numSquares) * 100 * 
                   (1 + noise(i + 2000, time * 0.1) * 0.8);
      
      // Variable spiral movement
      let spiralTightness = 1 + sin(time * 0.1) * 0.3 + noise(i, time * 0.2) * 0.5;
      let angle = -i * TWO_PI / numSquares - 
                  staticLoadingAngle * (layer * 0.5 + 1) - 
                  noise(i * 0.1, time * 0.1) * TWO_PI * 0.2;
      
      // Dynamic radius with stretching
      let stretchFactor = 1 + sin(time * 0.3 + noise(i, time) * 5) * 0.3;
      let radius = (175 + layer * 60 + sin(time * 0.5 + i * 0.2) * 125) * 
                   spiralTightness * stretchFactor;
      
      // Combine all movements with enhanced organic interpolation
      let x = cos(angle) * (radius + pulseRate * 80) + 
              trembleX + swarmX + fibrilX + 
              sin(time * 0.4) * 50 * noise(i, time * 0.2);
      
      let y = sin(angle) * (radius + pulseRate * 80) + 
              trembleY + swarmY + fibrilY + 
              cos(time * 0.3) * 50 * noise(i + 1000, time * 0.2);
      
      translate(x, y);
      
      // Add complex rotation
      let rot = angle * (layer + 1) + 
                time * (0.5 + sin(i * 0.1) * 0.3) +
                sin(time * 2) * 0.2 + 
                cos(time * 3) * 0.1;
      rotateZ(rot);
      
      // Enhanced breathing effect with more variation
      let breathingEffect = sin(time * 0.5) * 0.2 + 
                           cos(time * 0.7) * 0.1 + 
                           noise(i * 0.1, time) * 0.3 +
                           sin(time * 0.3 + noise(i, time) * 5) * 0.2;
      
      let baseSize = width * (0.06 + layer * 0.015) * (1 + breathingEffect);
      let size = baseSize + sin(time) * baseSize * 0.3;
      
      // Calculate distance from center of sequence
      let centerIndex = numSquares/2;
      let distanceFromCenter = abs(i - centerIndex) + (layer * numSquares/3);
      let frameIndex = floor(distanceFromCenter);
      
      let alpha = map(sin(staticLoadingAngle + i + layer * 2), -1, 1, 200, 255);
      
      // Calculate influence from stimulation points
      let totalStimulation = 0;
      let stimulationX = 0;
      let stimulationY = 0;
      
      for (let stim of stimulationPoints) {
        let dx = x - stim.x;
        let dy = y - stim.y;
        let dist = sqrt(dx * dx + dy * dy);
        let influence = (1 - constrain(dist / 500, 0, 1)) * stim.intensity;
        totalStimulation += influence;
        
        // Add directional influence
        stimulationX += (dx / dist) * influence * 50;
        stimulationY += (dy / dist) * influence * 50;
      }
      
      // Modify existing movement parameters with stimulation
      pulseRate = pulseRate * (1 + totalStimulation);
      trembleX = trembleX * (1 + totalStimulation * 2) + stimulationX;
      trembleY = trembleY * (1 + totalStimulation * 2) + stimulationY;
      
      // Add stimulation-based size pulsing
      breathingEffect += totalStimulation * 0.3;
      
      // Add stimulation-based rotation
      rot += totalStimulation * sin(time * 3) * PI/4;
      
      // If highly stimulated, play sound
      if (totalStimulation > 0.5 && random(1) < 0.01 && soundEnabled) {  // Add soundEnabled check
        osc.freq(map(totalStimulation, 0, 1, 200, 800));
        env.setADSR(0.001, 0.05, 0, 0.1);
        env.setRange(0.1, 0);
        env.play(osc);
      }
      
      // Draw wireframe
      if (showWireframes) {
        let wireframeColor = color(
          sin(staticLoadingAngle + i * 0.1) * 127 + 127,
          cos(staticLoadingAngle + i * 0.2) * 127 + 127,
          sin(staticLoadingAngle + i * 0.3) * 127 + 127,
          alpha * 0.45
        );
        
        noFill();
        strokeWeight(0.8);
        stroke(wireframeColor);
        rect(-size/2, -size/2, size, size);
        
        // Inner lines
        stroke(wireframeColor);
        strokeWeight(0.5);
        line(-size/4, -size/2, -size/4, size/2);
        line(size/4, -size/2, size/4, size/2);
        line(-size/2, -size/4, size/2, -size/4);
        line(-size/2, size/4, size/2, size/4);
        
        // Diagonal lines
        line(-size/2, -size/2, size/2, size/2);
        line(-size/2, size/2, size/2, -size/2);
      }
      
      // Draw image if available
      if (frameIndex < images.length) {
        push();
        imageMode(CENTER);
        let imageIndex = frameIndex % images.length;
        
        // Check if this image has an autonomous interaction
        let autonomousInteraction = autonomousInteractions.find(interaction => 
          interaction.imageIndex === imageIndex
        );
        
        if (imageIndex === hoveredImageIndex || autonomousInteraction) {
          // Draw hovered/interacted image larger and with full opacity
          let interactionZ = autonomousInteraction ? 
            250 + sin(frameCount * 0.2) * 100 : 200;  // More dramatic z movement
          translate(0, 0, interactionZ);
          
          tint(255, 255);
          let interactionScale = autonomousInteraction ? 
            2.5 + sin(frameCount * 0.3) * 0.5 : 2;  // Larger scale with more animation
          let hoverSize = size * interactionScale;
          image(images[imageIndex], 0, 0, hoverSize, hoverSize);
          
          // Enhanced highlight frame
          noFill();
          strokeWeight(3);  // Thicker stroke
          stroke(255, autonomousInteraction ? 150 + sin(frameCount * 0.3) * 100 : 150);
          rect(-hoverSize/2, -hoverSize/2, hoverSize, hoverSize);
          
          // Add inner glow effect
          for(let i = 0; i < 3; i++) {
            stroke(255, (autonomousInteraction ? 30 : 50) - i * 15);
            rect(-hoverSize/2 - i*2, -hoverSize/2 - i*2, hoverSize + i*4, hoverSize + i*4);
          }
        } else {
          // Draw normal image
          tint(255, alpha);
          image(images[imageIndex], 0, 0, size, size);
        }
        pop();
      }
      
      pop();
    }
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
    
    // Enhanced prompt with bioluminescence
    let bioluminescentElements = [
      "with bioluminescent patterns",
      "emanating ethereal light",
      "glowing with internal energy",
      "radiating bioluminescent pulses",
      "with luminous membranes",
      "pulsing with living light",
      "with phosphorescent structures",
      "emitting biological light",
      "with luminescent organelles",
      "generating bio-light patterns"
    ];
    
    let luminescence = random(bioluminescentElements);
    
    let prompt = `${subject} ${element} ${environment} ${style} ${colorScheme}, ${luminescence}, realistic organism on a black background, volumetric lighting, subsurface scattering`;
    
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

// Add mouseMoved function to trigger new generation
function mouseMoved() {
  let mouseRelX = mouseX - width/2;
  let mouseRelY = mouseY - height/2;
  
  let previousHovered = hoveredImageIndex;
  hoveredImageIndex = -1;
  
  for(let layer = 0; layer < 3; layer++) {
    for(let i = 0; i < 120; i++) {
      // Calculate frame index
      let centerIndex = 120/2;
      let distanceFromCenter = abs(i - centerIndex) + (layer * 120/3);
      let frameIndex = floor(distanceFromCenter);
      
      if (frameIndex >= images.length) continue;
      
      // Calculate position (simplified for hit detection)
      let angle = i * TWO_PI / 120 + staticLoadingAngle * (layer * 0.5 + 1);
      let radius = 175 + layer * 60;
      let x = cos(angle) * radius;
      let y = sin(angle) * radius;
      
      // Calculate size
      let baseSize = width * (0.06 + layer * 0.015);
      
      // Increase detection area
      let detectionSize = baseSize * 1.2;  // 20% larger detection area
      
      let dist = sqrt(pow(mouseRelX - x, 2) + pow(mouseRelY - y, 2));
      if (dist < detectionSize) {
        hoveredImageIndex = frameIndex % images.length;
        if (hoveredImageIndex !== previousHovered) {
          // Crisp hover sound
          osc.freq(random(800, 1200));  // Higher frequency for distinct hover sound
          env.setADSR(0.001, 0.05, 0, 0.05);  // Very short, crisp sound
          env.setRange(0.3, 0);  // Good volume
          env.play(osc);
        }
        return;
      }
    }
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
  if (!soundEnabled) return;
  // Random frequency between 200-600 Hz for variety
  osc.freq(random(200, 600));
  env.play(osc);
}

// Replace startGeneration with this new toggle function
function toggleGeneration(button) {
  if (!generationInterval) {
    // Start generation
    generationInterval = setInterval(() => {
      if (images.length < maxImages && !isGenerating) {
        generateImage();
      } else if (images.length >= maxImages) {
        clearInterval(generationInterval);
        generationInterval = null;
        button.html('Start Generation');
        console.log("Reached maximum number of images");
      }
    }, 2000);  // Generate every 2 seconds
    button.html('Stop Generation');
  } else {
    // Stop generation
    clearInterval(generationInterval);
    generationInterval = null;
    button.html('Start Generation');
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

// Add new function for hover sound
function playHoverPop() {
  if (!soundEnabled) return;
  osc.freq(random(800, 1200));
  env.setADSR(0.001, 0.05, 0, 0.05);
  env.setRange(0.3, 0);
  env.play(osc);
}

// Add this function to create new stimulation points
function addStimulationPoint() {
  if (stimulationPoints.length < MAX_STIMULATION_POINTS) {
    stimulationPoints.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      intensity: 1.0,
      frequency: random(0.5, 2.0)
    });
  }
}

// Modify the autonomous interaction sound to be different
function playAutonomousSound() {
  if (!soundEnabled) return;
  osc.freq(random(300, 600));
  env.setADSR(0.001, 0.2, 0.2, 0.2);
  env.setRange(0.3, 0);
  env.play(osc);
}
