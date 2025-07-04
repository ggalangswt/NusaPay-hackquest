import axios, { AxiosError } from "axios";

import {
  LoadPayloadForGroupId,
  LoadPayloadWithCompanyId,
  Recipient,
} from "./types/recipient";
import { Template } from "./lib/template";
// import { ApiResponse } from "./lib/invoiceApi";
import { Invoice } from "./types/invoice";
// import {  InvoiceSummary } from "./types/invoice";

// =====================
// TIPE DATA
// =====================

interface AuthUser {
  companyId: string; //ambil dari ID google
  email: string;
  companyName?: string;
  walletAddress?: string;
  networkChainId?: string;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface AuthResponse {
  authenticated: boolean;
  user?: AuthUser;
}

interface AddEmployeePayload {
  companyId: string;
  companyName: string;
  name: string;
  bankCode: string;
  bankAccount: string;
  bankAccountName: string;
  walletAddress: string;
  networkChainId: number;
  amountTransfer: number;
  currency: string;
  localCurrency: string;
  groupId: string;
}

interface editEmployeePayload {
  _id: string;
  bankCode: string;
  bankAccount: string;
  bankAccountName: string;
  amountTransfer: number;
}

interface ErrorResponse {
  message?: string;
}

// =====================
// KONFIGURASI AXIOS
// =====================
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// =====================
// INTERCEPTOR
// =====================
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    if (error.code === "ECONNABORTED") {
      return Promise.reject({ message: "Request timeout" });
    }
    return Promise.reject(error.response?.data || { message: "Unknown error" });
  }
);

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if(token){
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) =>{
    return Promise.reject(error)
  }
)

// =====================
// HOOK CEK AUTH
// =====================
// =====================
// FUNGSI API
// =====================

// export const addInvoiceData = async (
//   payload: InvoiceCreationPayload
// ): Promise<any> => {
//   const response = await api.post("/addInvoiceData", payload);
//   console.log(payload)
//   return response.data;
// };

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export const loadInvoiceData = async (payload: {
  txId: string;
}): Promise<ApiResponse<Invoice>> => {
  const response = await api.post("/loadInvoiceData", payload);
  console.log(payload);
  return response.data;
};

export const addEmployeeData = async (
  payload: AddEmployeePayload
): Promise<void> => {
  const response = await api.post("/addEmployeeDataToGroup", payload);
  console.log(payload);
  return response.data;
};

export const addGroupName = async (payload: Template): Promise<void> => {
  const response = await api.post("/addGroupName", payload);
  console.log(payload);
  return response.data;
};

interface LoadGroupNameResponse {
  message: string;
  data: Template[];
}

export const loadGroupName = async (
  payload: LoadPayloadWithCompanyId
): Promise<Template[]> => {
  try {
    const response = await api.post<LoadGroupNameResponse>(
      "/loadGroupName",
      payload
    );
    console.log(response.data.data);
    return response.data.data;
  } catch (error: unknown) { // ✅ SOLUSI 3: Ganti 'any' dengan 'unknown'
    // Lakukan pemeriksaan tipe sebelum mengakses properti
    if (error instanceof Error) {
        console.error("Failed to load group name:", error.message);
    } else {
        console.error("An unknown error occurred:", error);
    }
    throw error;
  }
};

interface LoadEmployeeResponse {
  message: string;
  data: Recipient[];
}

export const loadEmployeeData = async (
  payload: LoadPayloadForGroupId
): Promise<Recipient[]> => {
  try {
    const response = await api.post<LoadEmployeeResponse>(
      "/loadEmployeeDataFromGroup",
      payload
    );
    console.log(response);
    return response.data.data;
  } catch (error: unknown) { 
    if (error instanceof Error) {
        console.error("Failed to load employee data:", error.message);
    } else {
        console.error("An unknown error occurred:", error);
    }
    throw error;
  }
};

export const editEmployeeData = async (
  payload: editEmployeePayload
): Promise<void> => {
  const response = await api.post("/editEmployeeDataFromGroup", payload);
  return response.data;
};

export const deleteEmployeeData = async (id: string): Promise<void> => {
  const response = await api.post("/deleteEmployeeDataFromGroup", { id });
  return response.data;
};

// export const logout = async () => {
//   await api.post("/logout"); // backend akan hapus cookie
// };

// };

//buat ke smartcontract
export interface PriceFeedResponse{
  fromCurrency: string
  toCurrency: string
  rate: number
  timestamp: string
  source: string
}

export interface TransactionResponse{
  id: string
  status: 'pending' | 'completed' | 'failed'
  transactionHash?: string
  timestamp: string
}

export const getPriceFeedFromAPI = async (
  fromCurrency: string,
  toCurrency: string
): Promise<PriceFeedResponse> => {
  try {
    const response = await api.get<ApiResponse<PriceFeedResponse>>(
      `/price-feed/${fromCurrency}/${toCurrency}`
    );
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch price feed');
    }
  } catch (error) {
    console.error('Error fetching price feed from API:', error);
    throw error;
  }
};

export const getMultiplePriceFeeds = async (
  pairs: Array<{ from: string; to: string }>
): Promise<PriceFeedResponse[]> => {
  try {
    const response = await api.post<ApiResponse<PriceFeedResponse[]>>(
      '/price-feed/multiple',
      { pairs }
    );
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch price feeds');
    }
  } catch (error) {
    console.error('Error fetching multiple price feeds:', error);
    throw error;
  }
};

export const initiateTransfer = async (
  recipientId: string, amount: number, fromCurrency: string, toCurrency: string
): Promise<TransactionResponse> => {
  try{
    const response = await api.post<ApiResponse<TransactionResponse>>(
      '/transactions/transfer',
      {
        recipientId,
        amount,
        fromCurrency,
        toCurrency,
      }
    );
    if(response.data.success && response.data.data){
      return response.data.data
    } else{
      throw new Error(response.data.message || "Failed to get transaction status")
    } 
  }catch(error){
      console.error('Error getting transaction status:', error)
      throw error
  } 
}


