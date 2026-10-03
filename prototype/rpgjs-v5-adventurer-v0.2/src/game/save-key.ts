/** Separate standalone character-lab progress from the owner's playable save. */
export const gameSaveKey='adventurer-rpgjs-v02-slots1';
export const labSaveKey='adventurer-character-lab-slots1';
export function isCharacterLab(search:string){return new URLSearchParams(search).get('characterLab')==='1';}
export function saveKeyForSearch(search:string){return isCharacterLab(search)?labSaveKey:gameSaveKey;}
