import type { YEvent, YMapEvent, Transaction } from 'yjs'

export type ObserveCallback = (e: YMapEvent<any>, trans: Transaction) => void
export type ObserveDeepCallback = (events: YEvent<any>[], trans: Transaction) => void
