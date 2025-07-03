//data penerima

// Keperluan UI (gaada companyId dll untuk ga ditampilin)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface Recipient{
    _id: string
    name: string
    bankCode: string;
    bankAccount: string //no rekening
    bankAccountName: string //nama bank
    amountTransfer: number// jumlah tf pengirim
    currency: string //wallet si pengirim 
    localCurrency: string //wallet penerima
}

  

// Tipe asli dari data backend 
export interface Employee{
    id: string
    companyId: string
    companyName : string
    name: string
    bankCode: string;
    bankAccount: string //no rekening
    bankAccountName: string //nama bank
    walletAddress : string
    networkChainId : number
    amountTransfer: number// jumlah tf pengirim
    currency: string //wallet si pengirim 
    localCurrency: string //wallet penerima
}

export interface LoadPayloadWithCompanyId {
    companyId: string;
}  

export interface LoadPayloadForGroupId {
    groupId: string;
}




