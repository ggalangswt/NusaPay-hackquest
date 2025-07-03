"use client";

import { useState, useEffect } from "react";
import type { Employee, Recipient } from "@/types/recipient";
import { Button } from "../ui/button";
import FormField from "./FormField";
import ModalOverlay from "./ModalOverlay";
import { addEmployeeData } from "../../api";
import { useTemplate } from "@/lib/TemplateContext";
import { useUser } from "@/lib/UserContext";

/**
 * Add Beneficiary Modal Component
 * Fungsi:
 * - Modal buat nambah penerima
 * - utawa pas dipencet +
 */

interface BeneficiaryModalProps {
  employee?: Recipient | null;
  onClose: () => void;
  onSave: (employee: Employee | Omit<Recipient, "_id">) => void;
}

export default function BeneficiaryModal({
  employee = null,
  onClose,
  onSave,
}: BeneficiaryModalProps) {
  const isEditMode = employee !== null;
  const submitButtonText = isEditMode ? "Edit" : "Save";
  //state default buat form
  const [formData, setFormData] = useState({
    name: "",
    currency: "",
    localCurrency: "",
    bankAccountName: "",
    bankAccount: "",
    amountTransfer: "",
  });
  const { user } = useUser();
  const { currentTemplateId } = useTemplate();
  const modalTitle = isEditMode ? `${formData.name}` : "Add Beneficiary";

  useEffect(() => {
    if (isEditMode && employee) {
      setFormData({
        name: employee.name,
        currency: employee.currency,
        localCurrency: employee.localCurrency,
        bankAccountName: employee.bankAccountName,
        bankAccount: employee.bankAccount,
        amountTransfer: employee.amountTransfer.toString(),
      });
    } else {
      setFormData({
        name: "",
        currency: "",
        localCurrency: "",
        bankAccountName: "",
        bankAccount: "",
        amountTransfer: "",
      });
    }
  }, [isEditMode, employee]);

  //Handler buat update formfield
  const handelInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  //Hander buat submit + validasi input + save
  const handleSubmit = async () => {
    //validasi
    if (
      !formData.name ||
      !formData.bankAccountName ||
      !formData.bankAccount ||
      !formData.amountTransfer
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (!user || !user._id) {
        alert("User data is not available. Please try again later.");
        return;
    }
    if (!currentTemplateId) {
        alert("No active template selected. Please select a template first.");
        return;
    }

    console.log(currentTemplateId);

    const commonPayload = {
      companyId: user._id, // TODO: Ambil dari cookie/session nanti
      companyName: process.env.NEXT_PUBLIC_COMPANY_NAME!, // TODO: Ambil dari auth
      name: formData.name,
      bankCode: "014", // TODO: Bisa pakai enum/mapping dari nama bank
      bankAccountName: formData.bankAccountName,
      bankAccount: formData.bankAccount,
      walletAddress: "0xe8720c942F114Eac371746C6eCfAcf5F717164CB", // TODO
      networkChainId: 4202,
      amountTransfer: Number.parseFloat(formData.amountTransfer),
      currency: formData.currency || "USDC",
      localCurrency: formData.localCurrency || "IDR",
      groupId: currentTemplateId, // harusnya diganti dengan bisa menyesuaikan skrg lagi ada di template apa
    };

    if (isEditMode && employee) {
      const updatedEmployee = {
        ...commonPayload,
        id: employee._id,
      };
      onSave(updatedEmployee);
    } else {
      onSave(commonPayload);
      await addEmployeeData(commonPayload);
    }
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div
        className="relative bg-slate-800/50 border
            border-white/20 rounded-2xl p-8 w-full max-w-md backdrop-blur-sm"
      >
        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <h2 className="text-2xl font-bold text-white">{modalTitle}</h2>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {employee === null && (
            <FormField
              label="Full Name"
              value={formData.name}
              onChange={(value) => handelInputChange("name", value)}
              placeholder="Type here"
            />
          )}
          <FormField
            label="Currency"
            value={formData.currency}
            onChange={(value) => handelInputChange("currency", value)}
            placeholder="Type here"
          />
          <FormField
            label="Local Currency"
            value={formData.localCurrency}
            onChange={(value) => handelInputChange("localCurrency", value)}
            placeholder="Type here"
          />
          <FormField
            label="Bank"
            value={formData.bankAccountName}
            onChange={(value) => handelInputChange("bankAccountName", value)}
            placeholder="Type here"
          />
          <FormField
            label="Bank Account"
            value={formData.bankAccount}
            onChange={(value) => handelInputChange("bankAccount", value)}
            placeholder="Type here"
          />
          <FormField
            label="Amount"
            value={formData.amountTransfer}
            onChange={(value) => handelInputChange("amountTransfer", value)}
            placeholder="Type here"
          />

          {/* Price feed */}
          <div className=" rounded-lg justify-end flex ">
            <p className="text-gray-300 text-sm text-center">
              Display Price Feed Here
            </p>
          </div>

          <div className="flex space-x-3">
            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              className={`${
                isEditMode ? "flex-1" : "w-full"
              } bg-cyan-500 hover:bg-cyan-400 py-3 rounded-lg`}
            >
              {submitButtonText}
            </Button>
          </div>
        </div>
      </div>
    </ModalOverlay>
  );
}
