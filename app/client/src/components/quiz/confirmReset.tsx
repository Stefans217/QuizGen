"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog"

interface ConfirmDeleteModalProps {
    open: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

const ConfirmResetModal: React.FC<ConfirmDeleteModalProps> = ({
    open,
    onCancel,
    onConfirm,
}) => {
    if (!open) return null;

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            if (!isOpen) onCancel();
        }}>
            <DialogContent className="animate-fadeIn rounded shadow-md !p-0">
                <DialogHeader className="p-3">
                    <div>
                        <DialogTitle className="text-lg mb-4">
                        <span>Create Another Quiz?</span>
                        </DialogTitle>
                        <hr className="border-t border-gray-200 my-1" />
                        <DialogDescription>This action will erase the current quiz you made</DialogDescription>
                    </div>
                </DialogHeader>
                <div className="bg-gray-200 p-3 flex justify-end gap-2 rounded-b">
                    <Button variant="secondary" onClick={onCancel}>
                        Keep Current Quiz
                    </Button>
                    <Button variant="destructive" onClick={onConfirm}>
                        Reset Quiz
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmResetModal;