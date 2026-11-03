import type {Slot} from './equipment';
export const ivaneFrames:Record<Slot,{key:string;url:string;width:number;height:number;rect:{x:number;y:number;w:number;h:number}}>={
  "chassis": {
    "key": "ivane-structure",
    "url": "art/cosmetics/ivane-croatia-structure.webp",
    "width": 1536,
    "height": 1024,
    "rect": {
      "x": 12,
      "y": 156,
      "w": 739,
      "h": 241
    }
  },
  "wings": {
    "key": "ivane-structure",
    "url": "art/cosmetics/ivane-croatia-structure.webp",
    "width": 1536,
    "height": 1024,
    "rect": {
      "x": 775,
      "y": 207,
      "w": 755,
      "h": 139
    }
  },
  "tail": {
    "key": "ivane-structure",
    "url": "art/cosmetics/ivane-croatia-structure.webp",
    "width": 1536,
    "height": 1024,
    "rect": {
      "x": 134,
      "y": 570,
      "w": 502,
      "h": 368
    }
  },
  "nose": {
    "key": "ivane-structure",
    "url": "art/cosmetics/ivane-croatia-structure.webp",
    "width": 1536,
    "height": 1024,
    "rect": {
      "x": 851,
      "y": 636,
      "w": 562,
      "h": 261
    }
  },
  "engine": {
    "key": "ivane-systems",
    "url": "art/cosmetics/ivane-croatia-systems.webp",
    "width": 1536,
    "height": 1024,
    "rect": {
      "x": 24,
      "y": 66,
      "w": 717,
      "h": 373
    }
  },
  "tank": {
    "key": "ivane-systems",
    "url": "art/cosmetics/ivane-croatia-systems.webp",
    "width": 1536,
    "height": 1024,
    "rect": {
      "x": 805,
      "y": 69,
      "w": 715,
      "h": 354
    }
  },
  "rockets": {
    "key": "ivane-systems",
    "url": "art/cosmetics/ivane-croatia-systems.webp",
    "width": 1536,
    "height": 1024,
    "rect": {
      "x": 65,
      "y": 541,
      "w": 595,
      "h": 455
    }
  },
  "instruments": {
    "key": "ivane-systems",
    "url": "art/cosmetics/ivane-croatia-systems.webp",
    "width": 1536,
    "height": 1024,
    "rect": {
      "x": 797,
      "y": 581,
      "w": 698,
      "h": 361
    }
  }
};
export const IVANE_ATLASES=[ivaneFrames.chassis,ivaneFrames.engine];
