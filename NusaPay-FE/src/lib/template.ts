"use client"

import { Recipient } from "@/types/recipient"

export interface Template{
    groupId: string,
    companyId : string,
    companyName : string,
    nameOfGroup : string,
    recipients: Recipient[]
    createdAt: Date
    updatedAt: Date
}

export interface TemplateContextType{
    templates: Template[]
    currentTemplate: Template | null
    currentTemplateId: string | null; // ✅ Tambahkan ini
    switchTemplate: (templateId: string) => void
    createTemplate: (name: string) => void
    updateTemplate: (templateId: string, recipients: Recipient[]) => void
    deleteTemplate: (templateId: string) => void
}