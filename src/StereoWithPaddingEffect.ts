import * as THREE from "three";

// three/examples/jsm/effects/StereoEffect.js より
export default class StereoWithPaddingEffect{
  renderer:THREE.WebGLRenderer;
  stereoCamera:THREE.StereoCamera
  constructor(renderer:THREE.WebGLRenderer){
    this.renderer=renderer;
    this.stereoCamera=new THREE.StereoCamera();
    this.stereoCamera.aspect=0.5;
  }
  setSize(width:number,height:number):void{
    this.renderer.setSize(width,height);
  }
  render(scene:THREE.Scene,camera:THREE.PerspectiveCamera):void{
    if ( scene.matrixWorldAutoUpdate === true ) scene.updateMatrixWorld();

    if ( camera.parent === null && camera.matrixWorldAutoUpdate === true ) camera.updateMatrixWorld();

    this.stereoCamera.update( camera );

    const size=new THREE.Vector2();
    this.renderer.getSize( size );

    if ( this.renderer.autoClear ) this.renderer.clear();
    this.renderer.setScissorTest( true );

    this.renderer.setScissor( 0, 0, size.width / 2, size.height );
    this.renderer.setViewport( 0, 0, size.width / 2, size.height );
    this.renderer.render( scene, this.stereoCamera.cameraL );

    this.renderer.setScissor( size.width / 2, 0, size.width / 2, size.height );
    this.renderer.setViewport( size.width / 2, 0, size.width / 2, size.height );
    this.renderer.render( scene, this.stereoCamera.cameraR );

    this.renderer.setScissorTest( false );
  }
}