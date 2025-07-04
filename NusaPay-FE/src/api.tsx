
import {
  Employee,
  LoadPayloadForGroupId,
  LoadPayloadWithCompanyId,
} from "./types/recipient";
import { Template } from "./lib/template";
// import { ApiResponse } from "./lib/invoiceApi";
import { Invoice } from "./types/invoice";
// import {  InvoiceSummary } from "./types/invoice";



// export const addInvoiceData = async (
//   payload: InvoiceCreationPayload
// ): Promise<any> => {
//   const response = await api.post("/addInvoiceData", payload);
//   console.log(payload)
//   return response.data;
// };







interface LoadGroupNameResponse {
  message: string;
  data: Template[];
}



interface LoadEmployeeResponse {
  message: string;
  data: Employee[];
}



// export const logout = async () => {
//   await api.post("/logout"); // backend akan hapus cookie
// };

// };

//buat ke smartcontract







