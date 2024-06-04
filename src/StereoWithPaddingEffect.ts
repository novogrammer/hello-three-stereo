import * as THREE from "three";

// three/examples/jsm/effects/StereoEffect.js より
export default class StereoWithPaddingEffect{
  renderer:THREE.WebGLRenderer;
  stereoCamera:THREE.StereoCamera;
  padding:number;
  constructor(renderer:THREE.WebGLRenderer,padding:number){
    this.renderer=renderer;
    this.padding=padding;
    this.stereoCamera=new THREE.StereoCamera();

    const size=this.getSize();
    const innerSize=this.calcInnerSize();
    this.stereoCamera.aspect=(innerSize.x/size.x)/(innerSize.y/size.y);
  }
  getSize():THREE.Vector2{
    const rendererSize=new THREE.Vector2();
    this.renderer.getSize(rendererSize);
    return rendererSize;
  }
  calcInnerSize():THREE.Vector2{
    const rendererSize=new THREE.Vector2();
    this.renderer.getSize(rendererSize);
    const size=new THREE.Vector2();
    size.x=(rendererSize.x-(this.padding*3))*0.5;
    size.y=(rendererSize.y-(this.padding*2));
    return size;
  }
  setSize(width:number,height:number):void{
    this.renderer.setSize(width,height);

    const size=this.getSize();
    const innerSize=this.calcInnerSize();
    this.stereoCamera.aspect=(innerSize.x/size.x)/(innerSize.y/size.y);

  }
  render(scene:THREE.Scene,camera:THREE.PerspectiveCamera):void{
    if ( scene.matrixWorldAutoUpdate === true ) scene.updateMatrixWorld();

    if ( camera.parent === null && camera.matrixWorldAutoUpdate === true ) camera.updateMatrixWorld();

    this.stereoCamera.update( camera );

    const size=new THREE.Vector2();
    this.renderer.getSize( size );

    if ( this.renderer.autoClear ) this.renderer.clear();
    this.renderer.setScissorTest( true );

    const innerSize=this.calcInnerSize();


    this.renderer.setScissor( this.padding, this.padding, innerSize.x, innerSize.y );
    this.renderer.setViewport( this.padding, this.padding, innerSize.x, innerSize.y );
    this.renderer.render( scene, this.stereoCamera.cameraL );

    this.renderer.setScissor( this.padding * 2 + innerSize.x, this.padding, innerSize.x, innerSize.y );
    this.renderer.setViewport(  this.padding * 2 + innerSize.x, this.padding, innerSize.x, innerSize.y  );
    this.renderer.render( scene, this.stereoCamera.cameraR );

    this.renderer.setScissorTest( false );
  }
}