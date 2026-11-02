// Future server boundaries. No simulated accounts, rewards or multiplayer in v0.1.
export interface ProgressionNode {id:string;requires:string[];kind:'technology'|'research'|'prestige';modifiers:Record<string,number>}
export interface RunTicket {id:string;seed:number;ruleset:string;lockedBoosters:string[];revealAt:number}
export interface Sabotage {id:string;kind:string;anonymous:boolean;expiresAt:number}
export interface GameServices {
 startRun(roomId?:string,boosters?:string[]):Promise<RunTicket>;
 revealSabotage(ticketId:string):Promise<Sabotage|null>;
 submitRun(ticketId:string,inputs:Uint8Array):Promise<{verifiedDistance:number}>;
}
export interface SocialServices {joinRoom(code:string):Promise<void>;sendChat(roomId:string,text:string):Promise<void>;inviteFriend(userId:string):Promise<void>}
export interface LootService {open(crateId:string,idempotencyKey:string):Promise<{itemIds:string[]}>}
