
import * as THREE from "three";
import { GroundedSkybox } from 'three/addons/objects/GroundedSkybox.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

import { getElementSize } from "./dom_utils";
import StereoWithPaddingEffect from "./StereoWithPaddingEffect";


interface ThreeObjects{
  renderer:THREE.WebGLRenderer;
  scene:THREE.Scene;
  camera:THREE.PerspectiveCamera;
  cube:THREE.Mesh;
  stereoWithPaddingEffect:StereoWithPaddingEffect
}

export default class App{

  heroElement:HTMLElement;
  threeObjects?:ThreeObjects;

  constructor(){
    {
      const heroElement=document.querySelector<HTMLElement>(".p-section-hero");
      if(!heroElement){
        throw new Error("heroElement is null");
      }
      this.heroElement=heroElement;
    }
    
    this.setupThree();
    this.setupEvents();
  
  }
  setupThree(){
    const {width,height}=getElementSize(this.heroElement);

    const scene = new THREE.Scene();


    const camera = new THREE.PerspectiveCamera( 45, width / height, 0.1, 1000 );
    
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( width, height );
    this.heroElement.appendChild( renderer.domElement );
  
    const ambientLight = new THREE.AmbientLight(0xffffff,0.6);
    scene.add(ambientLight);
  
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(2, 5, 10).normalize();
    scene.add(directionalLight);
  
    const hdrLoader = new RGBELoader();
    hdrLoader.loadAsync( 'textures/equirectangular/blouberg_sunrise_2_1k.hdr' ).then((envMap:THREE.Texture)=>{
      envMap.mapping = THREE.EquirectangularReflectionMapping;
      const skybox=new GroundedSkybox(envMap,15,100);
      scene.add(skybox);
      scene.environment=envMap;
    });
    
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      roughness:0,
      metalness:1,
    });
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
    
    camera.position.z = 5;

    const stereoWithPaddingEffect=new StereoWithPaddingEffect(renderer)

    this.threeObjects={
      renderer,
      scene,
      camera,
      cube,
      stereoWithPaddingEffect,
    }
  }

  setupEvents(){
    if(!this.threeObjects){
      throw new Error("threeObjects is null");
    }
    const {
      renderer,
    }=this.threeObjects;

    window.addEventListener("resize",()=>{
      this.onResize();
    });

    this.onResize();


    const animate=()=> {
      this.onTick();
    }
    renderer.setAnimationLoop( animate );

  }


  onResize(){

    if (!this.threeObjects) {
      throw new Error("threeObjects is null");
    }
    const { renderer, camera } = this.threeObjects;

    const {
      width,
      height,
    } = getElementSize(this.heroElement);

    renderer.setSize(width, height);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  onTick(){
    if(!this.threeObjects){
      throw new Error("threeObjects is null");
    }
    const {
      renderer,
      scene,
      camera,
      cube,
      stereoWithPaddingEffect,
    }=this.threeObjects;
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  
    stereoWithPaddingEffect.render( scene, camera );

  }
}