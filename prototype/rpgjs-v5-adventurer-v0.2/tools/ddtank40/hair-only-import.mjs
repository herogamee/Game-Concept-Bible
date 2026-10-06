/** One fixed import for the new hair-only source family; never fit an item. */
import {createCanvas,loadImage} from '@napi-rs/canvas';
export const hairOnlyImportMatrix=Object.freeze([.72,0,0,.72,168,3]);
export async function registeredHairOnly(bytes){
 const image=await loadImage(bytes);
 if(image.width!==1254||image.height!==1254)throw new Error('Hair-only source must retain the 1254-square frame');
 const canvas=createCanvas(1254,1254),ctx=canvas.getContext('2d');
 ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
 ctx.setTransform(...hairOnlyImportMatrix);ctx.drawImage(image,0,0);
 return canvas.toBuffer('image/png');
}
