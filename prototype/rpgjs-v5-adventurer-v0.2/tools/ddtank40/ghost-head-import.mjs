/** Generation-space guides and one fixed import for the ghost-head hair family. */
import {createCanvas,loadImage} from '@napi-rs/canvas';
export const ghostHeadHairMatrix=Object.freeze([.625,0,0,.625,216,-20]);
export async function ghostHairImport(bytes){
 const image=await loadImage(bytes);
 if(image.width!==1254||image.height!==1254)throw new Error('Ghost-head source must retain the 1254-square frame');
 const canvas=createCanvas(1254,1254),ctx=canvas.getContext('2d');
 ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
 ctx.setTransform(...ghostHeadHairMatrix);ctx.drawImage(image,0,0);
 return canvas.toBuffer('image/png');
}
export async function ghostGenerationGuide(bytes){
 const image=await loadImage(bytes),canvas=createCanvas(1254,1254),ctx=canvas.getContext('2d');
 ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
 const [s,,,sy,tx,ty]=ghostHeadHairMatrix;
 ctx.setTransform(1/s,0,0,1/sy,-tx/s,-ty/sy);ctx.drawImage(image,0,0);
 return canvas.toBuffer('image/png');
}
